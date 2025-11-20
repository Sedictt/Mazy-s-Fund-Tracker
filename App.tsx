import React, { useState, useMemo, useEffect } from 'react';

import { Member, Contribution } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DailyTracker from './components/DailyTracker';
import MemberList from './components/MemberList';
import MembersPage from './components/MembersPage';
import ContributionLog from './components/ContributionLog';
import PayBalanceModal from './components/PayBalanceModal';
import EditContributionModal from './components/EditContributionModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import DataTablePage from './components/DataTablePage';
import LoginPage from './components/LoginPage';
import MemberSummaryPage from './components/MemberSummaryPage';
import { getTodayDateString, countContributionDays } from './utils/date';
import { saveContributionToFirestore, deleteContributionFromFirestore, saveMultipleContributionsToFirestore, loadContributionsFromFirestore } from './firestoreContributions';
import { loadMembersFromFirestore, saveMultipleMembersToFirestore, deleteMemberFromFirestore } from './firestoreMembers';

type Page = 'dashboard' | 'dataTable' | 'members';
type UserRole = 'admin' | 'member';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [goal, setGoal] = useState<number>(5000);
  const [payingMember, setPayingMember] = useState<Member | null>(null);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [contributionToDelete, setContributionToDelete] = useState<Contribution | null>(null);
  const [page, setPage] = useState<Page>('dashboard');

  const CONTRIBUTION_AMOUNT = 10;

  const handleLogin = (username: string, role: UserRole) => {
    setCurrentUser(username);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setUserRole('member');
    setPage('dashboard');
  };

  useEffect(() => {
    loadContributionsFromFirestore()
      .then(fetched => {
        if (fetched.length > 0) {
          setContributions(fetched);
        }
      })
      .catch(error => {
        console.error('Failed to load contributions from Firestore', error);
      });
    
    loadMembersFromFirestore()
      .then(fetched => {
        if (fetched.length > 0) {
          setMembers(fetched);
        }
      })
      .catch(error => {
        console.error('Failed to load members from Firestore', error);
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
    saveMultipleMembersToFirestore([newMember]).catch(error => {
      console.error('Failed to save member to Firestore', error);
    });
  };

  const updateMember = (id: string, name: string, profilePicture?: string) => {
    const updatedMembers = members.map(m => 
      m.id === id ? { ...m, name, ...(profilePicture !== undefined && { profilePicture }) } : m
    );
    setMembers(updatedMembers);
    const updatedMember = updatedMembers.find(m => m.id === id);
    if (updatedMember) {
      saveMultipleMembersToFirestore([updatedMember]).catch(error => {
        console.error('Failed to update member in Firestore', error);
      });
    }
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
  };

  const confirmDeleteMember = () => {
    if (!memberToDelete) return;
    setMembers(members.filter(m => m.id !== memberToDelete.id));
    setContributions(contributions.filter(c => c.memberId !== memberToDelete.id));
    deleteMemberFromFirestore(memberToDelete.id).catch(error => {
      console.error('Failed to delete member from Firestore', error);
    });
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
        const newMembers = updatedMembers.slice(members.length);
        saveMultipleMembersToFirestore(newMembers).catch(error => {
          console.error('Failed to save imported members to Firestore', error);
        });
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

  // Prepare members with totals and balances for member view
  const membersWithTotals = members.map(member => ({
    ...member,
    totalContributions: memberTotals.get(member.id) || 0,
    balance: balances.get(member.id) || 0,
  }));

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show member summary page for non-admin users
  if (userRole === 'member') {
    return <MemberSummaryPage members={membersWithTotals} currentUsername={currentUser} onLogout={handleLogout} />;
  }

  // Admin view - full dashboard
  return (
    <div className="min-h-screen bg-violet-50 text-gray-800">
      <Header page={page} onSetPage={setPage} onLogout={handleLogout} currentUser={currentUser} />
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
        ) : page === 'members' ? (
          <MembersPage
            members={members}
            onUpdateMember={updateMember}
            onDeleteMember={handleDeleteMember}
            onAddMember={addMember}
          />
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
