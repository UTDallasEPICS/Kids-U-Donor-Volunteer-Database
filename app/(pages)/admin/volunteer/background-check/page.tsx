'use client';

import { useEffect, useState } from 'react';

type VolunteerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
};

export default function BackgroundChecksPage() {
  const [volunteers, setVolunteers] = useState<VolunteerSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/volunteer/background-check/get')
      .then(res => res.json())
      .then(data => setVolunteers(data.volunteers ?? []))
      .catch(err => console.error('Error fetching volunteers:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(`/api/admin/volunteer/${id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { backgroundCheckCompleted: true } }),
      });

      if (res.ok) {
        setVolunteers(prev => prev.filter(v => v.id !== id));
      } else {
        console.error('Failed to approve background check');
      }
    } catch (error) {
      console.error('Error approving background check:', error);
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = volunteers.filter(v => {
    const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          {search ? 'No volunteers match your search.' : 'No pending background checks.'}
        </p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(volunteer => (
              <tr key={volunteer.id} className="border-t">
                <td className="p-2">{volunteer.firstName} {volunteer.lastName}</td>
                <td className="p-2">{volunteer.emailAddress}</td>
                <td className="p-2">
                  <span className="text-yellow-600 font-medium">Pending</span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleApprove(volunteer.id)}
                    disabled={approvingId === volunteer.id}
                    className="text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 px-3 py-1 rounded"
                  >
                    {approvingId === volunteer.id ? 'Approving...' : 'Approve'}
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
