// Vercel serverless function — cloud-syncs the profile & wallpaper settings so
// every device sees the same personalization.
//
//   GET /api/settings → { profile: DeveloperProfile | null, wallpaper: Wallpaper | null }
//   PUT /api/settings → body { username, password, profile?, wallpaper? }
//                       Validates the UAC admin credentials (same as
//                       /api/auth/admin) then replaces the stored values.
//
// Data lives in the same Neon Postgres `app_state` table used by /api/data
// (keys 'profile' and 'wallpaper'). The schema is created on first use, so no
// manual migration is required. If DATABASE_URL is not configured, GET returns
// nulls and PUT returns 503 — the app keeps working with device-local settings.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { neon } from '@neondatabase/serverless';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'yo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yo123';
const DATABASE_URL = process.env.DATABASE_URL || '';

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: Buffer | string) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(raw || '{}');
        resolve(typeof parsed === 'object' && parsed !== null ? parsed : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

async function upsert(sql: ReturnType<typeof neon>, key: string, value: unknown) {
  await sql`
    INSERT INTO app_state (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    if (!DATABASE_URL) {
      sendJson(res, 200, { profile: null, wallpaper: null });
      return;
    }
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema(sql);
      const rows = await sql`SELECT key, value FROM app_state`;
      const profile = rows.find((r) => r.key === 'profile')?.value ?? null;
      const wallpaper = rows.find((r) => r.key === 'wallpaper')?.value ?? null;
      sendJson(res, 200, { profile, wallpaper });
    } catch (err) {
      console.error('GET /api/settings failed:', err);
      sendJson(res, 500, { error: 'Failed to load cloud settings' });
    }
    return;
  }

  if (req.method === 'PUT') {
    const body = await readBody(req);
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const profile = body.profile;
    const wallpaper = body.wallpaper;

    const userOk = username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
    const passOk = password === ADMIN_PASSWORD;
    if (!userOk || !passOk) {
      sendJson(res, 401, { error: 'Unauthorized' });
      return;
    }
    const hasProfile = !!profile && typeof profile === 'object';
    const hasWallpaper =
      !!wallpaper && typeof wallpaper === 'object' && typeof (wallpaper as { id?: unknown }).id === 'string';
    if (!hasProfile && !hasWallpaper) {
      sendJson(res, 400, { error: 'profile or wallpaper is required' });
      return;
    }
    if (!DATABASE_URL) {
      sendJson(res, 503, { error: 'DATABASE_URL not configured' });
      return;
    }
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema(sql);
      if (hasProfile) {
        await upsert(sql, 'profile', profile);
      }
      if (hasWallpaper) {
        await upsert(sql, 'wallpaper', wallpaper);
      }
      sendJson(res, 200, { ok: true });
    } catch (err) {
      console.error('PUT /api/settings failed:', err);
      sendJson(res, 500, { error: 'Failed to save cloud settings' });
    }
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}
