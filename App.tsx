import React, { useState, useMemo } from 'react';
import { Member, Contribution } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import MemberList from './components/MemberList';
import ContributionLog from './components/ContributionLog';
import PayBalanceModal from './components/PayBalanceModal';
import EditContributionModal from './components/EditContributionModal';
import { getTodayDateString, countContributionDays } from './utils/date';

const App: React.FC = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('swim_fund_members', [
    { id: '1', name: 'Alice', joinDate: '2024-07-01T00:00:00.000Z' },
    { id: '2', name: 'Bob', joinDate: '2024-07-01T00:00:00.000Z' },
    { id: '3', name: 'Charlie', joinDate: '2024-07-03T00:00:00.000Z' },
    { id: '4', name: 'Diana', joinDate: new Date().toISOString() },
  ]);

  const [contributions, setContributions] = useLocalStorage<Contribution[]>('swim_fund_contributions', []);
  const [goal, setGoal] = useLocalStorage<number>('swim_fund_goal', 5000);
  const [payingMember, setPayingMember] = useState<Member | null>(null);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  
  const CONTRIBUTION_AMOUNT = 10;

  const addMember = (name: string) => {
    if (name.trim() === '' || members.some(m => m.name.toLowerCase() === name.trim().toLowerCase())) {
      alert("Member name cannot be empty or a duplicate.");
      return;
    }
    const newMember: Member = {
      id: new Date().getTime().toString(),
      name: name.trim(),
      joinDate: new Date().toISOString(),
    };
    setMembers([...members, newMember]);
  };

  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id);
    if (!memberToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${memberToDelete.name}? All of their contribution records will also be deleted. This action cannot be undone.`)) {
        setMembers(members.filter(m => m.id !== id));
        setContributions(contributions.filter(c => c.memberId !== id));
    }
  };

  const addContribution = (memberId: string) => {
    const today = getTodayDateString();
    const hasPaidToday = contributions.some(c => c.memberId === memberId && c.date === today);
    if (hasPaidToday) {
      return;
    }
    const newContribution: Contribution = {
      id: new Date().getTime().toString(),
      memberId,
      date: today,
      amount: CONTRIBUTION_AMOUNT,
    };
    setContributions([...contributions, newContribution]);
  };
  
  const recordBalancePayment = (memberId: string, amount: number) => {
    if (amount <= 0) {
      alert("Payment amount must be positive.");
      return;
    }
    const newContribution: Contribution = {
      id: new Date().getTime().toString(),
      memberId,
      date: getTodayDateString(),
      amount: amount,
    };
    setContributions([...contributions, newContribution]);
    setPayingMember(null);
  };

  const handleUpdateContribution = (id: string, newAmount: number, newDate: string, newMemberId: string) => {
      setContributions(
          contributions.map(c => 
              c.id === id ? { ...c, amount: newAmount, date: newDate, memberId: newMemberId } : c
          )
      );
      setEditingContribution(null);
  };

  const handleDeleteContribution = (id: string) => {
      if (window.confirm('Are you sure you want to delete this contribution record? This action cannot be undone.')) {
          setContributions(contributions.filter(c => c.id !== id));
      }
  };

  const handleImportData = (csvData: string) => {
    const lines = csvData.trim().split('\n');
    const newContributions: Contribution[] = [];
    let updatedMembers = [...members];
    const memberNameMap = new Map(updatedMembers.map(m => [m.name.toLowerCase(), m]));

    const linesToProcess = lines.filter(line => line.split(',').length === 3 && line.trim() !== '');

    if (linesToProcess.length === 0 && lines.length > 0) {
        alert("Invalid data format. Please use 'Date,Member Name,Amount'.");
        return;
    }

    let invalidLines = 0;

    linesToProcess.forEach((line, index) => {
        const [dateStr, name, amountStr] = line.split(',').map(s => s.trim());
        
        const amount = parseFloat(amountStr);
        const date = new Date(dateStr);

        if (isNaN(amount) || amount <= 0 || !dateStr || isNaN(date.getTime())) {
            console.warn(`Skipping invalid data on line: ${line}`);
            invalidLines++;
            return;
        }
        
        const formattedDate = date.toISOString().split('T')[0];

        let member = memberNameMap.get(name.toLowerCase());
        
        if (!member) {
            member = {
                id: `${new Date().getTime()}-${name}`,
                name: name,
                joinDate: new Date(date).toISOString(), // Set join date to first contribution
            };
            updatedMembers.push(member);
            memberNameMap.set(name.toLowerCase(), member);
        }

        const contributionExists = contributions.some(c => c.memberId === member!.id && c.date === formattedDate) ||
                                   newContributions.some(c => c.memberId === member!.id && c.date === formattedDate);

        if (!contributionExists) {
            newContributions.push({
                id: `${new Date().getTime()}-${index}`,
                memberId: member!.id,
                date: formattedDate,
                amount: amount,
            });
        }
    });
    
    const newMembersCount = updatedMembers.length - members.length;
    if (newMembersCount > 0) {
        setMembers(updatedMembers);
    }
    if (newContributions.length > 0) {
        setContributions([...contributions, ...newContributions]);
    }

    let alertMessage = '';
    if (newContributions.length > 0 || newMembersCount > 0) {
        alertMessage += `${newContributions.length} contributions imported successfully!`;
        if (newMembersCount > 0) {
            alertMessage += ` ${newMembersCount} new member(s) were added.`;
        }
    } else {
        alertMessage = "No new data was imported. The contributions might already exist or the data was invalid.";
    }

    if (invalidLines > 0) {
        alertMessage += `\n(${invalidLines} line(s) with invalid data were skipped.)`;
    }

    alert(alertMessage);
  };

  const { totalContributions, memberTotals, balances, outstandingBalance } = useMemo(() => {
    const total = contributions.reduce((acc, curr) => acc + curr.amount, 0);
    
    const totals = new Map<string, number>();
    members.forEach(member => totals.set(member.id, 0));
    contributions.forEach(c => {
      totals.set(c.memberId, (totals.get(c.memberId) || 0) + c.amount);
    });

    const today = getTodayDateString();
    const balancesMap = new Map<string, number>();
    let outstanding = 0;

    members.forEach(member => {
        const contributionDays = countContributionDays(member.joinDate, today);
        const expected = contributionDays * CONTRIBUTION_AMOUNT;
        const actual = totals.get(member.id) || 0;
        const balance = expected - actual;
        balancesMap.set(member.id, balance);
        if (balance > 0) {
            outstanding += balance;
        }
    });

    return { 
        totalContributions: total, 
        memberTotals: totals,
        balances: balancesMap,
        outstandingBalance: outstanding
    };
  }, [contributions, members]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Dashboard
          totalContributions={totalContributions}
          goalAmount={goal}
          memberCount={members.length}
          outstandingBalance={outstandingBalance}
          onSetGoal={setGoal}
          onImportData={handleImportData}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DailyTracker
              members={members}
              contributions={contributions}
              onAddContribution={addContribution}
              contributionAmount={CONTRIBUTION_AMOUNT}
            />
          </div>
          <div className="space-y-8">
            <MemberList
              members={members}
              memberTotals={memberTotals}
              balances={balances}
              onAddMember={addMember}
              onPayBalance={setPayingMember}
              onDeleteMember={handleDeleteMember}
            />
            <ContributionLog
              contributions={contributions}
              members={members}
              onEdit={setEditingContribution}
              onDelete={handleDeleteContribution}
            />
          </div>
        </div>
      </main>
      
      {payingMember && (
        <PayBalanceModal
            isOpen={!!payingMember}
            onClose={() => setPayingMember(null)}
            member={payingMember}
            balanceOwed={balances.get(payingMember.id) || 0}
            onRecordPayment={recordBalancePayment}
        />
      )}

      {editingContribution && (
        <EditContributionModal
            isOpen={!!editingContribution}
            onClose={() => setEditingContribution(null)}
            contribution={editingContribution}
            members={members}
            onSave={handleUpdateContribution}
        />
      )}

    </div>
  );
};

export default App;