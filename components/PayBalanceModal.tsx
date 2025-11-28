import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import Modal from './common/Modal';

interface PayBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  balanceOwed: number;
  onRecordPayment: (memberId: string, amount: number) => void;
}

const PayBalanceModal: React.FC<PayBalanceModalProps> = ({ isOpen, onClose, member, balanceOwed, onRecordPayment }) => {
  const [amount, setAmount] = useState(balanceOwed.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(balanceOwed > 0 ? balanceOwed.toString() : '');
      setError('');
    }
  }, [isOpen, balanceOwed]);

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (paymentAmount > balanceOwed) {
      if (!confirm(`This amount (₱${paymentAmount.toLocaleString()}) is more than what is owed. Are you sure you want to record this payment?`)) {
        return;
      }
    }
    onRecordPayment(member.id, paymentAmount);
  };

  const paymentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment for ${member.name}`} icon={paymentIcon}>
      <div className="mt-4 space-y-4">
        <p className="text-sm text-gray-600">
          Current outstanding balance: <strong className="text-red-600">₱{balanceOwed.toLocaleString()}</strong>
        </p>
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">Payment Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₱</span>
            </div>
            <input
              id="paymentAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePayment}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Record Payment
        </button>
      </div>
    </Modal>
  );
};

export default PayBalanceModal;