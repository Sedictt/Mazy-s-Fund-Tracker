import React, { useState } from 'react';
import Modal from './common/Modal';

interface DataImporterProps {
  onImport: (csvData: string) => void;
}

const DataImporter: React.FC<DataImporterProps> = ({ onImport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvData, setCsvData] = useState('');

  const handleImportClick = () => {
    if (csvData.trim() === '') {
      alert('Please paste some data into the text area.');
      return;
    }
    onImport(csvData);
    setIsModalOpen(false);
    setCsvData('');
  };

  const importIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center sm:justify-start space-x-1 text-sm text-violet-600 hover:text-violet-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>Import Data</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Import Pre-existing Data" icon={importIcon}>
        <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-600 space-y-3">
                <p>Paste data from a spreadsheet. It must have 3 columns:</p>
                <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                    <li><strong>Date</strong> (e.g., YYYY-MM-DD)</li>
                    <li><strong>Member Name</strong></li>
                    <li><strong>Amount</strong></li>
                </ul>
                <div>
                    <p>Example:</p>
                    <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre-wrap mt-1">
{`2024-07-01,Alice,10
2024-07-01,Bob,10
2024-07-02,Alice,10`}
                    </code>
                </div>
            </div>
            <div>
                <label htmlFor="csvData" className="sr-only">
                    Paste CSV Data
                </label>
                <textarea
                    id="csvData"
                    rows={6}
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                    placeholder="Paste your data here..."
                    aria-label="Paste CSV Data"
                />
            </div>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Import Data
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DataImporter;