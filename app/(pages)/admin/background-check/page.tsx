'use client';

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
  city: string;
  state: string;
  race: string;
  gender: string;
}

export default function AdminBackgroundCheckPage() {
  const [pendingChecks, setPendingChecks] = useState<BackgroundCheck[]>([]);
  const [approvedChecks, setApprovedChecks] = useState<BackgroundCheck[]>([]);
  const [rejectedChecks, setRejectedChecks] = useState<BackgroundCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
      
      const pending = checks.filter((c: BackgroundCheck) => c.status === 'PENDING');
      const approved = checks.filter((c: BackgroundCheck) => c.status === 'APPROVED');
      const rejected = checks.filter((c: BackgroundCheck) => c.status === 'DECLINED');
      
      console.log('Pending checks:', pending.length);
      console.log('Approved checks:', approved.length);
      console.log('Rejected checks:', rejected.length);
      
      setPendingChecks(pending);
      setApprovedChecks(approved);
      setRejectedChecks(rejected);
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
    if (!window.confirm('Are you sure you want to approve this background check?')) return;
    
    try {
      const response = await fetch(`/api/admin/volunteer/background-check/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve background check');
      }
      
      const result = await response.json();
      alert(result.message || 'Background check approved successfully!');
      await fetchBackgroundChecks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error approving background check');
      console.error(err);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectingId || !rejectionReason.trim()) {
      alert('Please enter a reason for declining');
      return;
    }

    try {
      const response = await fetch(`/api/admin/volunteer/background-check/${rejectingId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          declineReason: rejectionReason 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject background check');
      }
      
      const result = await response.json();
      alert(result.message || 'Background check rejected successfully!');
      setShowRejectModal(false);
      setRejectingId(null);
      setRejectionReason('');
      await fetchBackgroundChecks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error rejecting background check');
      console.error(err);
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
        <p className="text-gray-600">Loading background checks...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Background Checks</h1>
        <button
          onClick={fetchBackgroundChecks}
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

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending ({pendingChecks.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'approved'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Approved ({approvedChecks.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'rejected'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Rejected ({rejectedChecks.length})
        </button>
      </div>

      {/* Pending Applications Table */}
      {activeTab === 'pending' && (
        <div>
          {pendingChecks.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">No pending background checks</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Submitted</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingChecks.map((check) => (
                    <tr key={check.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{check.fullName}</p>
                          <p className="text-sm text-gray-600">DOB: {new Date(check.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{check.city}, {check.state}</p>
                        <p className="text-xs text-gray-500">{check.race} • {check.gender}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{new Date(check.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(check.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(check.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(check.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                          >
                            Reject
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
      )}

      {/* Approved Applications Table */}
      {activeTab === 'approved' && (
        <div>
          {approvedChecks.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">No approved background checks</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Submitted</th>
                    <th className="px-6 py-3 text-left">Approved Date</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedChecks.map((check) => (
                    <tr key={check.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{check.fullName}</p>
                          <p className="text-sm text-gray-600">DOB: {new Date(check.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{check.city}, {check.state}</p>
                        <p className="text-xs text-gray-500">{check.race} {check.gender}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{new Date(check.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(check.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{new Date(check.updatedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(check.updatedAt).toLocaleTimeString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rejected Applications Table */}
      {activeTab === 'rejected' && (
        <div>
          {rejectedChecks.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">No rejected background checks</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-red-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Submitted</th>
                    <th className="px-6 py-3 text-left">Rejection Reason</th>
                    <th className="px-6 py-3 text-left">Rejected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedChecks.map((check) => (
                    <tr key={check.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{check.fullName}</p>
                          <p className="text-sm text-gray-600">DOB: {new Date(check.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{check.city}, {check.state}</p>
                        <p className="text-xs text-gray-500">{check.race} {check.gender}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{new Date(check.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(check.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-red-600">{check.declineReason || 'No reason provided'}</p>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-600">{new Date(check.updatedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(check.updatedAt).toLocaleTimeString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Reject Background Check</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this background check.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingId(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
