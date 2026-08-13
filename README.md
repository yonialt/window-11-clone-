<div align="center">

# 🖥️ Windows 11 Portfolio OS

### An interactive, desktop-inspired portfolio that runs *inside a browser* — built with React, TypeScript & Tailwind CSS

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0070f3)](https://window-11-clone-wcic.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6db33f?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Express](https://img.shields.io/badge/Express-4-000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

</div>

---

## ✨ What is this?

Instead of a conventional scrolling portfolio, my CV is presented as a **fully interactive Windows 11 desktop** you can actually use: double-click icons to open apps, drag windows around, rubber-band select files, right-click the desktop for a context menu, and even unlock a **UAC-style admin prompt** to add, edit, or delete projects — all in the browser.

> **Why?** Because it demonstrates exactly the kind of engineering a company cares about: component architecture, window/state management, drag-and-drop geometry, API design, authentication flows, and polished UI/UX — all in one deployable project.

---

## 🎯 Highlights

- 🪟 **Full Windows 11 desktop experience** — wallpaper, draggable/resizable windows, taskbar, start menu, task view, flyouts, and a real window manager (z-order focus, minimize, maximize, close)
- 📂 **Desktop folders** — *Software Dev, DevOps, Networking, Certificates* organize projects exactly like Explorer
- 🧲 **Rubber-band (marquee) multi-select** — drag on the desktop to draw a Win11 selection box with live AABB collision highlighting
- 🔐 **UAC admin gate** — every write action (`+ Add project`, `New Folder`, `Edit`, `Delete`) triggers an authentic Windows 11 **User Account Control** modal with one-shot credential validation (no session persistence)
- 🖼️ **Cover upload** — add project screenshots from disk (canvas-resized to compact data URLs) *or* via URL
- 🌍 **ENG / Amharic** taskbar language switch, weather widget, notifications & quick-settings flyouts
- 📱 **Responsive** — desktop-first with a mobile notice for small screens

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS 4 · Motion (Framer Motion) · Fluent UI & Lucide icons |
| **Node backend** | Express 4 · in-memory REST API · Vite middleware-mode dev server (HMR) · esbuild production bundle |
| **Java backend** | Spring Boot 3.2.2 · Java 17 · Spring Data JPA · H2 · Lombok |
| **Deployment** | Vercel (static SPA + serverless function) · GitHub auto-deploy |
| **External services** | Web3Forms (contact form) · Vercel Serverless Functions (auth) |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js 18+** (20 LTS recommended)
- **Java 17 + Maven** (only if you want to run the Spring Boot backend)

### 1. Install & run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:24678** (override with the `PORT` env var).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with Vite HMR (Express middleware mode) |
| `npm run build` | `vite build` + bundles `server.ts` → `dist/server.cjs` |
| `npm start` | Serve the production build (`node dist/server.cjs`) |
| `npm run lint` | Type-check the whole project (`tsc --noEmit`) |

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and set what you need:

| Variable | Required | Purpose |
|----------|----------|---------|
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Recommended | Credentials for the UAC admin gate. **Defaults to `yo` / `yo123` in dev** — set real values! |
| `VITE_WEB3FORMS_ACCESS_KEY` | Recommended | Web3Forms key for the Contact form. Get a free one at [web3forms.com](https://web3forms.com) |
| `PORT` | No | Dev server port (default `24678`) |

### 3. (Optional) Run the Spring Boot backend

```bash
cd backend-springboot
mvn spring-boot:run
```

Serves the REST API at `http://localhost:8080/api/v1` (see [API](#-api) below).

---

## 🗂️ Project Structure

```
├── frontend/                     # Main application
│   ├── src/
│   │   ├── components/           # 28 UI components (Window, Taskbar, StartMenu,
│   │   │                         #   FileExplorerApp, CalculatorWindow, UACModal, …)
│   │   ├── config/               # Desktop icon definitions
│   │   ├── data/                 # Initial folders/projects seed data
│   │   ├── lib/                  # Helpers (folder helpers, admin auth client)
│   │   ├── App.tsx               # Window manager + desktop shell
│   │   ├── types.ts              # Shared TypeScript types
│   │   └── index.css             # Tailwind + global styles
│   ├── api/auth/admin.ts         # Vercel serverless auth function (production)
│   ├── server.ts                 # Express dev/prod server + REST API + auth
│   └── vercel.json               # Vercel SPA rewrites + build config
└── backend-springboot/           # Spring Boot REST API (Java 17)
    └── src/main/java/com/yonathan/portfolio/
        ├── PortfolioApplication.java
        └── controller/PortfolioController.java
```

---

## 🪟 Feature Tour

### Desktop & Window Manager
- Double-click desktop icons to open windows; single click selects (blue highlight)
- **Marquee selection**: drag on empty desktop → translucent-blue rubber-band box, live collision highlighting of intersecting icons; click empty space to clear
- Right-click desktop → **New** (Folder / Portfolio Project), **Rename**, **Delete** context menu
- Windows are draggable, resizable, minimize/maximize/close — with proper focus stacking

### Taskbar
- Pinned apps with **active-state logic**: folder windows highlight the **File Explorer** pin, standalone apps (Calculator, Terminal, Contact…) light up their own icon
- Start Menu with search, **Task View**, **Calendar / Notifications / Quick Settings** flyouts, **Weather widget**, **ENG ⇄ አማርኛ** language switch

### Built-in Apps
| App | What it does |
|-----|--------------|
| **File Explorer** | Browse desktop folders & projects, toolbar with `+ New Folder` / `+ Add Project` (UAC-gated) |
| **Project Detail** | Full project cards — cover image, tagline, tech stack, featured toggle |
| **Calculator** | Windows 11-style calculator with keyboard support |
| **Terminal** | Interactive command-line (try `help`, `ls`, `open …`) |
| **Notepad** | Simple document editing |
| **Browser** | In-window web browsing |
| **Settings** | Desktop icon size & theme controls |
| **Skills / About Me** | Profile, stack, experience |
| **Contact** | Web3Forms-powered message form + social links |
| **Resume** | Opens the CV PDF in a new tab |

### 🔐 Admin Authentication (UAC Gate)
- Add / Edit / Delete actions open a **User Account Control** modal (shield icon, app-card, *"Do you want to allow this app to make changes to your device?"*)
- Credentials are validated against the server (`POST /api/auth/admin`) — wrong credentials show *"Incorrect credentials"* with an inline red error
- **One-shot by design**: after the action completes, the gate re-locks — no token/localStorage session persists
- Works identically in dev (Express endpoint) and production (Vercel serverless function in `frontend/api/auth/admin.ts`)

---

## 📡 API

### Express server (`frontend/server.ts` — dev & `npm start`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` / `PUT` | `/api/profile` | Read / update profile data |
| `GET` / `POST` | `/api/folders` | List / create folders |
| `GET` / `POST` | `/api/projects` | List / create projects |
| `POST` | `/api/auth/admin` | Validate admin credentials → session token |
| `POST` | `/api/auth/validate` | Validate a session token |

### Spring Boot backend (`backend-springboot`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Service status + timestamp |
| `GET` | `/api/v1/profile` | Owner profile (name, role, bio, links) |
| `GET` | `/api/v1/projects` | Featured projects with tech stacks |

---

## 🚀 Deployment

The project deploys to **Vercel** on every push to `main` (auto-deploy connected to the repo).

**Production URL:** https://window-11-clone-wcic.vercel.app

### How it works
- `vercel.json` builds with `vite build` and rewrites all routes → `index.html` (SPA)
- The UAC gate's auth endpoint runs as a **serverless function** (`frontend/api/auth/admin.ts`), so admin login works on the static deployment
- **Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` in Vercel → Settings → Environment Variables** to override the dev defaults in production

### Deploy locally
```bash
cd frontend
npm run build && npm start     # serves the production build on :24678
```

> **Note:** folders/projects you create are persisted to that browser's `localStorage` — per-browser, not server-shared.

---

## 🛠️ Engineering Decisions Worth Noting

- **Window manager** is hand-rolled (no library): a central `windows` state array drives rendering, z-order, focus, minimize/maximize and taskbar states — a good interview talking point
- **Marquee selection** uses live AABB collision detection against desktop icon DOM rects, with a `pointer-events: none` selection layer so dragging is never blocked
- **Image uploads** are resized client-side on a canvas (max 900px, JPEG) and stored as compact data URLs — localStorage-friendly and serverless-friendly
- **Auth** is deliberately stateless per action for a stricter security posture, with env-var driven credentials and a serverless production path

---

## 📬 Contact

**Yonatan Altaye** — Software Engineer | Network & System Admin

- 🌐 GitHub: [yonialt](https://github.com/yonialt)
- 💼 LinkedIn: [Yonatan Altaye](https://www.linkedin.com/in/yonatan-altaye-a18260375/)
- ✉️ Email: yonathanaltayecama@gmail.com
- 📍 Addis Ababa, Ethiopia

---

## 📄 License

This project is licensed under the **MIT License** — free to use, learn from, and build upon. If it helps you land a job, consider saying hi 👋

<sub>Windows, Windows 11 and related logos are trademarks of Microsoft Corporation. This project is a fan-made UI clone for portfolio/educational purposes and is not affiliated with or endorsed by Microsoft.</sub>
