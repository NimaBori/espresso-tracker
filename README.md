# Espresso & Bean Extraction API

A comprehensive backend API to track specialty coffee beans and espresso extraction parameters, built with Spring Boot and MySQL.

> 📘 **For a complete deep-dive into the project architecture, configuration, and all components, see [`BOILERPLATE.md`](./BOILERPLATE.md).**

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security + JWT (jjwt 0.12.6)
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

### 4. Seed a User (Required for Authentication)

All endpoints except login are protected. You need to insert at least one user into the database first:

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
> Password for the above hash is **`admin123`**. Generate your own BCrypt hash at [bcrypt-generator.com](https://bcrypt-generator.com/).

### 5. Get a Token & Verify
```bash
# Login to get a JWT token
TOKEN=$(curl -s -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')
echo $TOKEN

# Use the token to access protected endpoints
curl http://localhost:9090/api/v1/beans -H "Authorization: Bearer $TOKEN"
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

> 🔒 **Authentication**: All endpoints except `/api/v1/auth/login` require a JWT token. Include it as:
> ```
> Authorization: Bearer <your-token>
> ```

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | Authenticate user, returns JWT token | No |

### Beans
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/v1/beans` | List all active beans (paginated) | Authenticated |
| GET | `/api/v1/beans/{id}` | Get a bean by UUID | Authenticated |
| POST | `/api/v1/beans` | Add a new coffee bean | ADMIN |
| PUT | `/api/v1/beans/{id}` | Update a bean | ADMIN |
| DELETE | `/api/v1/beans/{id}` | Soft-delete a bean | ADMIN |

### Brew Logs
| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/v1/brew-logs` | Log a new brew extraction | Authenticated |
| GET | `/api/v1/brew-logs/bean/{beanId}` | Get brew logs for a specific bean | Authenticated |
| GET | `/api/v1/brew-logs/top-rated` | Get brews rated 4-5 stars | Authenticated |

## Security

This project uses **JWT (JSON Web Token)** authentication with **Spring Security**. Two roles are defined:

- **`USER`** — Can read beans and manage brew logs (create, read)
- **`ADMIN`** — Full access: can create, update, and delete beans in addition to everything a USER can do

### Authentication Flow

1. **Login** — Send `POST /api/v1/auth/login` with `{"username": "...", "password": "..."}` → receive a JWT token
2. **Authenticate requests** — Include the token in every request header: `Authorization: Bearer <token>`
3. **Token validation** — The `JwtAuthenticationFilter` extracts and validates the token on every request, sets the security context
4. **Role enforcement** — Spring Security checks the user's role (USER/ADMIN) against endpoint security rules

### Testing with curl

```bash
# 1. Get a token
TOKEN=$(curl -s -X POST http://localhost:9090/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# 2. List beans (any authenticated user)
curl http://localhost:9090/api/v1/beans -H "Authorization: Bearer $TOKEN"

# 3. Create a bean (ADMIN only)
curl -X POST http://localhost:9090/api/v1/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"roasterName":"Stumptown","beanName":"Hair Bender","origin":"Ethiopia","roastLevel":"MEDIUM","tastingNotes":"Chocolate, citrus"}'

# 4. Without token (403 Forbidden)
curl http://localhost:9090/api/v1/beans
```

## Architecture
This project follows an N-Tier architecture (Controller, Service, Repository) with Flyway-managed database migrations, JWT-based authentication, and Swagger-based API documentation. See [`BOILERPLATE.md`](./BOILERPLATE.md) for a detailed breakdown of every component.
