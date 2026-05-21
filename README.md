# 🚗 CarGallery — Car Rental Management System

> A full-stack web application for browsing, filtering, and reserving rental vehicles with role-based access control, auto-pricing, and real-time conflict detection.

**Course:** System Analysis & Design — Spring 2026  
**Stack:** Node.js · Express · PostgreSQL · Prisma · Vanilla JS (SPA)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [Swagger Documentation](#-swagger-documentation)
- [Validation](#-validation)
- [Testing](#-testing)
- [CI/CD](#-cicd)
- [Database Schema](#-database-schema)
- [Design Decisions](#-design-decisions)
- [License](#-license)

---

## ✨ Features

### 👤 Customer Features
| Feature | Description |
|---------|-------------|
| Vehicle Browsing | Browse fleet with image cards showing key specs |
| Advanced Filtering | Filter by category, fuel type, transmission |
| Search | Real-time search by brand or model name |
| Sorting | Sort by price, year, or mileage (asc/desc) |
| Vehicle Details | View full specs, image, and reservation history |
| Smart Reservations | Book with real-time price preview and date validation |
| Balance System | Virtual wallet with $10,000 starting balance |
| Dashboard | Personal reservation history and account overview |

### 🔧 Admin Features
| Feature | Description |
|---------|-------------|
| Vehicle CRUD | Create, edit, delete vehicles via modal forms |
| Category CRUD | Manage categories with delete protection |
| Reservation Management | View, approve, cancel, or delete any reservation |
| User Management | View all registered users and their stats |
| Admin Creation | Master admin can create new admin accounts |
| Tabbed Interface | Organized admin panel with tabs |

### ⚙️ System Features
| Feature | Description |
|---------|-------------|
| Auto-pricing | Total price = daily rate × number of days |
| Conflict Detection | Prevents double-booking with date overlap checks |
| Balance Deduction | Automatically deducts from user balance on booking |
| Refund on Cancel | Returns balance when reservation is cancelled |
| Delete Protection | Cannot delete categories with vehicles or vehicles with active reservations |
| Dual Validation | Joi schemas on backend + JS validation on frontend |
| Auth System | Role-based access (user, admin, master_admin) via X-User-Id header |
| Error Handling | Centralized error handler with Prisma error mapping |
| Consistent API | Uniform `{ success, data, count }` response format |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML, CSS, Vanilla JavaScript | Single Page Application (SPA) |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Prisma | Type-safe database queries |
| **Validation** | Joi | Request schema validation |
| **Testing** | Jest | Unit testing with coverage |
| **API Docs** | Swagger / OpenAPI 3.0 | Interactive API documentation |
| **CI/CD** | GitHub Actions | Automated testing pipeline |

---

## 🏗 Architecture

The application follows a **layered architecture** pattern to separate concerns and ensure testability. Business logic is strictly separated from route handlers, making unit testing possible without HTTP layer dependencies.

```
Client (Browser SPA)
       │
       ▼
┌─────────────────────────────────────────────┐
│  Express Server                             │
│  ┌───────────┐  ┌────────────┐              │
│  │  Routes   │→ │ Middleware  │              │
│  │ (endpoints│  │ (validate, │              │
│  │  + swagger│  │  auth,     │              │
│  │  docs)    │  │  errorHndl)│              │
│  └─────┬─────┘  └────────────┘              │
│        ▼                                    │
│  ┌─────────────┐                            │
│  │ Controllers  │  ← Request/Response only  │
│  └──────┬──────┘                            │
│         ▼                                   │
│  ┌─────────────┐                            │
│  │  Services    │  ← Business logic here    │
│  └──────┬──────┘                            │
│         ▼                                   │
│  ┌──────────────┐                           │
│  │ Repositories  │ ← Database queries only  │
│  └──────┬───────┘                           │
│         ▼                                   │
│  ┌─────────────┐                            │
│  │ Prisma ORM   │                           │
│  └──────┬──────┘                            │
└─────────┼───────────────────────────────────┘
          ▼
    ┌──────────┐
    │PostgreSQL│
    └──────────┘
```

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Route** | HTTP endpoint definitions, Swagger docs, middleware binding | `GET /api/vehicles` |
| **Middleware** | Cross-cutting concerns (validation, auth, error handling) | Joi schema validation |
| **Controller** | Parse request, call service, send response (no business logic) | Extract `req.params.id`, call service |
| **Service** | Business logic, validation rules, conflict checks | Check date overlaps, calculate price |
| **Repository** | Database queries via Prisma (no logic) | `prisma.vehicle.findMany(...)` |

---

## 📁 Project Structure

```
cargallery/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma             # Database models & relations
│   │   └── seed.js                   # Sample data (4 categories + 10 vehicles)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── categoryController.js # Category request handlers
│   │   │   ├── vehicleController.js  # Vehicle request handlers
│   │   │   ├── reservationController.js # Reservation request handlers
│   │   │   └── userController.js     # User/auth request handlers
│   │   ├── middlewares/
│   │   │   ├── auth.js               # Authentication & role checks
│   │   │   ├── errorHandler.js       # Global error handling
│   │   │   └── validate.js           # Joi validation middleware
│   │   ├── repositories/
│   │   │   ├── categoryRepository.js # Category DB operations
│   │   │   ├── vehicleRepository.js  # Vehicle DB operations
│   │   │   ├── reservationRepository.js # Reservation DB operations
│   │   │   └── userRepository.js     # User DB operations
│   │   ├── routes/
│   │   │   ├── categoryRoutes.js     # Category endpoints + Swagger
│   │   │   ├── vehicleRoutes.js      # Vehicle endpoints + Swagger
│   │   │   ├── reservationRoutes.js  # Reservation endpoints + Swagger
│   │   │   └── userRoutes.js         # User/auth endpoints + Swagger
│   │   ├── services/
│   │   │   ├── categoryService.js    # Category business logic
│   │   │   ├── vehicleService.js     # Vehicle business logic
│   │   │   ├── reservationService.js # Reservation business logic
│   │   │   └── userService.js        # User/auth business logic
│   │   ├── swagger/
│   │   │   └── swagger.js            # OpenAPI 3.0 configuration
│   │   ├── utils/
│   │   │   └── helpers.js            # Utility functions (pricing, formatting)
│   │   ├── validations/
│   │   │   ├── categoryValidation.js # Category Joi schemas
│   │   │   ├── vehicleValidation.js  # Vehicle Joi schemas
│   │   │   ├── reservationValidation.js # Reservation Joi schemas
│   │   │   └── userValidation.js     # User/auth Joi schemas
│   │   └── app.js                    # Express app setup & middleware
│   ├── tests/
│   │   ├── helpers.test.js           # Utility function tests
│   │   ├── categoryService.test.js   # Category service tests
│   │   ├── vehicleService.test.js    # Vehicle service tests
│   │   ├── reservationService.test.js # Reservation service tests
│   │   └── userService.test.js       # User service tests
│   ├── server.js                     # Server entry point
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css                 # Complete design system
│   ├── js/
│   │   ├── api.js                    # API client module (fetch wrapper)
│   │   ├── router.js                 # Hash-based SPA router
│   │   ├── app.js                    # App initialization & route registration
│   │   ├── components/
│   │   │   ├── Auth.js               # Auth state management (localStorage)
│   │   │   ├── Modal.js              # Reusable modal component
│   │   │   ├── Navbar.js             # Dynamic navigation bar
│   │   │   ├── Toast.js              # Toast notification system
│   │   │   ├── VehicleCard.js        # Vehicle card component
│   │   │   └── VehicleFilter.js      # Filter/search/sort controls
│   │   └── pages/
│   │       ├── HomePage.js           # Landing page with featured vehicles
│   │       ├── LoginPage.js          # Login form with validation
│   │       ├── RegisterPage.js       # Registration form with validation
│   │       ├── DashboardPage.js      # User dashboard & reservations
│   │       ├── VehicleDetailPage.js  # Vehicle detail view
│   │       ├── ReservationPage.js    # Booking form with price preview
│   │       └── AdminPage.js          # Admin panel (vehicles, categories, reservations)
│   └── index.html                    # SPA shell (single HTML entry point)
├── .env.example                      # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | v18 or higher |
| PostgreSQL | v14 or higher |
| npm | v9 or higher |
| Git | Latest |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dormhi/CargallerySAD.git
cd CargallerySAD

# 2. Install backend dependencies
cd backend
npm install
```

---

## 🔐 Environment Variables

Create the `.env` file from the provided template:

```bash
cp ../.env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cargallery?schema=public"

# Server configuration
PORT=3000
NODE_ENV=development
```

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URI | — |
| `PORT` | Server port number | `3000` |
| `NODE_ENV` | Environment mode | `development` |

---

## 🗄 Database Setup

```bash
# Generate Prisma client from schema
npm run db:generate

# Run database migrations (creates tables)
npm run db:migrate

# Seed the database with sample data
# → 4 categories + 10 vehicles with realistic data
npm run db:seed
```

**Seed Data Contents:**
- **Categories:** Sedan, SUV, Hatchback, Luxury
- **Vehicles:** 10 vehicles across different brands (Toyota, BMW, Mercedes, etc.) with realistic pricing, specs, and image URLs
- **Master Admin:** A default master admin account is created for initial access

> **Tip:** Use `npm run db:studio` to open Prisma Studio — a visual database browser at `http://localhost:5555`

---

## ▶️ Running the Application

```bash
# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start
```

Once running, access:

| Resource | URL |
|----------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 📚 API Documentation (Swagger) | http://localhost:3000/api-docs |
| ❤️ Health Check | http://localhost:3000/api/health |

---

## 🔌 API Reference

All API endpoints return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Please enter a valid email address" }
    ]
  }
}
```

---

### 👤 Users `/api/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/users/register` | Register a new user account | Public |
| `POST` | `/api/users/login` | Login with email & password | Public |
| `GET` | `/api/users/profile` | Get current user profile | User |
| `POST` | `/api/users/balance` | Add balance to account | User |
| `GET` | `/api/users` | List all users | Admin |
| `POST` | `/api/users/create-admin` | Create an admin account | Master Admin |

---

### 📂 Categories `/api/categories`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/categories` | List all categories with vehicle count | Public |
| `GET` | `/api/categories/:id` | Get category by ID | Public |
| `POST` | `/api/categories` | Create a new category | Public |
| `PUT` | `/api/categories/:id` | Update category name | Public |
| `DELETE` | `/api/categories/:id` | Delete category (fails if has vehicles) | Public |

---

### 🚗 Vehicles `/api/vehicles`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/vehicles` | List vehicles with filter/sort/search | Public |
| `GET` | `/api/vehicles/:id` | Get vehicle details with reservations | Public |
| `POST` | `/api/vehicles` | Create a new vehicle | Public |
| `PUT` | `/api/vehicles/:id` | Update vehicle information | Public |
| `DELETE` | `/api/vehicles/:id` | Delete vehicle (fails if has active reservations) | Public |

**Query Parameters for `GET /api/vehicles`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `brand` | string | Filter by brand (partial match) |
| `categoryId` | integer | Filter by category ID |
| `fuelType` | string | `Gasoline`, `Diesel`, `Electric`, `Hybrid` |
| `transmission` | string | `Automatic`, `Manual` |
| `available` | boolean | Filter by availability |
| `search` | string | Search in brand and model fields |
| `sort` | string | Sort field: `pricePerDay`, `year`, `mileage`, `createdAt` |
| `order` | string | Sort order: `asc`, `desc` |

---

### 📋 Reservations `/api/reservations`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/reservations` | List all reservations | Public |
| `GET` | `/api/reservations/:id` | Get reservation details | Public |
| `POST` | `/api/reservations` | Create a reservation (auto-pricing) | User |
| `PATCH` | `/api/reservations/:id/status` | Update status (approve/cancel) | Public |
| `DELETE` | `/api/reservations/:id` | Delete a reservation | Public |

---

## 📖 Swagger Documentation

Interactive API documentation is available at **`/api-docs`** when the server is running.

The Swagger UI allows you to:
- 📋 Browse all available endpoints grouped by resource (Users, Categories, Vehicles, Reservations)
- 📝 View request/response schemas with examples
- 🧪 Test endpoints interactively by sending requests directly from the browser
- 🔍 See all available query parameters, request bodies, and response codes

**Implementation:** Swagger docs are generated from JSDoc comments in route files using `swagger-jsdoc` and served via `swagger-ui-express` with OpenAPI 3.0 specification.

---

## ✅ Validation

The system implements **dual-layer validation** — all inputs are validated on both the frontend and backend.

### Backend Validation (Joi)

Every API endpoint that accepts input uses Joi schema validation via middleware:

| Entity | Schemas |
|--------|---------|
| **User** | `registerSchema`, `loginSchema`, `addBalanceSchema`, `createAdminSchema` |
| **Category** | `createCategorySchema`, `updateCategorySchema` |
| **Vehicle** | `createVehicleSchema`, `updateVehicleSchema` |
| **Reservation** | `createReservationSchema`, `updateStatusSchema` |

**Validation includes:** required fields, data types, string lengths, email format, phone format, enum values, date ranges, numeric ranges, and custom error messages.

### Frontend Validation (JavaScript)

Client-side validation runs before API calls to provide instant feedback:

- **Login:** Email format validation, empty field checks
- **Register:** Name length, email format, phone format, password minimum length
- **Reservation:** Date range validation, end date must be after start date
- **Admin Forms:** Required fields, numeric value checks

---

## 🧪 Testing

Unit tests cover all **business logic** in the service layer using Jest with mocked repositories.

```bash
# Run all tests with coverage report
npm test

# Run tests in watch mode (development)
npm run test:watch
```

### Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `helpers.test.js` | Day calculation, price calculation, response formatters | Utility functions |
| `categoryService.test.js` | CRUD operations, delete protection | Category business logic |
| `vehicleService.test.js` | CRUD operations, category validation, reservation protection | Vehicle business logic |
| `reservationService.test.js` | Conflict detection, auto-pricing, availability checks | Reservation business logic |
| `userService.test.js` | Register, login, profile, balance, admin creation | User/auth business logic |

### Test Results

```
Test Suites: 5 passed, 5 total
Tests:       56 passed, 56 total

Service Layer Coverage:
  categoryService.js    — 100%
  userService.js        — 100%
  vehicleService.js     — 100%
  reservationService.js — 86%
  helpers.js            — 100%
```

### Testing Strategy

- **What is tested:** Business logic in service layer (the instructor's requirement)
- **What is NOT tested:** Routes and HTTP layer (not required per project spec)
- **Mocking:** Repository layer is mocked using `jest.mock()` to isolate business logic
- **Pattern:** Each test file mirrors a service file, testing success cases and error scenarios

---

## 🔄 CI/CD

The project includes a **GitHub Actions** pipeline that automatically runs on every push and pull request to the `main` branch.

**Pipeline steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run all unit tests with coverage

This provides continuous integration and ensures that no breaking changes are merged.

---

## 📊 Database Schema

```
User 1 ──→ N Reservation N ←── 1 Vehicle N ←── 1 Category
```

### Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────────┐       ┌──────────────┐
│   Category   │       │     Vehicle       │       │    Reservation       │       │     User     │
├──────────────┤       ├──────────────────┤       ├──────────────────────┤       ├──────────────┤
│ id       PK  │◄──┐   │ id           PK  │◄──┐   │ id             PK   │   ┌──►│ id       PK  │
│ name  UNIQUE │    └──│ categoryId   FK  │    └──│ vehicleId      FK   │   │   │ name         │
│ createdAt    │       │ brand            │       │ userId         FK   │───┘   │ email UNIQUE │
└──────────────┘       │ model            │       │ customerName        │       │ phone        │
                       │ year             │       │ customerPhone       │       │ password     │
                       │ pricePerDay      │       │ startDate           │       │ balance      │
                       │ fuelType    ENUM │       │ endDate             │       │ role         │
                       │ transmission ENUM│       │ totalPrice          │       │ createdAt    │
                       │ mileage          │       │ status        ENUM  │       └──────────────┘
                       │ imageUrl         │       │ createdAt           │
                       │ available        │       │ updatedAt           │
                       │ createdAt        │       └──────────────────────┘
                       │ updatedAt        │
                       └──────────────────┘
```

### Enum Types

| Enum | Values |
|------|--------|
| `FuelType` | Gasoline, Diesel, Electric, Hybrid |
| `Transmission` | Automatic, Manual |
| `ReservationStatus` | pending, approved, cancelled |
| `User Role` | user, admin, master_admin |

---

## 🎯 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Layered Architecture** | Separates business logic from routes, enabling unit testing as required by the project spec |
| **Repository Pattern** | Abstracts database queries, making services testable with mocks |
| **Hash-based SPA Router** | Simple client-side routing without frameworks, fulfilling the vanilla JS requirement |
| **Joi Validation** | Declarative schema validation with detailed error messages for both create and update operations |
| **Prisma ORM** | Type-safe database access with built-in migration support |
| **X-User-Id Header Auth** | Simplified authentication suitable for the project scope without JWT complexity |
| **Virtual Balance System** | Adds meaningful business logic beyond basic CRUD (pricing, deduction, refund) |
| **Centralized Error Handler** | Catches Prisma errors, Joi errors, and custom errors in one place |

---

## 📜 License

ISC
