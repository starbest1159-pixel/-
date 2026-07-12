import { bettingApi } from './api';
import { Bet, BetValidationResponse } from '../types';

// ============================================
// Betting Service - Business Logic
// ============================================

export const bettingService = {
  // ✅ Parse Quick Key Input (e.g., "824 5040x1, 123 100x2")
  parseQuickKey: (text: string): Bet[] => {
    const parsedBets: Bet[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());

      for (const part of parts) {
        if (!part) continue;

        // Match: "824 5040x1" or "824 5040"
        const match = part.match(/(\d+)\s+([\d.]+)(?:x(\d+))?/);
        if (!match) continue;

        const [, number, amount, quantity] = match;
        const betType = number.length === 3 ? '3d' : '2d';
        const amountNum = parseFloat(amount);
        const quantityNum = parseInt(quantity || '1', 10);
        const totalAmount = amountNum * quantityNum;

        parsedBets.push({
          lottery_number: number,
          bet_type: betType,
          amount: amountNum,
          quantity: quantityNum,
          total_amount: totalAmount
        });
      }
    }

    return parsedBets;
  },

  // ✅ Validate Bets
  validateBets: async (roundId: number, bets: Bet[]): Promise<BetValidationResponse> => {
    try {
      const validation = await bettingApi.validateBet(roundId, bets);
      return validation;
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'ZERO_CREDIT') {
        throw {
          code: 'ZERO_CREDIT',
          message: 'เครดิตหมด กรุณาเติมเครดิตก่อน'
        };
      } else if (error.response?.data?.error?.code === 'INSUFFICIENT_CREDIT') {
        throw {
          code: 'INSUFFICIENT_CREDIT',
          message: 'เครดิตไม่พอ'
        };
      }
      throw error;
    }
  },

  // ✅ Place Bet
  placeBet: async (roundId: number, bets: Bet[]): Promise<any> => {
    try {
      const result = await bettingApi.placeBet(roundId, bets);
      return result;
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'ZERO_CREDIT') {
        throw {
          code: 'ZERO_CREDIT',
          message: 'เครดิตหมด กรุณาเติมเค���ดิตก่อน'
        };
      } else if (error.response?.data?.error?.code === 'INSUFFICIENT_CREDIT') {
        throw {
          code: 'INSUFFICIENT_CREDIT',
          message: 'เครดิตไม่พอ'
        };
      } else if (error.response?.data?.error?.code === 'ROUND_CLOSED') {
        throw {
          code: 'ROUND_CLOSED',
          message: 'รอบนี้ปิดรับแทงแล้ว'
        };
      } else if (error.response?.data?.error?.code === 'DUPLICATE_BET') {
        throw {
          code: 'DUPLICATE_BET',
          message: 'มีการโพยเลขนี้แล้ว'
        };
      }
      throw error;
    }
  },

  // ✅ Check if number is restricted
  isNumberRestricted: (number: string, warnings: any[]): any => {
    return warnings.find(w => w.number === number);
  },

  // ✅ Calculate total bet amount
  calculateTotal: (bets: Bet[]): number => {
    return bets.reduce((sum, bet) => sum + bet.total_amount, 0);
  },

  // ✅ Format currency
  formatCurrency: (amount: number): string => {
    return amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

export default bettingService;
