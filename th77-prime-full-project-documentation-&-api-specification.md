# **TH77 Prime: Lottery Management Platform – Full Documentation & API Specification**
**Designed & Developed by PSAI Studio**
**Version:** 1.0.0
**Last Updated:** July 7, 2026

---

## **Table of Contents**
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Database Schema](#4-database-schema)
5. [API Documentation](#5-api-documentation)
6. [Frontend Structure](#6-frontend-structure)
7. [Backend Services](#7-backend-services)
8. [Risk Management System](#8-risk-management-system)
9. [Link-Based Betting System](#9-link-based-betting-system)
10. [Financial Processing & Reporting](#10-financial-processing--reporting)
11. [Deployment & CI/CD](#11-deployment--cicd)
12. [Security & Compliance](#12-security--compliance)
13. [Error Codes & Troubleshooting](#13-error-codes--troubleshooting)
14. [Appendices](#14-appendices)

---

## **1. Project Overview**

### **1.1 Introduction**
**TH77 Prime** is a **comprehensive lottery management platform** designed for **agents, masters, and admins** to manage lottery operations, bets, payouts, and financial reporting in a **secure, scalable, and automated** manner. The system supports **multi-lottery types**, **hierarchical user management**, **risk control**, and **real-time financial processing**.

### **1.2 Key Features**
| Feature | Description |
|---------|-------------|
| **Multi-Level User Management** | 4-tier hierarchy (Admin, Master, Agent, Member) with role-based access. |
| **Lottery & Round Management** | Supports multiple lottery types (Thai, Lao, Hanoi, Stock) with customizable schedules. |
| **Flexible Betting System** | Quick-key and manual selection modes with real-time validation. |
| **Risk Management** | Restricted numbers, payout rate adjustments, and risk-sharing with higher-level agents. |
| **Link-Based Betting** | Generate unique, time-limited betting links for customers. |
| **Automated Financial Processing** | Prize calculation, payout confirmation, and credit management. |
| **Detailed Reporting** | Real-time dashboards, bet history, and financial summaries. |
| **OCR Integration** | Supports document scanning for payment proof uploads. |

### **1.3 Technology Stack**
| Layer | Technology |
|-------|------------|
| **Frontend** | React (TypeScript), Next.js, Flutter (Mobile) |
| **Backend** | Node.js (Express/NestJS), Go (for high-throughput services) |
| **Database** | PostgreSQL (Primary), Redis (Cache), MongoDB (Analytics) |
| **Message Queue** | RabbitMQ / Kafka |
| **Search** | Elasticsearch |
| **Storage** | MinIO (Object Storage) |
| **API Gateway** | Kong / Traefik |
| **Monitoring** | Prometheus, Grafana, Loki |
| **CI/CD** | GitHub Actions, Docker, Kubernetes |
| **Security** | JWT, RBAC, Cloudflare WAF, TLS |

### **1.4 System Workflow**
```mermaid
graph TD
    A[Admin] -->|Manages| B[Lottery Types & Rounds]
    A -->|Configures| C[User Roles & Permissions]
    A -->|Sets| D[Restricted Numbers & Payout Rates]
    B -->|Automated Round Creation| E[New Rounds]
    E -->|Agent Places| F[Bets]
    F -->|Validated Against| D
    F -->|Stored in| G[Database]
    G -->|Processed by| H[Financial Service]
    H -->|Calculates| I[Prizes]
    I -->|Confirmed by| J[Master/Agent]
    J -->|Payout via| K[Wallet Service]
    K -->|Generates| L[Reports]
    L -->|Viewed by| M[All Users (Role-Based)]
```

---

## **2. System Architecture**

### **2.1 High-Level Architecture**
```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Client Layer                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌───────────┐ │
│  │   Web App   │    │  Agent App  │    │   Admin Panel   │    │  Mobile   │ │
│  │ (React/Next)│    │ (React/Next)│    │   (React/Next)   │    │ (Flutter) │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘    └───────────┘ │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                API Gateway (Kong/Traefik)                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ - Rate Limiting                                                          │  │
│  │ - JWT Validation                                                         │  │
│  │ - Request/Response Logging                                               │  │
│  │ - Load Balancing                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Microservices Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Auth       │  │  User       │  │  Lottery    │  │  Betting                 │  │
│  │  Service    │  │  Service    │  │  Service    │  │  Service                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Wallet     │  │  Payment    │  │  Settlement │  │  Commission              │  │
│  │  Service    │  │  Service    │  │  Service    │  │  Service                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────────────────┐  │
│  │  Reporting  │  │  Notification│  │  Audit / File / Notification / OCR      │  │
│  │  Service    │  │  Service    │  │  Service                                    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Infrastructure Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ PostgreSQL  │  │   Redis     │  │ RabbitMQ   │  │ Elasticsearch / MinIO    │  │
│  │ (Primary)   │  │ (Cluster)   │  │ (Cluster)  │  │ (Storage)                │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### **2.2 Service Breakdown**
| Service | Responsibility | Database | Dependencies |
|---------|----------------|----------|--------------|
| **Auth Service** | User authentication, JWT management | PostgreSQL | Redis (session) |
| **User Service** | User CRUD, role/permission management | PostgreSQL | Auth Service |
| **Lottery Service** | Lottery types, rounds, schedules | PostgreSQL | - |
| **Betting Service** | Bet placement, validation, duplication check | PostgreSQL | Lottery Service, Redis |
| **Wallet Service** | Credit management, deposits, withdrawals | PostgreSQL | User Service |
| **Payment Service** | Payment gateway integration, callbacks | PostgreSQL | Wallet Service |
| **Settlement Service** | Prize calculation, payout processing | PostgreSQL | Betting Service, Wallet Service |
| **Commission Service** | Agent hierarchy, commission calculation | PostgreSQL | User Service, Settlement Service |
| **Reporting Service** | Financial reports, bet history | PostgreSQL + MongoDB | All Services |
| **Notification Service** | SMS, Email, LINE notifications | - | RabbitMQ |
| **Audit Service** | Logging all financial operations | Elasticsearch | All Services |
| **File Service** | Document storage (payment proofs, OCR) | MinIO | - |

---

## **3. User Roles & Permissions**

### **3.1 Role Hierarchy**
```
Admin (Super User)
   │
   ├── Master (Manages Agents & Risk)
   │      │
   │      ├── Agent (Places Bets, Manages Members)
   │      │      │
   │      │      └── Member (Bets via Links)
   │
   └── Direct Agent (Optional)
```

### **3.2 Permission Matrix**
| Action | Admin | Master | Agent | Member |
|--------|-------|--------|-------|--------|
| **User Management** | ✅ Create/Edit/Delete All | ✅ Create/Edit Agents | ❌ | ❌ |
| **Credit Adjustment** | ✅ All Users | ✅ Agents & Below | ✅ Members Only | ❌ |
| **Discount Management** | ✅ All Users | ✅ Agents & Below | ✅ Members Only | ❌ |
| **Lottery/Round Management** | ✅ Full Access | ❌ | ❌ | ❌ |
| **Bet Placement** | ✅ All | ✅ All | ✅ Own Bets | ✅ Via Links |
| **Bet Validation** | ✅ All | ✅ All | ✅ Own Bets | ❌ |
| **Risk Management** | ✅ Full Access | ✅ Set Restricted Numbers | ❌ | ❌ |
| **Link Generation** | ✅ All | ✅ All | ✅ Own Links | ❌ |
| **Prize Calculation** | ✅ All | ✅ All | ❌ | ❌ |
| **Payout Confirmation** | ✅ All | ✅ All | ✅ Own Payouts | ❌ |
| **Financial Reports** | ✅ All | ✅ All | ✅ Own Reports | ✅ Own Bets |
| **Audit Logs** | ✅ All | ✅ All | ❌ | ❌ |

---

## **4. Database Schema**

### **4.1 PostgreSQL Tables**

#### **Core Tables**

```sql
-- Users & Roles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role_id INT REFERENCES roles(id),
    parent_id INT REFERENCES users(id), -- For hierarchy (Agent -> Master)
    credit DECIMAL(15,2) DEFAULT 0.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL, -- 'admin', 'master', 'agent', 'member'
    description TEXT
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id),
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- Lottery Types & Rounds
CREATE TABLE lottery_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'Thai Lottery', 'Lao Lottery'
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    lottery_type_id INT REFERENCES lottery_types(id),
    round_number VARCHAR(20) NOT NULL, -- e.g., '123456'
    draw_date TIMESTAMP NOT NULL,
    close_time TIMESTAMP NOT NULL, -- When betting closes
    open_time TIMESTAMP NOT NULL, -- When betting opens
    result_3d VARCHAR(3), -- 3-digit result
    result_2d VARCHAR(2), -- 2-digit result
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Betting System
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id), -- Who placed the bet (Agent/Member)
    round_id INT REFERENCES rounds(id),
    lottery_number VARCHAR(10) NOT NULL, -- e.g., '123', '456'
    bet_type VARCHAR(10) NOT NULL, -- '3d', '2d', 'top', 'bottom'
    amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL, -- amount * quantity
    quantity INT DEFAULT 1,
    discount_applied DECIMAL(5,2) DEFAULT 0.00,
    is_restricted BOOLEAN DEFAULT false,
    restricted_rate DECIMAL(5,2), -- If restricted, what's the payout rate?
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'won', 'paid'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Risk Management
CREATE TABLE restricted_numbers (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    number VARCHAR(10) NOT NULL,
    is_blocked BOOLEAN DEFAULT true, -- If true, cannot bet on this number
    payout_rate DECIMAL(5,2), -- If false, reduced payout rate
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Wallet & Financials
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'bet', 'prize', 'commission'
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id INT, -- e.g., bet_id for 'bet' type
    reference_type VARCHAR(20), -- 'bet', 'payout', etc.
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    proof_url VARCHAR(255), -- For deposits/withdrawals
    created_at TIMESTAMP DEFAULT NOW()
);

-- Link-Based Betting
CREATE TABLE betting_links (
    id SERIAL PRIMARY KEY,
    created_by INT REFERENCES users(id), -- Agent/Master who created the link
    customer_name VARCHAR(100),
    token VARCHAR(255) UNIQUE NOT NULL, -- Unique token for the link
    expiry_time TIMESTAMP NOT NULL,
    max_uses INT, -- NULL = unlimited
    current_uses INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE link_bets (
    id SERIAL PRIMARY KEY,
    link_id INT REFERENCES betting_links(id),
    bet_id INT REFERENCES bets(id),
    customer_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Settlements & Commissions
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    user_id INT REFERENCES users(id), -- Who is receiving the settlement
    total_bet_amount DECIMAL(15,2) NOT NULL,
    total_prize_amount DECIMAL(15,2) NOT NULL,
    net_profit DECIMAL(15,2) NOT NULL,
    commission_amount DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    settlement_id INT REFERENCES settlements(id),
    user_id INT REFERENCES users(id), -- Who receives the commission
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'create_bet', 'update_credit', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'bet', 'user', 'transaction'
    entity_id INT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **4.2 Indexes for Performance**
```sql
-- Users
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_parent ON users(parent_id);

-- Rounds
CREATE INDEX idx_rounds_lottery_type ON rounds(lottery_type_id);
CREATE INDEX idx_rounds_draw_date ON rounds(draw_date);
CREATE INDEX idx_rounds_status ON rounds(is_closed);

-- Bets
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_round ON bets(round_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_number_type ON bets(lottery_number, bet_type);

-- Transactions
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Restricted Numbers
CREATE INDEX idx_restricted_round_number ON restricted_numbers(round_id, number);

-- Betting Links
CREATE INDEX idx_betting_links_token ON betting_links(token);
CREATE INDEX idx_betting_links_expiry ON betting_links(expiry_time);
```

---

## **5. API Documentation**

### **5.1 Base URL & Authentication**
- **Base URL:** `https://api.th77prime.com/v1`
- **Authentication:** `Bearer <JWT_TOKEN>` (Header: `Authorization`)
- **Content-Type:** `application/json`

### **5.2 Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid lottery number format",
    "details": {
      "field": "lottery_number",
      "expected": "3 or 2 digits"
    }
  },
  "timestamp": "2026-07-07T10:00:00Z"
}
```

### **5.3 Endpoints**

#### **🔹 Authentication**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/login` | Login with username/password | Public |
| `POST` | `/auth/refresh` | Refresh JWT token | Public |
| `POST` | `/auth/logout` | Invalidate JWT token | Private |

**Request/Response Examples:**

**Login**
```bash
curl -X POST https://api.th77prime.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secure123"}'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "credit": 100000.00
    }
  }
}
```

---

**Refresh Token**
```bash
curl -X POST https://api.th77prime.com/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."}'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

#### **🔹 User Management**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/users` | List all users (paginated) | Admin |
| `GET` | `/users/{id}` | Get user details | Admin, Self |
| `POST` | `/users` | Create a new user | Admin, Master |
| `PUT` | `/users/{id}` | Update user details | Admin, Master, Self |
| `DELETE` | `/users/{id}` | Deactivate a user | Admin |
| `PUT` | `/users/{id}/credit` | Adjust user credit | Admin, Master |
| `PUT` | `/users/{id}/discount` | Adjust user discount | Admin, Master |

**Request/Response Examples:**

**Create User**
```bash
curl -X POST https://api.th77prime.com/v1/users \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "agent001",
    "password": "password123",
    "email": "agent001@th77prime.com",
    "phone": "+66812345678",
    "role": "agent",
    "parent_id": 2,
    "credit": 10000.00,
    "discount_percentage": 5.00
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "username": "agent001",
    "role": "agent",
    "credit": 10000.00,
    "discount_percentage": 5.00,
    "parent_id": 2,
    "created_at": "2026-07-07T10:00:00Z"
  }
}
```

---

**Adjust Credit**
```bash
curl -X PUT https://api.th77prime.com/v1/users/3/credit \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000.00,
    "action": "add",
    "reason": "Initial credit allocation"
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 3,
    "old_credit": 10000.00,
    "new_credit": 15000.00,
    "transaction_id": 1001
  }
}
```

---

#### **🔹 Lottery & Round Management**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/lotteries` | List all lottery types | Public |
| `POST` | `/lotteries` | Create a new lottery type | Admin |
| `PUT` | `/lotteries/{id}` | Update lottery type | Admin |
| `DELETE` | `/lotteries/{id}` | Delete lottery type | Admin |
| `GET` | `/rounds` | List all rounds (filterable) | Public |
| `POST` | `/rounds` | Create a new round | Admin |
| `PUT` | `/rounds/{id}` | Update round details | Admin |
| `POST` | `/rounds/{id}/close` | Close a round (stop betting) | Admin |
| `POST` | `/rounds/{id}/results` | Set round results | Admin |
| `POST` | `/rounds/generate` | Auto-generate upcoming rounds | Admin |

**Request/Response Examples:**

**Create Lottery Type**
```bash
curl -X POST https://api.th77prime.com/v1/lotteries \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thai Lottery",
    "description": "Government lottery of Thailand",
    "image_url": "https://th77prime.com/images/thai-lottery.png"
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Thai Lottery",
    "description": "Government lottery of Thailand",
    "image_url": "https://th77prime.com/images/thai-lottery.png",
    "is_active": true
  }
}
```

---

**Create Round**
```bash
curl -X POST https://api.th77prime.com/v1/rounds \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "lottery_type_id": 1,
    "round_number": "123456",
    "draw_date": "2026-07-16T18:00:00Z",
    "close_time": "2026-07-16T12:00:00Z",
    "open_time": "2026-07-01T00:00:00Z"
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "lottery_type_id": 1,
    "round_number": "123456",
    "draw_date": "2026-07-16T18:00:00Z",
    "close_time": "2026-07-16T12:00:00Z",
    "open_time": "2026-07-01T00:00:00Z",
    "is_closed": false
  }
}
```

---

**Set Round Results**
```bash
curl -X POST https://api.th77prime.com/v1/rounds/101/results \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "result_3d": "123",
    "result_2d": "23"
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "round_id": 101,
    "result_3d": "123",
    "result_2d": "23",
    "updated_at": "2026-07-16T18:30:00Z"
  }
}
```

---

#### **🔹 Betting System**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/bets` | List bets (filterable) | Admin, Master, Agent |
| `GET` | `/bets/{id}` | Get bet details | Admin, Master, Agent, Owner |
| `POST` | `/bets` | Place a new bet | Admin, Master, Agent |
| `PUT` | `/bets/{id}` | Update bet amount | Admin, Master, Agent, Owner |
| `DELETE` | `/bets/{id}` | Cancel a bet | Admin, Master, Agent, Owner |
| `POST` | `/bets/bulk` | Place multiple bets | Admin, Master, Agent |
| `GET` | `/bets/{id}/validate` | Validate bet before submission | Admin, Master, Agent |

**Request/Response Examples:**

**Place a Bet (Quick Key Mode)**
```bash
curl -X POST https://api.th77prime.com/v1/bets \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "round_id": 101,
    "bets": [
      {
        "lottery_number": "123",
        "bet_type": "3d",
        "amount": 100.00,
        "quantity": 1
      },
      {
        "lottery_number": "45",
        "bet_type": "2d",
        "amount": 50.00,
        "quantity": 2
      }
    ]
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "bets": [
      {
        "id": 1001,
        "user_id": 3,
        "round_id": 101,
        "lottery_number": "123",
        "bet_type": "3d",
        "amount": 100.00,
        "quantity": 1,
        "total_amount": 100.00,
        "status": "confirmed",
        "created_at": "2026-07-07T10:00:00Z"
      },
      {
        "id": 1002,
        "user_id": 3,
        "round_id": 101,
        "lottery_number": "45",
        "bet_type": "2d",
        "amount": 50.00,
        "quantity": 2,
        "total_amount": 100.00,
        "status": "confirmed",
        "created_at": "2026-07-07T10:00:00Z"
      }
    ],
    "total_amount": 200.00,
    "wallet_balance": 14800.00
  }
}
```

---

**Validate Bet Before Submission**
```bash
curl -X GET https://api.th77prime.com/v1/bets/validate?round_id=101&number=123&type=3d&amount=100 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "warnings": [
      {
        "code": "RESTRICTED_NUMBER",
        "message": "Number 123 is restricted with a payout rate of 80%",
        "payout_rate": 0.80
      }
    ],
    "estimated_payout": 800.00
  }
}
```

---

#### **🔹 Risk Management**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/restricted-numbers` | List restricted numbers for a round | Admin, Master |
| `POST` | `/restricted-numbers` | Add a restricted number | Admin, Master |
| `PUT` | `/restricted-numbers/{id}` | Update restricted number | Admin, Master |
| `DELETE` | `/restricted-numbers/{id}` | Remove restricted number | Admin, Master |
| `POST` | `/restricted-numbers/copy` | Copy restricted numbers from previous round | Admin, Master |
| `GET` | `/risk/overview` | Get risk overview for a round | Admin, Master |
| `POST` | `/risk/send-to-master` | Send high-risk bets to master | Admin, Master |

**Request/Response Examples:**

**Add Restricted Number**
```bash
curl -X POST https://api.th77prime.com/v1/restricted-numbers \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "round_id": 101,
    "number": "123",
    "is_blocked": false,
    "payout_rate": 0.80
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "round_id": 101,
    "number": "123",
    "is_blocked": false,
    "payout_rate": 0.80
  }
}
```

---

**Risk Overview for Round**
```bash
curl -X GET https://api.th77prime.com/v1/risk/overview?round_id=101 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "round_id": 101,
    "total_bets": 5000,
    "total_amount": 500000.00,
    "high_risk_numbers": [
      {
        "number": "123",
        "total_amount": 150000.00,
        "risk_level": "HIGH",
        "threshold": 100000.00
      },
      {
        "number": "456",
        "total_amount": 120000.00,
        "risk_level": "MEDIUM",
        "threshold": 100000.00
      }
    ],
    "recommended_actions": [
      "Send 123 to master agent",
      "Reduce payout rate for 456"
    ]
  }
}
```

---

#### **🔹 Link-Based Betting System**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/links` | List all betting links | Admin, Master, Agent |
| `POST` | `/links` | Create a new betting link | Admin, Master, Agent |
| `GET` | `/links/{token}` | Get link details | Public (with token) |
| `PUT` | `/links/{id}` | Update link settings | Admin, Master, Agent |
| `DELETE` | `/links/{id}` | Deactivate a link | Admin, Master, Agent |
| `POST` | `/links/{token}/bets` | Place a bet via link | Public (with token) |

**Request/Response Examples:**

**Create Betting Link**
```bash
curl -X POST https://api.th77prime.com/v1/links \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "expiry_time": "2026-07-08T23:59:59Z",
    "max_uses": 5,
    "round_id": 101
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "token": "abc123def456",
    "url": "https://th77prime.com/bet/abc123def456",
    "customer_name": "John Doe",
    "expiry_time": "2026-07-08T23:59:59Z",
    "max_uses": 5,
    "current_uses": 0,
    "is_active": true
  }
}
```

---

**Place Bet via Link**
```bash
curl -X POST https://api.th77prime.com/v1/links/abc123def456/bets \
  -H "Content-Type: application/json" \
  -d '{
    "bets": [
      {
        "lottery_number": "123",
        "bet_type": "3d",
        "amount": 100.00,
        "quantity": 1
      }
    ]
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "bets": [
      {
        "id": 1003,
        "lottery_number": "123",
        "bet_type": "3d",
        "amount": 100.00,
        "status": "pending",
        "requires_approval": true
      }
    ],
    "message": "Bets placed successfully. Awaiting agent approval."
  }
}
```

---

#### **🔹 Financial Processing**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/transactions` | List transactions | Admin, Master, Agent, Self |
| `POST` | `/transactions/deposit` | Record a deposit | Admin, Master |
| `POST` | `/transactions/withdraw` | Request a withdrawal | Admin, Master, Agent |
| `POST` | `/payouts/calculate` | Calculate prizes for a round | Admin |
| `POST` | `/payouts/confirm` | Confirm prize payout | Admin, Master |
| `GET` | `/settlements` | List settlements | Admin, Master |
| `POST` | `/settlements/{id}/confirm` | Confirm settlement | Admin, Master |

**Request/Response Examples:**

**Calculate Prizes for Round**
```bash
curl -X POST https://api.th77prime.com/v1/payouts/calculate?round_id=101 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "round_id": 101,
    "total_bets": 5000,
    "total_prize_amount": 100000.00,
    "winners": [
      {
        "bet_id": 1001,
        "user_id": 3,
        "lottery_number": "123",
        "prize_amount": 800.00,
        "payout_rate": 0.80
      }
    ],
    "summary": {
      "3d_winners": 10,
      "2d_winners": 20,
      "total_winners": 30
    }
  }
}
```

---

**Confirm Payout**
```bash
curl -X POST https://api.th77prime.com/v1/payouts/confirm \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "round_id": 101,
    "payout_ids": [1001, 1002, 1003]
  }'
```
**Response:**
```json
{
  "success": true,
  "data": {
    "confirmed_payouts": 3,
    "total_amount": 2400.00
  }
}
```

---

#### **🔹 Reporting & Dashboards**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/reports/bets` | Detailed bet reports | Admin, Master, Agent |
| `GET` | `/reports/financial` | Financial summary | Admin, Master, Agent |
| `GET` | `/reports/agent` | Agent performance reports | Admin, Master |
| `GET` | `/reports/customer` | Customer balance reports | Admin, Master, Agent |
| `GET` | `/dashboard/overview` | Overview dashboard | Admin, Master, Agent |

**Request/Response Examples:**

**Get Bet Report**
```bash
curl -X GET "https://api.th77prime.com/v1/reports/bets?round_id=101&user_id=3&status=confirmed&start_date=2026-07-01&end_date=2026-07-07" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_bets": 50,
    "total_amount": 50000.00,
    "bets": [
      {
        "id": 1001,
        "user_id": 3,
        "round_id": 101,
        "lottery_number": "123",
        "bet_type": "3d",
        "amount": 100.00,
        "status": "confirmed",
        "created_at": "2026-07-07T10:00:00Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_pages": 3
  }
}
```

---

**Dashboard Overview**
```bash
curl -X GET https://api.th77prime.com/v1/dashboard/overview \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 100,
    "total_bets_today": 500,
    "total_amount_today": 500000.00,
    "total_payouts_today": 100000.00,
    "net_profit_today": 400000.00,
    "active_rounds": [
      {
        "id": 101,
        "lottery_type": "Thai Lottery",
        "round_number": "123456",
        "total_bets": 5000,
        "total_amount": 500000.00,
        "draw_date": "2026-07-16T18:00:00Z"
      }
    ],
    "recent_transactions": [
      {
        "id": 2001,
        "user_id": 3,
        "type": "bet",
        "amount": -100.00,
        "created_at": "2026-07-07T10:00:00Z"
      }
    ]
  }
}
```

---

#### **🔹 File Upload (OCR Support)**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/files/upload` | Upload a file (e.g., payment proof) | Admin, Master, Agent |
| `GET` | `/files/{id}` | Get file details | Private |
| `GET` | `/files/{id}/download` | Download a file | Private |

**Request/Response Examples:**

**Upload Payment Proof**
```bash
curl -X POST https://api.th77prime.com/v1/files/upload \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@payment_proof.jpg" \
  -F "type=payment_proof" \
  -F "reference_id=2001" \
  -F "reference_type=transaction"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://storage.th77prime.com/files/payment_proof_2001.jpg",
    "type": "payment_proof",
    "reference_id": 2001,
    "reference_type": "transaction",
    "ocr_data": {
      "detected_text": "BANK: KBANK\nDATE: 07/07/2026\nAMOUNT: 10,000 THB",
      "confidence": 0.95
    }
  }
}
```

---

## **6. Frontend Structure**

### **6.1 Directory Structure**
```
th77-prime-frontend/
├── public/                 # Static files
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── assets/             # Local assets (icons, fonts)
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Buttons, Modals, Tables
│   │   ├── layout/        # Header, Sidebar, Footer
│   │   └── lottery/       # Lottery-specific components
│   ├── contexts/           # React Contexts (Auth, Theme)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   │   ├── Auth/          # Login, Register
│   │   ├── Dashboard/     # Overview, Reports
│   │   ├── Lottery/       # Lottery management
│   │   ├── Betting/       # Bet placement, validation
│   │   ├── Risk/          # Risk management
│   │   ├── Links/         # Betting links
│   │   ├── Financial/     # Transactions, settlements
│   │   ├── Users/         # User management
│   │   └── Settings/      # Profile, preferences
│   ├── services/           # API service layer
│   │   ├── api.ts         # Axios instance
│   │   ├── auth.ts        # Auth API calls
│   │   ├── users.ts       # User API calls
│   │   ├── lottery.ts     # Lottery API calls
│   │   ├── betting.ts     # Betting API calls
│   │   └── ...
│   ├── stores/             # State management (Zustand/Redux)
│   ├── styles/             # Global styles, themes
│   ├── types/              # TypeScript types/interfaces
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # React entry point
├── .env                    # Environment variables
├── package.json
└── tsconfig.json
```

### **6.2 Key Frontend Components**

#### **Layout Components**
- **`Sidebar`**: Role-based navigation menu.
- **`Header`**: User info, notifications, quick actions.
- **`ProtectedRoute`**: Wrapper for authenticated routes.

#### **Lottery Components**
- **`LotteryTypeList`**: List/CRUD for lottery types.
- **`RoundCalendar`**: Visual calendar for round schedules.
- **`RoundCreator`**: Form to create new rounds.

#### **Betting Components**
- **`BetForm`**: Form for placing bets (quick-key & manual modes).
- **`BetValidation`**: Real-time validation for bet inputs.
- **`BetList`**: Table of bets with filters/sorting.
- **`RestrictedNumberAlert`**: Shows warnings for restricted numbers.

#### **Risk Management Components**
- **`RiskDashboard`**: Overview of high-risk numbers/bets.
- **`RestrictedNumberManager`**: Add/edit/remove restricted numbers.
- **`RiskSharingModal`**: Send high-risk bets to master.

#### **Link-Based Betting Components**
- **`LinkGenerator`**: Form to create betting links.
- **`LinkList`**: Table of active/inactive links.
- **`PublicBetPage`**: Page for customers to bet via link (no login).

#### **Financial Components**
- **`TransactionList`**: Table of deposits/withdrawals/bets.
- **`SettlementList`**: Table of settlements with payout status.
- **`PayoutCalculator`**: Tool to calculate prizes for a round.
- **`CreditAdjuster`**: Form to adjust user credits.

#### **Reporting Components**
- **`BetReport`**: Detailed bet history with filters.
- **`FinancialReport`**: Summary of income/expenses.
- **`AgentReport`**: Performance metrics for agents.
- **`Dashboard`**: Overview with charts/stats.

---

### **6.3 Example React Components**

#### **`BetForm.tsx` (Quick-Key Mode)**
```tsx
import React, { useState } from 'react';
import { placeBet } from '../services/betting';
import { validateBet } from '../services/validation';

const BetForm = ({ roundId, userId }) => {
  const [input, setInput] = useState('');
  const [bets, setBets] = useState([]);
  const [errors, setErrors] = useState([]);

  const parseQuickKey = (text: string) => {
    // Example: "123 10x5, 456 20x1" -> [{number: '123', amount: 10, quantity: 5}, ...]
    const parsedBets = [];
    const parts = text.split(',').map(p => p.trim());
    for (const part of parts) {
      const [number, rest] = part.split(' ');
      const [amount, quantity = '1'] = rest?.split('x') || [];
      parsedBets.push({
        lottery_number: number,
        bet_type: number.length === 3 ? '3d' : '2d',
        amount: parseFloat(amount),
        quantity: parseInt(quantity)
      });
    }
    return parsedBets;
  };

  const handleSubmit = async () => {
    const parsedBets = parseQuickKey(input);
    const validation = await validateBet(parsedBets, roundId);
    if (validation.is_valid) {
      const response = await placeBet({ round_id: roundId, bets: parsedBets });
      setBets(response.data.bets);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter bets (e.g., 123 10x5, 456 20x1)"
      />
      <button onClick={handleSubmit}>Place Bets</button>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <p key={i} className="error">{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BetForm;
```

---

#### **`RestrictedNumberAlert.tsx`**
```tsx
import React from 'react';

const RestrictedNumberAlert = ({ number, payoutRate }) => {
  return (
    <div className="alert alert-warning">
      <span>⚠️ Number {number} is restricted.</span>
      <span>Payout rate: {payoutRate * 100}%</span>
    </div>
  );
};

export default RestrictedNumberAlert;
```

---

## **7. Backend Services**

### **7.1 Service Structure (Node.js/Express Example)**
```
th77-prime-backend/
├── src/
│   ├── config/               # Configuration files
│   │   ├── db.ts             # Database config
│   │   ├── redis.ts          # Redis config
│   │   └── rabbitmq.ts       # Message queue config
│   ├── controllers/          # Route controllers
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── lottery.ts
│   │   ├── betting.ts
│   │   └── ...
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.ts           # JWT validation
│   │   ├── role.ts           # Role-based access
│   │   └── rateLimiter.ts    # Rate limiting
│   ├── models/               # Database models (Sequelize/TypeORM)
│   │   ├── User.ts
│   │   ├── Bet.ts
│   │   └── ...
│   ├── routes/               # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── lottery.ts
│   │   └── index.ts          # Combines all routes
│   ├── services/             # Business logic
│   │   ├── authService.ts
│   │   ├── bettingService.ts
│   │   └── ...
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   ├── validator.ts
│   │   └── ...
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

---

### **7.2 Example Backend Code (Node.js/Express)**

#### **`app.ts` (Express Setup)**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import lotteryRoutes from './routes/lottery';
import bettingRoutes from './routes/betting';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/lotteries', lotteryRoutes);
app.use('/api/v1/bets', bettingRoutes);

// Error Handling
app.use(errorHandler);

export default app;
```

---

#### **`controllers/betting.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { BetService } from '../services/bettingService';
import { validateBet } from '../utils/validator';

export class BetController {
  static async placeBet(req: Request, res: Response, next: NextFunction) {
    try {
      const { round_id, bets } = req.body;
      const userId = req.user.id;

      // Validate bets
      const validation = await validateBet(bets, round_id);
      if (!validation.is_valid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_BET',
            message: validation.errors[0].message,
            details: validation.errors
          }
        });
      }

      // Place bets
      const result = await BetService.placeBets(userId, round_id, bets);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async validateBet(req: Request, res: Response, next: NextFunction) {
    try {
      const { round_id, number, type, amount } = req.query;
      const validation = await BetService.validateBet(
        Number(round_id),
        String(number),
        String(type),
        Number(amount)
      );
      res.json({ success: true, data: validation });
    } catch (error) {
      next(error);
    }
  }
}
```

---

#### **`services/bettingService.ts`**
```typescript
import { Bet, Round, RestrictedNumber } from '../models';
import { sequelize } from '../config/db';

export class BetService {
  static async placeBets(userId: number, roundId: number, bets: any[]) {
    return sequelize.transaction(async (t) => {
      const createdBets = [];
      let totalAmount = 0;

      for (const bet of bets) {
        // Check for duplicates
        const existingBet = await Bet.findOne({
          where: {
            user_id: userId,
            round_id: roundId,
            lottery_number: bet.lottery_number,
            bet_type: bet.bet_type
          },
          transaction: t
        });

        if (existingBet) {
          // Update existing bet
          existingBet.amount += bet.amount * bet.quantity;
          existingBet.quantity += bet.quantity;
          existingBet.total_amount = existingBet.amount * existingBet.quantity;
          await existingBet.save({ transaction: t });
          createdBets.push(existingBet);
          totalAmount += bet.amount * bet.quantity;
        } else {
          // Create new bet
          const newBet = await Bet.create({
            user_id: userId,
            round_id: roundId,
            lottery_number: bet.lottery_number,
            bet_type: bet.bet_type,
            amount: bet.amount,
            quantity: bet.quantity,
            total_amount: bet.amount * bet.quantity,
            status: 'confirmed'
          }, { transaction: t });
          createdBets.push(newBet);
          totalAmount += newBet.total_amount;
        }
      }

      // Deduct from user's credit
      const user = await User.findByPk(userId, { transaction: t });
      user.credit -= totalAmount;
      await user.save({ transaction: t });

      return { bets: createdBets, total_amount: totalAmount, wallet_balance: user.credit };
    });
  }

  static async validateBet(roundId: number, number: string, type: string, amount: number) {
    const round = await Round.findByPk(roundId);
    if (!round) {
      throw new Error('Round not found');
    }

    const restrictedNumber = await RestrictedNumber.findOne({
      where: { round_id: roundId, number }
    });

    const warnings = [];
    if (restrictedNumber) {
      warnings.push({
        code: 'RESTRICTED_NUMBER',
        message: `Number ${number} is restricted`,
        payout_rate: restrictedNumber.payout_rate
      });
    }

    return {
      is_valid: true,
      warnings,
      estimated_payout: restrictedNumber ? amount * restrictedNumber.payout_rate * 800 : amount * 800
    };
  }
}
```

---

## **8. Risk Management System**

### **8.1 Risk Control Workflow**
1. **Admin/Master sets restricted numbers** for a round (blocked or reduced payout).
2. **Agent places bets** – system checks against restricted numbers.
3. **If bet is on a restricted number**:
   - If **blocked**: Reject bet.
   - If **reduced payout**: Accept bet but flag it.
4. **System tracks total bets per number** in real-time.
5. **If a number exceeds risk threshold**:
   - Highlight in **Risk Dashboard**.
   - Allow **sending to master** for sharing.
6. **Master reviews and confirms** risk-sharing with higher-level agents.

### **8.2 Risk Dashboard Features**
- **Real-time monitoring** of bets per number.
- **Color-coded risk levels** (Green: Safe, Yellow: Caution, Red: High Risk).
- **Automated alerts** for numbers exceeding thresholds.
- **One-click actions**: Send to master, adjust payout rate, block number.

---

## **9. Link-Based Betting System**

### **9.1 Workflow**
1. **Agent/Master creates a link**:
   - Sets customer name, expiry, max uses.
   - System generates a **unique token** (e.g., `abc123def456`).
2. **Link is shared** (via LINE, SMS, etc.):
   - URL: `https://th77prime.com/bet/abc123def456`
3. **Customer clicks link**:
   - Redirects to a **public betting page** (no login required).
   - Page shows available rounds and bet options.
4. **Customer places bets**:
   - Bets are stored with `status: 'pending'`.
   - Agent receives a **notification** for approval.
5. **Agent approves/rejects bets**:
   - If approved: Bet status changes to `confirmed`.
   - If rejected: Bet is cancelled, customer sees error.

### **9.2 Security Measures**
- **Token-based access**: Each link has a unique, unguessable token.
- **Expiry time**: Links automatically expire after set time.
- **Max uses**: Limit number of bets per link.
- **IP tracking**: Log customer IP for fraud detection.
- **Rate limiting**: Prevent abuse of public endpoints.

---

## **10. Financial Processing & Reporting**

### **10.1 Prize Calculation Logic**
| Bet Type | Payout Rate | Example (Bet: 100 THB) |
|----------|-------------|------------------------|
| 3D (Exact) | 1:800 | 80,000 THB |
| 2D (Exact) | 1:80 | 8,000 THB |
| 3D (Any Order) | 1:150 | 15,000 THB |
| 2D (Any Order) | 1:40 | 4,000 THB |

**Restricted Numbers:**
- If payout rate is set to `0.80`, prize = `800 * 0.80 = 640 THB` per 1 THB bet.

### **10.2 Settlement Process**
1. **After round closes**, admin/master runs **prize calculation**.
2. System identifies winning bets and calculates prizes.
3. **Settlement record** is created for each agent/master.
4. **Commission** is calculated based on hierarchy.
5. **Payouts** are confirmed and processed.

### **10.3 Reporting Features**
| Report | Description | Access |
|--------|-------------|--------|
| **Bet Report** | Detailed list of all bets with filters | Admin, Master, Agent |
| **Financial Report** | Income, expenses, net profit | Admin, Master |
| **Agent Report** | Performance metrics per agent | Admin, Master |
| **Customer Report** | Balance and bet history per customer | Admin, Master, Agent |
| **Round Report** | Summary for a specific round | Admin, Master |

---

## **11. Deployment & CI/CD**

### **11.1 Infrastructure Setup**
- **Cloud Provider**: AWS / GCP / Azure
- **Kubernetes Cluster**: For container orchestration
- **Ingress Controller**: Nginx / Traefik
- **CI/CD Pipeline**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Loki + Grafana
- **Tracing**: Jaeger / OpenTelemetry

### **11.2 Kubernetes Deployment**
```yaml
# Example: betting-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: betting-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: betting-service
  template:
    metadata:
      labels:
        app: betting-service
    spec:
      containers:
      - name: betting-service
        image: th77prime/betting-service:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: host
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      imagePullSecrets:
      - name: regcred
---
apiVersion: v1
kind: Service
metadata:
  name: betting-service
spec:
  selector:
    app: betting-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

### **11.3 GitHub Actions CI/CD**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: |
        docker build -t th77prime/betting-service:${{ github.sha }} .
        docker push th77prime/betting-service:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/betting-service betting-service=th77prime/betting-service:${{ github.sha }}
        kubectl rollout status deployment/betting-service
```

---

## **12. Security & Compliance**

### **12.1 Security Measures**
| Layer | Security Feature | Implementation |
|-------|-------------------|----------------|
| **Network** | DDoS Protection | Cloudflare |
| **Network** | WAF | Cloudflare WAF |
| **API** | Rate Limiting | Express Rate Limiter |
| **API** | JWT Authentication | `jsonwebtoken` |
| **API** | Input Validation | `joi` / `zod` |
| **Database** | Encryption at Rest | PostgreSQL TDE |
| **Database** | Encryption in Transit | TLS 1.2+ |
| **Application** | RBAC | Custom middleware |
| **Application** | Audit Logging | All financial actions logged |
| **Application** | OCR Security | Sanitize uploaded files |

### **12.2 Compliance**
- **GDPR**: Data anonymization, right to erasure.
- **PCI DSS**: Secure payment processing (via gateway).
- **Local Laws**: Adhere to Thai gambling regulations.

---

## **13. Error Codes & Troubleshooting**

### **13.1 Error Code Reference**
| Code | HTTP Status | Description | Solution |
|------|-------------|-------------|----------|
| `INVALID_INPUT` | 400 | Missing or invalid request data | Check request body |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT | Re-login |
| `FORBIDDEN` | 403 | Insufficient permissions | Check user role |
| `NOT_FOUND` | 404 | Resource not found | Verify ID/endpoint |
| `INVALID_BET` | 400 | Bet violates rules | Check number/type |
| `INSUFFICIENT_CREDIT` | 400 | User has no credit | Top up credit |
| `ROUND_CLOSED` | 400 | Betting is closed for round | Wait for next round |
| `RESTRICTED_NUMBER` | 400 | Number is blocked | Choose another number |
| `RATE_LIMITED` | 429 | Too many requests | Wait and retry |
| `SERVER_ERROR` | 500 | Internal server error | Contact admin |

### **13.2 Common Issues & Fixes**
| Issue | Cause | Solution |
|-------|-------|----------|
| **Login fails** | Incorrect credentials | Reset password |
| **Bets not appearing** | Not confirmed by agent | Contact agent |
| **Payout not received** | Prize calculation not run | Run calculation |
| **Link not working** | Expired or max uses reached | Generate new link |
| **Slow API responses** | High server load | Check monitoring |

---

## **14. Appendices**

### **14.1 Glossary**
| Term | Definition |
|------|------------|
| **3D** | 3-digit lottery bet (e.g., 123) |
| **2D** | 2-digit lottery bet (e.g., 23) |
| **Agent** | User who places bets for customers |
| **Master** | User who manages agents and risk |
| **Round** | A single lottery draw event |
| **Restricted Number** | A number with betting restrictions |
| **Payout Rate** | Multiplier for prize calculation |
| **Settlement** | Financial reconciliation after a round |
| **Commission** | Percentage earned by agents/masters |

### **14.2 Sample Data**

**Sample User:**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "credit": 1000000.00,
  "discount_percentage": 0.00
}
```

**Sample Round:**
```json
{
  "id": 101,
  "lottery_type_id": 1,
  "round_number": "123456",
  "draw_date": "2026-07-16T18:00:00Z",
  "close_time": "2026-07-16T12:00:00Z",
  "is_closed": false
}
```

**Sample Bet:**
```json
{
  "id": 1001,
  "user_id": 3,
  "round_id": 101,
  "lottery_number": "123",
  "bet_type": "3d",
  "amount": 100.00,
  "quantity": 1,
  "total_amount": 100.00,
  "status": "confirmed"
}
```

### **14.3 Third-Party Integrations**
| Service | Purpose | API Docs |
|---------|---------|----------|
| **Cloudflare** | CDN, DDoS Protection | [Link](https://developers.cloudflare.com/) |
| **PostgreSQL** | Primary Database | [Link](https://www.postgresql.org/docs/) |
| **Redis** | Caching | [Link](https://redis.io/docs/) |
| **RabbitMQ** | Message Queue | [Link](https://www.rabbitmq.com/documentation.html) |
| **MinIO** | Object Storage | [Link](https://min.io/docs/) |
| **Elasticsearch** | Search & Logs | [Link](https://www.elastic.co/guide/) |
| **LINE API** | Notifications | [Link](https://developers.line.biz/) |
| **SMS Gateway** | SMS Notifications | Custom |

---

### **14.4 Changelog**
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-07-07 | Initial release |

---

### **14.5 License**
This documentation is proprietary and confidential. Unauthorized distribution is prohibited.

---

**End of Document**