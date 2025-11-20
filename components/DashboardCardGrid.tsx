import React from 'react';
import Card from './common/Card';

interface DashboardCardGridProps {
  totalContributions: number;
  goalAmount: number;
  memberCount: number;
  outstandingBalance: number;
  onOpenDailyTracker: () => void;
  onOpenMemberList: () => void;
  onOpenContributionLog: () => void;
  onOpenSettings: () => void;
}

const DashboardCardGrid: React.FC<DashboardCardGridProps> = ({
  totalContributions,
  goalAmount,
  memberCount,
  outstandingBalance,
  onOpenDailyTracker,
  onOpenMemberList,
  onOpenContributionLog,
  onOpenSettings,
}) => {
  const progress = (totalContributions / goalAmount) * 100;

  return (
    <div className="p-4 sm:p-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Total Contributions */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">₱{totalContributions.toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Fund</div>
          </div>
        </Card>

        {/* Goal Progress */}
        <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-violet-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-violet-600 mb-1">{progress.toFixed(0)}%</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Goal Progress</div>
          </div>
        </Card>

        {/* Members */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{memberCount}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Active Members</div>
          </div>
        </Card>

        {/* Outstanding Balance */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">₱{outstandingBalance.toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Outstanding</div>
          </div>
        </Card>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Daily Tracker Card */}
        <button
          onClick={onOpenDailyTracker}
          className="group"
        >
          <Card className="h-full p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
            <div className="flex flex-col items-center text-center h-full justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-100 group-hover:bg-violet-200 transition-colors flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Daily Tracker</h3>
              <p className="text-xs sm:text-sm text-gray-600">Mark daily contributions</p>
            </div>
          </Card>
        </button>

        {/* Member List Card */}
        <button
          onClick={onOpenMemberList}
          className="group"
        >
          <Card className="h-full p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex flex-col items-center text-center h-full justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Member List</h3>
              <p className="text-xs sm:text-sm text-gray-600">View & manage members</p>
            </div>
          </Card>
        </button>

        {/* Contribution Log Card */}
        <button
          onClick={onOpenContributionLog}
          className="group"
        >
          <Card className="h-full p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex flex-col items-center text-center h-full justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Contribution Log</h3>
              <p className="text-xs sm:text-sm text-gray-600">View recent contributions</p>
            </div>
          </Card>
        </button>

        {/* Settings Card */}
        <button
          onClick={onOpenSettings}
          className="group"
        >
          <Card className="h-full p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
            <div className="flex flex-col items-center text-center h-full justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Settings</h3>
              <p className="text-xs sm:text-sm text-gray-600">Goal & data management</p>
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
};

export default DashboardCardGrid;
