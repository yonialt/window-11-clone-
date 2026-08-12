// Vercel serverless function — validates the UAC admin credentials on the
// deployed (static) site, mirroring the /api/auth/admin endpoint in server.ts.
// The gate is one-shot: each Add/Edit/Delete action re-authenticates, so no
// session token is issued or persisted here.
import type { IncomingMessage, ServerResponse } from 'node:http';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'yo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yo123';

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { success: false, message: 'Method not allowed' });
    return;
  }

  let raw = '';
  req.on('data', (chunk: Buffer | string) => {
    raw += chunk;
  });
  req.on('end', () => {
    let username = '';
    let password = '';
    try {
      const body = JSON.parse(raw || '{}');
      username = typeof body.username === 'string' ? body.username : '';
      password = typeof body.password === 'string' ? body.password : '';
    } catch {
      // fall through to rejection
    }

    const userOk = username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
    const passOk = password === ADMIN_PASSWORD;

    if (!userOk || !passOk) {
      sendJson(res, 401, { success: false, message: 'Incorrect credentials' });
      return;
    }

    sendJson(res, 200, { success: true });
  });
}
