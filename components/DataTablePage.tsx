import React, { useState, useMemo } from 'react';
import { Contribution, Member } from '../types';
import Card from './common/Card';

interface DataTablePageProps {
  contributions: Contribution[];
  members: Member[];
  onSaveContribution: (id: string, amount: number, date: string, memberId: string) => void;
  onDeleteContribution: (contribution: Contribution) => void;
  onAddNewContribution: () => void;
}

const DataTablePage: React.FC<DataTablePageProps> = ({
  contributions,
  members,
  onSaveContribution,
  onDeleteContribution,
  onAddNewContribution
}) => {
  const [editingCell, setEditingCell] = useState<{ memberId: string; date: string } | null>(null);
  const [cellValue, setCellValue] = useState('');

  const { uniqueDates, contributionMatrix } = useMemo(() => {
    const dates = new Set<string>();
    contributions.forEach(c => dates.add(c.date));
    const sortedDates = Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const matrix = new Map<string, Map<string, Contribution>>();
    members.forEach(m => {
        matrix.set(m.id, new Map<string, Contribution>());
    });
    contributions.forEach(c => {
      // Ensure member exists in the matrix before setting
      if (matrix.has(c.memberId)) {
        matrix.get(c.memberId)!.set(c.date, c);
      }
    });

    return { uniqueDates: sortedDates, contributionMatrix: matrix };
  }, [contributions, members]);

  const handleCellClick = (memberId: string, date: string, contribution: Contribution | undefined) => {
    if (editingCell?.memberId === memberId && editingCell?.date === date) {
        return; // Already editing this cell
    }
    setEditingCell({ memberId, date });
    setCellValue(contribution ? contribution.amount.toString() : '');
  };
  
  const handleCellBlur = () => {
    if (!editingCell) return;

    const { memberId, date } = editingCell;
    const originalContribution = contributionMatrix.get(memberId)?.get(date);
    const newAmount = parseFloat(cellValue);

    const isNewEntry = !originalContribution && !isNaN(newAmount) && newAmount > 0;
    const isDeletion = originalContribution && (isNaN(newAmount) || newAmount <= 0);
    const isUpdate = originalContribution && !isNaN(newAmount) && newAmount > 0 && originalContribution.amount !== newAmount;

    if (isNewEntry || isUpdate) {
        onSaveContribution(originalContribution?.id || '', newAmount, date, memberId);
    } else if (isDeletion) {
        onDeleteContribution(originalContribution);
    }
    
    setEditingCell(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
        (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
        setEditingCell(null);
    }
  };


  return (
    <Card>
      <div className="p-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Contributions Grid</h2>
          <p className="text-sm text-gray-500">Click any cell to edit contribution amounts.</p>
        </div>
        <button
          onClick={onAddNewContribution}
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Add Record
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="sticky left-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              {uniqueDates.map(date => (
                <th key={date} scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {new Date(date).toLocaleDateString('en-CA', { timeZone: 'UTC' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="sticky left-0 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                {uniqueDates.map(date => {
                  const contribution = contributionMatrix.get(member.id)?.get(date);
                  const isEditing = editingCell?.memberId === member.id && editingCell?.date === date;
                  
                  return (
                    <td 
                      key={date} 
                      className="px-2 py-1 whitespace-nowrap text-sm text-center cursor-pointer"
                      onClick={() => handleCellClick(member.id, date, contribution)}
                    >
                      {isEditing ? (
                        <input
                          type="number"
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-20 text-center border border-violet-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                        />
                      ) : (
                        <span className={`inline-block w-full h-full p-2 rounded-md ${contribution ? 'text-gray-700' : 'text-gray-300'} hover:bg-violet-50`}>
                           {contribution ? `₱${contribution.amount}` : '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataTablePage;
