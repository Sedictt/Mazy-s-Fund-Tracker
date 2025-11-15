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
            <p className="text-sm text-gray-600">
                Paste your data from a spreadsheet. The format should be CSV (Comma Separated Values) with three columns: <strong>Date, Member Name, Amount</strong>.
            </p>
            <p className="text-sm text-gray-600">
                The date format should be understandable by JavaScript's `new Date()`, like YYYY-MM-DD.
            </p>
            <p className="text-sm text-gray-600">
                Example:
                <br />
                <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre">
{`2024-05-20,Alice,10
2024-05-20,Bob,10
2024-05-21,Alice,10`}
                </code>
            </p>
            <div>
                <label htmlFor="csvData" className="block text-sm font-medium text-gray-700">
                    Paste CSV Data
                </label>
                <textarea
                    id="csvData"
                    rows={8}
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                    placeholder={`e.g.\n2024-05-20,Alice,10\n2024-05-20,Bob,10`}
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