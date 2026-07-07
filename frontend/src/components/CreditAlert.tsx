'use client';

import React from 'react';
import './CreditAlert.css';

interface CreditAlertProps {
  type: 'low_credit' | 'zero_credit' | 'warning';
  message: string;
  userId?: number;
  onResolve?: () => void;
  onAdjustCredit?: () => void;
}

const CreditAlert: React.FC<CreditAlertProps> = ({
  type,
  message,
  onResolve,
  onAdjustCredit
}) => {
  const getIcon = () => {
    switch (type) {
      case 'zero_credit':
        return '🚨';
      case 'low_credit':
        return '⚠️';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getClassName = () => {
    switch (type) {
      case 'zero_credit':
        return 'credit-alert alert-danger';
      case 'low_credit':
        return 'credit-alert alert-warning';
      case 'warning':
        return 'credit-alert alert-warning';
      default:
        return 'credit-alert alert-info';
    }
  };

  return (
    <div className={getClassName()}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
      </div>
      {onAdjustCredit && type === 'zero_credit' && (
        <button className="btn-adjust" onClick={onAdjustCredit}>
          เติมเครดิต
        </button>
      )}
      {onResolve && (
        <button className="btn-close" onClick={onResolve}>✕</button>
      )}
    </div>
  );
};

export default CreditAlert;
