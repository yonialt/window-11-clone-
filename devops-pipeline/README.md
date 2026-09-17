<div align="center">

# 🚀 AWS Production CI/CD Pipeline & Cloud Deployment (FidaBet)

### Automated Microservices Delivery Pipeline — GitHub Actions · AWS IAM · Amazon ECR · Docker Desktop · AWS EC2 · Spring Boot · Next.js · PostgreSQL

[![AWS](https://img.shields.io/badge/AWS-EC2_%7C_ECR_%7C_IAM-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD_Pipeline-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/yonialt/betting-with-fida-auth)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage_Builds-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Alpine-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7_Alpine-dc382d?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

</div>

A production-grade, automated Continuous Integration and Continuous Deployment (CI/CD) system engineered for **FidaBet** ([yonialt/betting-with-fida-auth](https://github.com/yonialt/betting-with-fida-auth)). The pipeline integrates least-privilege AWS IAM security governance, Amazon Elastic Container Registry (ECR) private repositories, Docker multi-stage container optimization, local verification environments in Docker Desktop, and zero-downtime rolling updates to an AWS EC2 production instance (`hagerawi`).

```
┌─────────────────┐       ┌──────────────────────────────────────────────────────────────┐       ┌──────────────────────────────┐
│  Developer Push │──────▶│  GitHub Actions CI/CD (Workflow: Deploy to AWS EC2)          │──────▶│  Amazon ECR Private Registry │
│  to main branch │       │  12 automated steps executed on Ubuntu runner in 2m 28s       │       │  933858446201.dkr.ecr.       │
└─────────────────┘       └──────────────────────────────────────────────────────────────┘       │  us-east-1.amazonaws.com     │
                                                          │                                      └──────────────────────────────┘
                                                          ▼                                                      │
                                           ┌──────────────────────────────┐                                      │
                                           │  AWS IAM Security Layer      │                                      ▼
                                           │  Account: 933858446201       │                     ┌────────────────────────────────┐
                                           │  Root MFA · Scoped CI User   │                     │  AWS EC2 Host: "hagerawi"      │
                                           └──────────────────────────────┘                     │  Instance: t3.micro (us-east-1c│
                                                                                                │  Status: 3/3 checks passed     │
                                                                                                │  Docker Compose rolling deploy │
                                                                                                └────────────────────────────────┘
                                                                                                                 │
                                                                  ┌──────────────────────────────────────────────┼──────────────────────────────┐
                                                                  ▼                                              ▼                              ▼
                                                        ┌───────────────────┐                          ┌───────────────────┐          ┌───────────────────┐
                                                        │  Frontend Service │  REST API / Auth ──────▶ │  Backend API      │  SQL ──▶ │  PostgreSQL 16    │
                                                        │  Next.js / React  │                          │  Spring Boot 3    │          │  Persistent DB    │
                                                        └───────────────────┘                          └───────────────────┘          └───────────────────┘
```

---

## 📸 Architecture & Infrastructure Components

### 1. AWS IAM Security & Governance (`iam secerty.png`)
- **Account ID:** `933858446201`
- **Root Security Posture:** Root account has **0 active access keys**; Multi-Factor Authentication (MFA) is strictly enforced.
- **Dedicated CI/CD Automation User:** Created with least-privilege IAM policies, isolated to ECR authentication/push operations and EC2 SSH deployment triggering.
- **Roles & Identity Providers:** 5 IAM roles configured for instance profiles and service execution, with 1 OpenID Connect (OIDC) identity provider.

### 2. Amazon Elastic Container Registry (ECR) (`ecr.png`)
- **Region:** `us-east-1` (US East - N. Virginia)
- **Registry URI:** `933858446201.dkr.ecr.us-east-1.amazonaws.com`
- **Private Repositories:**
  1. `backend-springboot`: Holds Spring Boot API microservice images (Tag immutability: Mutable, Server-side AES-256 encryption).
  2. `frontend`: Holds Next.js/React frontend production images (Tag immutability: Mutable, Server-side AES-256 encryption).

### 3. Docker Multi-Stage Builds & Local Pre-Deployment Testing (`docker image.png` & `dockercontiner.png`)
- **Multi-Stage Containerization:**
  - `betting-with-fida-auth-fidabet-backend:latest` & `933858446201.dkr.ecr.us-east-1.amazonaws.com/backend-springboot:latest`: **324.72 MB** (packaged using `maven:3.9-eclipse-temurin` and lightweight JRE 17 runtime).
  - `betting-with-fida-auth-fidabet-frontend:latest` & `933858446201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest`: **108.34 MB** (Node build stage with production artifact extraction).
  - Database & Cache base images: `postgres:16-alpine` (**419.68 MB**) and `redis:7-alpine` (**57.82 MB**).
- **Local Verification Stack (Docker Desktop):**
  - Container `verify-backend` (port `18080:8080`, image `fidabet-backend:verify`).
  - Container `verify-postgres` (PostgreSQL 16 Alpine).
  - Telemetry verification: 0.83% CPU, 289.91 MB RAM footprint under verification load to ensure schema consistency, database directory permissions, and CORS configurations before pushing to remote.

### 4. AWS EC2 Production Server (`ec2server.png`)
- **Instance Name:** `hagerawi`
- **Instance Type:** `t3.micro`
- **Availability Zone:** `us-east-1c`
- **Operational Health:** **3/3 checks passed** (System reachability check, Instance status check, Attached EBS volume check).
- **Alarm State:** 0 alarms; healthy running state.

---

## ⚡ GitHub Actions CI/CD Pipeline: 12 Execution Steps (`githubaction2.png`)

**Workflow:** `Deploy to AWS EC2` (`.github/workflows/deploy.yml`)  
**Trigger:** Push to `main` branch in repository `yonialt/betting-with-fida-auth`  
**Total Duration:** **2m 28s** (all 12 steps succeeded)

| # | Step Name | Duration | Purpose & Actions Taken |
|---|-----------|----------|-------------------------|
| **1** | **Set up job** | `2s` | Provision GitHub-hosted Ubuntu 22.04 LTS runner, initialize virtual environment and runner execution credentials. |
| **2** | **Checkout repository** | `1s` | Executes `actions/checkout@v4` on branch `main` at latest commit SHA in `yonialt/betting-with-fida-auth`. |
| **3** | **Configure AWS credentials** | `1s` | Authenticates runner with AWS using `aws-actions/configure-aws-credentials@v4` in `us-east-1` via scoped IAM user credentials (Account `933858446201`). |
| **4** | **Login to Amazon ECR** | `0s` | Executes `aws-actions/amazon-ecr-login@v2` to authenticate local Docker daemon against `933858446201.dkr.ecr.us-east-1.amazonaws.com`. |
| **5** | **Set deployment tag** | `0s` | Computes commit hash (`git rev-parse --short HEAD`) and timestamp to tag container images with dual `:latest` and `:<commit-sha>` pointers. |
| **6** | **Build and push frontend image** | `37s` | Runs multi-stage Docker build for Next.js/React frontend and pushes image to `933858446201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest` (108.34 MB). |
| **7** | **Build and push backend image** | `1m 20s` | Compiles Spring Boot application with Maven, executes unit test suite, packages optimized container, and pushes to `933858446201.dkr.ecr.us-east-1.amazonaws.com/backend-springboot:latest` (324.72 MB). |
| **8** | **Deploy to EC2** | `24s` | SSH connection into EC2 instance `hagerawi` (`t3.micro`), logs into ECR, pulls updated images, and executes rolling update via `docker compose up -d` with health checks. |
| **9** | **Post Login to Amazon ECR** | `0s` | Docker logout from `933858446201.dkr.ecr.us-east-1.amazonaws.com` and revokes temporary authorization tokens. |
| **10** | **Post Configure AWS credentials** | `0s` | Wipes AWS access keys and session tokens from runner memory. |
| **11** | **Post Checkout repository** | `0s` | Cleans up temporary Git working tree and workspace artifacts. |
| **12** | **Complete job** | `0s` | Validates step statuses, logs overall execution time (2m 28s), and emits green status to GitHub commit. |

---

## 🚀 Local Deployment & Replication

```bash
# 1. Clone repository
git clone https://github.com/yonialt/betting-with-fida-auth.git
cd betting-with-fida-auth

# 2. Configure environment variables
cp .env.example .env

# 3. Build and launch with Docker Compose
docker compose up -d --build

# 4. Inspect container health & resource usage
docker compose ps
docker stats
```

---

## 🖥️ Portfolio OS Integration & DevOps Folder Breakdown

Each major component and screenshot from this deployment setup is posted as an individual interactive project card inside the **DevOps** folder (`folder-devops`) on the Windows 11 Desktop portfolio:

1. **AWS Production CI/CD Pipeline & Cloud Deployment (FidaBet)** (`proj-devops-pipeline`)  
   - Complete architectural overview card with high-level microservices topology diagram.
2. **AWS IAM Security Governance & Access Control** (`proj-devops-iam-security`)  
   - Root account security posture, hardware/virtual MFA, zero active root keys, and scoped CI/CD automation credentials (Account: `933858446201`).
3. **Amazon ECR Microservices Container Registry** (`proj-devops-ecr-registry`)  
   - Private repositories `backend-springboot` and `frontend` in `us-east-1` with AES-256 encryption and versioned commit tags.
4. **Docker Multi-Stage Build & Container Image Optimization** (`proj-devops-docker-images`)  
   - Image optimization breakdown: Spring Boot backend (`324.72 MB`), Next.js frontend (`108.34 MB`), Postgres 16 Alpine (`419.68 MB`), and Redis 7 Alpine (`57.82 MB`).
5. **Docker Desktop Local Verification & Pre-Deployment Stack** (`proj-devops-docker-containers`)  
   - Local staging environment running `verify-backend` (port `18080:8080`) and `verify-postgres` (port `5432`) with live 0.83% CPU and 289 MB RAM telemetry.
6. **GitHub Actions CI/CD Pipeline Execution History** (`proj-devops-github-actions-history`)  
   - Continuous deployment history tracking 16 automated workflow executions for "Deploy to AWS EC2".
7. **GitHub Actions 12-Step Automated Production Deployment** (`proj-devops-github-actions-steps`)  
   - Complete 12-step interactive pipeline runner with execution durations (total 2m 28s), automated commands, and real-time step inspection.
8. **AWS EC2 Production Cloud Server (Instance: hagerawi)** (`proj-devops-ec2-server`)  
   - Production host specifications: `t3.micro` in `us-east-1c`, 3/3 checks passed, zero alarms, and automated Docker Compose rolling deployment.

---

## 📬 Author & Maintainer

**Yonatan Altaye**  
*Full Stack Developer & Network / DevOps Engineer*  
- **Email:** yonathanaltayecama@gmail.com  
- **GitHub:** [github.com/yonialt](https://github.com/yonialt)  
- **LinkedIn:** [linkedin.com/in/yonatan-altaye-a18260375](https://www.linkedin.com/in/yonatan-altaye-a18260375/)
