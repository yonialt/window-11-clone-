<div align="center">

# ☕ Spring Boot Portfolio Backend

### REST API backend for the [Windows 11 Portfolio OS](../README.md) — Java 17 · Spring Boot 3.2.2

[![Java 17](https://img.shields.io/badge/Java-17-e76f00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/technologies/downloads/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-6db33f?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.9-c71a36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org)
[![H2 Database](https://img.shields.io/badge/H2-Database-2b6cb0?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGVsbGlwc2U+PC9lbGxpcHNlPjwvc3ZnPg==)](https://www.h2database.com)

</div>

---

## 📖 Overview

A lightweight **REST API** that serves the profile and project data displayed by the [Windows 11 Portfolio OS](..). It's the Java counterpart to the Node/Express server in [`frontend/server.ts`](../frontend/server.ts) — pick whichever backend fits your deployment, or run both.

It demonstrates a clean, layered Spring Boot setup: a single `@RestController` exposing versioned endpoints (`/api/v1`), CORS-enabled for any frontend origin, and ready to grow into a full JPA/H2 persistence layer.

---

## ✨ Features

- 📦 **Versioned REST API** under `/api/v1` with consistent JSON responses
- 🔌 **CORS enabled** (`@CrossOrigin("*")`) — callable from any frontend origin
- 👤 **Profile endpoint** — name, role, bio, contact links, location
- 🗂️ **Projects endpoint** — featured projects with descriptions and tech stacks
- 💾 **H2 + Spring Data JPA** already on the classpath — persistence layer ready to wire in
- 🏗️ **Maven-managed** with the standard `spring-boot-maven-plugin` build

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java 17 |
| Framework | Spring Boot 3.2.2 (Web MVC) |
| Persistence | Spring Data JPA + H2 (runtime) |
| Utilities | Project Lombok |
| Build | Maven (spring-boot-starter-parent) |
| Testing | spring-boot-starter-test (JUnit 5) |

---

## ⚙️ Getting Started

### Prerequisites

- **JDK 17+** (e.g., [Temurin](https://adoptium.net) or [Oracle JDK](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.9+** (or use your IDE's bundled Maven)

### Run it

```bash
cd backend-springboot

# Build
mvn clean package

# Run (default port 8080)
mvn spring-boot:run
# or run the packaged jar:
java -jar target/portfolio-backend-1.0.0.jar
```

You should see:

```
🚀 Spring Boot Portfolio Backend Service Running on Port 8080!
```

Override the port with `--server.port=9090` if 8080 is taken.

### Quick smoke test

```bash
curl http://localhost:8080/api/v1/health
```

---

## 📡 API Reference

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Service status, framework version & timestamp |
| `GET` | `/api/v1/profile` | Owner profile (name, role, bio, email, links) |
| `GET` | `/api/v1/projects` | Featured projects with tech stacks |

### `GET /api/v1/health`

```json
{
  "status": "UP",
  "framework": "Spring Boot 3.2.2",
  "service": "Desktop Portfolio OS Backend",
  "timestamp": "2026-08-13T10:15:30.123+00:00"
}
```

### `GET /api/v1/profile`

```json
{
  "name": "Yonatan Altaye",
  "role": "Software Engineer | Network & System Admin",
  "bio": "Computer Science graduate with hands-on experience in IT support, networking, and backend development...",
  "email": "yonathanaltayecama@gmail.com",
  "location": "Addis Ababa, Ethiopia",
  "github": "https://github.com/yonialt",
  "linkedin": "https://www.linkedin.com/in/yonatan-altaye-a18260375/"
}
```

### `GET /api/v1/projects`

Returns an array of project objects:

```json
[
  {
    "id": "proj-ai-resource",
    "title": "AI Smart Resource Management System",
    "tagline": "AI-driven resource allocation with role-based access control",
    "description": "Resource allocation system for university operations with role-based access control and AI-driven decision-making logic...",
    "techStack": ["Node.js", "Express.js", "MongoDB", "RBAC", "AI Decision Logic"]
  }
]
```

Currently served projects:

| Project | Tech Stack |
|---------|-----------|
| AI Smart Resource Management System | Node.js · Express.js · MongoDB · RBAC · AI Decision Logic |
| Self Tracker Analytics System | Python · Pandas · NumPy · Scikit-learn · Matplotlib |
| Socket Programming Web Server | C++ · POSIX Sockets · TCP/IP · HTTP/1.1 |

---

## 🗂️ Project Structure

```
backend-springboot/
├── pom.xml                                   # Maven build (Spring Boot 3.2.2, Java 17)
└── src/main/java/com/yonathan/portfolio/
    ├── PortfolioApplication.java             # @SpringBootApplication entry point
    └── controller/
        └── PortfolioController.java          # REST endpoints under /api/v1
```

---

## 🗺️ Current State & Roadmap

| Area | Status |
|------|--------|
| REST endpoints (health / profile / projects) | ✅ Implemented |
| CORS for any frontend origin | ✅ Implemented |
| Spring Data JPA + H2 dependencies | ✅ On classpath |
| Entity classes, repositories & database persistence | 🚧 Next step |
| CRUD endpoints (create / update / delete projects) | 🚧 Next step |
| Unit & integration tests | 🚧 Next step |

> The endpoints currently serve data defined in `PortfolioController.java`. Because H2 and Spring Data JPA are already wired into `pom.xml`, the natural next step is replacing the in-memory maps with `@Entity` classes, Spring Data repositories, and full CRUD — a great extension if you want to showcase more of the Spring ecosystem.

---

## 📬 Author

**Yonatan Altaye** — Software Engineer | Network & System Admin

- 💼 [LinkedIn](https://www.linkedin.com/in/yonatan-altaye-a18260375/)
- 🌐 [GitHub](https://github.com/yonialt)
- ✉️ yonathanaltayecama@gmail.com

---

## 📄 License

Part of the **Windows 11 Portfolio OS** monorepo — MIT licensed. See the [root README](../README.md).
