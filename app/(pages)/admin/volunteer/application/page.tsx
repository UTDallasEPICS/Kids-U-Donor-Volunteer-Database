'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VolunteerAppStatus } from '@prisma/client';
import { stat } from 'fs';

type ApplicationSummary = {
  id: string;
  createdAt: string;
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetch('/api/admin/volunteer/application/get')
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const [Pathapplications, setPathapplications] = useState<ApplicationSummary[]>([]);

  useEffect(() => {
    fetch('/api/admin/volunteer/application/getDisplay')
      .then(res => res.json())
      .then(data => setPathapplications(data));
  }, []);

  const toggleAccepted = async (id: string, accepted: boolean) => {
    try {
      const res = await fetch(`/api/admin/volunteer/application/${id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {accepted: true } }), 
      });

      if (res.ok) {
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, status: "APPROVED", softdelete: false } : app))
        );
        setPathapplications(apps =>
          apps.map(app => (app.id === id ? { ...app, status: "APPROVED", softdelete: false } : app))
        );
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
        body: JSON.stringify({ rejectionReason: rejectionReason || undefined }), 
      });

      if (res.ok) {
        setApplications(apps => apps.filter(app => app.id !== rejectingId));
        setPathapplications(apps => apps.filter(app => app.id !== rejectingId));
        alert('Application rejected and rejection email sent!');
        setShowRejectModal(false);
        setRejectingId(null);
        setRejectionReason('');
      } else {
        console.error('Failed to reject the application');
        alert('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application');
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="flex text-2xl font-bold mb-4">Pending Volunteer Applications</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Application Status</th>
            <th className="p-2">Action</th>
            <th className="p-2">View Details</th>
          </tr>
        </thead>
        <tbody>
          {applications.filter(app => app.status === VolunteerAppStatus.PENDING).map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.legalName}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => toggleAccepted(app.id, app.accepted)}
                  className="text-white bg-green-600 active:bg-green-700 px-2 py-1 rounded hover:bg-green-700 transition"
                >
                  {app.accepted ? 'Unaccept' : 'Accept'}
                </button>
                <button
                  onClick={() => openRejectModal(app.id)}
                  className="text-white bg-red-600 active:bg-red-700 px-2 py-1 rounded hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </td>
              <td className="p-2">
                <Link
                  href={`/admin/volunteer/application/${app.id}`}
                  className="text-blue-600 active:underline"
                >
                  View Full Application
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full">
      <h1 className="flex text-2xl font-bold mb-4">Past Volunteer Applications</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Application Status</th>
            <th className="p-2">View Details</th>
          </tr>
        </thead>
        <tbody>
          {Pathapplications.filter(app => app.status !== VolunteerAppStatus.PENDING).map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.legalName}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2 space-x-2">

                <Link
                  href={`/admin/volunteer/application/${app.id}`}
                  className="text-blue-600 active:underline"
                >
                  View Full Application
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  </div>

  {/* Rejection Reason Modal */}
  {showRejectModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reject Application</h2>
        <p className="text-gray-600 mb-4">
          Provide a reason for rejection (optional). This will be included in the rejection email sent to the applicant.
        </p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full border border-gray-300 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
          rows={4}
        />
        <div className="flex space-x-3 justify-end">
          <button
            onClick={() => setShowRejectModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmReject}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  )}
  </div>
  );
}
