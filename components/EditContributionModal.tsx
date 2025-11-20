import React, { useState, useEffect } from 'react';
import { Member, Contribution } from '../types';
import Modal from './common/Modal';

interface EditContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: Contribution | null; // Can be null for adding
  members: Member[];
  onSave: (id: string, amount: number, date: string, memberId: string) => void;
}

const EditContributionModal: React.FC<EditContributionModalProps> = ({ 
    isOpen, onClose, contribution, members, onSave 
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [memberId, setMemberId] = useState('');

  const isEditMode = contribution && contribution.id;

  useEffect(() => {
    if (contribution) {
      setAmount(contribution.amount.toString());
      setDate(contribution.date);
      setMemberId(contribution.memberId);
    }
  }, [contribution]);

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      alert('Please enter a valid, non-negative amount.');
      return;
    }
    if (!date) {
        alert('Please select a date.');
        return;
    }
    if (!memberId) {
        alert('Please select a member.');
        return;
    }
    onSave(contribution?.id || '', numericAmount, date, memberId);
  };
  
  const icon = isEditMode ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Contribution" : "Add Contribution"} icon={icon} zIndex="z-[60]">
      <div className="mt-4 space-y-4">
        
        <div>
            <label htmlFor="edit-member" className="block text-sm font-medium text-gray-700">Member</label>
            <select
                id="edit-member"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm rounded-md"
            >
                <option value="" disabled>Select a member</option>
                {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                ))}
            </select>
        </div>

        <div>
          <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₱</span>
            </div>
            <input
              id="edit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            />
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
          onClick={handleSave}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          {isEditMode ? 'Save Changes' : 'Add Contribution'}
        </button>
      </div>
    </Modal>
  );
};

export default EditContributionModal;
