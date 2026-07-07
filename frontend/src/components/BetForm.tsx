'use client';

import React, { useState, useEffect } from 'react';
import { Bet } from '../types';
import bettingService from '../services/betting';
import { bettingApi } from '../services/api';
import CreditAlert from './CreditAlert';
import './BetForm.css';

interface BetFormProps {
  roundId: number;
  userCredit: number;
  isBlocked: boolean;
  onSuccess: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ roundId, userCredit, isBlocked, onSuccess }) => {
  const [input, setInput] = useState<string>('');
  const [bets, setBets] = useState<Bet[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mode, setMode] = useState<'quick' | 'manual'>('quick');
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const total = bettingService.calculateTotal(bets);
    setTotalAmount(total);
  }, [bets]);

  const parseAndValidate = async (betsToValidate: Bet[]) => {
    if (betsToValidate.length === 0) {
      setErrors(['กรุณาใส่อย่างน้อย 1 โพย']);
      return false;
    }

    if (totalAmount > userCredit) {
      setErrors(['เครดิตไม่พอ']);
      return false;
    }

    try {
      const validation = await bettingService.validateBets(roundId, betsToValidate);

      if (!validation.is_valid) {
        setErrors(validation.errors.map((e: any) => e.message));
        return false;
      }

      setWarnings(validation.warnings || []);
      setErrors([]);
      return true;
    } catch (error: any) {
      setErrors([error.message || 'ตรวจสอบโพยไม่สำเร็จ']);
      return false;
    }
  };

  const handleQuickKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const parsedBets = bettingService.parseQuickKey(e.target.value);
    setBets(parsedBets);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isBlocked) return;

    setIsSubmitting(true);

    try {
      const betsToSubmit = mode === 'quick' ? bets : bets;

      const isValid = await parseAndValidate(betsToSubmit);
      if (!isValid) return;

      await bettingService.placeBet(roundId, betsToSubmit);
      onSuccess();
      setInput('');
      setBets([]);
      setWarnings([]);
      setErrors([]);
    } catch (error: any) {
      setErrors([error.message || 'บวกโพยไม่สำเร็จ']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addManualBet = () => {
    setBets([...bets, {
      lottery_number: '',
      bet_type: '3d',
      amount: 0,
      quantity: 1,
      total_amount: 0
    }]);
  };

  const updateBet = (index: number, field: keyof Bet, value: any) => {
    const updatedBets = [...bets];
    updatedBets[index][field] = value;

    if (field === 'amount' || field === 'quantity') {
      updatedBets[index].total_amount = updatedBets[index].amount * updatedBets[index].quantity;
    }

    setBets(updatedBets);
  };

  const removeBet = (index: number) => {
    const updatedBets = [...bets];
    updatedBets.splice(index, 1);
    setBets(updatedBets);
  };

  if (isBlocked) {
    return (
      <div className="bet-form-blocked">
        <h2>🚫 เครดิตหมด</h2>
        <p>กรุณาเติมเครดิตเพื่อทำการโพย</p>
      </div>
    );
  }

  return (
    <div className="bet-form">
      <h2>บวกโพย</h2>

      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          onClick={() => setMode('quick')}
          className={`mode-btn ${mode === 'quick' ? 'active' : ''}`}
        >
          โหมดคีย์ด่วน
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
        >
          โหมดกดเลือก
        </button>
      </div>

      {/* Quick Key Mode */}
      {mode === 'quick' && (
        <div className="quick-key-mode">
          <textarea
            value={input}
            onChange={handleQuickKeyChange}
            placeholder="ตัวอย่าง:\n824 5040x1\n123 100x2"
            rows={6}
            className="input-area"
          />
          <p className="hint">รูปแบบ: [เลข] [ยอด]x[จำนวน] (1 บรรทัดต่อ 1 โพย)</p>
        </div>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <div className="manual-mode">
          {bets.length === 0 ? (
            <p className="no-bets">ยังไม่มีโพย</p>
          ) : (
            <div className="bets-list">
              {bets.map((bet, index) => (
                <div key={index} className="bet-row">
                  <select
                    value={bet.bet_type}
                    onChange={(e) => updateBet(index, 'bet_type', e.target.value)}
                    className="bet-type-select"
                  >
                    <option value="3d">3D (3 ตัว)</option>
                    <option value="2d">2D (2 ตัว)</option>
                  </select>
                  <input
                    type="text"
                    value={bet.lottery_number}
                    onChange={(e) => updateBet(index, 'lottery_number', e.target.value)}
                    placeholder="เลข"
                    maxLength={3}
                    className="input-number"
                  />
                  <input
                    type="number"
                    value={bet.amount}
                    onChange={(e) => updateBet(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="ยอด"
                    min="1"
                    className="input-amount"
                  />
                  <input
                    type="number"
                    value={bet.quantity}
                    onChange={(e) => updateBet(index, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder="จำนวน"
                    min="1"
                    className="input-quantity"
                  />
                  <span className="total-amount">
                    {bettingService.formatCurrency(bet.total_amount)}
                  </span>
                  <button
                    onClick={() => removeBet(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={addManualBet} className="btn-add-bet">
            + เพิ่มโพย
          </button>
        </div>
      )}

      {/* Bet Summary */}
      {bets.length > 0 && (
        <div className="bet-summary">
          <div className="summary-item">
            <span>จำนวนโพย:</span>
            <strong>{bets.length} รายการ</strong>
          </div>
          <div className="summary-item">
            <span>รวมยอด:</span>
            <strong>{bettingService.formatCurrency(totalAmount)} THB</strong>
          </div>
          <div className="summary-item">
            <span>เครดิตคงเหลือ:</span>
            <strong
              className={userCredit - totalAmount < 0 ? 'error' : ''}
            >
              {bettingService.formatCurrency(userCredit - totalAmount)} THB
            </strong>
          </div>
        </div>
      )}

      {/* Warnings (Restricted Numbers) */}
      {warnings.length > 0 && (
        <div className="warnings">
          <h4>⚠️ เลขอั้น/จ่ายลด</h4>
          {warnings.map((warning, i) => (
            <CreditAlert
              key={i}
              type="warning"
              message={`เลข ${warning.number} (${warning.type}) จ่าย ${(warning.rate * 100).toFixed(0)}%`}
            />
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <div key={i} className="error-item">❌ {error}</div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="form-actions">
        <button
          onClick={() => {
            setInput('');
            setBets([]);
            setErrors([]);
            setWarnings([]);
          }}
          className="btn-secondary"
          disabled={isSubmitting || bets.length === 0}
        >
          ล้าง
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary"
          disabled={isSubmitting || bets.length === 0 || totalAmount > userCredit}
        >
          {isSubmitting ? 'กำลังบวก...' : 'บวกโพย'}
        </button>
      </div>
    </div>
  );
};

export default BetForm;
