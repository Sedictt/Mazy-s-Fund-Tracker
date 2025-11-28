import React, { useState } from 'react';
import Card from './common/Card';
import { Member, WishlistItem } from '../types';
import MemberProfileSettings from './MemberProfileSettings';
import Wishlist from './Wishlist';
import AnnouncementsModal from './AnnouncementsModal';


interface MemberSummaryPageProps {
  members: Member[];
  currentUsername: string;
  onLogout: () => void;
  onUpdateProfile: (displayName: string, profilePicture?: string) => void;
  onUpdateCredentials: (newUsername: string, newPassword: string) => void;
  onOpenChat: () => void;
  unreadCount?: number;
  wishlistItems: WishlistItem[];
  onAddWishlistItem: (itemName: string, price: number) => void;
  onDeleteWishlistItem: (id: string) => void;
  onEditWishlistItem: (item: WishlistItem) => void;
}

const MemberSummaryPage: React.FC<MemberSummaryPageProps> = ({
  members,
  currentUsername,
  onLogout,
  onUpdateProfile,
  onUpdateCredentials,
  onOpenChat,
  unreadCount = 0,
  wishlistItems,
  onAddWishlistItem,
  onDeleteWishlistItem,
  onEditWishlistItem
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);

  // Find current member
  const currentMember = members.find(m => m.name.toLowerCase() === currentUsername.toLowerCase());

  // Calculate summary stats
  const totalMembers = members.length;
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributions, 0);
  const averageContribution = totalMembers > 0 ? totalContributions / totalMembers : 0;

  React.useEffect(() => {
    const campaignEndDate = new Date('2025-12-05').getTime(); // 7 days from Nov 27
    const now = Date.now();
    const hasSeenAnnouncement = localStorage.getItem(`hasSeenWishlistAnnouncement_${currentUsername}`);

    if (now < campaignEndDate && !hasSeenAnnouncement) {
      setIsAnnouncementsOpen(true);
    }
  }, [currentUsername]);

  const handleCloseAnnouncements = () => {
    setIsAnnouncementsOpen(false);
    localStorage.setItem(`hasSeenWishlistAnnouncement_${currentUsername}`, 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-6">
            <img src="/logo.png" alt="Mazy Fund Tracker" className="h-8 sm:h-10 w-auto" />

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={onOpenChat}
                className="p-2 rounded-full text-gray-600 hover:bg-violet-100 transition-colors relative"
                title="Group Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowWishlist(true)}
                className="p-2 rounded-full text-gray-600 hover:bg-violet-100 transition-colors relative"
                title="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full">
                  NEW
                </span>
              </button>

              <button
                onClick={() => setIsAnnouncementsOpen(true)}
                className="p-2 rounded-full text-gray-600 hover:bg-violet-100 transition-colors relative"
                title="What's New"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full text-gray-600 hover:bg-violet-100 transition-colors"
                title="Profile Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fund Summary</h1>
            <p className="text-sm text-gray-500">Overview of contributions and balances</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Members</div>
              <div className="text-3xl font-bold text-violet-600">{totalMembers}</div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Total Contributions</div>
              <div className="text-3xl font-bold text-green-600">₱{totalContributions.toFixed(2)}</div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-1">Average Contribution</div>
              <div className="text-3xl font-bold text-blue-600">₱{averageContribution.toFixed(2)}</div>
            </div>
          </Card>
        </div>

        {/* Your Profile */}
        {currentMember && (
          <Card className="mb-6 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
                {currentMember.profilePicture ? (
                  <img
                    src={currentMember.profilePicture}
                    alt={currentMember.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-violet-300 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-violet-300 flex items-center justify-center border-4 border-violet-400 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {(currentMember.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Profile</p>
                  <h3 className="text-2xl font-bold text-gray-800">{currentMember.name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Contributions</p>
                  <p className="text-2xl font-bold text-green-600">₱{currentMember.totalContributions.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">₱{currentMember.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* All Members List */}
        <Card>
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Members</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">Member</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">Contributions</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-violet-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2">
                          {member.profilePicture ? (
                            <img
                              src={member.profilePicture}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-violet-700">
                                {(member.name || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{member.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 sm:px-4 font-semibold text-green-600">
                        ₱{member.totalContributions.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-2 sm:px-4 font-semibold text-blue-600">
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

      {/* Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={handleCloseAnnouncements}
      />

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

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Wishlist</h2>
              <button
                onClick={() => setShowWishlist(false)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Wishlist
                items={wishlistItems}
                members={members}
                currentUser={currentUsername}
                onAddItem={onAddWishlistItem}
                onDeleteItem={onDeleteWishlistItem}
                onEditItem={onEditWishlistItem}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSummaryPage;
