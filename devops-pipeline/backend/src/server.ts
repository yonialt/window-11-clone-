import 'dotenv/config';
import { createApp } from './app.js';
import { pool } from './db.js';

const PORT = Number(process.env.PORT) || 5000;

const server = createApp().listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 pipeline-demo API listening on http://0.0.0.0:${PORT}`);
});

// Graceful shutdown — lets in-flight requests finish before exiting so
// zero-downtime deployments never drop active connections.
function shutdown(signal: string) {
  console.log(`${signal} received — shutting down gracefully…`);
  server.close(() => {
    pool.end().catch(() => undefined).finally(() => process.exit(0));
  });
  // Hard stop if graceful shutdown hangs (e.g. stuck keep-alive connections)
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
