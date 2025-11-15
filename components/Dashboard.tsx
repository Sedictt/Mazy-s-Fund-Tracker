import React, { useState } from 'react';
import Card from './common/Card';
import DataImporter from './DataImporter';

interface DashboardProps {
  totalContributions: number;
  goalAmount: number;
  memberCount: number;
  outstandingBalance: number;
  onSetGoal: (newGoal: number) => void;
  onImportData: (csvData: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 rounded-full bg-cyan-100 text-cyan-600 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ totalContributions, goalAmount, memberCount, outstandingBalance, onSetGoal, onImportData }) => {
  const progress = goalAmount > 0 ? Math.round((totalContributions / goalAmount) * 100) : 0;
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(goalAmount.toString());

  const handleGoalSave = () => {
    const goalValue = parseInt(newGoal, 10);
    if (!isNaN(goalValue) && goalValue > 0) {
      onSetGoal(goalValue);
      setIsEditingGoal(false);
    } else {
        alert("Please enter a valid positive number for the goal.");
    }
  };


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Funds Collected" 
            value={`₱${totalContributions.toLocaleString()}`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard 
            title="Savings Goal" 
            value={`₱${goalAmount.toLocaleString()}`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />
        <StatCard
            title="Outstanding Balance"
            value={`₱${outstandingBalance.toLocaleString()}`}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-2m0 2v.01M12 12h.01M12 12h-.01M12 8h.01M12 8h-.01M12 16h.01M12 16h-.01M12 16v.01M12 16v-.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Active Members" 
            value={memberCount.toString()}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 014.288 0M10 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </div>

      <Card className="mt-6 p-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Progress to Goal</h3>
            <span className="text-lg font-bold text-cyan-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-cyan-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-4">
            {!isEditingGoal && <DataImporter onImport={onImportData} />}
            {isEditingGoal ? (
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm w-32"
                        placeholder="Set new goal"
                    />
                    <button onClick={handleGoalSave} className="px-3 py-1 bg-cyan-500 text-white rounded-md text-sm hover:bg-cyan-600">Save</button>
                    <button onClick={() => setIsEditingGoal(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">Cancel</button>
                </div>
            ) : (
                <button onClick={() => setIsEditingGoal(true)} className="flex items-center space-x-1 text-sm text-cyan-600 hover:text-cyan-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Goal</span>
                </button>
            )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;