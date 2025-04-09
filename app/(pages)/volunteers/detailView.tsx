// app/volunteers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Edit, Calendar, Mail, Phone, Clock, FileText } from 'lucide-react';

interface Volunteer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    skills?: string[];
    availability?: string[];
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export default function VolunteerDetailPage({ params }: { params: { id: string } }) {
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVolunteer = async () => {
            try {
                const response = await fetch(`/api/volunteers/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch volunteer data');
                }
                const data = await response.json();
                setVolunteer(data.data);
            } catch (err) {
                console.error('Error fetching volunteer:', err);
                setError('Failed to load volunteer data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteer();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading volunteer data...</p>
            </div>
        );
    }

    if (error || !volunteer) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Volunteer not found'}
                </div>
                <div className="mt-4">
                    <Link href="/volunteers" className="text-blue-600 hover:underline">
                        Back to Volunteers
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/volunteers" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ChevronLeft size={16} />
                    <span className="ml-1">Back to Volunteers</span>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{volunteer.firstName} {volunteer.lastName}</h1>
                <Link
                    href={`/volunteers/${volunteer.id}/edit`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                >
                    <Edit size={16} className="mr-2" />
                    Edit
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <span className={`px-3 py-1 text-sm rounded-full ${
              volunteer.status === 'active' ? 'bg-green-100 text-green-800' :
                  volunteer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
          }`}>
            {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
          </span>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <Mail size={18} className="text-gray-400 mr-2 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <a href={`mailto:${volunteer.email}`} className="text-blue-600 hover:underline">
                                            {volunteer.email}
                                        </a>
                                    </div>
                                </div>

                                {volunteer.phone && (
                                    <div className="flex items-start">
                                        <Phone size={18} className="text-gray-400 mr-2 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-500">Phone</div>
                                            <a href={`tel:${volunteer.phone}`} className="text-blue-600 hover:underline">
                                                {volunteer.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start">
                                    <Calendar size={18} className="text-gray-400 mr-2 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">Joined</div>
                                        <div>{formatDate(volunteer.createdAt)}</div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Clock size={18} className="text-gray-400 mr-2 mt-1" />
                                    <div>
                                        <div className="text-sm text-gray-500">Last Updated</div>
                                        <div>{formatDate(volunteer.updatedAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
                            {volunteer.skills && volunteer.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {volunteer.skills.map((skill, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                      {skill}
                    </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No skills listed</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Availability</h2>
                        {volunteer.availability && volunteer.availability.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {volunteer.availability.map((time, index) => (
                                    <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">
                    {time}
                  </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No availability specified</p>
                        )}
                    </div>

                    {volunteer.notes && (
                        <div className="mt-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <div className="flex items-start">
                                    <FileText size={18} className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                                    <p className="whitespace-pre-line">{volunteer.notes}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Volunteer ID: {volunteer.id}
                            </div>
                            <Link
                                href={`/volunteers/${volunteer.id}/edit`}
                                className="text-blue-600 hover:underline"
                            >
                                Edit volunteer information
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}