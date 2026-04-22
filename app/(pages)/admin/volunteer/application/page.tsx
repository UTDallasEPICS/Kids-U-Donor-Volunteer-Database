'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VolunteerAppStatus } from '@prisma/client';

type ApplicationSummary = {
  id: string;
  createdAt: string;
  updatedAt: string;
  legalName: string;
  preferredName: string | null;
  email: string;
  phoneNumber: string;
  educationLevel: string;
  accepted: boolean;
  status: VolunteerAppStatus;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [pendingApplications, setPendingApplications] = useState<ApplicationSummary[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<ApplicationSummary[]>([]);
  const [rejectedApplications, setRejectedApplications] = useState<ApplicationSummary[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const [Pathapplications, setPathapplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          fetch('/api/admin/volunteer/application/get'),
          fetch('/api/admin/volunteer/application/getDisplay'),
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        // Combine and categorize applications by status
        const allApplications = data1.concat(data2);
        const pending = allApplications.filter((app: ApplicationSummary) => app.status === 'PENDING');
        const approved = allApplications.filter((app: ApplicationSummary) => app.status === 'APPROVED');
        const rejected = allApplications.filter((app: ApplicationSummary) => app.status === 'REJECTED');
        
        setApplications(allApplications);
        setPendingApplications(pending);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
        setPathapplications(data2);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const toggleAccepted = async (id: string, accepted: boolean) => {
    try {
      const res = await fetch(`/api/admin/volunteer/application/${id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { accepted: true } }),
      });

      if (res.ok) {
        // Refresh the applications to get updated data
        const [res1, res2] = await Promise.all([
          fetch('/api/admin/volunteer/application/get'),
          fetch('/api/admin/volunteer/application/getDisplay'),
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        // Combine and categorize applications by status
        const allApplications = data1.concat(data2);
        const pending = allApplications.filter((app: ApplicationSummary) => app.status === 'PENDING');
        const approved = allApplications.filter((app: ApplicationSummary) => app.status === 'APPROVED');
        const rejected = allApplications.filter((app: ApplicationSummary) => app.status === 'REJECTED');
        
        setApplications(allApplications);
        setPendingApplications(pending);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
        setPathapplications(data2);
        
        alert('Application approved and approval email sent!');
      } else {
        console.error('Failed to update accepted status');
        alert('Failed to approve application');
      }
    } catch (error) {
      console.error('Error updating accepted status:', error);
      alert('Error approving application');
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectingId) return;

    try {
      const res = await fetch(`/api/admin/volunteer/application/${rejectingId}/delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectionReason || 'No reason provided' }),
      });

      if (res.ok) {
        // Refresh the applications to get updated data
        const [res1, res2] = await Promise.all([
          fetch('/api/admin/volunteer/application/get'),
          fetch('/api/admin/volunteer/application/getDisplay'),
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        // Combine and categorize applications by status
        const allApplications = data1.concat(data2);
        const pending = allApplications.filter((app: ApplicationSummary) => app.status === 'PENDING');
        const approved = allApplications.filter((app: ApplicationSummary) => app.status === 'APPROVED');
        const rejected = allApplications.filter((app: ApplicationSummary) => app.status === 'REJECTED');
        
        setApplications(allApplications);
        setPendingApplications(pending);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
        setPathapplications(data2);
        
        alert('Application rejected and rejection email sent!');
        setShowRejectModal(false);
        setRejectingId(null);
        setRejectionReason('');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to reject the application:', errorData);
        alert(errorData.message || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Volunteer Applications</h1>
        <p className="text-gray-500 mt-1">Manage volunteer applications and approvals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-[#7FA7D8] rounded-2xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{Pathapplications.length}</p>
              <p className="text-sm mt-1 opacity-90">Total Applications</p>
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
              <p className="text-3xl font-bold">{Pathapplications.filter(a => a.status === 'PENDING').length}</p>
              <p className="text-sm mt-1 opacity-90">Pending Review</p>
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
              <p className="text-3xl font-bold">{Pathapplications.filter(a => a.status === 'APPROVED').length}</p>
              <p className="text-sm mt-1 opacity-90">Approved</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending ({pendingApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'approved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Approved ({approvedApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'rejected'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Rejected ({rejectedApplications.length})
          </button>
        </div>
      </div>

      {/* Pending Applications Table */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Pending Applications</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading applications...
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">No pending applications</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingApplications.map((app: ApplicationSummary) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{app.legalName}</p>
                        {app.preferredName && <p className="text-xs text-gray-400">{app.preferredName}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {app.educationLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAccepted(app.id, true)}
                          className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(app.id)}
                          className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Approved Applications Table */}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Approved Applications</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading applications...
            </div>
          ) : approvedApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">No approved applications</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Approved Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {approvedApplications.map((app: ApplicationSummary) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{app.legalName}</p>
                        {app.preferredName && <p className="text-xs text-gray-400">{app.preferredName}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {app.educationLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Rejected Applications Table */}
      {activeTab === 'rejected' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Rejected Applications</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading applications...
            </div>
          ) : rejectedApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">No rejected applications</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rejected Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rejectedApplications.map((app: ApplicationSummary) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{app.legalName}</p>
                        {app.preferredName && <p className="text-xs text-gray-400">{app.preferredName}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {app.educationLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reject Application</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this application? A rejection email will be sent to the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingId(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}