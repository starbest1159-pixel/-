-- TH77 Prime Database Schema
-- PostgreSQL migration script

-- ============================================
-- Roles Table
-- ============================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Users Table
-- ============================================
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

-- ============================================
-- Lottery Types Table
-- ============================================
CREATE TABLE lottery_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Rounds Table
-- ============================================
CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    lottery_type_id INT REFERENCES lottery_types(id),
    round_number VARCHAR(50) NOT NULL,
    draw_date DATE NOT NULL,
    open_time TIMESTAMP,
    close_time TIMESTAMP,
    result_3d VARCHAR(10),
    result_2d VARCHAR(10),
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Bets Table
-- ============================================
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
    is_from_link BOOLEAN DEFAULT false,
    link_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Credit Transactions Table
-- ============================================
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

-- ============================================
-- Transactions Table
-- ============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    reference_id INT,
    reference_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'completed',
    proof_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Settlements Table
-- ============================================
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    user_id INT REFERENCES users(id),
    bet_id INT REFERENCES bets(id),
    prize_amount DECIMAL(15,2) NOT NULL,
    payout_rate DECIMAL(5,2) DEFAULT 100.00,
    status VARCHAR(20) DEFAULT 'pending',
    settled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Commissions Table
-- ============================================
CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    round_id INT REFERENCES rounds(id),
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Restricted Numbers Table
-- ============================================
CREATE TABLE restricted_numbers (
    id SERIAL PRIMARY KEY,
    round_id INT REFERENCES rounds(id),
    lottery_number VARCHAR(10) NOT NULL,
    bet_type VARCHAR(10) NOT NULL,
    is_blocked BOOLEAN DEFAULT false,
    payout_rate DECIMAL(5,2) DEFAULT 100.00,
    max_bet_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Betting Links Table
-- ============================================
CREATE TABLE betting_links (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    round_id INT REFERENCES rounds(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    max_uses INT DEFAULT NULL,
    current_uses INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Audit Logs Table
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INT,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_parent ON users(parent_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_round ON bets(round_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_rounds_lottery_type ON rounds(lottery_type_id);
CREATE INDEX idx_rounds_closed ON rounds(is_closed);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_settlements_round ON settlements(round_id);
CREATE INDEX idx_commissions_user ON commissions(user_id);
CREATE INDEX idx_restricted_numbers_round ON restricted_numbers(round_id);
CREATE INDEX idx_betting_links_token ON betting_links(token);
CREATE INDEX idx_betting_links_user ON betting_links(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- ============================================
-- Seed Data: Roles
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'System administrator with full access', '{"manage_users": true, "manage_lotteries": true, "manage_rounds": true, "view_all_bets": true, "manage_credit": true, "view_reports": true, "manage_settings": true}'),
  ('master', 'Master agent overseeing sub-agents', '{"manage_agents": true, "manage_credit": true, "view_sub_bets": true, "create_links": true, "view_reports": true}'),
  ('agent', 'Agent managing members and betting', '{"manage_members": true, "manage_own_credit": true, "place_bets": true, "create_links": true, "view_own_bets": true}'),
  ('member', 'End-user placing bets via links', '{"place_bets_via_link": true, "view_own_bets": true}');
