'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ApplicationSummary = {
  id: string;
  createdAt: string;
  legalName: string;
  preferredName: string | null;
  email: string;
  phoneNumber: string;
  educationLevel: string;
  accepted: boolean;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);

  useEffect(() => {
    fetch('/api/admin/volunteer/application/get')
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  const toggleAccepted = async (id: string, accepted: boolean) => {
    try {
      const res = await fetch(`/api/admin/volunteer/application/${id}/patch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { accepted: true } }), // match your backend
      });

      if (res.ok) {
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, accepted: true } : app))
        );
      } else {
        console.error('Failed to update accepted status');
      }
    } catch (error) {
      console.error('Error updating accepted status:', error);
    }
  };

  const rejectApplication = async (id: string) => {
    if (!confirm('Are you sure you want to reject (delete) this application?')) return;

    try {
      const res = await fetch(`/api/admin/volunteer/application/${id}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setApplications(apps => apps.filter(app => app.id !== id));
      } else {
        console.error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Volunteer Applications</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Preferred Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Education</th>
            <th className="p-2">Accepted</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.legalName}</td>
              <td className="p-2">{app.preferredName || '-'}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.phoneNumber}</td>
              <td className="p-2">{app.educationLevel}</td>
              <td className="p-2">{app.accepted ? 'Yes' : 'No'}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/volunteer/application/${app.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Full Application
                </Link>
                <button
                  onClick={() => toggleAccepted(app.id, app.accepted)}
                  className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                >
                  {app.accepted ? 'Unaccept' : 'Accept'}
                </button>
                <button
                  onClick={() => rejectApplication(app.id)}
                  className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
