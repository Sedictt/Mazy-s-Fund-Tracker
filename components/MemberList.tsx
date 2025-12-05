import React, { useState } from 'react';
import { Member, Contribution } from '../types';
import Card from './common/Card';
import Modal from './common/Modal';
import { calculateStreak } from '../utils/gamification';

interface MemberListProps {
  members: Member[];
  contributions: Contribution[];
  memberTotals: Map<string, number>;
  balances: Map<string, number>;
  onAddMember: (name: string) => void;
  onPayBalance: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
  onResetPassword: (member: Member, newPassword: string) => Promise<void>;
}

const BalanceStatus: React.FC<{ balance: number }> = ({ balance }) => {
  if (balance <= 0) {
    return (
      <div className="flex items-center text-sm text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Up to date</span>
      </div>
    );
  }
  return (
    <span className="text-sm text-red-600 font-semibold">
      Owes ₱{balance.toLocaleString()}
    </span>
  );
};


const MemberList: React.FC<MemberListProps> = ({ members, contributions, memberTotals, balances, onAddMember, onPayBalance, onDeleteMember, onResetPassword }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [resetPasswordMember, setResetPasswordMember] = useState<Member | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleAddMember = () => {
    onAddMember(newMemberName);
    setNewMemberName('');
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <div className="p-5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Members</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full text-violet-600 bg-violet-100 hover:bg-violet-200"
            aria-label="Add new member"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {members.map((member) => {
            const balance = balances.get(member.id) || 0;
            return (
              <li key={member.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 truncate">{member.name}</p>
                        {(() => {
                          const streak = calculateStreak(member.id, contributions);
                          return (
                            <span
                              className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${streak > 0
                                ? 'text-orange-600 bg-orange-100'
                                : 'text-gray-400 bg-gray-100 grayscale'
                                }`}
                              title={`${streak} Day Streak`}
                            >
                              🔥 {streak}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-sm text-gray-500">
                        Total Contributed: ₱{(memberTotals.get(member.id) || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    <div className="text-right">
                      <BalanceStatus balance={balance} />
                    </div>
                    <button
                      onClick={() => onDeleteMember(member)}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors ml-1"
                      aria-label={`Delete ${member.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setResetPasswordMember(member)}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors ml-1"
                      aria-label={`Reset Password for ${member.name}`}
                      title="Reset Password"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 19.464a2.414 2.414 0 01-1.707.707H8.414a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 01-.293-.707V16.414a2.414 2.414 0 01.707-1.707l1.414-1.414a1 1 0 00.293-.707V11.586a1 1 0 01.293-.707L13 8.586A6 6 0 0115 7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {balance > 0 && (
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => onPayBalance(member)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-violet-500 rounded-full shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                      Record Payment
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
        <div className="mt-4">
          <label htmlFor="memberName" className="block text-sm font-medium text-gray-700">Member Name</label>
          <input
            id="memberName"
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddMember}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Add Member
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!resetPasswordMember} onClose={() => setResetPasswordMember(null)} title={`Reset Password for ${resetPasswordMember?.name}`}>
        <div className="mt-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="newPassword"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            placeholder="Enter new password"
          />
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setResetPasswordMember(null);
              setNewPassword('');
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              if (resetPasswordMember && newPassword) {
                await onResetPassword(resetPasswordMember, newPassword);
                setResetPasswordMember(null);
                setNewPassword('');
              }
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MemberList;