import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

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
    id: "proj-food-delivery",
    title: "Food Delivery Management System",
    tagline: "Full-stack food ordering backend with auth, restaurants & order processing",
    description: "Backend system with authentication, restaurant management, and order processing, built with Spring Boot and PostgreSQL using a layered architecture.",
    techStack: ["Java 17", "Spring Boot", "Spring Security", "JWT", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-ai-resource",
    title: "AI Smart Resource Management System",
    tagline: "AI-driven resource allocation with role-based access control",
    description: "Resource allocation system for university operations with role-based access control and AI-driven decision-making logic.",
    techStack: ["Node.js", "Express.js", "MongoDB", "Role-Based Access Control", "AI Decision Logic"],
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-self-tracker",
    title: "Self Tracker Analytics System",
    tagline: "Personal analytics & ML insights from Google Takeout data",
    description: "Personal analytics platform using Google Takeout data; applied data cleaning, visualization, and machine learning with Pandas, NumPy, and Scikit-learn.",
    techStack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-socket-server",
    title: "Socket Programming Web Server",
    tagline: "HTTP web server built from scratch with raw C++ sockets",
    description: "HTTP web server built with raw socket programming, implementing request/response handling from the ground up.",
    techStack: ["C++", "POSIX Sockets", "TCP/IP", "HTTP/1.1"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    folderId: "folder-web-apps",
    featured: false,
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
