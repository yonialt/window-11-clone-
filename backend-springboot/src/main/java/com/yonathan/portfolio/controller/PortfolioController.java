package com.yonathan.portfolio.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("framework", "Spring Boot 3.2.2");
        response.put("service", "Desktop Portfolio OS Backend");
        response.put("timestamp", new Date());
        return response;
    }

    @GetMapping("/profile")
    public Map<String, String> getProfile() {
        Map<String, String> profile = new HashMap<>();
        profile.put("name", "Yonatan Altaye");
        profile.put("role", "Software Engineer | Network & System Admin");
        profile.put("bio", "Computer Science graduate with hands-on experience in IT support, networking, and backend development. Skilled in building REST APIs with Java (Spring Boot) and Node.js (Express.js), working with relational and NoSQL databases, and deploying applications on AWS, Azure, and GCP.");
        profile.put("email", "yonathanaltayecama@gmail.com");
        profile.put("location", "Addis Ababa, Ethiopia");
        profile.put("github", "https://github.com/yonialt");
        profile.put("linkedin", "https://www.linkedin.com/in/yonatan-altaye-a18260375/");
        return profile;
    }

    @GetMapping("/projects")
    public List<Map<String, Object>> getProjects() {
        List<Map<String, Object>> projects = new ArrayList<>();

        Map<String, Object> proj1 = new HashMap<>();
        proj1.put("id", "proj-ai-resource");
        proj1.put("title", "AI Smart Resource Management System");
        proj1.put("tagline", "AI-driven resource allocation with role-based access control");
        proj1.put("description", "Resource allocation system for university operations with role-based access control and AI-driven decision-making logic.");
        proj1.put("techStack", List.of("Node.js", "Express.js", "MongoDB", "RBAC", "AI Decision Logic"));
        projects.add(proj1);

        Map<String, Object> proj3 = new HashMap<>();
        proj3.put("id", "proj-socket-server");
        proj3.put("title", "Socket Programming Web Server");
        proj3.put("tagline", "HTTP web server built from scratch with raw C++ sockets");
        proj3.put("description", "HTTP web server built with raw socket programming, implementing request/response handling from the ground up.");
        proj3.put("techStack", List.of("C++", "POSIX Sockets", "TCP/IP", "HTTP/1.1"));
        projects.add(proj3);

        Map<String, Object> proj4 = new HashMap<>();
        proj4.put("id", "proj-devops-pipeline");
        proj4.put("title", "AWS Production CI/CD Pipeline & Cloud Deployment (FidaBet)");
        proj4.put("tagline", "Automated GitHub Actions CI/CD deploying Spring Boot & Next.js microservices to Amazon ECR and AWS EC2");
        proj4.put("description", "Automated 12-stage CI/CD pipeline on AWS (IAM, ECR, EC2, Docker Desktop) delivering zero-downtime rolling updates in 2m 28s.");
        proj4.put("techStack", List.of("AWS EC2", "Amazon ECR", "AWS IAM", "GitHub Actions", "Docker Desktop", "Spring Boot", "PostgreSQL", "Next.js"));
        projects.add(proj4);

        Map<String, Object> proj5 = new HashMap<>();
        proj5.put("id", "proj-devops-iam-security");
        proj5.put("title", "AWS IAM Security Governance & Access Control");
        proj5.put("tagline", "AWS Account 933858446201 security posture: root MFA enforced, 0 active root keys, and scoped CI/CD service credentials.");
        proj5.put("techStack", List.of("AWS IAM", "MFA", "Least-Privilege Policies", "OIDC Provider", "5 IAM Roles"));
        projects.add(proj5);

        Map<String, Object> proj6 = new HashMap<>();
        proj6.put("id", "proj-devops-ecr-registry");
        proj6.put("title", "Amazon ECR Microservices Container Registry");
        proj6.put("tagline", "Private Docker repositories in us-east-1 storing Spring Boot backend and Next.js frontend production images.");
        proj6.put("techStack", List.of("Amazon ECR (us-east-1)", "Docker Registry", "AES-256 Encryption", "backend-springboot", "frontend"));
        projects.add(proj6);

        Map<String, Object> proj7 = new HashMap<>();
        proj7.put("id", "proj-devops-docker-images");
        proj7.put("title", "Docker Multi-Stage Build & Container Image Optimization");
        proj7.put("tagline", "Production multi-stage build optimization reducing Spring Boot backend to 324 MB and Next.js frontend to 108 MB.");
        proj7.put("techStack", List.of("Docker Desktop", "Multi-Stage Dockerfiles", "Maven 3.9 Temurin JRE", "Postgres 16 Alpine", "Redis 7 Alpine"));
        projects.add(proj7);

        Map<String, Object> proj8 = new HashMap<>();
        proj8.put("id", "proj-devops-docker-containers");
        proj8.put("title", "Docker Desktop Local Verification & Pre-Deployment Stack");
        proj8.put("tagline", "Pre-deployment local verification environment running Spring Boot (port 18080:8080) and PostgreSQL 16.");
        proj8.put("techStack", List.of("Docker Desktop", "verify-backend (18080:8080)", "verify-postgres (5432)", "Live Telemetry", "CORS Pre-check"));
        projects.add(proj8);

        Map<String, Object> proj9 = new HashMap<>();
        proj9.put("id", "proj-devops-github-actions-history");
        proj9.put("title", "GitHub Actions CI/CD Pipeline Execution History");
        proj9.put("tagline", "16 automated CI/CD workflow runs for 'Deploy to AWS EC2' tracking commits, bug fixes, and continuous delivery.");
        proj9.put("techStack", List.of("GitHub Actions", "Workflow: Deploy to AWS EC2", "16 Automated Runs", "Git Branch: main"));
        projects.add(proj9);

        Map<String, Object> proj10 = new HashMap<>();
        proj10.put("id", "proj-devops-github-actions-steps");
        proj10.put("title", "GitHub Actions 12-Step Automated Production Deployment");
        proj10.put("tagline", "Detailed 12-stage automated cloud deployment pipeline completing runner setup, Docker build/push, and EC2 rollout in 2m 28s.");
        proj10.put("techStack", List.of("GitHub Actions", "actions/checkout@v4", "Amazon ECR Login", "Docker Push", "SSH Remote Deploy"));
        projects.add(proj10);

        Map<String, Object> proj11 = new HashMap<>();
        proj11.put("id", "proj-devops-ec2-server");
        proj11.put("title", "AWS EC2 Production Cloud Server (Instance: hagerawi)");
        proj11.put("tagline", "Production t3.micro server in us-east-1c running containerized microservices with 3/3 checks passed and zero alarms.");
        proj11.put("techStack", List.of("AWS EC2", "Instance: hagerawi", "Type: t3.micro", "Zone: us-east-1c", "3/3 Checks Passed", "Docker Compose"));
        projects.add(proj11);

        return projects;
    }
}
