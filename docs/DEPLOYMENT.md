# TH77 Prime - Deployment Guide

## Overview

This guide covers deploying TH77 Prime using Docker Compose for local/production environments.

---

## Prerequisites

- Docker & Docker Compose (v2+)
- Node.js 16+ (for manual builds)
- PostgreSQL 12+ (if not using Docker)
- Redis 7+ (if not using Docker)

---

## Docker Compose Setup

### 1. Clone Repository

```bash
git clone https://github.com/starbest1159-pixel/-.git
cd th77-prime
```

### 2. Configure Environment Variables

Copy `.env.example` files and set values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Key environment variables for the backend:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` or `postgres` (Docker) |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `th77_prime` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | JWT signing secret | (use a strong random string) |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3001` |
| `PORT` | Backend API port | `3000` |

Key environment variables for the frontend:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:3000/api/v1` |

### 3. Start All Services

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, RabbitMQ, MinIO, Elasticsearch, Prometheus, Grafana, and Loki.

### 4. Run Database Migrations

The `schema.sql` is automatically applied on first PostgreSQL startup via `docker-entrypoint-initdb.d`. For manual migration:

```bash
cd backend
npm install
npm run migrate
```

### 5. Build & Run Backend

```bash
cd backend
npm install
npm run dev   # Development with hot reload
# or
npm run build && npm start   # Production
```

### 6. Build & Run Frontend

```bash
cd frontend
npm install
npm run dev   # Development
# or
npm run build && npm start   # Production
```

---

## Access Points

| Service | URL |
|---------|-----|
| Frontend (Admin) | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| API Status | http://localhost:3000/api/v1/status |
| Grafana | http://localhost:3100 |
| Prometheus | http://localhost:9090 |
| RabbitMQ Management | http://localhost:15672 |
| MinIO Console | http://localhost:9001 |

---

## Production Notes

- Set strong passwords for PostgreSQL, Redis, RabbitMQ, and MinIO in production.
- Change `JWT_SECRET` to a cryptographically random value.
- Configure `CORS_ORIGIN` to restrict to your actual frontend domain.
- Enable TLS via a reverse proxy (e.g., Nginx, Traefik, Kong).
- Use managed services for PostgreSQL and Redis where available.
- Set `NODE_ENV=production` for both backend and frontend.

---

## Troubleshooting

- **Database connection failed**: Ensure PostgreSQL is healthy (`docker-compose ps`). Check `DB_HOST` is set to `postgres` inside Docker network.
- **Frontend can't reach API**: Verify `NEXT_PUBLIC_API_BASE_URL` matches the backend address.
- **Port conflicts**: Adjust ports in `docker-compose.yml` if local ports are already in use.
