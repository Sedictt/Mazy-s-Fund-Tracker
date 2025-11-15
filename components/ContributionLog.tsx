import React from 'react';
import { Member, Contribution } from '../types';
import Card from './common/Card';

interface ContributionLogProps {
  contributions: Contribution[];
  members: Member[];
  onEdit: (contribution: Contribution) => void;
  onDelete: (id: string) => void;
}

const ContributionLog: React.FC<ContributionLogProps> = ({ contributions, members, onEdit, onDelete }) => {
  const memberMap = new Map(members.map(m => [m.id, m.name]));
  const sortedContributions = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
      </div>
      {sortedContributions.length > 0 ? (
        <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {sortedContributions.slice(0, 15).map(c => (
            <li key={c.id} className="group relative px-5 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{memberMap.get(c.memberId) || 'Unknown Member'}</p>
                <p className="text-sm text-gray-500">{new Date(c.date).toLocaleDateString('en-CA')}</p>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-green-600 transition-opacity group-hover:opacity-0">
                  +₱{c.amount.toLocaleString()}
                </span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(c)}
                    className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                    aria-label="Edit contribution"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                    aria-label="Delete contribution"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 pb-5 text-gray-500">No contributions have been made yet.</p>
      )}
    </Card>
  );
};

export default ContributionLog;