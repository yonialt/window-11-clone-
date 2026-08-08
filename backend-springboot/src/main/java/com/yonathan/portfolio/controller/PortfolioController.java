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
        proj1.put("id", "proj-food-delivery");
        proj1.put("title", "Food Delivery Management System");
        proj1.put("tagline", "Full-stack food ordering backend with auth, restaurants & order processing");
        proj1.put("description", "Backend system with authentication, restaurant management, and order processing, built with Spring Boot and PostgreSQL using a layered architecture.");
        proj1.put("techStack", List.of("Java 17", "Spring Boot", "Spring Security", "JWT", "PostgreSQL"));
        projects.add(proj1);

        Map<String, Object> proj2 = new HashMap<>();
        proj2.put("id", "proj-ai-resource");
        proj2.put("title", "AI Smart Resource Management System");
        proj2.put("tagline", "AI-driven resource allocation with role-based access control");
        proj2.put("description", "Resource allocation system for university operations with role-based access control and AI-driven decision-making logic.");
        proj2.put("techStack", List.of("Node.js", "Express.js", "MongoDB", "RBAC", "AI Decision Logic"));
        projects.add(proj2);

        Map<String, Object> proj3 = new HashMap<>();
        proj3.put("id", "proj-self-tracker");
        proj3.put("title", "Self Tracker Analytics System");
        proj3.put("tagline", "Personal analytics & ML insights from Google Takeout data");
        proj3.put("description", "Personal analytics platform using Google Takeout data; applied data cleaning, visualization, and machine learning with Pandas, NumPy, and Scikit-learn.");
        proj3.put("techStack", List.of("Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"));
        projects.add(proj3);

        Map<String, Object> proj4 = new HashMap<>();
        proj4.put("id", "proj-socket-server");
        proj4.put("title", "Socket Programming Web Server");
        proj4.put("tagline", "HTTP web server built from scratch with raw C++ sockets");
        proj4.put("description", "HTTP web server built with raw socket programming, implementing request/response handling from the ground up.");
        proj4.put("techStack", List.of("C++", "POSIX Sockets", "TCP/IP", "HTTP/1.1"));
        projects.add(proj4);

        return projects;
    }
}
