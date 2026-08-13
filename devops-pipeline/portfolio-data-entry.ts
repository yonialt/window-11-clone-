// ─────────────────────────────────────────────────────────────────────────────
//  Portfolio OS — data entry for the "DevOps" folder
//
//  This object matches the portfolio's `Project` type
//  (frontend/src/types.ts) and renders inside the "DevOps" folder window.
//
//  Two ways to add it to your portfolio:
//
//  1. Recommended (already done): the same entry was added to
//     `frontend/src/data/initialData.ts` under INITIAL_PROJECTS.
//     The app merges new seed projects into existing localStorage on next load,
//     so it appears automatically — no data is overwritten.
//
//  2. Via the UI: right-click the desktop → New → Portfolio Project (UAC-gated),
//     then paste the fields below into the "DevOps" folder.
// ─────────────────────────────────────────────────────────────────────────────

import type { Project } from '../frontend/src/types';

export const DEVOPS_PIPELINE_PROJECT: Project = {
  id: 'proj-devops-pipeline',
  title: 'Automated Microservices Deployment & CI/CD Pipeline',
  tagline:
    'Production-ready automated delivery pipeline utilizing Docker multi-stage builds, GitHub Actions workflows, and Nginx reverse proxying.',
  description: [
    'A complete, containerized full-stack application demonstrating the entire DevOps toolchain end-to-end: multi-stage Docker builds, a health-checked multi-service stack (Nginx → Express API → PostgreSQL), an automated GitHub Actions CI/CD pipeline that publishes multi-architecture images to GHCR, and a zero-downtime remote deployment script.',
    '',
    '▸ Key Features',
    '  • Automated lint + unit-test enforcement on every pull request (CI gate)',
    '  • Multi-arch (amd64/arm64) container images published to GHCR with SHA + latest tags',
    '  • Zero-downtime deployment script with health-checked, rolling container recreation',
    '  • Persistent PostgreSQL storage with automated health checks & boot ordering',
    '',
    '▸ Architecture Flow',
    '  Developer Push → GitHub Actions (CI: lint → test → build → Docker)',
    '  → GHCR Registry (multi-arch images) → SSH Deploy (docker compose up -d --build)',
  ].join('\n'),
  folderId: 'folder-devops',
  tags: ['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'Nginx', 'PostgreSQL', 'AWS'],
  techStack: ['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'Nginx', 'PostgreSQL', 'AWS'],
  githubUrl: 'https://github.com/yonialt/window-11-clone-/tree/main/devops-pipeline',
  imageUrl:
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
  featured: false,
  createdAt: '2026-08-13T10:00:00.000Z',
  updatedAt: '2026-08-13T10:00:00.000Z',
};
