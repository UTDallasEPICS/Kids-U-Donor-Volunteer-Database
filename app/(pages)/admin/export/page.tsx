"use client";
import React, { useState } from 'react';

export default function Export() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  // Grants filters
  const [showGrantsFilters, setShowGrantsFilters] = useState(false);
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");
  const [grantFund, setGrantFund] = useState("");
  const [grantMinAwarded, setGrantMinAwarded] = useState("");
  const [grantMaxAwarded, setGrantMaxAwarded] = useState("");
  const [grantStatus, setGrantStatus] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [grantorType, setGrantorType] = useState("");

  // Donors (Donations export) filters
  const [showDonorsFilters, setShowDonorsFilters] = useState(false);
  const [donStart, setDonStart] = useState("");
  const [donEnd, setDonEnd] = useState("");
  const [donorType, setDonorType] = useState("");
  const [donorStatus, setDonorStatus] = useState("");
  const [commPref, setCommPref] = useState("");
  const [donFund, setDonFund] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [campaign, setCampaign] = useState("");
  const [ackSent, setAckSent] = useState(""); // '', 'true', 'false'
  const [recurringFrequency, setRecurringFrequency] = useState("");

  /**
   * @param {string} dataType - The type of data to export (e.g., 'donations', 'donors').
   */
  const handleExport = async (dataType: string) => {
    setIsExporting(dataType);
    setStatusMessage(`Requesting ${dataType} data export...`);

    try {
      // NOTE: API endpoint must be programmed to return a file, edit the endpoint here
      // Use the admin API path
      // donations export handler is used for donors export as well
      const route = dataType === 'donors' ? 'donations' : dataType;
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/${route}/export`;

      // Append proposal due date range for grants
      let apiUrl = baseUrl;
      if (route === 'grants') {
        const params = new URLSearchParams();
        if (dueStart) params.set('dueStart', dueStart);
        if (dueEnd) params.set('dueEnd', dueEnd);
        if (grantFund) params.set('fund', grantFund);
        if (grantMinAwarded) params.set('minAmount', grantMinAwarded);
        if (grantMaxAwarded) params.set('maxAmount', grantMaxAwarded);
        if (grantStatus) params.set('status', grantStatus);
        if (applicationType) params.set('applicationType', applicationType);
        if (grantorType) params.set('grantorType', grantorType);
        const qs = params.toString();
        apiUrl = qs ? `${baseUrl}?${qs}` : baseUrl;
      } else if (route === 'donations') {
        const params = new URLSearchParams();
        if (donStart) params.set('startDate', donStart);
        if (donEnd) params.set('endDate', donEnd);
        if (donorType) params.set('donorType', donorType);
        if (donorStatus) params.set('donorStatus', donorStatus);
        if (commPref) params.set('commPref', commPref);
        if (donFund) params.set('fund', donFund);
        if (minAmount) params.set('minAmount', minAmount);
        if (maxAmount) params.set('maxAmount', maxAmount);
        if (paymentMethod) params.set('paymentMethod', paymentMethod);
        if (campaign) params.set('campaign', campaign);
        if (ackSent) params.set('acknowledgementSent', ackSent);
        if (recurringFrequency) params.set('recurringFrequency', recurringFrequency);
        const qs = params.toString();
        apiUrl = qs ? `${baseUrl}?${qs}` : baseUrl;
      }
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`The server failed to generate the file. Status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // keep the filename friendly: use 'donors' in the filename when dataType is donors
      const filenameKey = dataType === 'donors' ? 'donors' : dataType;
      a.download = `${filenameKey}_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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

          {/* Export Grants Card */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-gray-700">Export Grants</h2>
            <p className="text-gray-500 mt-2 mb-4 text-sm">Download a complete spreadsheet of all Grant records in the database.</p>
            {/* Filters (Proposal Due Date range) */}
            <button
              type="button"
              onClick={() => setShowGrantsFilters(v => !v)}
              className="text-sm text-indigo-600 underline mb-3"
            >
              {showGrantsFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showGrantsFilters && (
              <div className="w-full text-left space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Due Date From</label>
                    <input
                      type="date"
                      value={dueStart}
                      onChange={(e) => setDueStart(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Due Date To</label>
                    <input
                      type="date"
                      value={dueEnd}
                      onChange={(e) => setDueEnd(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Funding Area</label>
                    <input type="text" value={grantFund} onChange={(e)=>setGrantFund(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Education"/>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Min Awarded</label>
                      <input type="number" step="0.01" value={grantMinAwarded} onChange={(e)=>setGrantMinAwarded(e.target.value)} className="w-full border rounded px-2 py-1"/>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max Awarded</label>
                      <input type="number" step="0.01" value={grantMaxAwarded} onChange={(e)=>setGrantMaxAwarded(e.target.value)} className="w-full border rounded px-2 py-1"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <input type="text" value={grantStatus} onChange={(e)=>setGrantStatus(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Open, Awarded"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Application Type</label>
                    <input type="text" value={applicationType} onChange={(e)=>setApplicationType(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. LOI"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Grantor Type</label>
                    <input type="text" value={grantorType} onChange={(e)=>setGrantorType(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Foundation, Corporate"/>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setDueStart(""); setDueEnd(""); setGrantFund(""); setGrantMinAwarded(""); setGrantMaxAwarded(""); setGrantStatus(""); setApplicationType(""); setGrantorType(""); }}
                    className="text-xs text-gray-600 underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              // edit this to certain key word of routing for each data type
              onClick={() => handleExport('grants')}
              disabled={!!isExporting}
              className="w-full max-w-xs flex justify-center items-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              {isExporting === 'grants' ? 'Exporting...' : 'Download Grants'}
            </button>
          </div>

          {/* Export Donors Card */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-gray-700">Export Donors</h2>
            <p className="text-gray-500 mt-2 mb-4 text-sm">Download a complete spreadsheet of all donor profiles in the database.</p>
            {/* Donors Filters */}
            <button
              type="button"
              onClick={() => setShowDonorsFilters(v => !v)}
              className="text-sm text-green-700 underline mb-3"
            >
              {showDonorsFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showDonorsFilters && (
              <div className="w-full text-left space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input type="date" value={donStart} onChange={(e)=>setDonStart(e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input type="date" value={donEnd} onChange={(e)=>setDonEnd(e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Donor Type</label>
                    <select value={donorType} onChange={(e)=>setDonorType(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">All</option>
                      <option value="Individual">Individual</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Donor Status</label>
                    <input type="text" value={donorStatus} onChange={(e)=>setDonorStatus(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Active"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Communication Preference</label>
                    <select value={commPref} onChange={(e)=>setCommPref(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">All</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Mail">Mail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fund Designation</label>
                    <input type="text" value={donFund} onChange={(e)=>setDonFund(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. General Fund"/>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Min Amount</label>
                      <input type="number" step="0.01" value={minAmount} onChange={(e)=>setMinAmount(e.target.value)} className="w-full border rounded px-2 py-1"/>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max Amount</label>
                      <input type="number" step="0.01" value={maxAmount} onChange={(e)=>setMaxAmount(e.target.value)} className="w-full border rounded px-2 py-1"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
                    <input type="text" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Check"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Campaign</label>
                    <input type="text" value={campaign} onChange={(e)=>setCampaign(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Gala 2025"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Acknowledgement Sent</label>
                    <select value={ackSent} onChange={(e)=>setAckSent(e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">Any</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Recurring Frequency</label>
                    <input type="text" value={recurringFrequency} onChange={(e)=>setRecurringFrequency(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="e.g. Monthly"/>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setDonStart(""); setDonEnd(""); setDonorType(""); setDonorStatus(""); setCommPref(""); setDonFund(""); setMinAmount(""); setMaxAmount(""); setPaymentMethod(""); setCampaign(""); setAckSent(""); setRecurringFrequency(""); }}
                    className="text-xs text-gray-600 underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
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

