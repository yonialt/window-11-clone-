import express from 'express';
import cors from 'cors';
import { pool, pingDatabase } from './db.js';

/** Builds the Express app — separated from `listen` so it is unit-testable. */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health probe — used by Docker healthchecks and the frontend status cards
  app.get('/api/health', async (_req, res) => {
    const db = (await pingDatabase()) ? 'connected' : 'unavailable';
    res.json({
      status: 'ok',
      service: 'pipeline-demo-backend',
      db,
      uptime: process.uptime(),
      commit: process.env.COMMIT_SHA ?? 'local',
      timestamp: new Date().toISOString(),
    });
  });

  // Build metadata injected by CI at image build time
  app.get('/api/version', (_req, res) => {
    res.json({
      version: '1.0.0',
      commit: process.env.COMMIT_SHA ?? 'local',
      buildDate: process.env.BUILD_DATE ?? 'unknown',
      env: process.env.NODE_ENV ?? 'development',
    });
  });

  // Projects — persisted in PostgreSQL (seeded by backend/db/init.sql)
  app.get('/api/projects', async (_req, res) => {
    try {
      const { rows } = await pool.query<{
        id: number;
        title: string;
        tagline: string | null;
        tech_stack: string[] | null;
        created_at: Date;
      }>(
        `SELECT id, title, tagline, tech_stack, created_at
         FROM projects
         ORDER BY created_at DESC`,
      );
      res.json({ source: 'postgres', count: rows.length, projects: rows });
    } catch {
      res.status(503).json({
        source: 'postgres',
        status: 'error',
        message: 'Database unavailable',
      });
    }
  });

  // JSON 404 for anything else (the SPA itself is served by Nginx)
  app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  return app;
}
