# 🚗 CarGallery — Implementation Plan

> Rent-a-Car System | System Analysis & Design Course Final Project
> Timeline: May 7 – May 20, 2026 (14 days)

---

## 📁 Final Folder Structure

```
cargallery_commit/
├── .gitignore
├── .env.example
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── utils/
│       │   └── helpers.js
│       ├── middlewares/
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── validations/
│       │   ├── categoryValidation.js
│       │   ├── vehicleValidation.js
│       │   └── reservationValidation.js
│       ├── repositories/
│       │   ├── categoryRepository.js
│       │   ├── vehicleRepository.js
│       │   └── reservationRepository.js
│       ├── services/
│       │   ├── categoryService.js
│       │   ├── vehicleService.js
│       │   └── reservationService.js
│       ├── controllers/
│       │   ├── categoryController.js
│       │   ├── vehicleController.js
│       │   └── reservationController.js
│       ├── routes/
│       │   ├── categoryRoutes.js
│       │   ├── vehicleRoutes.js
│       │   └── reservationRoutes.js
│       ├── swagger/
│       │   └── swagger.js
│       └── tests/
│           ├── categoryService.test.js
│           ├── vehicleService.test.js
│           ├── reservationService.test.js
│           └── helpers.test.js
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── app.js
    │   ├── router.js
    │   ├── api.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── VehicleCard.js
    │   │   ├── VehicleFilter.js
    │   │   ├── Modal.js
    │   │   └── Toast.js
    │   └── pages/
    │       ├── HomePage.js
    │       ├── VehicleDetailPage.js
    │       ├── ReservationPage.js
    │       └── AdminPage.js
    └── assets/
```

---

## 🗄️ Database Schema (Prisma)

### Category
| Field     | Type     | Notes          |
|-----------|----------|----------------|
| id        | Int      | PK, auto-inc   |
| name      | String   | unique          |
| createdAt | DateTime | default: now()  |

### Vehicle
| Field        | Type         | Notes                    |
|--------------|--------------|--------------------------|
| id           | Int          | PK, auto-inc             |
| brand        | String       |                          |
| model        | String       |                          |
| year         | Int          |                          |
| pricePerDay  | Decimal(10,2)|                          |
| fuelType     | Enum         | Gasoline/Diesel/Electric/Hybrid |
| transmission | Enum         | Automatic/Manual         |
| mileage      | Int          |                          |
| imageUrl     | String?      | nullable                 |
| available    | Boolean      | default: true            |
| categoryId   | Int          | FK → Category            |
| createdAt    | DateTime     | default: now()           |
| updatedAt    | DateTime     | @updatedAt               |

### Reservation
| Field         | Type         | Notes                    |
|---------------|--------------|--------------------------|
| id            | Int          | PK, auto-inc             |
| vehicleId     | Int          | FK → Vehicle             |
| customerName  | String       |                          |
| customerPhone | String       |                          |
| startDate     | DateTime     | @db.Date                 |
| endDate       | DateTime     | @db.Date                 |
| totalPrice    | Decimal(10,2)| auto-calculated          |
| status        | Enum         | pending/approved/cancelled |
| createdAt     | DateTime     | default: now()           |
| updatedAt     | DateTime     | @updatedAt               |

### Relationships
- Category 1 → N Vehicle
- Vehicle 1 → N Reservation

---

## 🔌 REST API Endpoints

### Categories `/api/categories`
| Method | Path               | Description         |
|--------|--------------------|---------------------|
| GET    | /api/categories    | List all categories |
| GET    | /api/categories/:id| Get category by ID  |
| POST   | /api/categories    | Create category     |
| PUT    | /api/categories/:id| Update category     |
| DELETE | /api/categories/:id| Delete category     |

### Vehicles `/api/vehicles`
| Method | Path              | Description                     |
|--------|-------------------|---------------------------------|
| GET    | /api/vehicles     | List vehicles (filter/sort/search) |
| GET    | /api/vehicles/:id | Get vehicle with reservations   |
| POST   | /api/vehicles     | Create vehicle                  |
| PUT    | /api/vehicles/:id | Update vehicle                  |
| DELETE | /api/vehicles/:id | Delete vehicle                  |

**Query params:** `?brand=&categoryId=&fuelType=&transmission=&available=&sort=pricePerDay&order=asc&search=`

### Reservations `/api/reservations`
| Method | Path                            | Description          |
|--------|---------------------------------|----------------------|
| GET    | /api/reservations               | List all reservations|
| GET    | /api/reservations/:id           | Get reservation      |
| POST   | /api/reservations               | Create reservation   |
| PATCH  | /api/reservations/:id/status    | Update status        |
| DELETE | /api/reservations/:id           | Cancel/delete        |

---

## ✅ Validation Rules

### Category
- `name`: required, string, 2-50 chars, unique

### Vehicle
- `brand`: required, string, 2-50 chars
- `model`: required, string, 1-50 chars
- `year`: required, integer, 1990–current+1
- `pricePerDay`: required, number, > 0
- `fuelType`: required, one of [Gasoline, Diesel, Electric, Hybrid]
- `transmission`: required, one of [Automatic, Manual]
- `mileage`: required, integer, >= 0
- `imageUrl`: optional, valid URL
- `available`: optional, boolean
- `categoryId`: required, integer, must exist

### Reservation
- `vehicleId`: required, integer, must exist
- `customerName`: required, string, 2-100 chars
- `customerPhone`: required, string, valid phone format
- `startDate`: required, date, >= today
- `endDate`: required, date, > startDate

---

## 🧠 Business Logic (Service Layer)

1. **Reservation overlap check**: Same vehicle cannot be reserved for overlapping dates
2. **Total price auto-calculation**: `totalPrice = dayCount × pricePerDay`
3. **Availability check**: Cannot reserve unavailable vehicle
4. **Category delete protection**: Cannot delete category with vehicles
5. **Vehicle delete protection**: Cannot delete vehicle with active reservations

---

## 🖥️ Frontend Pages

| Page            | Route              | Features                              |
|-----------------|--------------------|---------------------------------------|
| Home            | `/`                | Vehicle listing, filters, search, sort|
| Vehicle Detail  | `/vehicles/:id`    | Full details, reservation form link   |
| Reservation     | `/reservation/:id` | Booking form with validation          |
| Admin           | `/admin`           | CRUD tables for all entities          |

---

## 📅 Day-by-Day Plan

### Day 1 — May 7: Project Initialization
**Files:**
- `.gitignore`, `.env.example`, `README.md` (initial)
- `backend/package.json`
- `backend/prisma/schema.prisma`

**Commits:**
1. `chore: initialize project structure and dependencies`
2. `feat: design database schema with Prisma models`

---

### Day 2 — May 8: Backend Core Infrastructure
**Files:**
- `backend/src/config/database.js`
- `backend/src/utils/helpers.js`
- `backend/src/middlewares/errorHandler.js`
- `backend/src/middlewares/validate.js`
- `backend/src/swagger/swagger.js`
- `backend/src/app.js`
- `backend/server.js`

**Commits:**
1. `feat: add database configuration and utility helpers`
2. `feat: setup Express server with error handling and Swagger`

---

### Day 3 — May 9: Category CRUD
**Files:**
- `backend/src/repositories/categoryRepository.js`
- `backend/src/services/categoryService.js`
- `backend/src/validations/categoryValidation.js`
- `backend/src/controllers/categoryController.js`
- `backend/src/routes/categoryRoutes.js`

**Commit:**
1. `feat: implement Category CRUD with layered architecture`

---

### Day 4 — May 10: Vehicle CRUD
**Files:**
- `backend/src/repositories/vehicleRepository.js`
- `backend/src/services/vehicleService.js`
- `backend/src/validations/vehicleValidation.js`
- `backend/src/controllers/vehicleController.js`
- `backend/src/routes/vehicleRoutes.js`

**Commit:**
1. `feat: implement Vehicle CRUD with search, filter, and sort`

---

### Day 5 — May 11: Reservation System
**Files:**
- `backend/src/repositories/reservationRepository.js`
- `backend/src/services/reservationService.js`
- `backend/src/validations/reservationValidation.js`
- `backend/src/controllers/reservationController.js`
- `backend/src/routes/reservationRoutes.js`

**Commit:**
1. `feat: implement Reservation system with conflict detection and auto-pricing`

---

### Day 6 — May 12: Seed Data & Swagger Docs
**Files:**
- `backend/prisma/seed.js`
- Swagger JSDoc annotations in all route files (enhance)

**Commits:**
1. `feat: add database seed with sample categories and vehicles`
2. `docs: add Swagger API documentation for all endpoints`

---

### Day 7 — May 13: Frontend Foundation
**Files:**
- `frontend/index.html`
- `frontend/css/style.css`

**Commit:**
1. `feat: create frontend HTML structure and CSS design system`

---

### Day 8 — May 14: Frontend SPA Core
**Files:**
- `frontend/js/app.js`
- `frontend/js/router.js`
- `frontend/js/api.js`

**Commit:**
1. `feat: implement SPA router and API client module`

---

### Day 9 — May 15: Frontend Components
**Files:**
- `frontend/js/components/Navbar.js`
- `frontend/js/components/VehicleCard.js`
- `frontend/js/components/VehicleFilter.js`
- `frontend/js/components/Modal.js`
- `frontend/js/components/Toast.js`

**Commit:**
1. `feat: add reusable UI components`

---

### Day 10 — May 16: Home & Vehicle Detail Pages
**Files:**
- `frontend/js/pages/HomePage.js`
- `frontend/js/pages/VehicleDetailPage.js`

**Commit:**
1. `feat: implement vehicle listing and detail pages`

---

### Day 11 — May 17: Reservation & Admin Pages
**Files:**
- `frontend/js/pages/ReservationPage.js`
- `frontend/js/pages/AdminPage.js`

**Commit:**
1. `feat: implement reservation booking and admin management pages`

---

### Day 12 — May 18: Frontend Validation & Polish
**Focus:** Client-side form validation, UI polish, responsive fixes

**Commit:**
1. `feat: add client-side validation and UI improvements`

---

### Day 13 — May 19: Unit Tests
**Files:**
- `backend/src/tests/helpers.test.js`
- `backend/src/tests/categoryService.test.js`
- `backend/src/tests/vehicleService.test.js`
- `backend/src/tests/reservationService.test.js`

**Commits:**
1. `test: add unit tests for utility helpers`
2. `test: add unit tests for service layer`

---

### Day 14 — May 20: Final Documentation & Polish
**Focus:** Complete README, final cleanup

**Commits:**
1. `docs: finalize README with full project documentation`
2. `chore: final code cleanup and polish`

---

## 🔧 Commit Strategy

All commits use **Conventional Commits** format:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `test:` — tests
- `chore:` — maintenance

Commit dates will be set using:
```bash
GIT_AUTHOR_DATE="2026-05-07T10:00:00+03:00" GIT_COMMITTER_DATE="2026-05-07T10:00:00+03:00" git commit -m "message"
```

---

## 🏗️ Architecture Flow

```
Client (Browser)
    ↓ fetch()
Route (HTTP + Swagger + Validation middleware)
    ↓
Controller (req/res handling)
    ↓
Service (business logic)
    ↓
Repository (Prisma queries)
    ↓
PostgreSQL Database
```

> [!IMPORTANT]
> Each day's work will be committed with the correct date. No code will be written ahead of schedule in the commit history.
