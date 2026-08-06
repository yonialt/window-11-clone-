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
        profile.put("name", "Yonathan Altaye");
        profile.put("role", "Full Stack Engineer & UI Architect");
        profile.put("bio", "Building full-stack Java Spring Boot APIs and modern desktop React user interfaces.");
        profile.put("email", "yonathanaltayecama@gmail.com");
        profile.put("location", "San Francisco, CA");
        return profile;
    }

    @GetMapping("/projects")
    public List<Map<String, Object>> getProjects() {
        List<Map<String, Object>> projects = new ArrayList<>();

        Map<String, Object> proj1 = new HashMap<>();
        proj1.put("id", "proj-daedalos");
        proj1.put("title", "Windows Desktop Portfolio OS");
        proj1.put("tagline", "Interactive Windows 11 desktop portfolio environment built with React & Spring Boot API");
        proj1.put("techStack", List.of("Spring Boot", "Java 17", "React", "TypeScript", "Tailwind CSS"));
        projects.add(proj1);

        Map<String, Object> proj2 = new HashMap<>();
        proj2.put("id", "proj-springboot-backend");
        proj2.put("title", "Spring Boot Microservices Suite");
        proj2.put("tagline", "Enterprise REST API backend architecture with JPA & H2 / PostgreSQL");
        proj2.put("techStack", List.of("Java 17", "Spring Boot 3", "Spring Security", "JPA", "Docker"));
        projects.add(proj2);

        return projects;
    }
}
