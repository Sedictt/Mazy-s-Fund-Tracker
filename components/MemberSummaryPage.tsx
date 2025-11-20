import React, { useState } from 'react';
import Card from './common/Card';
import { Member } from '../types';
import MemberProfileSettings from './MemberProfileSettings';

interface MemberSummaryPageProps {
  members: Member[];
  currentUsername: string;
  onLogout: () => void;
  onUpdateProfile: (displayName: string, profilePicture?: string) => void;
  onUpdateCredentials: (newUsername: string, newPassword: string) => void;
  onOpenChat: () => void;
}

const MemberSummaryPage: React.FC<MemberSummaryPageProps> = ({ 
  members, 
  currentUsername, 
  onLogout,
  onUpdateProfile,
  onUpdateCredentials,
  onOpenChat
}) => {
  const [showSettings, setShowSettings] = useState(false);
  // Find current member
  const currentMember = members.find(m => m.name.toLowerCase() === currentUsername.toLowerCase());
  
  // Calculate summary stats
  const totalMembers = members.length;
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributions, 0);
  const averageContribution = totalMembers > 0 ? totalContributions / totalMembers : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <img src="/logo.png" alt="Mazy Fund Tracker" className="h-10 sm:h-12 w-auto" />
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-600">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">{currentUsername}</p>
              </div>
              <button
                onClick={onOpenChat}
                className="p-2 rounded-md text-gray-600 hover:bg-violet-100 transition-colors"
                title="Group Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-violet-100 transition-colors"
                title="Profile Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Fund Summary</h1>
          <p className="text-sm sm:text-base text-gray-600">Overview of contributions and balances</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Members</div>
              <div className="text-2xl sm:text-3xl font-bold text-violet-600">{totalMembers}</div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Contributions</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">₱{totalContributions.toFixed(2)}</div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Average Contribution</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">₱{averageContribution.toFixed(2)}</div>
            </div>
          </Card>
        </div>

        {/* Your Profile */}
        {currentMember && (
          <Card className="mb-6">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {currentMember.profilePicture ? (
                  <img
                    src={currentMember.profilePicture}
                    alt={currentMember.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-violet-200"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-200 flex items-center justify-center border-4 border-violet-300">
                    <span className="text-xl sm:text-2xl font-bold text-violet-700">
                      {currentMember.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{currentMember.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Contributions</p>
                      <p className="text-base sm:text-lg font-bold text-green-600">₱{currentMember.totalContributions.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Current Balance</p>
                      <p className="text-base sm:text-lg font-bold text-blue-600">₱{currentMember.balance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* All Members List */}
        <Card>
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">All Members</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Member</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Contributions</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-violet-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2">
                          {member.profilePicture ? (
                            <img
                              src={member.profilePicture}
                              alt={member.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-violet-700">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">{member.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-green-600 whitespace-nowrap">
                        ₱{member.totalContributions.toFixed(2)}
                      </td>
                      <td className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-blue-600 whitespace-nowrap">
                        ₱{member.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Note */}
        <div className="mt-6 p-4 bg-violet-100 rounded-lg">
          <p className="text-sm text-violet-800 text-center">
            💡 For detailed contributions and management features, please contact the administrator.
          </p>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showSettings && currentMember && (
        <MemberProfileSettings
          currentUsername={currentUsername}
          displayName={currentMember.name}
          profilePicture={currentMember.profilePicture}
          onUpdateProfile={onUpdateProfile}
          onUpdateCredentials={onUpdateCredentials}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default MemberSummaryPage;
