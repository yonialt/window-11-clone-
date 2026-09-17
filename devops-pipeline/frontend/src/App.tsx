import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  service: string;
  db: 'connected' | 'unavailable';
  uptime: number;
  commit: string;
  timestamp: string;
}

interface ProjectRow {
  id: number;
  title: string;
  tagline: string | null;
  tech_stack: string[] | null;
}

interface LoadedState {
  health: HealthResponse | null;
  projects: ProjectRow[];
  projectsSource: string;
}

type State = { phase: 'loading' } | ({ phase: 'ready' } & LoadedState);

const STACK = ['Docker', 'Docker Compose', 'GitHub Actions', 'Nginx', 'PostgreSQL', 'CI/CD'];

function fmtUptime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export default function App() {
  const [state, setState] = useState<State>({ phase: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let health: HealthResponse | null = null;
      let projects: ProjectRow[] = [];
      let projectsSource = 'unavailable';

      try {
        const res = await fetch('/api/health');
        if (res.ok) health = await res.json();
      } catch {
        /* API unreachable */
      }
      try {
        const res = await fetch('/api/projects');
        const body = await res.json();
        if (res.ok) {
          projects = body.projects ?? [];
          projectsSource = body.source ?? 'postgres';
        } else {
          projectsSource = body.message ?? 'error';
        }
      } catch {
        /* API unreachable */
      }

      if (!cancelled) setState({ phase: 'ready', health, projects, projectsSource });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <span className="badge">devops-pipeline v1.0.0</span>
        <h1>Automated Deployment &amp; CI/CD Pipeline</h1>
        <p>
          Multi-stage Docker builds · health-checked orchestration · GitHub Actions ·
          Nginx reverse proxy · PostgreSQL persistence
        </p>
        <div className="stack">
          {STACK.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </header>

      {state.phase === 'loading' ? (
        <p className="muted">Loading stack status…</p>
      ) : (
        <>
          <section className="cards">
            <StatusCard
              title="API Gateway"
              detail={state.health ? `${state.health.service} · v1.0.0` : 'Unreachable'}
              ok={!!state.health}
              sub={state.health ? `uptime ${fmtUptime(state.health.uptime)}` : 'check Nginx + backend logs'}
            />
            <StatusCard
              title="PostgreSQL"
              detail={state.health ? state.health.db : 'Unknown'}
              ok={state.health?.db === 'connected'}
              sub={state.health ? `commit ${state.health.commit.slice(0, 7)}` : '—'}
            />
            <StatusCard
              title="Data Source"
              detail={state.projectsSource}
              ok={state.projectsSource === 'postgres'}
              sub={state.projects.length > 0 ? `${state.projects.length} project(s) loaded` : 'no rows yet'}
            />
          </section>

          <section>
            <h2>Projects (served from PostgreSQL via Nginx → Express)</h2>
            {state.projects.length === 0 ? (
              <p className="muted">No projects available.</p>
            ) : (
              <ul className="list">
                {state.projects.map((p) => (
                  <li key={p.id}>
                    <strong>{p.title}</strong>
                    {p.tagline && <span>{p.tagline}</span>}
                    {p.tech_stack && (
                      <div className="mini">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="chip small">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <footer className="muted">
        Served by Nginx container → proxied to Express API container → persisted in PostgreSQL.
      </footer>
    </div>
  );
}

function StatusCard({
  title,
  detail,
  ok,
  sub,
}: {
  title: string;
  detail: string;
  ok: boolean;
  sub: string;
}) {
  return (
    <div className={`card ${ok ? 'ok' : 'warn'}`}>
      <div className="dot" />
      <h3>{title}</h3>
      <p>{detail}</p>
      <span className="muted">{sub}</span>
    </div>
  );
}
