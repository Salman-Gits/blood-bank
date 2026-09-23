# 🩸 Blood Bank & Donor Management System - Spring Boot Backend

A production-style RESTful backend service built with **Java 17+ / Spring Boot 3.2+**, **Spring Data JPA / Hibernate**, and **MySQL 8.0**.

---

## 🚀 Key Features

* **Authentication & Authorization**: User & Donor registration, Admin login, token-based session handling.
* **Donor Management**:
  * Register new donors with medical details (blood group, last donation date, location, contact, donation history).
  * Filter & search donors by Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-), City/District, and 90-day medical donation eligibility.
  * Admin toggle availability and CRUD operations.
* **Blood Inventory Management**:
  * Real-time tracking of units available, reserved units, and critical shortage alerts for all 8 blood groups.
  * Stock adjustment with operational logging (donations received, emergency dispatches).
* **Blood Requests & Emergency Dispatch**:
  * Public emergency blood request submission generating unique tracking codes (e.g. `REQ-2026-1001`).
  * Urgency tiering (`NORMAL`, `URGENT`, `CRITICAL`).
  * Multi-stage request workflow: `PENDING` ➔ `APPROVED` / `REJECTED` ➔ `COMPLETED`.
  * Automatic inventory deduction upon completion.
* **Admin Analytics & Dashboard**:
  * Aggregated real-time metrics, donor counts, inventory levels, pending & critical request counters.
* **Enterprise Architecture**:
  * Controller ➔ Service ➔ Repository ➔ Entity / DTO layer separation.
  * Global exception handling with RFC 7807 compliant error payloads.
  * Robust Bean Validation (`@Valid`, `@NotBlank`, `@Min`, `@Email`).
  * Pre-configured CORS for React frontend (`http://localhost:3000`).

---

## 🛠️ Prerequisites

* **Java JDK 17** or newer
* **Apache Maven 3.8+**
* **MySQL 8.0+** (or Docker to run MySQL automatically)

---

## 📦 Quick Start (with Docker Compose for MySQL)

1. **Start the MySQL 8.0 Database:**
   ```bash
   cd backend
   docker-compose up -d
   ```
   * MySQL will start on `localhost:3306` with database `bloodbank_db`.
   * The schema and sample seed data will be automatically imported from `schema.sql` and `data.sql`.

2. **Run the Spring Boot Application:**
   ```bash
   mvn spring-boot:run
   ```
   The application will start on **`http://localhost:8080`**.

---

## 🏃 Running without Docker (Local MySQL)

1. Open your MySQL console or MySQL Workbench:
   ```sql
   CREATE DATABASE IF NOT EXISTS bloodbank_db;
   ```
2. Verify credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bloodbank_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

---

## 🔌 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user or admin |
| `POST` | `/api/auth/register` | Register new user or donor |

### Donors (`/api/donors`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/donors` | List all registered donors |
| `GET` | `/api/donors/{id}` | Get donor profile by ID |
| `GET` | `/api/donors/search` | Search by `bloodGroup`, `location`, `query`, `eligibleOnly` |
| `POST` | `/api/donors` | Register new donor |
| `PUT` | `/api/donors/{id}` | Update donor details |
| `PATCH` | `/api/donors/{id}/toggle-availability` | Toggle donor availability |
| `DELETE` | `/api/donors/{id}` | Delete donor record |

### Blood Inventory (`/api/inventory`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inventory` | Get real-time stock for all 8 blood groups |
| `GET` | `/api/inventory/{bloodGroup}` | Get stock for specific blood group |
| `POST` | `/api/inventory/update` | Add or deduct units (+/- delta) |

### Blood Requests (`/api/requests`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/requests?status={PENDING|APPROVED|REJECTED|COMPLETED}` | List requests with optional status filter |
| `GET` | `/api/requests/{id}` | Get blood request by ID |
| `GET` | `/api/requests/track/{trackingCode}` | Track request status by tracking code |
| `POST` | `/api/requests` | Submit emergency or planned blood request |
| `PATCH` | `/api/requests/{id}/status` | Admin update status (`PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`) |
| `DELETE` | `/api/requests/{id}` | Delete request |

### Admin Dashboard (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated statistics, unit counts, request counts |

---

## 👤 Default Credentials

* **Admin Username**: `admin`
* **Admin Password**: `admin123`
* **Role**: `ADMIN`
