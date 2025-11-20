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

const Header: React.FC<HeaderProps> = ({ page, onSetPage }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="w-auto h-10 sm:h-12 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="Mazy Fund Tracker Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Mazy Fund Tracker</h1>
            <p className="text-sm text-gray-500">Your daily contributions, simplified.</p> */}
          </div>
        </div>
        <nav className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
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