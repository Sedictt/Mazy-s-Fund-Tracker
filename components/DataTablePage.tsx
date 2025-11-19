import React, { useState, useMemo } from 'react';
import { Contribution, Member } from '../types';
import Card from './common/Card';

interface DataTablePageProps {
  contributions: Contribution[];
  members: Member[];
  onSaveContribution: (id: string, amount: number, date: string, memberId: string) => void;
  onDeleteContribution: (contribution: Contribution) => void;
  onAddNewContribution: () => void;
  onEditContribution: (contribution: Contribution) => void;
}

const DataTablePage: React.FC<DataTablePageProps> = ({
  contributions,
  members,
  onSaveContribution,
  onDeleteContribution,
  onAddNewContribution,
  onEditContribution,
}) => {
  // --- STATE & LOGIC FOR DESKTOP PIVOT TABLE ---
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
      if (matrix.has(c.memberId)) {
        matrix.get(c.memberId)!.set(c.date, c);
      }
    });

    return { uniqueDates: sortedDates, contributionMatrix: matrix };
  }, [contributions, members]);

  const handleCellClick = (memberId: string, date: string, contribution: Contribution | undefined) => {
    if (editingCell?.memberId === memberId && editingCell?.date === date) return;
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

    if (isNewEntry) {
        // For new entries, create a contribution for this specific date and member
        onSaveContribution('', newAmount, date, memberId);
    } else if (isUpdate) {
        // For updates, use the ORIGINAL contribution's date and memberId to avoid moving it
        onSaveContribution(originalContribution.id, newAmount, originalContribution.date, originalContribution.memberId);
    } else if (isDeletion) {
        onDeleteContribution(originalContribution);
    }
    
    setEditingCell(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
    else if (event.key === 'Escape') setEditingCell(null);
  };
  
  // --- STATE & LOGIC FOR MOBILE CARD VIEW & EXPORT ---
  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m.name])), [members]);
  
  const contributionsByDate = useMemo(() => {
    const grouped = contributions.reduce((acc: Map<string, Contribution[]>, c: Contribution) => {
        if (!acc.has(c.date)) {
            acc.set(c.date, []);
        }
        acc.get(c.date)!.push(c);
        return acc;
    }, new Map<string, Contribution[]>());
    
    // FIX: Explicitly type `a` and `b` as `string` for the sort compare function to resolve a TypeScript type inference issue.
    const sortedDates = Array.from(grouped.keys()).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    
    return sortedDates.map(date => ({
        date,
        entries: grouped.get(date)!.sort((a, b) => (memberMap.get(a.memberId) || '').localeCompare(memberMap.get(b.memberId) || ''))
    }));
  }, [contributions, memberMap]);

  const handleExportData = () => {
    if (contributions.length === 0) {
      alert("No data to export.");
      return;
    }

    const sortedContributions = [...contributions].sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      const memberA = memberMap.get(a.memberId) || '';
      const memberB = memberMap.get(b.memberId) || '';
      return memberA.localeCompare(memberB);
    });

    const csvHeader = "Date,Member,Amount\n";
    const csvRows = sortedContributions.map(c => {
      const memberName = memberMap.get(c.memberId) || 'Unknown Member';
      const safeMemberName = `"${memberName.replace(/"/g, '""')}"`;
      return `${c.date},${safeMemberName},${c.amount}`;
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "swim-fund-contributions.csv");
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Contributions Data</h2>
          <p className="text-sm text-gray-500">Manage all contribution records.</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
           <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 border border-transparent rounded-md shadow-sm hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddNewContribution}
            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Add Record
          </button>
        </div>
      </div>

      {/* --- DESKTOP PIVOT TABLE VIEW --- */}
      <div className="hidden md:block overflow-x-auto">
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
      
      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden p-2 sm:p-4 space-y-4 bg-violet-50">
        {contributionsByDate.map(({ date, entries }) => (
          <Card key={date}>
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700">{new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {entries.map(c => (
                <li key={c.id} className="p-3 sm:p-4 flex justify-between items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{memberMap.get(c.memberId) || 'Unknown Member'}</p>
                    <p className="text-sm text-green-600 font-semibold">+₱{c.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <button
                        onClick={() => onEditContribution(c)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                        aria-label="Edit contribution"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                        onClick={() => onDeleteContribution(c)}
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                        aria-label="Delete contribution"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {contributions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                No contributions have been recorded.
            </div>
        )}
      </div>

    </Card>
  );
};

export default DataTablePage;