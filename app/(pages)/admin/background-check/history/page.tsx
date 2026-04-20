sad'use client';

import { useState, useEffect } from 'react';

interface BackgroundCheck {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  dateOfBirth: string;
  email?: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  declineReason?: string;
  signatureDate: string;
}

export default function BackgroundCheckHistory() {
  const [checks, setChecks] = useState<BackgroundCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCheck, setSelectedCheck] = useState<BackgroundCheck | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/volunteer/background-check/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setChecks(data.data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Approve this background check?')) return;
    try {
      setActionLoading(true);
      const response = await fetch(`/api/volunteer/background-check/${id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (!response.ok) throw new Error('Failed to approve');
      await fetchHistory();
      alert('Background check approved!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error approving');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!selectedCheck || !declineReason.trim()) {
      alert('Please enter a decline reason');
      return;
    }
    try {
      setActionLoading(true);
      const response = await fetch(`/api/volunteer/background-check/${selectedCheck.id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DECLINED', declineReason }),
      });
      if (!response.ok) throw new Error('Failed to decline');
      setShowModal(false);
      setDeclineReason('');
      setSelectedCheck(null);
      await fetchHistory();
      alert('Background check declined!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error declining');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Loading background check history...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Background Check History</h1>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {checks.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No background check submissions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Submitted</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((check) => (
                <tr key={check.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{check.fullName}</p>
                      <p className="text-sm text-gray-600">DOB: {new Date(check.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm text-gray-600">{new Date(check.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(check.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(check.status)}`}>
                      {getStatusLabel(check.status)}
                    </span>
                    {check.declineReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {check.declineReason}</p>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {check.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(check.id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCheck(check);
                              setShowModal(true);
                            }}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedCheck(check)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decline Modal */}
      {showModal && selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Decline Background Check</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to decline the background check for <strong>{selectedCheck.fullName}</strong>?
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason for decline..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setDeclineReason('');
                  setSelectedCheck(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={actionLoading || !declineReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedCheck && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Background Check Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Full Name</p>
                <p className="text-gray-900">{selectedCheck.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                <p className="text-gray-900">{new Date(selectedCheck.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCheck.status)}`}>
                    {getStatusLabel(selectedCheck.status)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Submitted</p>
                <p className="text-gray-900">{new Date(selectedCheck.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Last Updated</p>
                <p className="text-gray-900">{new Date(selectedCheck.updatedAt).toLocaleString()}</p>
              </div>
              {selectedCheck.declineReason && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Decline Reason</p>
                  <p className="text-red-600">{selectedCheck.declineReason}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedCheck(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
