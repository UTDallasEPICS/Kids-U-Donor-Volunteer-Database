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
        body: JSON.stringify({ data: {accepted: true } }), // match your backend
      });

      if (res.ok) {
        setApplications(apps =>
          apps.map(app => (app.id === id ? { ...app, status: "APPROVED", softdelete: false } : app))
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
        body: JSON.stringify({ data: { status: "REJECTED", softdelete: true } }), // match your backend
      });

      if (res.ok) {
        setApplications(apps => apps.filter(app => app.id !== id));
      } else {
        console.error('Failed to reject the application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
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
          {applications.map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.legalName}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => toggleAccepted(app.id, app.accepted)}
                  className="text-white bg-green-600 active:bg-green-700 px-2 py-1 rounded"
                >
                  {app.accepted ? 'Unaccept' : 'Accept'}
                </button>
                <button
                  onClick={() => rejectApplication(app.id)}
                  className="text-white bg-red-600 active:bg-red-700 px-2 py-1 rounded"
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
      <h1 className="flex text-2xl font-bold mb-4">Pending Volunteer Applications</h1>
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
          {Pathapplications.map(app => (
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
  </div>
  );
}
