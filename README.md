# Espresso & Bean Extraction API

A comprehensive backend API to track specialty coffee beans and espresso extraction parameters, built with Spring Boot and MySQL.

> 📘 **For a complete deep-dive into the project architecture, configuration, and all components, see [`BOILERPLATE.md`](./BOILERPLATE.md).**

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.5
- **Database**: MySQL 9.6 (port 3307)
- **ORM**: Spring Data JPA / Hibernate
- **Migrations**: Flyway
- **API Docs**: Swagger UI / OpenAPI (springdoc-openapi)
- **Build Tool**: Maven 3.9+

## Quick Start

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL running on port 3307 (via Homebrew)

### 1. Start MySQL
```bash
brew services start mysql
```

### 2. Create the Database
```bash
mysql -h 127.0.0.1 -P 3307 -u root -p'2264' -e "CREATE DATABASE IF NOT EXISTS espresso_tracker;"
```

### 3. Run the Application
```bash
mvn clean install
mvn spring-boot:run
```

The server starts on **http://localhost:9090**.

### 4. Verify it's Running
```bash
curl http://localhost:9090/api/v1/beans
```

## API Documentation (Swagger)

Once the app is running, open your browser to:

**http://localhost:9090/swagger-ui/index.html**

Swagger UI provides an interactive documentation page where you can:
- Browse all available API endpoints
- View request/response schemas (JSON structures)
- Click **"Try it out"** to execute API calls directly from your browser
- See HTTP status codes and error responses for each endpoint

No additional setup needed — the Swagger UI is auto-generated from the code annotations.

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

### Beans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/beans` | List all active beans (paginated) |
| GET | `/api/v1/beans/{id}` | Get a bean by UUID |
| POST | `/api/v1/beans` | Add a new coffee bean |
| PUT | `/api/v1/beans/{id}` | Update a bean |
| DELETE | `/api/v1/beans/{id}` | Soft-delete a bean |

### Brew Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/brew-logs` | Log a new brew extraction |
| GET | `/api/v1/brew-logs/bean/{beanId}` | Get brew logs for a specific bean |
| GET | `/api/v1/brew-logs/top-rated` | Get brews rated 4-5 stars |

## Architecture
This project follows an N-Tier architecture (Controller, Service, Repository) with Flyway-managed database migrations and Swagger-based API documentation. See [`BOILERPLATE.md`](./BOILERPLATE.md) for a detailed breakdown of every component.
