import React, { useState, useMemo, useEffect } from 'react';

import { Member, Contribution } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import MemberList from './components/MemberList';
import ContributionLog from './components/ContributionLog';
import PayBalanceModal from './components/PayBalanceModal';
import EditContributionModal from './components/EditContributionModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import DataTablePage from './components/DataTablePage';
import { getTodayDateString, countContributionDays } from './utils/date';
import { saveContributionToFirestore, deleteContributionFromFirestore, saveMultipleContributionsToFirestore, loadContributionsFromFirestore } from './firestoreContributions';

type Page = 'dashboard' | 'dataTable';

const App: React.FC = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('swim_fund_members', [
    { id: '1', name: 'Margaux', joinDate: '2025-11-04T00:00:00.000Z' },
    { id: '2', name: 'Lorraine', joinDate: '2025-11-04T00:00:00.000Z' },
    { id: '3', name: 'Raineer', joinDate: '2025-11-04T00:00:00.000Z' },
    { id: '4', name: 'Deign', joinDate: '2025-11-04T00:00:00.000Z' },
    { id: '5', name: 'Jv', joinDate: '2025-11-04T00:00:00.000Z' },
    { id: '6', name: 'Bryan', joinDate: '2025-11-04T00:00:00.000Z' },
  ]);

  const [contributions, setContributions] = useLocalStorage<Contribution[]>('swim_fund_contributions', [
    { id: 'c1', memberId: '1', date: '2025-11-04', amount: 10 },
    { id: 'c2', memberId: '2', date: '2025-11-04', amount: 10 },
    { id: 'c3', memberId: '3', date: '2025-11-04', amount: 10 },
    { id: 'c4', memberId: '4', date: '2025-11-04', amount: 10 },
    { id: 'c5', memberId: '5', date: '2025-11-04', amount: 10 },
    { id: 'c6', memberId: '6', date: '2025-11-04', amount: 10 },
    { id: 'c7', memberId: '1', date: '2025-11-05', amount: 10 },
    { id: 'c8', memberId: '2', date: '2025-11-05', amount: 10 },
    { id: 'c9', memberId: '3', date: '2025-11-05', amount: 10 },
    { id: 'c10', memberId: '4', date: '2025-11-05', amount: 10 },
    { id: 'c11', memberId: '5', date: '2025-11-05', amount: 10 },
    { id: 'c12', memberId: '6', date: '2025-11-05', amount: 10 },
    { id: 'c13', memberId: '1', date: '2025-11-06', amount: 10 },
    { id: 'c14', memberId: '2', date: '2025-11-06', amount: 10 },
    { id: 'c15', memberId: '3', date: '2025-11-06', amount: 10 },
    { id: 'c16', memberId: '4', date: '2025-11-06', amount: 10 },
    { id: 'c17', memberId: '5', date: '2025-11-06', amount: 10 },
    { id: 'c18', memberId: '6', date: '2025-11-06', amount: 10 },
    { id: 'c19', memberId: '1', date: '2025-11-08', amount: 10 },
    { id: 'c20', memberId: '3', date: '2025-11-08', amount: 10 },
    { id: 'c21', memberId: '4', date: '2025-11-08', amount: 10 },
    { id: 'c22', memberId: '6', date: '2025-11-08', amount: 10 },
    { id: 'c23', memberId: '1', date: '2025-11-11', amount: 10 },
    { id: 'c24', memberId: '3', date: '2025-11-11', amount: 10 },
    { id: 'c25', memberId: '4', date: '2025-11-11', amount: 10 },
    { id: 'c26', memberId: '6', date: '2025-11-11', amount: 10 },
    { id: 'c27', memberId: '1', date: '2025-11-12', amount: 10 },
    { id: 'c28', memberId: '3', date: '2025-11-12', amount: 10 },
    { id: 'c29', memberId: '4', date: '2025-11-12', amount: 10 },
    { id: 'c30', memberId: '6', date: '2025-11-12', amount: 10 },
    { id: 'c31', memberId: '1', date: '2025-11-13', amount: 10 },
    { id: 'c32', memberId: '3', date: '2025-11-13', amount: 10 },
    { id: 'c33', memberId: '4', date: '2025-11-13', amount: 10 },
    { id: 'c34', memberId: '6', date: '2025-11-13', amount: 10 },
    { id: 'c35', memberId: '1', date: '2025-11-15', amount: 10 },
    { id: 'c36', memberId: '3', date: '2025-11-15', amount: 10 },
    { id: 'c37', memberId: '4', date: '2025-11-15', amount: 10 },
    { id: 'c38', memberId: '6', date: '2025-11-15', amount: 10 },
  ]);
  const [goal, setGoal] = useLocalStorage<number>('swim_fund_goal', 5000);
  const [payingMember, setPayingMember] = useState<Member | null>(null);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [contributionToDelete, setContributionToDelete] = useState<Contribution | null>(null);
  const [page, setPage] = useState<Page>('dashboard');

  const CONTRIBUTION_AMOUNT = 10;

  useEffect(() => {
    loadContributionsFromFirestore()
      .then(async fetched => {
        if (fetched.length > 0) {
          setContributions(fetched);
        } else if (contributions.length > 0) {
          try {
            await saveMultipleContributionsToFirestore(contributions);
          } catch (syncError) {
            console.error('Failed to sync local contributions to Firestore', syncError);
          }
        }
      })
      .catch(error => {
        console.error('Failed to load contributions from Firestore', error);
      });
  }, []);

  const fundStartDate = useMemo(() => {
    if (contributions.length === 0) {
      return new Date().toISOString();
    }
    const earliestDate = contributions.reduce((earliest, current) => {
      return new Date(current.date) < new Date(earliest.date) ? current : earliest;
    });
    return new Date(earliestDate.date).toISOString();
  }, [contributions]);

  const addMember = (name: string) => {
    if (name.trim() === '' || members.some(m => m.name.toLowerCase() === name.trim().toLowerCase())) {
      alert("Member name cannot be empty or a duplicate.");
      return;
    }
    const newMember: Member = {
      id: new Date().getTime().toString(),
      name: name.trim(),
      joinDate: fundStartDate,
    };
    setMembers([...members, newMember]);
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMember = () => {
    if (!memberToDelete) return;
    setMembers(members.filter(m => m.id !== memberToDelete.id));
    setContributions(contributions.filter(c => c.memberId !== memberToDelete.id));
    setMemberToDelete(null);
  };

  const addDailyContribution = (memberId: string) => {
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
    saveContributionToFirestore(newContribution).catch(error => {
      console.error('Failed to save contribution to Firestore', error);
    });
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
    saveContributionToFirestore(newContribution).catch(error => {
      console.error('Failed to save balance payment to Firestore', error);
    });
  };

  const handleSaveContribution = (id: string, newAmount: number, newDate: string, newMemberId: string) => {
      if (id) {
        // Editing existing contribution
        const updatedContribution: Contribution = {
          id,
          memberId: newMemberId,
          date: newDate,
          amount: newAmount,
        };
        setContributions(
            contributions.map(c => 
                c.id === id ? updatedContribution : c
            )
        );
        saveContributionToFirestore(updatedContribution).catch(error => {
          console.error('Failed to save contribution to Firestore', error);
        });
      } else {
        // Adding new contribution
        const newContribution: Contribution = {
          id: new Date().getTime().toString(),
          memberId: newMemberId,
          date: newDate,
          amount: newAmount,
        };
        setContributions([...contributions, newContribution]);
        saveContributionToFirestore(newContribution).catch(error => {
          console.error('Failed to save contribution to Firestore', error);
        });
      }
      setEditingContribution(null);
  };
  
  const handleOpenAddContributionModal = () => {
    setEditingContribution({
      id: '', // Empty ID signifies a new entry
      memberId: members[0]?.id || '',
      date: getTodayDateString(),
      amount: CONTRIBUTION_AMOUNT,
    });
  };

  const handleDeleteContribution = (contribution: Contribution) => {
      setContributionToDelete(contribution);
  };

  const confirmDeleteContribution = () => {
    if (!contributionToDelete) return;
    setContributions(contributions.filter(c => c.id !== contributionToDelete.id));
    deleteContributionFromFirestore(contributionToDelete.id).catch(error => {
      console.error('Failed to delete contribution from Firestore', error);
    });
    setContributionToDelete(null);
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
        saveMultipleContributionsToFirestore(newContributions).catch(error => {
            console.error('Failed to save imported contributions to Firestore', error);
        });
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
    <div className="min-h-screen bg-violet-50 text-gray-800">
      <Header page={page} onSetPage={setPage} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {page === 'dashboard' ? (
          <>
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
                  onAddContribution={addDailyContribution}
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
          </>
        ) : (
          <DataTablePage
            contributions={contributions}
            members={members}
            onSaveContribution={handleSaveContribution}
            onDeleteContribution={handleDeleteContribution}
            onAddNewContribution={handleOpenAddContributionModal}
            onEditContribution={setEditingContribution}
          />
        )}
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
            onSave={handleSaveContribution}
        />
      )}

      {memberToDelete && (
        <ConfirmationModal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={confirmDeleteMember}
          title={`Delete ${memberToDelete.name}?`}
          message="This will permanently delete the member and all of their contribution records. This action cannot be undone."
        />
      )}
      
      {contributionToDelete && (
          <ConfirmationModal
            isOpen={!!contributionToDelete}
            onClose={() => setContributionToDelete(null)}
            onConfirm={confirmDeleteContribution}
            title="Delete Contribution?"
            message="Are you sure you want to delete this contribution record? This action cannot be undone."
          />
      )}
    </div>
  );
};

export default App;