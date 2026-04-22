'use client';

import { useEffect, useState } from 'react';

type BackgroundCheckRecord = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  county: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  race: string;
  gender: string;
  agreedToBackgroundCheck: boolean;
  eSignature: string;
  signatureDate: string;
  createdAt: string;
};

export default function BackgroundChecksPage() {
  const [records, setRecords] = useState<BackgroundCheckRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/volunteer/background-check/get')
      .then(res => res.json())
      .then(data => setRecords(data.records ?? []))
      .catch(err => console.error('Error fetching background checks:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(`/api/admin/volunteer/background-check/${id}/approve`, {
        method: 'PATCH',
      });

      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        alert('Background check approved successfully!');
      } else {
        console.error('Failed to approve background check');
        alert('Failed to approve background check');
      }
    } catch (error) {
      console.error('Error approving background check:', error);
      alert('Error approving background check');
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = records.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Background Checks</h1>
        <p className="text-gray-500 mt-1">Manage pending background check approvals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-[#7FA7D8] rounded-2xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{records.length}</p>
              <p className="text-sm mt-1 opacity-90">Pending Reviews</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#4C7AB8] rounded-2xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{records.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length}</p>
              <p className="text-sm mt-1 opacity-90">Submitted Today</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[#2E5A8E] rounded-2xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{filtered.length}</p>
              <p className="text-sm mt-1 opacity-90">Search Results</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
          </div>

          {/* Print All Button */}
          <button
            onClick={() => window.open('/admin/volunteer/background-check/print-all', '_blank')}
            disabled={records.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
          >
            Print All ({records.length})
          </button>

          {/* Clear Search */}
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Background Checks Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Pending Background Checks</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading background checks...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">
              {search ? 'No records match your search.' : 'No pending background checks.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  County
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  City, State
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{record.fullName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(record.dateOfBirth).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {record.county}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{record.city}, {record.state}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            `/admin/volunteer/background-check/${record.id}/print`,
                            '_blank'
                          )
                        }
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleApprove(record.id)}
                        disabled={approvingId === record.id}
                        className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition"
                      >
                        {approvingId === record.id ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {records.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{filtered.length}</span> of <span className="font-medium">{records.length}</span> background checks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
