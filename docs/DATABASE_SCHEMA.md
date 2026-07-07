# TH77 Prime - Database Schema

## Overview

PostgreSQL database schema for TH77 Prime Lottery Management Platform.

---

## Core Tables

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role_id INT REFERENCES roles(id),
    parent_id INT REFERENCES users(id),
    credit DECIMAL(15,2) DEFAULT 0.00,
    max_credit_limit DECIMAL(15,2) DEFAULT 100000.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    is_betting_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Bets Table

```sql
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    round_id INT REFERENCES rounds(id),
    lottery_number VARCHAR(10) NOT NULL,
    bet_type VARCHAR(10) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Credit Transactions Table

```sql
CREATE TABLE credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Full Schema

See `backend/migrations/schema.sql` for complete database schema.
