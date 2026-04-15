'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VolunteerAppStatus } from '@prisma/client';

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
        setApplications(data1);
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
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, status: 'APPROVED', accepted: true } : app))
        );
        
        
      } else {
        console.error('Failed to update accepted status');
      }
    } catch (error) {
      console.error('Error updating accepted status:', error);
    }
  };

  const rejectApplication = async (id: string) => {
    if (!confirm('Are you sure you want to reject this application?')) return;

    try {
      const res = await fetch(`/api/admin/volunteer/application/${id}/delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status: 'REJECTED', softdelete: true } }),
      });

      if (res.ok) {
        
        setPathapplications(apps => apps.filter(app => app.id !== id));
      } else {
        console.error('Failed to reject the application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Volunteer Applications</h1>
        <p className="text-gray-500 mt-1">Manage volunteer applications and approvals</p>
      </div>

      {/* First Table - Volunteer Application Review */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Pending Reviews</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">No applications found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{app.legalName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{app.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === 'APPROVED'
                        ? 'bg-green-50 text-green-700'
                        : app.status === 'REJECTED'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAccepted(app.id, app.accepted)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
                      >
                        {app.accepted ? 'Unaccept' : 'Accept'}
                      </button>
                      <button
                        onClick={() => rejectApplication(app.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/volunteer/application/${app.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                      View Full
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {applications.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{applications.length}</span> applications
            </p>
          </div>
        )}
      </div>

      {/* Second Table - Pending Volunteer Applications in Middle */}
      <div className= "flex-col min-h-screen p-6">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800"> Past Volunteer Applications</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading applications...
              </div>
            ) : Pathapplications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg font-medium">No pending applications</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Pathapplications.map(app => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{app.legalName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          app.status === 'APPROVED'
                            ? 'bg-green-50 text-green-700'
                            : app.status === 'REJECTED'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/volunteer/application/${app.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          View Full
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}

            {Pathapplications.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{Pathapplications.length}</span> applications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}