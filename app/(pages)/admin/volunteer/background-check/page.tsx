'use client';

import { useEffect, useState } from 'react';

type BGCRecord = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  county: string;
  addressLine?: string;
  city: string;
  state: string;
  zipCode?: string;
  race?: string;
  gender?: string;
  agreedToBackgroundCheck?: boolean;
  eSignature?: string;
  signatureDate?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  volunteer?: { emailAddress: string } | null;
};

export default function BackgroundChecksPage() {
  const [pending, setPending] = useState<BGCRecord[]>([]);
  const [history, setHistory] = useState<BGCRecord[]>([]);
  const [search, setSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/volunteer/background-check/get')
      .then(res => res.json())
      .then(data => {
        setPending(data.pending ?? []);
        setHistory(data.history ?? []);
      })
      .catch(err => console.error('Error fetching background checks:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/volunteer/background-check/${id}/approve`, { method: 'PATCH' });
      if (res.ok) {
        const record = pending.find(r => r.id === id);
        if (record) {
          setPending(prev => prev.filter(r => r.id !== id));
          setHistory(prev => [{ ...record, status: 'APPROVED' }, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error approving:', err);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/volunteer/background-check/${id}/reject`, { method: 'PATCH' });
      if (res.ok) {
        const record = pending.find(r => r.id === id);
        if (record) {
          setPending(prev => prev.filter(r => r.id !== id));
          setHistory(prev => [{ ...record, status: 'REJECTED' }, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error rejecting:', err);
    } finally {
      setActionId(null);
    }
  };

  const filteredPending = pending.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHistory = history.filter(r =>
    r.fullName.toLowerCase().includes(historySearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-[#2f4b7c] font-semibold">Loading background checks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Pending Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#2f4b7c]">Pending Background Checks</h1>
              <p className="text-sm text-gray-500 mt-0.5">{pending.length} awaiting review</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#2f4b7c]/30"
              />
              <button
                onClick={() => window.open('/admin/volunteer/background-check/print-all', '_blank')}
                disabled={pending.length === 0}
                className="text-white bg-[#2f4b7c] hover:bg-[#243d66] disabled:opacity-40 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Print All ({pending.length})
              </button>
            </div>
          </div>

          {filteredPending.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              {search ? 'No records match your search.' : 'No pending background checks.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-left">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Date of Birth</th>
                    <th className="px-5 py-3 font-semibold">County</th>
                    <th className="px-5 py-3 font-semibold">City, State</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPending.map(record => (
                    <tr key={record.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{record.fullName}</td>
                      <td className="px-5 py-3 text-gray-600">{record.volunteer?.emailAddress ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(record.dateOfBirth).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{record.county}</td>
                      <td className="px-5 py-3 text-gray-600">{record.city}, {record.state}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/admin/volunteer/background-check/${record.id}/print`, '_blank')}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => handleApprove(record.id)}
                            disabled={actionId === record.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white transition-colors"
                          >
                            {actionId === record.id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(record.id)}
                            disabled={actionId === record.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors"
                          >
                            {actionId === record.id ? '...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#2f4b7c]">History</h2>
              <p className="text-sm text-gray-500 mt-0.5">{history.length} resolved</p>
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#2f4b7c]/30"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              {historySearch ? 'No records match your search.' : 'No resolved background checks yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-left">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Date of Birth</th>
                    <th className="px-5 py-3 font-semibold">County</th>
                    <th className="px-5 py-3 font-semibold">City, State</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(record => (
                    <tr key={record.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{record.fullName}</td>
                      <td className="px-5 py-3 text-gray-600">{record.volunteer?.emailAddress ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(record.dateOfBirth).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{record.county}</td>
                      <td className="px-5 py-3 text-gray-600">{record.city}, {record.state}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          record.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
