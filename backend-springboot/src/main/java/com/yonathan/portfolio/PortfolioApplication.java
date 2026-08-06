package com.yonathan.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
        System.out.println("🚀 Spring Boot Portfolio Backend Service Running on Port 8080!");
    }
}
