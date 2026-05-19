"use client";
import React, { useState } from 'react';

export default function Export() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = async (dataType: string) => {
    setIsExporting(dataType);
    setStatusMessage('');

    try {
      const route = dataType;
      const apiUrl = `/api/admin/${route}/export`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`The server failed to generate the file. Status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export_${new Date().toISOString().slice(0, 10)}.csv`;
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

  const exportCards = [
    {
      key: 'volunteer',
      title: 'Volunteers',
      description: 'Export all volunteer profiles, contact info, preferences, and compliance status.',
      color: '#7FA7D8',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      key: 'donors',
      title: 'Donors',
      description: 'Export all donor records, donation totals, and communication preferences.',
      color: '#4C7AB8',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      key: 'events',
      title: 'Events',
      description: 'Export all events with location details, registrations, and attendance counts.',
      color: '#2D4A7C',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
        <p className="text-sm text-gray-500 mt-1">Download database records as CSV spreadsheets.</p>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${statusMessage.startsWith('Error:') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {statusMessage}
        </div>
      )}

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {exportCards.map((card) => (
          <div key={card.key} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Card Color Header */}
            <div
              className="p-5 text-white flex items-center justify-between"
              style={{ backgroundColor: card.color }}
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <div className="bg-white/30 p-2 rounded-xl">
                {card.icon}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-sm text-gray-600 mb-5 flex-1">{card.description}</p>
              <button
                type="button"
                onClick={() => handleExport(card.key)}
                disabled={!!isExporting}
                className="w-full flex justify-center items-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: card.color,
                  color: isExporting === card.key ? '#9CA3AF' : card.color,
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) {
                    e.currentTarget.style.backgroundColor = card.color;
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = card.color;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {isExporting === card.key ? 'Exporting...' : `Download ${card.title}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

