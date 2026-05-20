# 🚗 CarGallery — Car Rental System

A full-stack web application for browsing, filtering, and reserving rental vehicles.  
Built as a **System Analysis & Design** course project.

---

## 📋 Features

### Customer Features
- Browse vehicle fleet with image cards
- Filter by **category, fuel type, transmission**
- Search by **brand or model name**
- Sort by **price, year, or mileage**
- View detailed vehicle information
- Make reservations with **real-time price preview**
- Client-side form validation

### Admin Features
- **Vehicle CRUD** — Create, edit, delete vehicles via modal forms
- **Category CRUD** — Manage vehicle categories with delete protection
- **Reservation Management** — View all reservations, approve, cancel, or delete
- Tabbed admin panel interface

### System Features
- **Auto-pricing** — Total price calculated automatically from daily rate × duration
- **Conflict detection** — Prevents double-booking with date overlap checks
- **Delete protection** — Cannot delete categories with vehicles or vehicles with active reservations
- **Backend + Frontend validation** — Joi schema validation on server, JS validation on client
- **RESTful API** — JSON request/response with proper HTTP status codes
- **Swagger API Documentation** — Interactive API docs at `/api-docs`

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML, CSS, Vanilla JavaScript (SPA) |
| Backend    | Node.js, Express.js                 |
| Database   | PostgreSQL                          |
| ORM        | Prisma                              |
| Validation | Joi                                 |
| Testing    | Jest                                |
| API Docs   | Swagger (OpenAPI 3.0)               |

---

## 🏗 Architecture

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

| Layer        | Responsibility                              |
|-------------|---------------------------------------------|
| **Route**       | HTTP endpoint definitions + Joi validation middleware |
| **Controller**  | Request/Response handling (no business logic)         |
| **Service**     | Business logic (validation rules, conflict checks)   |
| **Repository**  | Database queries via Prisma ORM                      |

---

## 📁 Project Structure

```
cargallery_commit/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   └── seed.js                # Sample data seeder
│   ├── src/
│   │   ├── config/database.js     # Prisma client singleton
│   │   ├── controllers/           # Request handlers
│   │   ├── middlewares/           # Error handler, validation
│   │   ├── repositories/         # Database access layer
│   │   ├── routes/               # API routes + Swagger docs
│   │   ├── services/             # Business logic
│   │   ├── swagger/              # Swagger configuration
│   │   ├── utils/helpers.js      # Utility functions
│   │   ├── validations/          # Joi schemas
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── tests/                    # Jest unit tests
│   └── package.json
├── frontend/
│   ├── css/style.css             # Design system
│   ├── js/
│   │   ├── api.js                # API client module
│   │   ├── router.js             # Hash-based SPA router
│   │   ├── app.js                # App entry point
│   │   ├── components/           # Reusable UI components
│   │   └── pages/                # Page modules
│   └── index.html                # SPA shell
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v14+

### Installation

```bash
# Clone the repository
git clone https://github.com/dormhi/CargallerySAD.git
cd CargallerySAD

# Install dependencies
cd backend
npm install
```

### Environment Setup

```bash
# Copy environment template (from project root)
cp ../.env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cargallery?schema=public"
PORT=3000
NODE_ENV=development
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data (4 categories + 10 vehicles)
npm run db:seed
```

### Running the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

- 🌐 **Frontend**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api-docs
- ❤️ **Health Check**: http://localhost:3000/api/health

---

## 🔌 API Endpoints

### Categories `/api/categories`
| Method | Path                 | Description         |
|--------|----------------------|---------------------|
| GET    | `/api/categories`    | List all categories |
| GET    | `/api/categories/:id`| Get category by ID  |
| POST   | `/api/categories`    | Create category     |
| PUT    | `/api/categories/:id`| Update category     |
| DELETE | `/api/categories/:id`| Delete category     |

### Vehicles `/api/vehicles`
| Method | Path               | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/api/vehicles`    | List vehicles (filter/sort/search) |
| GET    | `/api/vehicles/:id`| Get vehicle with reservations      |
| POST   | `/api/vehicles`    | Create vehicle                     |
| PUT    | `/api/vehicles/:id`| Update vehicle                     |
| DELETE | `/api/vehicles/:id`| Delete vehicle                     |

**Query Parameters:** `?brand=&categoryId=&fuelType=&transmission=&available=&sort=pricePerDay&order=asc&search=`

### Reservations `/api/reservations`
| Method | Path                              | Description        |
|--------|-----------------------------------|--------------------|
| GET    | `/api/reservations`               | List reservations  |
| GET    | `/api/reservations/:id`           | Get reservation    |
| POST   | `/api/reservations`               | Create reservation |
| PATCH  | `/api/reservations/:id/status`    | Update status      |
| DELETE | `/api/reservations/:id`           | Delete reservation |

---

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage:**
- `helpers.test.js` — Utility function tests (calculateDayCount, calculateTotalPrice, response formatters)
- `categoryService.test.js` — Category CRUD + delete protection
- `vehicleService.test.js` — Vehicle CRUD + category validation + reservation protection
- `reservationService.test.js` — Conflict detection + auto-pricing + availability checks

---

## 📊 Database Schema

```
Category 1 ──→ N Vehicle 1 ──→ N Reservation
```

| Model       | Key Fields                                                    |
|-------------|---------------------------------------------------------------|
| Category    | id, name (unique)                                             |
| Vehicle     | id, brand, model, year, pricePerDay, fuelType, transmission, mileage, imageUrl, available, categoryId |
| Reservation | id, vehicleId, customerName, customerPhone, startDate, endDate, totalPrice, status (pending/approved/cancelled) |

---

## 📜 License

ISC
