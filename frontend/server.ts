import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory storage for API endpoints
let profileData = {
  name: "Yonathan Altaye",
  role: "Full Stack Engineer & UI Architect",
  bio: "Passionate engineer building high-performance web applications, desktop OS simulations, and cloud microservices with Spring Boot & Node.js.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  email: "yonathanaltayecama@gmail.com",
  github: "https://github.com/YonathanAltaye",
  linkedin: "https://linkedin.com/in/yonathanaltaye",
  location: "San Francisco, CA",
};

let foldersData = [
  {
    id: "folder-about-me",
    name: "About Me",
    description: "Personal bio, contact links, and engineering profile",
    icon: "user",
    color: "blue",
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder-web-apps",
    name: "Projects",
    description: "Featured web applications & full-stack open source projects",
    icon: "briefcase",
    color: "amber",
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder-skills",
    name: "Skills",
    description: "Technical stack, programming languages, and tools",
    icon: "code",
    color: "emerald",
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder-resume",
    name: "Resume",
    description: "Career resume PDF download and work experience history",
    icon: "file-text",
    color: "purple",
    parentId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder-contact",
    name: "Contact",
    description: "Direct email message form and social channels",
    icon: "mail",
    color: "rose",
    parentId: null,
    createdAt: new Date().toISOString(),
  },
];

let projectsData = [
  {
    id: "proj-daedalos-portfolio",
    title: "Windows Desktop Portfolio OS",
    tagline: "Interactive Windows 11 desktop portfolio environment built with React & Spring Boot API",
    description: "A replica of a modern desktop OS featuring draggables, windows manager, CLI terminal prompt, file explorer, and customizeable wallpapers.",
    techStack: ["React 19", "TypeScript", "Tailwind CSS", "Spring Boot", "Express API"],
    liveUrl: "https://ais-dev-rmj6jzrwjlvqez7ggz3ufw-28529118907.europe-west2.run.app",
    githubUrl: "https://github.com/DustinBrett/daedalOS",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-springboot-microservices",
    title: "Spring Boot Microservices Suite",
    tagline: "Enterprise REST API backend architecture with Spring Security & PostgreSQL",
    description: "Robust Spring Boot 3 backend system with JWT auth, JPA/Hibernate persistence layer, rate-limiting filter chains, and Docker container support.",
    techStack: ["Java 17", "Spring Boot 3", "Spring Security", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/DustinBrett/daedalOS",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

// Vite Middleware Setup for Dev & Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
