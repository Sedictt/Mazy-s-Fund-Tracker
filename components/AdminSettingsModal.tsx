import React, { useState, useEffect } from 'react';
import { saveSettingsToFirestore, ContributionRule } from '../firestoreSettings';
import { getCurrentContributionAmount } from '../utils/date';

interface AdminSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGoal: number;
    currentRules: ContributionRule[];
    onUpdateSettings: (newGoal: number, newRules: ContributionRule[]) => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose, currentGoal, currentRules, onUpdateSettings }) => {
    const [goalInput, setGoalInput] = useState(currentGoal);
    const [rulesInput, setRulesInput] = useState<ContributionRule[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New rule state
    const [newRuleDate, setNewRuleDate] = useState('');
    const [newRuleAmount, setNewRuleAmount] = useState('');

    useEffect(() => {
        setGoalInput(currentGoal);
        // Sort rules by date for display
        const sortedRules = [...currentRules].sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
        setRulesInput(sortedRules);
    }, [currentGoal, currentRules, isOpen]);

    const handleAddRule = () => {
        if (!newRuleDate || !newRuleAmount) return;

        const amount = parseFloat(newRuleAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const newRule: ContributionRule = {
            effectiveDate: newRuleDate,
            amount: amount
        };

        // Check if rule for date already exists, if so update it
        const existingIndex = rulesInput.findIndex(r => r.effectiveDate === newRuleDate);
        let updatedRules;
        if (existingIndex >= 0) {
            updatedRules = [...rulesInput];
            updatedRules[existingIndex] = newRule;
        } else {
            updatedRules = [...rulesInput, newRule];
        }

        // Sort again
        updatedRules.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

        setRulesInput(updatedRules);
        setNewRuleDate('');
        setNewRuleAmount('');
    };

    const handleDeleteRule = (dateToDelete: string) => {
        if (rulesInput.length <= 1) {
            alert("You must have at least one contribution rule.");
            return;
        }
        setRulesInput(rulesInput.filter(r => r.effectiveDate !== dateToDelete));
    };

    const handleSave = async () => {
        setIsLoading(true);
        await saveSettingsToFirestore({
            goal: goalInput,
            contributionRules: rulesInput
        });
        onUpdateSettings(goalInput, rulesInput);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">App Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: General Settings */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">General</h3>

                        <div className="mb-6 p-4 bg-violet-50 rounded-lg border border-violet-100">
                            <label className="block text-sm font-medium text-violet-800 mb-1">Current Contribution Cost</label>
                            <div className="text-2xl font-bold text-violet-900">₱{getCurrentContributionAmount(rulesInput)}</div>
                            <p className="text-xs text-violet-600 mt-1">Based on current date and rules.</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fundraising Goal</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₱</span>
                                </div>
                                <input
                                    type="number"
                                    value={goalInput}
                                    onChange={(e) => setGoalInput(Number(e.target.value))}
                                    className="focus:ring-violet-500 focus:border-violet-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Set the target amount for the fund.</p>
                        </div>
                    </div>

                    {/* Right Column: Contribution Rules */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contribution Rules</h3>
                        <p className="text-sm text-gray-500 mb-4">Define how much members contribute starting from specific dates.</p>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto mb-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                                        <th className="px-3 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 md:px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rulesInput.map((rule, index) => (
                                        <tr key={rule.effectiveDate}>
                                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-900">{rule.effectiveDate}</td>
                                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-sm text-gray-900">₱{rule.amount}</td>
                                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteRule(rule.effectiveDate)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Rule"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Add New Rule</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={newRuleDate}
                                        onChange={(e) => setNewRuleDate(e.target.value)}
                                        className="block w-full text-sm border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Amount (₱)</label>
                                    <input
                                        type="number"
                                        value={newRuleAmount}
                                        onChange={(e) => setNewRuleAmount(e.target.value)}
                                        className="block w-full text-sm border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                        placeholder="20"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddRule}
                                disabled={!newRuleDate || !newRuleAmount}
                                className="w-full py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Add Rule
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsModal;
