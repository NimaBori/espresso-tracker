# Espresso-Tracker — Boilerplate Guide

This document explains the architecture, configuration, and key components of this Spring Boot project with its React frontend. Use it as a reference for understanding how everything fits together.

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
10. [JWT Authentication & Security](#jwt-authentication--security)
11. [Frontend Authentication](#frontend-authentication)
12. [Build & Run](#build--run)

---

## Project Overview

A full-stack application for tracking specialty coffee beans and espresso extraction parameters. Users can manage an inventory of coffee beans and log espresso brew extractions with detailed parameters (dose, yield, extraction time, rating, etc.).

- **Backend**: Spring Boot REST API with JWT authentication and role-based authorization
- **Frontend**: React SPA with protected routes and role-based UI rendering

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
| Frontend              | React 19 + Vite 8                    |
| Frontend HTTP Client  | Axios                                |
| Routing               | React Router v7                      |

---

## Project Structure

```
Espresso-Tracker/
├── BOILERPLATE.md                  ← You are here
├── README.md
├── pom.xml                         ← Maven dependencies & plugins
├── frontend/                       ← React SPA
│   ├── package.json
│   ├── vite.config.js              ← Vite config (proxy /api → localhost:9090)
│   └── src/
│       ├── main.jsx                ← Entry point (BrowserRouter + AuthProvider)
│       ├── App.jsx                 ← Routes (public + protected)
│       ├── context/
│       │   └── AuthContext.jsx     ← Global auth state (token, user, role)
│       ├── services/
│       │   └── api.js              ← Axios instance + JWT interceptor + API calls
│       ├── components/
│       │   ├── Header.jsx          ← Nav bar with role-based links
│       │   ├── ProtectedRoute.jsx  ← Redirects unauthenticated users to /login
│       │   └── ...
│       └── pages/
│           ├── LoginPage.jsx       ← Sign-in form
│           ├── RegisterPage.jsx    ← Registration form
│           ├── Dashboard.jsx       ← Admin: shows add buttons; User: view-only
│           ├── BeanList.jsx        ← Admin: edit/delete; User: view-only
│           ├── BeanDetail.jsx      ← Admin: edit/log/delete; User: view-only
│           └── ...
src/
├── main/
│   ├── java/com/espresso/tracker/
│   │   ├── TrackerApplication.java             ← Entry point
│   │   ├── config/                             ← Security & app configuration
│   │   │   └── SecurityConfig.java
│   │   ├── controller/                         ← REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── BeanController.java
│   │   │   └── BrewLogController.java
│   │   ├── dto/                                ← Request/Response DTOs
│   │   │   ├── BeanRequestDTO.java
│   │   │   ├── BeanResponseDTO.java
│   │   │   ├── BrewLogRequestDTO.java
│   │   │   ├── BrewLogResponseDTO.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── RegisterRequest.java
│   │   ├── entity/                             ← JPA entities
│   │   │   ├── Bean.java
│   │   │   ├── BrewLog.java
│   │   │   ├── RoastLevel.java                 ← ENUM
│   │   │   ├── Role.java                       ← ENUM (USER, ADMIN)
│   │   │   └── User.java
│   │   ├── exception/                          ← Global error handling
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/                         ← Spring Data JPA repos
│   │   │   ├── BeanRepository.java
│   │   │   ├── BrewLogRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/                           ← JWT & auth components
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── JwtService.java
│   │   └── service/                            ← Business logic
│   │       ├── BeanService.java
│   │       └── BrewLogService.java
│   └── resources/
│       ├── application.properties              ← App configuration
│       └── db/migration/
│           ├── V1__init_schema.sql             ← Beans + brew_logs tables
│           ├── V2__add_users_table.sql         ← Users table
│           ├── V3__fix_users_role_enum.sql     ← Fix role column type
│           └── V4__seed_admin_user.sql         ← Seed default admin user
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

- `jwt.secret` — Base64-encoded HMAC-SHA384 key used to sign and verify JWT tokens. **Replace with a strong, unique secret in production.**
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

```sql
CREATE TABLE users (
    id BINARY(16) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME,
    updated_at DATETIME,
    PRIMARY KEY (id)
);
```

### Migration V3 — `V3__fix_users_role_enum.sql`

Fixes the role column to use MySQL ENUM type matching the Java Role enum:

```sql
ALTER TABLE users
MODIFY COLUMN role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
```

### Migration V4 — `V4__seed_admin_user.sql`

Seeds the default admin user so authentication works out of the box:

```sql
INSERT INTO users (id, username, email, password, role)
SELECT UUID_TO_BIN('a1b2c3d4-e5f6-7890-abcd-ef1234567890'), 'admin', 'admin@espresso.com',
       '$2a$10$...', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
```

- **Username:** `admin`
- **Password:** `admin123`

### Adding a New Migration

1. Create a file named `V5__description.sql` in `src/main/resources/db/migration/`.
2. Write your SQL (ALTER TABLE, CREATE TABLE, etc.).
3. Restart the app — Flyway will apply it automatically.

---

## API Layer

### Base URL

All endpoints are prefixed with `/api/v1/`.

### Authentication API (`AuthController`)

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/v1/auth/login` | Authenticate user, returns JWT token | 200 OK, 401 Unauthorized, 400 Bad Request |
| POST | `/api/v1/auth/register` | Create a new user (USER role) | 201 Created, 400 Bad Request |

### Beans API (`BeanController`)

| Method | Endpoint | Description | Required Role | Status Codes |
|--------|----------|-------------|---------------|--------------|
| GET | `/api/v1/beans` | List all active beans (paginated) | Authenticated | 200 OK |
| GET | `/api/v1/beans/{id}` | Get a bean by UUID | Authenticated | 200 OK, 404 Not Found |
| POST | `/api/v1/beans` | Add a new coffee bean | ADMIN | 201 Created, 400 Bad Request |
| PUT | `/api/v1/beans/{id}` | Update an existing bean | ADMIN | 200 OK, 404 Not Found |
| DELETE | `/api/v1/beans/{id}` | Soft-delete (sets is_active=false) | ADMIN | 204 No Content, 404 Not Found |

### Brew Logs API (`BrewLogController`)

| Method | Endpoint | Description | Required Role | Status Codes |
|--------|----------|-------------|---------------|--------------|
| GET | `/api/v1/brew-logs/bean/{beanId}` | Get all brew logs for a specific bean | Authenticated | 200 OK |
| GET | `/api/v1/brew-logs/top-rated` | Get brew logs with rating 4 or 5 | Authenticated | 200 OK |
| POST | `/api/v1/brew-logs` | Log a new brew extraction | ADMIN | 201 Created |

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

| Exception | HTTP Status | Response Body |
|-----------|-------------|---------------|
| `ResourceNotFoundException` | 404 | `{ "error": "Not Found", "message": "...", "timestamp": "...", "status": 404 }` |
| `MethodArgumentNotValidException` | 400 | Field-level validation errors |
| `BadCredentialsException` | 401 | `{ "message": "Invalid username or password" }` |
| `Exception` (catch-all) | 500 | Generic error message |

---

## JWT Authentication & Security

This section explains how Spring Security, JWT authentication, and role-based authorization work in this project.

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  REGISTER                                                           │
│  POST /api/v1/auth/register                                         │
│  { username, email, password } → Hash password → Save to DB → 201  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  LOGIN                                                              │
│  POST /api/v1/auth/login                                            │
│  { username, password } → Authenticate → Generate JWT → Return      │
│  { token, username, role }                                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  AUTHENTICATED REQUEST                                              │
│  GET /api/v1/beans                                                  │
│  Header: Authorization: Bearer <token>                              │
│    │                                                                 │
│    ▼                                                                 │
│  JwtAuthenticationFilter                                            │
│    │ 1. Extract token from header                                   │
│    │ 2. Validate signature (HMAC-SHA384)                            │
│    │ 3. Check expiration                                            │
│    │ 4. Extract username from token                                 │
│    ▼                                                                 │
│  CustomUserDetailsService.loadUserByUsername(username)              │
│    │ Load user from DB + create UserDetails with GrantedAuthority   │
│    ▼                                                                 │
│  SecurityContextHolder.setAuthentication(authToken)                 │
│    ▼                                                                 │
│  Controller                                                         │
│    │ @PreAuthorize("hasRole('ADMIN')") → checks role claim          │
│    │ If unauthorized → 403 Forbidden                                │
│    ▼                                                                 │
│  Response to client                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Security Components

#### 1. `SecurityConfig.java`

**`@EnableMethodSecurity`** enables `@PreAuthorize` annotations on controller methods.

Security rules:
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()        // Login & register — public
    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()  // Swagger — public
    .requestMatchers("/api/v1/beans/**").authenticated()   // Beans — any logged-in user
    .requestMatchers("/api/v1/brew-logs/**").authenticated() // Brew logs — any logged-in user
    .anyRequest().authenticated())
```

- CSRF disabled (stateless JWT)
- Stateless session management
- `JwtAuthenticationFilter` registered before `UsernamePasswordAuthenticationFilter`

#### 2. `JwtService.java`

Creates and validates JWT tokens:

| Method | Description |
|--------|-------------|
| `generateToken(username, extraClaims)` | Creates a signed JWT with subject (username), claims (role), issued-at, and expiration |
| `extractUsername(token)` | Parses the token and returns the subject claim |
| `isTokenValid(token)` | Verifies the HMAC signature and checks expiration date |

Token structure:
```json
{
  "sub": "admin",
  "role": "ADMIN",
  "iat": 1783992840,
  "exp": 1784079240
}
```

#### 3. `CustomUserDetailsService.java`

- Implements Spring Security's `UserDetailsService`
- Looks up user by username in the `users` table
- Returns a `UserDetails` with the BCrypt password and `ROLE_USER` or `ROLE_ADMIN` authority

#### 4. `JwtAuthenticationFilter.java`

- Extends `OncePerRequestFilter` — runs once per request
- Reads `Authorization: Bearer <token>` header
- Validates the token and sets the `SecurityContext`
- If no token or invalid token, the request continues unauthenticated (filter chain)

#### 5. `@PreAuthorize` on Controllers

**`BeanController.java`:**
```java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<BeanResponseDTO> createBean(...)

@PutMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<BeanResponseDTO> updateBean(...)

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteBean(...)
```

**`BrewLogController.java`:**
```java
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<BrewLogResponseDTO> logBrew(...)
```

GET endpoints in both controllers have no `@PreAuthorize` annotation — they rely on the `.authenticated()` rule from `SecurityConfig`, which allows any authenticated user regardless of role.

#### 6. `Role.java` Enum

```java
public enum Role {
    USER,    // Read-only access
    ADMIN    // Full access
}
```

### Role-Based Access Matrix

| Endpoint | Method | USER | ADMIN |
|----------|--------|------|-------|
| `/api/v1/auth/login` | POST | ✅ | ✅ |
| `/api/v1/auth/register` | POST | ✅ | ✅ |
| `/api/v1/beans` | GET | ✅ | ✅ |
| `/api/v1/beans/{id}` | GET | ✅ | ✅ |
| `/api/v1/beans` | POST | ❌ 403 | ✅ |
| `/api/v1/beans/{id}` | PUT | ❌ 403 | ✅ |
| `/api/v1/beans/{id}` | DELETE | ❌ 403 | ✅ |
| `/api/v1/brew-logs/bean/{beanId}` | GET | ✅ | ✅ |
| `/api/v1/brew-logs/top-rated` | GET | ✅ | ✅ |
| `/api/v1/brew-logs` | POST | ❌ 403 | ✅ |

### User Registration Details

**`AuthController.register()`:**
1. Validates request (username 3-50 chars, email, password 6+ chars)
2. Checks for duplicate username → 400 "Username already exists"
3. Checks for duplicate email → 400 "Email already exists"
4. Generates UUID, hashes password with BCrypt, sets `Role.USER`
5. Saves to database → 201 "User registered successfully"

**`RegisterRequest` DTO:**
```java
public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 50) String username,
    @NotBlank @Email @Size(max = 100) String email,
    @NotBlank @Size(min = 6, max = 100) String password) {}
```

### Default Admin User (Flyway V4)

The seed migration creates an admin user automatically:
- **Username:** `admin`
- **Password:** `admin123` (BCrypt encoded)
- **Email:** `admin@espresso.com`
- **Role:** `ADMIN`

### Testing with curl

```bash
# 1. Register a new user
curl -X POST http://localhost:9090/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"new@example.com","password":"password123"}'

# 2. Login as admin
TOKEN=$(curl -s -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# 3. List beans (works for any authenticated user)
curl http://localhost:9090/api/v1/beans -H "Authorization: Bearer $TOKEN"

# 4. Create a bean (ADMIN only)
curl -X POST http://localhost:9090/api/v1/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"roasterName":"Stumptown","beanName":"Hair Bender","origin":"Ethiopia","roastLevel":"MEDIUM","tastingNotes":"Chocolate, citrus"}'

# 5. Without token (403 Forbidden)
curl http://localhost:9090/api/v1/beans
```

---

## Frontend Authentication

### Architecture Overview

The frontend uses React Context for auth state management, Axios interceptors for automatic JWT attachment, and React Router for protected route handling.

### 1. AuthContext (`frontend/src/context/AuthContext.jsx`)

Provides global auth state to the entire React component tree:

| Value | Description |
|-------|-------------|
| `user` | `{ token, username, role }` or `null` if not logged in |
| `loading` | Boolean — true while checking localStorage on mount |
| `login(token, username, role)` | Saves to localStorage + updates state |
| `logout()` | Clears localStorage + sets user to null |

### 2. Axios Interceptor (`frontend/src/services/api.js`)

Attaches the JWT token to every outgoing request automatically:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

API functions exported:
- `login(username, password)` → POST `/auth/login`
- `register(username, email, password)` → POST `/auth/register`
- `getBeans()`, `getBeanById(id)`, `createBean(data)`, `updateBean(id, data)`, `deleteBean(id)`
- `getLogsByBeanId(id)`, `getTopRatedLogs()`, `createBrewLog(data)`

### 3. ProtectedRoute (`frontend/src/components/ProtectedRoute.jsx`)

Wraps pages that require authentication:

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

### 4. Role-Based UI Rendering

Every page checks `user.role === "ADMIN"` to conditionally render admin-only UI elements:

| Component | Admin Sees | Regular User Sees |
|-----------|-----------|-------------------|
| **Header** | Dashboard, Beans, + Add Bean, Admin badge, Logout | Dashboard, Beans, Sign In/Logout |
| **Dashboard** | + Add Bean, + Log Brew buttons | View-only content |
| **Bean List** | Edit, Delete buttons on each card | View-only grid |
| **Bean Detail** | Edit, Log Brew, Delete action buttons | View-only info |

### 5. Route Configuration (`frontend/src/App.jsx`)

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />         // Public
  <Route path="/register" element={<RegisterPage />} />    // Public
  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />       // Protected
  <Route path="/beans" element={<ProtectedRoute><BeanList /></ProtectedRoute>} />   // Protected
  // ... all other routes are protected
</Routes>
```

### 6. Vite Proxy (`frontend/vite.config.js`)

```javascript
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:9090",
      changeOrigin: true,
    },
  },
}
```

During development, all `/api` requests from the frontend are proxied to the backend on port 9090.

---

## Build & Run

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+
- MySQL running on port 3307 (via Homebrew)

### Start MySQL
```bash
brew services start mysql
# Verify: brew services info mysql → should show "Running: ✔"
```

### Run the Backend
```bash
mvn clean install
mvn spring-boot:run
```

The app starts on `http://localhost:9090`.

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Verify It's Working
```bash
# Backend health check
curl http://localhost:9090/api/v1/beans
# Expected: {"content":[],"pageable":...,"totalElements":0,...}

# Login (admin user is auto-seeded by Flyway V4)
curl -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'