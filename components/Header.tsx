import React, { useState } from 'react';
import AnnouncementsModal from './AnnouncementsModal';

interface HeaderProps {
  page: 'dashboard' | 'dataTable' | 'members';
  onSetPage: (page: 'dashboard' | 'dataTable' | 'members') => void;
  onLogout: () => void;
  currentUser: string;
  onOpenChat: () => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const activeClasses = 'bg-violet-100 text-violet-700';
  const inactiveClasses = 'text-gray-500 hover:bg-violet-100 hover:text-gray-700';
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 font-medium text-sm rounded-md transition-colors w-full sm:w-auto ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ page, onSetPage, onLogout, currentUser, onOpenChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);

  const handleNavigation = (newPage: 'dashboard' | 'dataTable' | 'members') => {
    onSetPage(newPage);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleNavigation('dashboard')}
                className="w-auto h-10 sm:h-12 flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                title="Go to Dashboard"
              >
                <img src="/logo.png" alt="Mazy Fund Tracker Logo" className="h-full w-auto object-contain" />
              </button>
              <div>
                {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Mazy Fund Tracker</h1>
                <p className="text-sm text-gray-500">Your daily contributions, simplified.</p> */}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
              <NavButton
                label="Dashboard"
                isActive={page === 'dashboard'}
                onClick={() => onSetPage('dashboard')}
              />
              <NavButton
                label="Data Table"
                isActive={page === 'dataTable'}
                onClick={() => onSetPage('dataTable')}
              />
            </nav>

            {/* Right side buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* User info */}
              <div className="text-right mr-2">
                <p className="text-xs text-gray-500">Admin</p>
                <p className="text-sm font-semibold text-gray-700">{currentUser}</p>
              </div>

              {/* Chat Button */}
              <button
                onClick={onOpenChat}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 relative"
                aria-label="Open group chat"
                title="Group Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* Announcements Button */}
              <button
                onClick={() => setIsAnnouncementsOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 relative"
                aria-label="View announcements"
                title="What's New"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                {/* New badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Announcements and Mobile Menu Buttons */}
            <div className="flex sm:hidden items-center gap-2">
              {/* Chat Button (Mobile) */}
              <button
                onClick={onOpenChat}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Open group chat"
                title="Group Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* Announcements Button */}
              <button
                onClick={() => setIsAnnouncementsOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 relative"
                aria-label="View announcements"
                title="What's New"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                {/* New badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Announcements Modal */}
      <AnnouncementsModal 
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 sm:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <NavButton
              label="Dashboard"
              isActive={page === 'dashboard'}
              onClick={() => handleNavigation('dashboard')}
            />
            <NavButton
              label="Members"
              isActive={page === 'members'}
              onClick={() => handleNavigation('members')}
            />
            <NavButton
              label="Data Table"
              isActive={page === 'dataTable'}
              onClick={() => handleNavigation('dataTable')}
            />
            
            {/* User info and Logout in mobile menu */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="p-3 bg-violet-50 rounded-lg mb-2">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-700">{currentUser}</p>
                <p className="text-xs text-violet-600">Admin</p>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;