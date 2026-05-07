# 🚗 CarGallery — Car Rental System

A full-stack web application for browsing, filtering, and reserving rental vehicles. Built as a System Analysis & Design course project.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML, CSS, Vanilla JavaScript (SPA) |
| Backend  | Node.js, Express.js               |
| Database | PostgreSQL                        |
| ORM      | Prisma                            |
| Testing  | Jest                              |
| API Docs | Swagger                           |

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+

### Installation

```bash
cd backend
npm install
```

Copy the environment file and configure your database:
```bash
cp ../.env.example .env
```

Run database migrations and seed:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Running the Application

```bash
npm run dev
```

- 🌐 Frontend: http://localhost:3000
- 📚 API Docs: http://localhost:3000/api-docs

## Architecture

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Route**: HTTP definitions + validation middleware
- **Controller**: Request/Response handling
- **Service**: Business logic
- **Repository**: Database queries

## License

ISC
