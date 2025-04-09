'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';

interface Volunteer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    skills?: string[];
    availability?: string[];
    status: string;
    createdAt: string;
}

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [error, setError] = useState('');

    const fetchVolunteers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter) params.append('status', statusFilter);
            if (skillFilter) params.append('skill', skillFilter);

            const response = await fetch(`/api/volunteers?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch volunteers');
            }

            const data = await response.json();
            setVolunteers(data.data);
        } catch (err) {
            console.error('Error fetching volunteers:', err);
            setError('Failed to load volunteers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchVolunteers();
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setSkillFilter('');
        fetchVolunteers();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Volunteer Management</h1>
                <Link href="/volunteers/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Volunteer
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search volunteers..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 md:flex-initial">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded w-full"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="flex-1 md:flex-initial">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded w-full"
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                        >
                            <option value="">All Skills</option>
                            <option value="teaching">Teaching</option>
                            <option value="mentoring">Mentoring</option>
                            <option value="administration">Administration</option>
                            <option value="event planning">Event Planning</option>
                            <option value="fundraising">Fundraising</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center"
                    >
                        <Filter size={16} className="mr-2" />
                        Filter
                    </button>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Reset
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading volunteers...</p>
                </div>
            ) : (
                <>
                    {volunteers.length === 0 ? (
                        <div className="text-center py-8 bg-white shadow rounded-lg">
                            <p className="text-gray-600">No volunteers found.</p>
                            <Link href="/volunteers/new" className="text-blue-600 hover:underline mt-2 inline-block">
                                Add your first volunteer
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {volunteers.map((volunteer) => (
                                    <tr key={volunteer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">
                                                {volunteer.firstName} {volunteer.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-500">{volunteer.email}</div>
                                            {volunteer.phone && <div className="text-gray-500">{volunteer.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {volunteer.skills?.map((skill, index) => (
                                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                                                )) || "No skills listed"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            volunteer.status === 'active' ? 'bg-green-100 text-green-800' :
                                volunteer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                    'bg-yellow-100 text-yellow-800'
                        }`}>
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/volunteers/${volunteer.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                                View
                                            </Link>
                                            <Link href={`/volunteers/${volunteer.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}