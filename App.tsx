import React, { useState, useMemo, useEffect } from 'react';
import { Member, Contribution } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import MemberList from './components/MemberList';
import ContributionLog from './components/ContributionLog';
import PayBalanceModal from './components/PayBalanceModal';
import EditContributionModal from './components/EditContributionModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import DataTablePage from './components/DataTablePage';
import { getTodayDateString, countContributionDays } from './utils/date';

type Page = 'dashboard' | 'dataTable';

const App: React.FC = () => {
  const [members, setMembers] = useLocalStorage<Member[]>('swim_fund_members', []);
  const [contributions, setContributions] = useLocalStorage<Contribution[]>('swim_fund_contributions', []);
  const [goal, setGoal] = useLocalStorage<number>('swim_fund_goal', 5000);
  const [payingMember, setPayingMember] = useState<Member | null>(null);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [contributionToDelete, setContributionToDelete] = useState<Contribution | null>(null);
  const [page, setPage] = useState<Page>('dashboard');

  useEffect(() => {
    const loadDataFromFirestore = async () => {
      try {
        const membersSnapshot = await getDocs(collection(db, 'members'));
        const loadedMembers: Member[] = membersSnapshot.docs.map(docSnap => {
          const data = docSnap.data() as Member;
          return {
            id: docSnap.id,
            name: data.name,
            joinDate: data.joinDate,
          };
        });
        if (loadedMembers.length > 0) {
          setMembers(loadedMembers);
        }

        const contributionsSnapshot = await getDocs(collection(db, 'contributions'));
        const loadedContributions: Contribution[] = contributionsSnapshot.docs.map(docSnap => {
          const data = docSnap.data() as Contribution;
          return {
            id: docSnap.id,
            memberId: data.memberId,
            date: data.date,
            amount: data.amount,
          };
        });
        if (loadedContributions.length > 0) {
          setContributions(loadedContributions);
        }

        const goalDocRef = doc(db, 'settings', 'global');
        const goalSnapshot = await getDoc(goalDocRef);
        if (goalSnapshot.exists()) {
          const goalData = goalSnapshot.data() as { goal?: number };
          if (typeof goalData.goal === 'number') {
            setGoal(goalData.goal);
          }
        }
      } catch (error) {
        console.error('Error loading data from Firestore', error);
      }
    };

    loadDataFromFirestore();
  }, [setMembers, setContributions, setGoal]);

  const CONTRIBUTION_AMOUNT = 10;

  const handleSetGoal = (newGoal: number) => {
    setGoal(newGoal);
    const goalDocRef = doc(db, 'settings', 'global');
    setDoc(goalDocRef, { goal: newGoal }).catch(error => {
      console.error('Error saving goal to Firestore', error);
    });
  };

  const fundStartDate = useMemo(() => {
    if (contributions.length === 0) {
      return new Date().toISOString();
    }

    const validContributions = contributions.filter(contribution => {
      const date = new Date(contribution.date);
      return !isNaN(date.getTime());
    });

    if (validContributions.length === 0) {
      return new Date().toISOString();
    }

    const earliestContribution = validContributions.reduce((earliest, current) => {
      return new Date(current.date) < new Date(earliest.date) ? current : earliest;
    });

    const earliestDate = new Date(earliestContribution.date);
    if (isNaN(earliestDate.getTime())) {
      return new Date().toISOString();
    }

    return earliestDate.toISOString();
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
    setDoc(doc(db, 'members', newMember.id), newMember).catch(error => {
      console.error('Error saving member to Firestore', error);
    });
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMember = () => {
    if (!memberToDelete) return;
    const memberId = memberToDelete.id;
    setMembers(members.filter(m => m.id !== memberToDelete.id));
    setContributions(contributions.filter(c => c.memberId !== memberToDelete.id));
    setMemberToDelete(null);

    deleteDoc(doc(db, 'members', memberId)).catch(error => {
      console.error('Error deleting member from Firestore', error);
    });
    contributions
      .filter(c => c.memberId === memberId)
      .forEach(c => {
        deleteDoc(doc(db, 'contributions', c.id)).catch(error => {
          console.error('Error deleting contribution from Firestore', error);
        });
      });
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
    setDoc(doc(db, 'contributions', newContribution.id), newContribution).catch(error => {
      console.error('Error saving contribution to Firestore', error);
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
    setDoc(doc(db, 'contributions', newContribution.id), newContribution).catch(error => {
      console.error('Error saving payment to Firestore', error);
    });
    setPayingMember(null);
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
      setDoc(doc(db, 'contributions', id), updatedContribution).catch(error => {
        console.error('Error updating contribution in Firestore', error);
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
      setDoc(doc(db, 'contributions', newContribution.id), newContribution).catch(error => {
        console.error('Error saving new contribution to Firestore', error);
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
    const id = contributionToDelete.id;
    setContributions(contributions.filter(c => c.id !== contributionToDelete.id));
    setContributionToDelete(null);
    deleteDoc(doc(db, 'contributions', id)).catch(error => {
      console.error('Error deleting contribution from Firestore', error);
    });
  };

  const handleImportData = (csvData: string) => {
    const lines = csvData.trim().split('\n');
    const newContributions: Contribution[] = [];
    const createdMembers: Member[] = [];
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
        createdMembers.push(member);
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

    createdMembers.forEach(member => {
      setDoc(doc(db, 'members', member.id), member).catch(error => {
        console.error('Error saving imported member to Firestore', error);
      });
    });
    newContributions.forEach(contribution => {
      setDoc(doc(db, 'contributions', contribution.id), contribution).catch(error => {
        console.error('Error saving imported contribution to Firestore', error);
      });
    });

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
              onSetGoal={handleSetGoal}
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