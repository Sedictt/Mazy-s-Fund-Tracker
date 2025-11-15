
import React from 'react';
import { Member, Contribution } from '../types';
import Card from './common/Card';

interface ContributionLogProps {
  contributions: Contribution[];
  members: Member[];
}

const ContributionLog: React.FC<ContributionLogProps> = ({ contributions, members }) => {
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
            <li key={c.id} className="px-5 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{memberMap.get(c.memberId) || 'Unknown Member'}</p>
                <p className="text-sm text-gray-500">{new Date(c.date).toLocaleDateString('en-CA')}</p>
              </div>
              <span className="font-semibold text-green-600">+₱{c.amount.toLocaleString()}</span>
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
