"use client";
import React, { useState } from 'react';

export default function Export() {
  const [isExporting, setIsExporting] = useState<string | null>(null); 
  const [statusMessage, setStatusMessage] = useState('');

  /**
   * @param {string} dataType - The type of data to export (e.g., 'donations', 'donors').
   */
  const handleExport = async (dataType: string) => {
    setIsExporting(dataType);
    setStatusMessage(`Requesting ${dataType} data export...`);

    try {
      // NOTE: API endpoint must be programmed to return a file, edit the endpoint here
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/${dataType}/export`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`The server failed to generate the file. Status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      document.body.appendChild(a); 
      a.click(); 
      a.remove(); 
      window.URL.revokeObjectURL(url); 

      setStatusMessage('Export completed successfully!');

    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsExporting(null); 
    }
  };

  // svg icon: downloading
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  return (
    <div className="font-sans p-8 w-full">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
          <p className="text-gray-500 mt-2">Download database records as an Excel spreadsheet.</p>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          
          {/* Export Donations Card */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-gray-700">Export Donations</h2>
            <p className="text-gray-500 mt-2 mb-4 text-sm">Download a complete spreadsheet of all donation records in the database.</p>
            <button
              type="button"
              onClick={() => handleExport('donations')}
              disabled={!!isExporting}
              className="w-full max-w-xs flex justify-center items-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <DownloadIcon />
                {isExporting === 'donations' ? 'Exporting...' : 'Download Donations'}
            </button>
          </div>

          {/* Export Donors Card */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-gray-700">Export Donors</h2>
            <p className="text-gray-500 mt-2 mb-4 text-sm">Download a complete spreadsheet of all donor profiles in the database.</p>
            <button
              type="button"
              onClick={() => handleExport('donors')}
              disabled={!!isExporting}
              className="w-full max-w-xs flex justify-center items-center gap-2 bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <DownloadIcon />
                {isExporting === 'donors' ? 'Exporting...' : 'Download Donors'}
            </button>
          </div>
        </div>
        
        {/* Status Message */}
        {statusMessage && (
            <div className={`text-center text-sm mt-6 p-3 rounded-md ${statusMessage.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                <p className="font-medium">{statusMessage}</p>
            </div>
        )}
      </div>
    </div>
  );
}

