// Vercel serverless function — cloud-syncs the portfolio folders & projects so
// every device sees the same content.
//
//   GET /api/data  → { folders: Folder[], projects: Project[] }
//   PUT /api/data  → body { username, password, folders, projects }
//                    Validates the UAC admin credentials (one-shot, same as
//                    /api/auth/admin) then replaces the stored state.
//
// Data lives in a single Neon Postgres table `app_state` (two rows: 'folders'
// and 'projects'). The schema is created on first use, so no manual migration
// is required. If DATABASE_URL is not configured, GET returns empty arrays and
// PUT returns 503 — the app keeps working with its local fallback data.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { neon } from '@neondatabase/serverless';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'yo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yo123';
const DATABASE_URL = process.env.DATABASE_URL || '';

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    if (!DATABASE_URL) {
      sendJson(res, 200, { folders: [], projects: [] });
      return;
    }
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema(sql);
      const rows = await sql`SELECT key, value FROM app_state`;
      const folders = rows.find((r) => r.key === 'folders')?.value ?? [];
      const projects = rows.find((r) => r.key === 'projects')?.value ?? [];
      sendJson(res, 200, { folders, projects });
    } catch (err) {
      console.error('GET /api/data failed:', err);
      sendJson(res, 500, { error: 'Failed to load cloud data' });
    }
    return;
  }

  if (req.method === 'PUT') {
    const body = await readBody(req);
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const folders = body.folders;
    const projects = body.projects;

    const userOk = username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
    const passOk = password === ADMIN_PASSWORD;
    if (!userOk || !passOk) {
      sendJson(res, 401, { error: 'Unauthorized' });
      return;
    }
    if (!Array.isArray(folders) || !Array.isArray(projects)) {
      sendJson(res, 400, { error: 'folders and projects arrays are required' });
      return;
    }
    if (!DATABASE_URL) {
      sendJson(res, 503, { error: 'DATABASE_URL not configured' });
      return;
    }
    try {
      const sql = neon(DATABASE_URL);
      await ensureSchema(sql);
      await sql`
        INSERT INTO app_state (key, value, updated_at)
        VALUES ('folders', ${JSON.stringify(folders)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `;
      await sql`
        INSERT INTO app_state (key, value, updated_at)
        VALUES ('projects', ${JSON.stringify(projects)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `;
      sendJson(res, 200, { ok: true });
    } catch (err) {
      console.error('PUT /api/data failed:', err);
      sendJson(res, 500, { error: 'Failed to save cloud data' });
    }
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}
