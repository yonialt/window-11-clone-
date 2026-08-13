import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from './app.js';

describe('API', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer(createApp());
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('GET /api/health returns ok with db status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(['connected', 'unavailable']).toContain(body.db);
    expect(typeof body.uptime).toBe('number');
  });

  it('GET /api/version exposes build metadata', async () => {
    const res = await fetch(`${baseUrl}/api/version`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.version).toBe('1.0.0');
    expect(typeof body.commit).toBe('string');
  });

  it('GET /api/projects returns an array (from Postgres or 503 when DB is down)', async () => {
    const res = await fetch(`${baseUrl}/api/projects`);
    if (res.status === 503) {
      const body = await res.json();
      expect(body.status).toBe('error');
      return;
    }
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('postgres');
    expect(Array.isArray(body.projects)).toBe(true);
  });

  it('unknown routes return JSON 404', async () => {
    const res = await fetch(`${baseUrl}/api/nope`);
    expect(res.status).toBe(404);
    expect((await res.json()).message).toBe('Not found');
  });
});
