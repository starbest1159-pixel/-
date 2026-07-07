# TH77 Prime: Lottery Management Platform

**Designed & Developed by PSAI Studio**
**Version:** 1.0.0
**Status:** 🚀 Production Ready

---

## 📋 Overview

TH77 Prime is a **comprehensive lottery management platform** designed for agents, masters, and admins to manage lottery operations, bets, payouts, and financial reporting in a **secure, scalable, and automated** manner.

### Key Features
- ✅ **4-Level User Hierarchy**: Admin → Master → Agent → Member
- ✅ **Multi-Lottery Support**: Thai, Lao, Hanoi, Stock lotteries
- ✅ **Real-Time Credit Management**: Auto deduction on bet placement
- ✅ **Link-Based Betting**: Unique tokens for customer self-service
- ✅ **Risk Management**: Restricted numbers, payout controls
- ✅ **Automated Settlement**: Prize calculation & payouts
- ✅ **Comprehensive Reporting**: Real-time dashboards & financial summaries
- ✅ **Multi-Channel Notifications**: LINE, SMS, Email, In-App

---

## 🏗️ Project Structure

```
th77-prime/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── utils/             # Helper functions
│   │   └── app.ts             # Express app setup
│   ├── migrations/            # Database migrations
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── docker-compose.yml
├── frontend/                   # React/Next.js frontend
│   ├── src/
│   │   ├── pages/             # Next.js pages
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── store/             # Zustand state management
│   │   ├── styles/            # Tailwind CSS
│   │   └── types/             # TypeScript types
│   ├── .env.example
│   ├── package.json
���   └── next.config.js
├── mobile/                     # Flutter mobile app
│   ├── lib/
│   │   ├── screens/           # App screens
│   │   ├── widgets/           # Reusable widgets
│   │   ├── services/          # API client
│   │   └── models/            # Data models
│   └── pubspec.yaml
├── docs/                       # Documentation
│   ├── API_SPECIFICATION.md   # Complete API docs
│   ├── DATABASE_SCHEMA.md     # DB schema & relationships
│   └── DEPLOYMENT.md          # Deployment guide
├── docker-compose.yml         # Local dev environment
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React (TypeScript), Next.js, Tailwind CSS |
| **Backend** | Node.js, Express, NestJS |
| **Database** | PostgreSQL (primary), Redis (cache) |
| **Message Queue** | RabbitMQ / Kafka |
| **Storage** | MinIO (object storage) |
| **API Gateway** | Kong / Traefik |
| **Monitoring** | Prometheus, Grafana, Loki |
| **CI/CD** | GitHub Actions, Docker, Kubernetes |
| **Security** | JWT, RBAC, Cloudflare WAF, TLS |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for backend)
- Docker & Docker Compose
- PostgreSQL 12+ (or use Docker)
- Redis (or use Docker)

### 1. Clone Repository
```bash
git clone https://github.com/starbest1159-pixel/-.git
cd -
git checkout setup/initial-project-structure
```

### 2. Setup Environment
```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 3. Start Database & Services
```bash
# From root directory
docker-compose up -d
```

### 4. Run Database Migrations
```bash
cd backend
npm run migrate
```

### 5. Start Backend & Frontend
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 6. Access Application
- **Admin Panel**: http://localhost:3001
- **Agent Panel**: http://localhost:3002
- **API Docs**: http://localhost:3000/api/docs

---

## 📚 Documentation

- [API Specification](./docs/API_SPECIFICATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Roles & Permissions](./docs/ROLES_AND_PERMISSIONS.md)

---

## 🔐 Security

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Rate limiting on all APIs
- Input validation & sanitization
- SQL injection prevention (Sequelize ORM)
- CORS configuration
- Environment-based secrets management

---

## 📊 Database

### Tables Overview
- `users` - User accounts with roles & credit
- `bets` - Lottery bet records
- `rounds` - Lottery draw rounds
- `transactions` - Financial transaction logs
- `credit_transactions` - Credit audit trail
- `settlements` - Prize settlements
- `commissions` - Agent commission calculations
- `restricted_numbers` - Risk management
- `betting_links` - Token-based betting links
- `audit_logs` - System audit trail

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

---

## 📈 Monitoring

Access monitoring dashboards:
- **Grafana**: http://localhost:3100
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## 📝 License

Proprietary - PSAI Studio

---

## 📞 Support

For issues or questions:
- Email: support@psaistudio.com
- GitHub Issues: [Create an issue](https://github.com/starbest1159-pixel/-/issues)

---

**Last Updated:** July 7, 2026
