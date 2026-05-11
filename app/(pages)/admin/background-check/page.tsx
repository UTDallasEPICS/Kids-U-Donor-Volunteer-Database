'use client';

import { useState, useEffect } from 'react';

interface BackgroundCheck {
  id: string;
  fullName: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  volunteer?: { emailAddress: string } | null;
}

export default function AdminBackgroundCheckPage() {
  const [checks, setChecks] = useState<BackgroundCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBackgroundChecks();
  }, []);

  const fetchBackgroundChecks = async () => {
    try {
      setLoading(true);
      console.log('Fetching background checks from /api/admin/volunteer/background-check/history');
      const response = await fetch('/api/admin/volunteer/background-check/history');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Failed to fetch background checks');
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      const checks = data.data || [];
      console.log('Total checks:', checks.length);
      setChecks(checks);
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load background checks';
      console.error('Fetch error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Approve this background check?')) return;

    try {
      const response = await fetch(`/api/admin/volunteer/background-check/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to approve background check');
      }

      await fetchBackgroundChecks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error approving background check');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading background checks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#2f4b7c]">Background Checks</h1>
          <button
            onClick={fetchBackgroundChecks}
            className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
          >
            Refresh
          </button>
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
              {checks.map((check) => {
                const isApproved = check.status === 'APPROVED';
                return (
                  <tr key={check.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                      {check.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {check.volunteer?.emailAddress ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(check.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {isApproved ? 'Approved' : 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => handleApprove(check.id)}
                        disabled={isApproved}
                        className="px-3 py-2 rounded-lg text-white text-sm font-semibold bg-[#2f4b7c] hover:bg-[#4a6fa5] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                );
              })}
              {checks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                    No volunteers found.
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
