'use client';

import { useEffect, useState } from 'react';

type BGCRecord = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateSubmitted: string;
  backgroundCheckStatus: 'PENDING' | 'APPROVED' | 'DECLINED';
};

export default function BackgroundChecksPage() {
  const [pending, setPending] = useState<BGCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/volunteer/background-check/get', { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || data?.message || 'Failed to load background checks');
        }
        setPending(Array.isArray(data.pending) ? data.pending : []);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching background checks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load background checks');
        setPending([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/volunteer/background-check/${id}/approve`, { method: 'PATCH' });
      if (res.ok) {
        setPending(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error approving:', err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-[#2f4b7c] font-semibold">Loading background checks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#2f4b7c]">Background Checks</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Volunteer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(record => (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {record.firstName} {record.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.emailAddress}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(record.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Pending</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => handleApprove(record.id)}
                      disabled={actionId === record.id}
                      className="px-3 py-2 rounded-lg text-white text-sm font-semibold bg-[#2f4b7c] hover:bg-[#4a6fa5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionId === record.id ? '...' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                    No pending background checks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
