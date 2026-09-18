import express from "express";
import http from "http";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT) || 24678;

app.use(express.json());

// In-Memory storage for API endpoints
let profileData = {
  name: "Yonatan Altaye",
  role: "Software Engineer | Network & System Admin",
  bio: "Computer Science graduate with hands-on experience in IT support, networking, and backend development. Skilled in building REST APIs with Java (Spring Boot) and Node.js (Express.js), working with relational and NoSQL databases, and deploying applications on AWS, Azure, and GCP.",
  avatarUrl: "/src/assets/icons/yo.jpg",
  email: "yonathanaltayecama@gmail.com",
  github: "https://github.com/yonialt",
  linkedin: "https://www.linkedin.com/in/yonatan-altaye-a18260375/",
  location: "Addis Ababa, Ethiopia",
};

// Cloud-synced folders & projects. Mirrors the Vercel serverless function in
// frontend/api/data.ts so local development behaves like production. Starts
// empty (matching the empty Neon database) so the app seeds itself from
// src/data/initialData.ts — otherwise dev seed data would clobber the real
// portfolio state on every load. The first admin write (PUT /api/data) seeds
// this from the frontend's current state.
let foldersData = [];
let projectsData = [];

// ── Cloud-synced settings (profile + wallpaper) ──
// Mirrors the Vercel serverless function in frontend/api/settings.ts so local
// development behaves like production. settingsSaved starts false so GET only
// returns profile data after the user actually saved it — matching the empty
// production database state (otherwise dev defaults would clobber a user's
// customized local profile on every reload).
let wallpaperData: {
  id: string;
  name: string;
  type: string;
  value: string;
  thumbnail: string;
} | null = null;
let settingsSaved = false;

app.get("/api/settings", (req, res) => {
  res.json({
    profile: settingsSaved ? profileData : null,
    wallpaper: wallpaperData,
  });
});

app.put("/api/settings", (req, res) => {
  const { username, password, profile, wallpaper } = req.body ?? {};
  const userOk =
    typeof username === "string" &&
    username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
  const passOk = typeof password === "string" && password === ADMIN_PASSWORD;
  if (!userOk || !passOk) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (profile && typeof profile === "object") {
    profileData = { ...profileData, ...profile };
    settingsSaved = true;
  }
  if (wallpaper && typeof wallpaper === "object" && typeof wallpaper.id === "string") {
    wallpaperData = wallpaper as typeof wallpaperData;
  }
  res.json({ ok: true });
});

// ── Admin authentication (UAC gate) ──
// Write operations in the UI (add/edit/delete) prompt for an administrator
// username + password and validate them here. Set ADMIN_USERNAME and
// ADMIN_PASSWORD in your environment to override the development defaults.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "yo";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "yo123";
const ADMIN_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h session
const adminTokens = new Map<string, number>(); // token -> expiry timestamp

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.warn("⚠️  ADMIN_USERNAME / ADMIN_PASSWORD not fully set — using defaults (yo / yo123). Set them to change.");
}

app.post("/api/auth/admin", (req, res) => {
  const { username, password } = req.body ?? {};
  const userOk =
    typeof username === "string" &&
    username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
  const passOk = typeof password === "string" && password === ADMIN_PASSWORD;
  if (!userOk || !passOk) {
    return res.status(401).json({ success: false, message: "Incorrect credentials" });
  }
  const token = crypto.randomBytes(32).toString("hex");
  adminTokens.set(token, Date.now() + ADMIN_TOKEN_TTL_MS);
  res.json({ success: true, token, expiresIn: ADMIN_TOKEN_TTL_MS });
});

app.post("/api/auth/validate", (req, res) => {
  const token = req.body?.token;
  const expiry = typeof token === "string" ? adminTokens.get(token) : undefined;
  if (expiry === undefined) {
    return res.json({ valid: false });
  }
  if (expiry < Date.now()) {
    adminTokens.delete(token);
    return res.json({ valid: false });
  }
  res.json({ valid: true });
});

// Backend API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Spring Boot / Node Backend API", timestamp: new Date() });
});

app.get("/api/profile", (req, res) => {
  res.json(profileData);
});

app.put("/api/profile", (req, res) => {
  profileData = { ...profileData, ...req.body };
  res.json(profileData);
});

app.get("/api/folders", (req, res) => {
  res.json(foldersData);
});

app.post("/api/folders", (req, res) => {
  const newFolder = {
    id: `folder-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  foldersData.push(newFolder);
  res.status(201).json(newFolder);
});

app.get("/api/projects", (req, res) => {
  res.json(projectsData);
});

app.post("/api/projects", (req, res) => {
  const newProject = {
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  projectsData.push(newProject);
  res.status(201).json(newProject);
});

// Cloud-sync endpoints — mirror the Vercel serverless function in
// frontend/api/data.ts so local development behaves like production. Local
// dev stores data in memory (restarting the server resets it); production
// persists it to Neon Postgres via DATABASE_URL.
app.get("/api/data", (req, res) => {
  res.json({ folders: foldersData, projects: projectsData });
});

app.put("/api/data", (req, res) => {
  const { username, password, folders, projects } = req.body ?? {};
  const userOk =
    typeof username === "string" &&
    username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase();
  const passOk = typeof password === "string" && password === ADMIN_PASSWORD;
  if (!userOk || !passOk) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!Array.isArray(folders) || !Array.isArray(projects)) {
    return res.status(400).json({ error: "folders and projects arrays are required" });
  }
  foldersData = folders;
  projectsData = projects;
  res.json({ ok: true });
});

// Vite Middleware Setup for Dev & Prod
async function startServer() {
  // Create the HTTP server first so Vite's HMR WebSocket can bind to its
  // 'upgrade' event (required for HMR to work in middleware mode).
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Cache-busting: index.html (and any un-hashed file) must never be cached so
    // browsers always fetch the latest app shell; Vite emits content-hashed
    // filenames under dist/assets, which are safe to cache forever.
    const noStore = "no-cache, no-store, must-revalidate";
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", noStore);
          } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else {
            res.setHeader("Cache-Control", noStore);
          }
        },
      })
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", noStore);
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
