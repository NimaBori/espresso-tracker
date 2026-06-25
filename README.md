# Espresso & Bean Extraction API

A comprehensive backend API to track specialty coffee beans and espresso extraction parameters, built with Spring Boot and MySQL.

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.x
- **Database**: MySQL
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL Server

### Database Setup
1. Create a MySQL database named `espresso_tracker`.
2. Update the `src/main/resources/application.properties` with your local MySQL root password if it differs from the default `password`.

### Running the Application
To build and run the application locally:
```bash
mvn clean install
mvn spring-boot:run
```

## Architecture
This project follows an N-Tier architecture (Controller, Service, Repository) and uses DTOs for data transfer to ensure a clean separation of concerns.
