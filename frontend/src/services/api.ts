import axios from 'axios';
import { SuccessResponse, ErrorResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token
        });

        const { access_token } = response.data.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// Authentication APIs
// ============================================

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<SuccessResponse>('/auth/login', {
      username,
      password
    });
    return response.data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.clear();
  },

  refreshToken: async (refresh_token: string) => {
    const response = await api.post<SuccessResponse>('/auth/refresh', {
      refresh_token
    });
    return response.data.data;
  }
};

// ============================================
// User APIs
// ============================================

export const userApi = {
  getProfile: async () => {
    const response = await api.get<SuccessResponse>('/users/profile');
    return response.data.data;
  },

  getUser: async (id: number) => {
    const response = await api.get<SuccessResponse>(`/users/${id}`);
    return response.data.data;
  },

  listUsers: async (role?: string, parent_id?: number, page: number = 1) => {
    const response = await api.get<SuccessResponse>('/users', {
      params: { role, parent_id, page, limit: 20 }
    });
    return response.data.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post<SuccessResponse>('/users', userData);
    return response.data.data;
  },

  adjustCredit: async (userId: number, amount: number, action: 'add' | 'subtract', reason: string) => {
    const response = await api.put<SuccessResponse>(`/users/${userId}/credit`, {
      amount,
      action,
      reason
    });
    return response.data.data;
  },

  adjustDiscount: async (userId: number, discount_percentage: number) => {
    const response = await api.put<SuccessResponse>(`/users/${userId}/discount`, {
      discount_percentage
    });
    return response.data.data;
  }
};

// ============================================
// Dashboard APIs
// ============================================

export const dashboardApi = {
  getAgentDashboard: async () => {
    const response = await api.get<SuccessResponse>('/dashboard/agent');
    return response.data.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get<SuccessResponse>('/dashboard/admin');
    return response.data.data;
  }
};

// ============================================
// Lottery APIs
// ============================================

export const lotteryApi = {
  listLotteries: async () => {
    const response = await api.get<SuccessResponse>('/lotteries');
    return response.data.data;
  },

  listRounds: async (lottery_type_id?: number, status?: string, page: number = 1) => {
    const response = await api.get<SuccessResponse>('/rounds', {
      params: { lottery_type_id, status, page, limit: 20 }
    });
    return response.data.data;
  },

  getRound: async (id: number) => {
    const response = await api.get<SuccessResponse>(`/rounds/${id}`);
    return response.data.data;
  },

  createRound: async (roundData: any) => {
    const response = await api.post<SuccessResponse>('/rounds', roundData);
    return response.data.data;
  }
};

// ============================================
// Betting APIs
// ============================================

export const bettingApi = {
  placeBet: async (roundId: number, bets: any[]) => {
    const response = await api.post<SuccessResponse>('/bets', {
      round_id: roundId,
      bets
    });
    return response.data.data;
  },

  validateBet: async (roundId: number, bets: any[]) => {
    const response = await api.post<SuccessResponse>('/bets/validate', {
      round_id: roundId,
      bets
    });
    return response.data.data;
  },

  getUserBets: async (userId: number, status?: string, page: number = 1) => {
    const response = await api.get<SuccessResponse>(`/users/${userId}/bets`, {
      params: { status, page, limit: 20 }
    });
    return response.data.data;
  },

  cancelBet: async (betId: number, reason: string) => {
    const response = await api.post<SuccessResponse>(`/bets/${betId}/cancel`, {
      reason
    });
    return response.data.data;
  }
};

// ============================================
// Betting Link APIs
// ============================================

export const linkApi = {
  createLink: async (customer_name: string, round_id: number, max_uses?: number, expiry_hours: number = 24) => {
    const response = await api.post<SuccessResponse>('/links', {
      customer_name,
      round_id,
      max_uses,
      expiry_hours
    });
    return response.data.data;
  },

  getUserLinks: async (userId: number, page: number = 1) => {
    const response = await api.get<SuccessResponse>(`/users/${userId}/links`, {
      params: { page, limit: 20 }
    });
    return response.data.data;
  },

  placeBetViaLink: async (token: string, bets: any[]) => {
    const response = await api.post<SuccessResponse>(`/links/${token}/bets`, {
      bets
    });
    return response.data.data;
  }
};

// ============================================
// Transaction & Wallet APIs
// ============================================

export const transactionApi = {
  getTransactions: async (userId: number, type?: string, page: number = 1) => {
    const response = await api.get<SuccessResponse>(`/users/${userId}/transactions`, {
      params: { type, page, limit: 20 }
    });
    return response.data.data;
  },

  getBalance: async (userId: number) => {
    const response = await api.get<SuccessResponse>(`/users/${userId}/balance`);
    return response.data.data;
  }
};

// ============================================
// Alert APIs
// ============================================

export const alertApi = {
  getCreditAlerts: async (userId?: number) => {
    const response = await api.get<SuccessResponse>('/alerts/credit', {
      params: { user_id: userId }
    });
    return response.data.data;
  },

  resolveCreditAlert: async (alertId: number) => {
    const response = await api.put<SuccessResponse>(`/alerts/credit/${alertId}/resolve`);
    return response.data.data;
  }
};

export default api;
