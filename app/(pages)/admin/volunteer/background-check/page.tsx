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
      } else {
        console.error('Failed to approve background check');
      }
    } catch (error) {
      console.error('Error approving background check:', error);
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = records.filter(r =>
    r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading pending background checks...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Background Checks</h1>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => window.open('/admin/volunteer/background-check/print-all', '_blank')}
          disabled={records.length === 0}
          className="text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 px-4 py-2 rounded"
        >
          Print All ({records.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          {search ? 'No records match your search.' : 'No pending background checks.'}
        </p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Date of Birth</th>
              <th className="p-2">County</th>
              <th className="p-2">City, State</th>
              <th className="p-2">Submitted</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => (
              <tr key={record.id} className="border-t">
                <td className="p-2">{record.fullName}</td>
                <td className="p-2">
                  {new Date(record.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="p-2">{record.county}</td>
                <td className="p-2">{record.city}, {record.state}</td>
                <td className="p-2">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <span className="text-yellow-600 font-medium">Pending</span>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() =>
                      window.open(
                        `/admin/volunteer/background-check/${record.id}/print`,
                        '_blank'
                      )
                    }
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleApprove(record.id)}
                    disabled={approvingId === record.id}
                    className="text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 px-3 py-1 rounded"
                  >
                    {approvingId === record.id ? 'Approving...' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
