-- ─────────────────────────────────────────────────────────────────────────────
--  PostgreSQL init script — runs automatically on first container start
--  (mounted at /docker-entrypoint-initdb.d/001-init.sql).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    tagline     TEXT,
    tech_stack  TEXT[],
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed data (ON CONFLICT is a no-op here; kept for idempotency in tests)
INSERT INTO projects (title, tagline, tech_stack) VALUES
    (
        'Automated Microservices Deployment & CI/CD Pipeline',
        'Production-ready automated delivery pipeline utilizing Docker multi-stage builds, GitHub Actions workflows, and Nginx reverse proxying.',
        ARRAY['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'Nginx', 'PostgreSQL', 'AWS']
    ),
    (
        'Food Delivery Management System',
        'Full-stack food ordering backend with auth, restaurants & order processing.',
        ARRAY['Java 17', 'Spring Boot', 'JWT', 'PostgreSQL']
    )
ON CONFLICT DO NOTHING;
