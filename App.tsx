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
import GroupChat from './components/GroupChat';
import { getTodayDateString, countContributionDays } from './utils/date';
import { saveContributionToFirestore, deleteContributionFromFirestore, saveMultipleContributionsToFirestore, loadContributionsFromFirestore } from './firestoreContributions';
import { loadMembersFromFirestore, saveMultipleMembersToFirestore, deleteMemberFromFirestore } from './firestoreMembers';
import { updateMemberCredentials } from './memberCredentials';
import { requestNotificationPermission, showContributionNotification } from './utils/notifications';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const [showContributionLog, setShowContributionLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDailyTrackerExpanded, setIsDailyTrackerExpanded] = useState(true);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);

  const CONTRIBUTION_AMOUNT = 10;

  const handleLogin = (username: string, role: UserRole) => {
    setCurrentUser(username);
    setUserRole(role);
    setIsLoggedIn(true);
    
    // Request notification permission on login
    requestNotificationPermission();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setUserRole('member');
    setPage('dashboard');
    // Clear localStorage
    localStorage.removeItem('fundTracker_user');
    localStorage.removeItem('fundTracker_role');
  };

  const handleMemberUpdateProfile = (displayName: string, profilePicture?: string) => {
    // Find the member by current display name and update
    const memberToUpdate = members.find(m => m.name === currentUser);
    if (memberToUpdate) {
      const oldDisplayName = memberToUpdate.name;
      updateMember(memberToUpdate.id, displayName, profilePicture);
      setCurrentUser(displayName); // Update current user to new display name
      
      // Update credentials with new display name
      updateMemberCredentials(oldDisplayName, undefined, undefined, displayName);
    }
  };

  const handleMemberUpdateCredentials = (newUsername: string, newPassword: string) => {
    // Update credentials using the update function
    const success = updateMemberCredentials(currentUser, newUsername, newPassword, undefined);
    
    if (success) {
      alert('Login credentials updated successfully! Please use your new credentials next time you log in.');
    } else {
      alert('Failed to update credentials. Please try again.');
    }
  };

  useEffect(() => {
    // Check for stored login credentials
    const storedUser = localStorage.getItem('fundTracker_user');
    const storedRole = localStorage.getItem('fundTracker_role');
    
    if (storedUser && storedRole) {
      setCurrentUser(storedUser);
      setUserRole(storedRole as UserRole);
      setIsLoggedIn(true);
      
      // Request notification permission after login
      requestNotificationPermission();
    }

    // Load data from Firestore
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
    
    const member = members.find(m => m.id === memberId);
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
    
    // Show notification
    if (member) {
      showContributionNotification(member.name, CONTRIBUTION_AMOUNT);
    }
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
    const currentMember = members.find(m => m.name === currentUser);
    
    return (
      <>
        <MemberSummaryPage 
          members={membersWithTotals} 
          currentUsername={currentUser} 
          onLogout={handleLogout}
          onUpdateProfile={handleMemberUpdateProfile}
          onUpdateCredentials={handleMemberUpdateCredentials}
          onOpenChat={() => setIsChatOpen(true)}
        />
        {isChatOpen && (
          <GroupChat
            currentUser={currentUser}
            userRole={userRole}
            userProfilePicture={currentMember?.profilePicture}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </>
    );
  }

  // Admin view - full dashboard
  return (
    <div className="min-h-screen bg-violet-50 text-gray-800">
      <Header page={page} onSetPage={setPage} onLogout={handleLogout} currentUser={currentUser} onOpenChat={() => setIsChatOpen(true)} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {page === 'dashboard' ? (
          <>
            {/* Goal and Stats Section - Collapsible */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header with Total Funds Always Visible */}
              <button
                onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm text-gray-600">Total Funds</h2>
                    <p className="text-2xl font-bold text-gray-800">₱{totalContributions.toLocaleString()}</p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 text-gray-600 transition-transform duration-200 ${isDashboardExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Collapsible Dashboard Content */}
              {isDashboardExpanded && (
                <div className="border-t border-gray-200">
                  <Dashboard
                    totalContributions={totalContributions}
                    goalAmount={goal}
                    memberCount={members.length}
                    outstandingBalance={outstandingBalance}
                    onSetGoal={setGoal}
                    onImportData={handleImportData}
                    hideTotalFunds={true}
                  />
                </div>
              )}
            </div>

            {/* Main Daily Tracker */}
            <div className="mt-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Collapsible Header */}
                <button
                  onClick={() => setIsDailyTrackerExpanded(!isDailyTrackerExpanded)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Daily Contribution Tracker</h2>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-gray-600 transition-transform duration-200 ${isDailyTrackerExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Collapsible Content */}
                {isDailyTrackerExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <DailyTracker
                      members={members}
                      contributions={contributions}
                      onAddContribution={addDailyContribution}
                      contributionAmount={CONTRIBUTION_AMOUNT}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Member List Card */}
              <button
                onClick={() => setShowMemberList(true)}
                className="group"
              >
                <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-blue-200">
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">Member List</h3>
                    <p className="text-xs text-gray-600">Manage members</p>
                  </div>
                </div>
              </button>

              {/* Contribution Log Card */}
              <button
                onClick={() => setShowContributionLog(true)}
                className="group"
              >
                <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-green-200">
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">Contribution Log</h3>
                    <p className="text-xs text-gray-600">Recent activity</p>
                  </div>
                </div>
              </button>

              {/* Data Import Card */}
              <button
                onClick={() => setShowSettings(true)}
                className="group col-span-2 lg:col-span-1"
              >
                <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-violet-200">
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="w-12 h-12 rounded-full bg-violet-100 group-hover:bg-violet-200 transition-colors flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">Import Data</h3>
                    <p className="text-xs text-gray-600">Bulk upload CSV</p>
                  </div>
                </div>
              </button>
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

      {/* Group Chat */}
      {isChatOpen && (
        <GroupChat
          currentUser={currentUser}
          userRole={userRole}
          userProfilePicture={members.find(m => m.name === currentUser)?.profilePicture}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Member List Modal */}
      {showMemberList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Member List</h2>
              <button
                onClick={() => setShowMemberList(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <MemberList
                members={members}
                memberTotals={memberTotals}
                balances={balances}
                onAddMember={addMember}
                onPayBalance={setPayingMember}
                onDeleteMember={handleDeleteMember}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contribution Log Modal */}
      {showContributionLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Contribution Log</h2>
              <button
                onClick={() => setShowContributionLog(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ContributionLog
                contributions={contributions}
                members={members}
                onEdit={setEditingContribution}
                onDelete={handleDeleteContribution}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Dashboard
                totalContributions={totalContributions}
                goalAmount={goal}
                memberCount={members.length}
                outstandingBalance={outstandingBalance}
                onSetGoal={setGoal}
                onImportData={handleImportData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
