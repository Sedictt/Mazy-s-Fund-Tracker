import React from 'react';

interface HeaderProps {
  page: 'dashboard' | 'dataTable';
  onSetPage: (page: 'dashboard' | 'dataTable') => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const activeClasses = 'bg-violet-100 text-violet-700';
  const inactiveClasses = 'text-gray-500 hover:bg-gray-100 hover:text-gray-700';
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 font-medium text-sm rounded-md transition-colors ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ page, onSetPage }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" opacity="0" transform="scale(0.3) translate(22, 22)"/>
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Swim Fund Tracker</h1>
            <p className="text-sm text-gray-500">Your daily contributions, simplified.</p>
          </div>
        </div>
        <nav className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
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
      </div>
    </header>
  );
};

export default Header;
