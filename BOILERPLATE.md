# Espresso-Tracker — Boilerplate Guide

This document explains the architecture, configuration, and key components of this Spring Boot project. Use it as a reference for understanding how everything fits together.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Application Configuration](#application-configuration)
5. [Database & Flyway Migrations](#database--flyway-migrations)
6. [API Layer](#api-layer)
7. [Swagger / OpenAPI Documentation](#swagger--openapi-documentation)
8. [Service & Repository Layer](#service--repository-layer)
9. [Exception Handling](#exception-handling)
10. [Build & Run](#build--run)

---

## Project Overview

A backend API for tracking specialty coffee beans and espresso extraction parameters. Users can manage an inventory of coffee beans and log espresso brew extractions with detailed parameters (dose, yield, extraction time, rating, etc.).

---

## Tech Stack

| Component             | Technology                           |
|-----------------------|--------------------------------------|
| Language              | Java 21                              |
| Framework             | Spring Boot 3.2.5                    |
| Security              | Spring Security + JWT (jjwt 0.12.6)  |
| Database              | MySQL 9.6 (Homebrew)                 |
| ORM                   | Spring Data JPA / Hibernate          |
| Migrations            | Flyway Community Edition 9.22.3      |
| API Documentation     | Swagger UI / OpenAPI 3.0 (springdoc-openapi) |
| Build Tool            | Maven 3.9+                           |
| DTO Mapping           | Manual (Lombok for boilerplate)      |

---

## Project Structure

```
Espresso-Tracker/
├── BOILERPLATE.md                  ← You are here
├── README.md
├── pom.xml                         ← Maven dependencies & plugins
├── src/
│   ├── main/
│   │   ├── java/com/espresso/tracker/
│   │   │   ├── TrackerApplication.java         ← Entry point
│   │   │   ├── config/                         ← Security & app configuration
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/                     ← REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── BeanController.java
│   │   │   │   └── BrewLogController.java
│   │   │   ├── dto/                            ← Request/Response DTOs
│   │   │   │   ├── BeanRequestDTO.java
│   │   │   │   ├── BeanResponseDTO.java
│   │   │   │   ├── BrewLogRequestDTO.java
│   │   │   │   ├── BrewLogResponseDTO.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── LoginResponse.java
│   │   │   ├── entity/                         ← JPA entities
│   │   │   │   ├── Bean.java
│   │   │   │   ├── BrewLog.java
│   │   │   │   ├── RoastLevel.java             ← ENUM
│   │   │   │   ├── Role.java                   ← ENUM
│   │   │   │   └── User.java
│   │   │   ├── exception/                      ← Global error handling
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── repository/                     ← Spring Data JPA repos
│   │   │   │   ├── BeanRepository.java
│   │   │   │   ├── BrewLogRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/                       ← JWT & auth components
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtService.java
│   │   │   └── service/                        ← Business logic
│   │   │       ├── BeanService.java
│   │   │       └── BrewLogService.java
│   │   └── resources/
│   │       ├── application.properties          ← App configuration
│   │       └── db/migration/
│   │           ├── V1__init_schema.sql         ← Flyway migration
│   │           └── V2__add_users_table.sql     ← Flyway migration
│   └── test/java/com/espresso/tracker/
└── pom.xml
```

---

## Application Configuration

**File:** `src/main/resources/application.properties`

### Server
```properties
server.port=9090
```

### MySQL Datasource
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/espresso_tracker?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=2264
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**Important:** MySQL on this machine runs on port **3307** (not the default 3306). The root password is `2264`. The Homebrew MySQL config is at `/opt/homebrew/etc/my.cnf`:
```ini
[mysqld]
port = 3307
socket = /tmp/mysql_3307.sock
```

### JPA / Hibernate
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

- `ddl-auto=validate` — Hibernate checks that the database schema matches the entities **without** modifying it. Schema changes are managed by Flyway migrations.

### JWT Configuration
```properties
jwt.secret=dGhpcyBpcyBhIHZlcnkgc2VjdXJlIGtleSBmb3IgZXNwcmVzc28gdHJhY2tlciBhcHBsaWNhdGlvbg==
jwt.expiration-ms=86400000
```

- `jwt.secret` — Base64-encoded HMAC-SHA256 key used to sign and verify JWT tokens. **Replace with a strong, unique secret in production.**
- `jwt.expiration-ms` — Token lifetime in milliseconds. Default is `86400000` (24 hours).

---

## Database & Flyway Migrations

### How Flyway Works

Flyway is a database migration tool that applies versioned SQL scripts in order. When the application starts:

1. Flyway checks a table called `flyway_schema_history` in the database.
2. It compares the migrations in `src/main/resources/db/migration/` against what's been applied.
3. Any new migrations are applied in order of their version number (e.g., `V1`, `V2`, etc.).

### Migration V1 — `V1__init_schema.sql`

Creates two tables:

- **`beans`** — Coffee bean inventory:
  - `id` (BINARY(16) UUID)
  - `roaster_name`, `bean_name`, `origin`
  - `roast_level` — stored as `ENUM('LIGHT','MEDIUM','DARK')` to match the Java `RoastLevel` enum
  - `tasting_notes`, `is_active`, `created_at`

- **`brew_logs`** — Espresso extraction logs:
  - `id` (BINARY(16) UUID)
  - `bean_id` — foreign key to `beans`
  - `dose_grams`, `yield_grams`, `extraction_time_seconds`
  - `grind_setting`, `rating`, `notes`, `created_at`

### Migration V2 — `V2__add_users_table.sql`

Creates the `users` table for authentication:

- **`users`** — Application users:
  - `id` (BINARY(16) UUID, primary key)
  - `username` (VARCHAR 50, unique, not null)
  - `email` (VARCHAR 100, unique, not null)
  - `password` (VARCHAR 255, not null — BCrypt-encoded)
  - `role` (VARCHAR 20, default `'USER'`) — either `USER` or `ADMIN`
  - `created_at`, `updated_at`

### Adding a New Migration

1. Create a file named `V3__description.sql` in `src/main/resources/db/migration/`.
2. Write your SQL (ALTER TABLE, CREATE TABLE, etc.).
3. Restart the app — Flyway will apply it automatically.

### Important: ENUM vs VARCHAR

The `roast_level` column uses MySQL's `ENUM` type because the Java entity uses:
```java
@Enumerated(EnumType.STRING)
private RoastLevel roastLevel;
```

If you change the migration, you must also update the Java enum or vice versa. Otherwise Hibernate validation (`ddl-auto=validate`) will fail with a schema mismatch error.

---

## API Layer

### Base URL

All endpoints are prefixed with `/api/v1/`.

### Authentication API (`AuthController`)

| Method | Endpoint              | Description                            | Status Codes               |
|--------|-----------------------|----------------------------------------|----------------------------|
| POST   | `/api/v1/auth/login`  | Authenticate user, returns JWT token   | 200 OK, 401 Unauthorized, 400 Bad Request |

### Beans API (`BeanController`)

| Method | Endpoint                | Description                          | Required Role    | Status Codes               |
|--------|-------------------------|--------------------------------------|------------------|----------------------------|
| GET    | `/api/v1/beans`         | List all active beans (paginated)    | Authenticated    | 200 OK                     |
| GET    | `/api/v1/beans/{id}`    | Get a bean by UUID                   | Authenticated    | 200 OK, 404 Not Found      |
| POST   | `/api/v1/beans`         | Add a new coffee bean                | ADMIN            | 201 Created, 400 Bad Request |
| PUT    | `/api/v1/beans/{id}`    | Update an existing bean              | ADMIN            | 200 OK, 404 Not Found      |
| DELETE | `/api/v1/beans/{id}`    | Soft-delete (sets is_active=false)   | ADMIN            | 204 No Content, 404 Not Found |

### Brew Logs API (`BrewLogController`)

| Method | Endpoint                         | Description                               | Required Role    | Status Codes          |
|--------|----------------------------------|-------------------------------------------|------------------|-----------------------|
| POST   | `/api/v1/brew-logs`              | Log a new brew extraction                 | Authenticated    | 201 Created           |
| GET    | `/api/v1/brew-logs/bean/{beanId}` | Get all brew logs for a specific bean    | Authenticated    | 200 OK                |
| GET    | `/api/v1/brew-logs/top-rated`     | Get brew logs with rating 4 or 5         | Authenticated    | 200 OK                |

### Example: Login (Get JWT Token)

```bash
curl -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc1MDAwMDAwMCwiZXhwIjoxNzUwMDg2NDAwfQ...",
  "username": "admin",
  "role": "ADMIN"
}
```

### Example: Creating a Bean (with JWT)

```bash
curl -X POST http://localhost:9090/api/v1/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "roasterName": "Stumptown",
    "beanName": "Hair Bender",
    "origin": "Ethiopia",
    "roastLevel": "MEDIUM",
    "tastingNotes": "Chocolate, citrus"
  }'
```

Response: `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "roasterName": "Stumptown",
  "beanName": "Hair Bender",
  "origin": "Ethiopia",
  "roastLevel": "MEDIUM",
  "tastingNotes": "Chocolate, citrus",
  "isActive": true,
  "createdAt": "2026-07-02T08:30:00"
}
```

### Example: Logging a Brew (with JWT)

```bash
curl -X POST http://localhost:9090/api/v1/brew-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "beanId": "550e8400-e29b-41d4-a716-446655440000",
    "doseGrams": 18.0,
    "yieldGrams": 36.0,
    "extractionTimeSeconds": 30,
    "grindSetting": "3.5 on Baratza Encore",
    "rating": 4,
    "notes": "Sweet and balanced"
  }'
```

---

## Swagger / OpenAPI Documentation

### What is Swagger?

Swagger (also called OpenAPI) is a specification for describing REST APIs. **springdoc-openapi** automatically generates an OpenAPI 3.0 specification from your Spring Boot controllers by reading annotations like `@RestController`, `@RequestMapping`, `@Operation`, and `@Tag`.

### Accessing the Swagger UI

Once the application is running, open your browser to:

**http://localhost:9090/swagger-ui/index.html**

(Note: `http://localhost:9090/swagger-ui.html` redirects to the above URL.)

### What You Can Do in Swagger UI

#### 1. Browse Endpoints
All API endpoints are grouped by tag (Authentication API, Beans API, Brew Logs API). Each endpoint shows:
- HTTP method (GET, POST, PUT, DELETE)
- Full URL path
- Short description from `@Operation`
- Request parameters, headers, and body schemas
- Response schemas and status codes

#### 2. Try It Out (Execute Requests from the Browser)
Every endpoint has a **"Try it out"** button. Click it, fill in the parameters, and execute the request directly — you'll see the raw curl command, the request URL, and the full server response (status, headers, body).

#### 3. View Request/Response Schemas
- **Request body** — Shows the exact JSON structure expected, with field types and whether each field is required.
- **Response body** — Shows the structure of the data returned.

#### 4. Error Responses
Swagger documents the possible HTTP status codes for each endpoint (200, 201, 204, 400, 404, 500).

### How It's Configured

The dependency in `pom.xml`:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

Controller annotations used:
```java
@Tag(name = "Beans API", description = "Endpoints for managing coffee beans inventory")
@Operation(summary = "Get all active beans", description = "...")
```

No additional configuration is needed — springdoc auto-configures itself on startup.

---

## Service & Repository Layer

### Repository Pattern

Spring Data JPA repositories provide automatic CRUD operations:

```java
public interface BeanRepository extends JpaRepository<Bean, UUID> {
    Page<Bean> findByIsActiveTrue(Pageable pageable);
}
```

### Service Layer

Business logic lives in service classes:

- **`BeanService`** — CRUD operations, soft-delete, DTO mapping
- **`BrewLogService`** — Create brew logs, fetch by bean ID, fetch top-rated

---

## Exception Handling

**`GlobalExceptionHandler`** uses `@ControllerAdvice` to catch exceptions globally:

| Exception                        | HTTP Status | Response Body              |
|----------------------------------|-------------|----------------------------|
| `ResourceNotFoundException`      | 404         | `{ "error": "Not Found", "message": "...", "timestamp": "...", "status": 404 }` |
| `MethodArgumentNotValidException`| 400         | Field-level validation errors |
| `Exception` (catch-all)          | 500         | Generic error message      |

---

## JWT Authentication & Security

This section explains how Spring Security and JWT authentication work in this project.

### Authentication Flow

```
┌──────────┐         ┌──────────────────┐         ┌──────────┐
│  Client  │ ──POST──▶  /api/v1/auth/   │ ──────▶  │  DB:     │
│ (curl/   │   login  │  login           │  verify  │  users   │
│  Swagger)│         │                  │  creds   │  table   │
└────┬─────┘         └────────┬─────────┘         └──────────┘
     │                        │
     │                        │ Returns JWT token
     │                        ▼
     │              ┌──────────────────┐
     │              │  Client saves    │
     │              │  the token       │
     │              └──────────────────┘
     │
     │ ──GET /api/v1/beans ──┐
     │   Authorization:       │
     │   Bearer <token>       │
     │                        ▼
     │              ┌──────────────────┐
     │              │ JwtAuthFilter    │
     │              │ • extracts token │
     │              │ • validates sig  │
     │              │ • loads user     │
     │              └────────┬─────────┘
     │                       │
     │                       ▼
     │              ┌──────────────────┐
     │              │ SecurityContext  │
     │              │ holds auth info  │
     │              └────────┬─────────┘
     │                       │
     │                       ▼
     │              ┌──────────────────┐
     │              │ Controller       │
     │              │ (authenticated)  │
     │              └──────────────────┘
```

### How Each Component Works

#### 1. User Registration (Manual / Seed Data)
There is no registration endpoint built in. Users are inserted directly into the `users` table with a BCrypt-encoded password. Two roles are supported:

- **`USER`** — Can read beans, read/write brew logs
- **`ADMIN`** — Can do everything including create/update/delete beans

**Example: Insert a test user (run after starting the app & running Flyway migration V2):**
```sql
INSERT INTO users (id, username, email, password, role)
VALUES (
  UUID_TO_BIN(UUID()),
  'admin',
  'admin@espresso.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ADMIN'
);
```

To generate a BCrypt password for your own user, use this one-liner:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--bcrypt=mypassword"
```
Or generate one online at `https://bcrypt-generator.com/`.

#### 2. `SecurityConfig`
- **Disables CSRF** — The API uses stateless JWT, so CSRF is unnecessary.
- **Stateless sessions** — No HTTP session is created; every request is authenticated individually via the JWT.
- **Endpoint security rules:**
  - `POST /api/v1/auth/login` — open to everyone
  - Swagger UI paths — open to everyone
  - `GET /api/v1/beans/**` — any authenticated user (USER or ADMIN)
  - `POST/PUT/DELETE /api/v1/beans/**` — ADMIN only
  - `/api/v1/brew-logs/**` — any authenticated user
  - Any other request — authenticated
- Registers `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter` in the filter chain.

#### 3. `JwtService`
- Uses **HMAC-SHA256** with a Base64-encoded secret key from `application.properties`
- `generateToken(username, extraClaims)` — creates a signed JWT with subject (username), issued-at, and expiration timestamps
- `extractUsername(token)` — parses the token and returns the subject claim
- `isTokenValid(token)` — verifies the signature and checks the expiration date

#### 4. `CustomUserDetailsService`
- Implements Spring Security's `UserDetailsService`
- Looks up a user by username in the database
- Returns a `UserDetails` object with the BCrypt password and granted authority (e.g., `ROLE_USER` or `ROLE_ADMIN`)

#### 5. `JwtAuthenticationFilter`
- Extends `OncePerRequestFilter` — runs once per request
- Reads the `Authorization` header and looks for `Bearer <token>` format
- Extracts the username from the token via `JwtService`
- If the token is valid and no existing authentication exists, loads the `UserDetails` and sets `UsernamePasswordAuthenticationToken` in the `SecurityContextHolder`
- If no valid token is present, the request continues unauthenticated (and Spring Security will deny access based on the security rules)

### Role-Based Access Summary

| Role   | Beans (GET) | Beans (POST/PUT/DELETE) | Brew Logs | Login |
|--------|-------------|-------------------------|-----------|-------|
| USER   | ✅          | ❌                      | ✅        | ✅    |
| ADMIN  | ✅          | ✅                      | ✅        | ✅    |
| None   | ❌          | ❌                      | ❌        | ✅    |

### Testing with curl

```bash
# 1. Get a token (replace credentials with your seeded user)
TOKEN=$(curl -s -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# 2. Use the token to list beans (USER or ADMIN)
curl http://localhost:9090/api/v1/beans \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a bean (ADMIN only — will fail if token is from a USER role)
curl -X POST http://localhost:9090/api/v1/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"roasterName":"Test","beanName":"Test Bean","origin":"Test","roastLevel":"MEDIUM"}'

# 4. Without token (will get 403 Forbidden)
curl http://localhost:9090/api/v1/beans
```

---

## Build & Run

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL running on port 3307 (via Homebrew)

### Start MySQL
```bash
brew services start mysql
# Verify: brew services info mysql → should show "Running: ✔"
```

### Run the Application
```bash
mvn clean install
mvn spring-boot:run
```

The app starts on `http://localhost:9090`.

### Verify It's Working
```bash
curl http://localhost:9090/api/v1/beans
# Expected: {"content":[],"pageable":...,"totalElements":0,...}