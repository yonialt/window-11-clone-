import pg from 'pg';

const { Pool } = pg;

/**
 * Connection pool for PostgreSQL.
 *
 * Priority:
 *   1. DATABASE_URL (set by docker-compose) — e.g. postgres://user:pass@db:5432/portfolio
 *   2. Individual POSTGRES_* environment variables
 */
const connectionString =
  process.env.DATABASE_URL ??
  `postgres://${process.env.POSTGRES_USER ?? 'portfolio'}:${process.env.POSTGRES_PASSWORD ?? 'portfolio'}@${
    process.env.POSTGRES_HOST ?? 'db'
  }:${process.env.POSTGRES_PORT ?? '5432'}/${process.env.POSTGRES_DB ?? 'portfolio'}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
  max: 10,
});

/** Quick connectivity probe used by /api/health. */
export async function pingDatabase(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
