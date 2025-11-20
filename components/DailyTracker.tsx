import React from 'react';
import { Member, Contribution } from '../types';
import Card from './common/Card';
import { getTodayDateString } from '../utils/date';

interface DailyTrackerProps {
  members: Member[];
  contributions: Contribution[];
  onAddContribution: (memberId: string) => void;
  contributionAmount: number;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ members, contributions, onAddContribution, contributionAmount }) => {
  const today = getTodayDateString();
  const todaysContributions = new Set(
    contributions.filter(c => c.date === today).map(c => c.memberId)
  );

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">Daily Contribution Tracker</h3>
        <p className="text-gray-500 mt-1">Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {members.map((member) => {
            const hasPaid = todaysContributions.has(member.id);
            return (
              <li key={member.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0 overflow-hidden">
                        {member.profilePicture ? (
                          <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <p className="text-md font-medium text-gray-900 truncate">{member.name}</p>
                    </div>
                    {hasPaid ? (
                      <div className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-full flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Paid
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddContribution(member.id)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-violet-500 rounded-lg shadow-sm hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors flex-shrink-0"
                      >
                        Mark as Paid<span className="hidden sm:inline"> (₱{contributionAmount})</span>
                      </button>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};

export default DailyTracker;