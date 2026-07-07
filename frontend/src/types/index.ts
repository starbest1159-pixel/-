// ============================================
// TypeScript Types & Interfaces
// ============================================

// User & Authentication
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'master' | 'agent' | 'member';
  credit: number;
  max_credit_limit: number;
  discount_percentage: number;
  is_active: boolean;
  is_betting_blocked: boolean;
  parent_id?: number;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// Lottery & Rounds
export interface LotteryType {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
}

export interface Round {
  id: number;
  lottery_type_id: number;
  round_number: string;
  draw_date: string;
  close_time: string;
  open_time: string;
  result_3d?: string;
  result_2d?: string;
  is_closed: boolean;
}

// Betting
export interface Bet {
  id?: number;
  lottery_number: string;
  bet_type: '3d' | '2d' | 'top' | 'bottom';
  amount: number;
  quantity: number;
  total_amount: number;
  status?: 'pending' | 'confirmed' | 'won' | 'lost' | 'cancelled';
  is_restricted?: boolean;
  restricted_rate?: number;
  is_from_link?: boolean;
  link_id?: number;
  created_at?: string;
}

export interface PlaceBetRequest {
  round_id: number;
  bets: Bet[];
}

export interface PlaceBetResponse {
  success: boolean;
  data: {
    bets: Bet[];
    new_balance: number;
    total_amount: number;
  };
}

export interface BetValidationRequest {
  round_id: number;
  bets: Omit<Bet, 'id' | 'created_at'>[];
}

export interface BetValidationResponse {
  is_valid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ number: string; type: string; rate: number }>; // Restricted numbers
}

// Risk Management
export interface RestrictedNumber {
  id: number;
  number: string;
  is_blocked: boolean;
  payout_rate?: number;
}

// Wallet & Transactions
export interface Transaction {
  id: number;
  user_id: number;
  type: 'bet' | 'deposit' | 'withdrawal' | 'prize' | 'commission';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id?: number;
  reference_type?: string;
  status: 'pending' | 'completed' | 'failed';
  proof_url?: string;
  created_at: string;
}

export interface AdjustCreditRequest {
  amount: number;
  action: 'add' | 'subtract';
  reason: string;
}

export interface AdjustCreditResponse {
  success: boolean;
  data: {
    user_id: number;
    old_credit: number;
    new_credit: number;
    transaction_id: number;
  };
}

// Betting Links
export interface BettingLink {
  id: number;
  token: string;
  customer_name: string;
  expiry_time: string;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateBettingLinkRequest {
  customer_name: string;
  round_id: number;
  max_uses?: number;
  expiry_hours: number;
}

export interface CreateBettingLinkResponse {
  success: boolean;
  data: {
    link: BettingLink;
    betting_url: string;
  };
}

// Notifications & Alerts
export interface CreditAlert {
  id: number;
  user_id: number;
  alert_type: 'low_credit' | 'zero_credit';
  message: string;
  is_resolved: boolean;
  resolved_by?: number;
  resolved_at?: string;
  created_at: string;
}

// Dashboard Data
export interface AgentDashboardData {
  user: User;
  today_total_bet: number;
  today_total_prize: number;
  recent_bets: Bet[];
  pending_confirmations: Bet[];
  credit_alerts: CreditAlert[];
}

export interface AdminDashboardData {
  total_agents: number;
  today_total_bet: number;
  today_total_payout: number;
  zero_credit_users: User[];
  low_credit_users: User[];
  agents: User[];
  recent_transactions: Transaction[];
}

// API Error Response
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp?: string;
}
