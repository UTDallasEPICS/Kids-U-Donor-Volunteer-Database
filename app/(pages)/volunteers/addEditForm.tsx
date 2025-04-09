'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Volunteer {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    skills: string[];
    availability: string[];
    status: string;
    notes: string;
}

export default function EditVolunteerPage({ params }: { params?: { id: string } }) {
    const router = useRouter();
    const isEditing = params?.id !== undefined;

    const [volunteer, setVolunteer] = useState<Volunteer>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        skills: [],
        availability: [],
        status: 'pending',
        notes: ''
    });

    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const availabilityOptions = [
        'Weekday mornings',
        'Weekday afternoons',
        'Weekday evenings',
        'Weekend mornings',
        'Weekend afternoons',
        'Weekend evenings'
    ];

    useEffect(() => {
        if (isEditing) {
            const fetchVolunteer = async () => {
                try {
                    const response = await fetch(`/api/volunteers/${params?.id}`);
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
        }
    }, [params?.id, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVolunteer(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (checked) {
            setVolunteer(prev => ({
                ...prev,
                availability: [...prev.availability, name]
            }));
        } else {
            setVolunteer(prev => ({
                ...prev,
                availability: prev.availability.filter(item => item !== name)
            }));
        }
    };

    const addSkill = () => {
        if (skillInput.trim() !== '' && !volunteer.skills.includes(skillInput.trim().toLowerCase())) {
            setVolunteer(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim().toLowerCase()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setVolunteer(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const url = isEditing ? `/api/volunteers/${params?.id}` : '/api/volunteers';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(volunteer),
            });

            if (!response.ok) {
                throw new Error('Failed to save volunteer');
            }

            router.push('/volunteers');
            router.refresh();
        } catch (err) {
            console.error('Error saving volunteer:', err);
            setError('Failed to save volunteer. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        if (!confirm('Are you sure you want to delete this volunteer? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/volunteers/${params?.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete volunteer');
            }

            router.push('/volunteers');
            router.refresh();
        } catch (err) {
            console.error('Error deleting volunteer:', err);
            setError('Failed to delete volunteer. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading volunteer data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/volunteers" className="flex items-center text-blue-600 hover:text-blue-800">
                    <ChevronLeft size={16} />
                    <span className="ml-1">Back to Volunteers</span>
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">
                {isEditing ? 'Edit Volunteer' : 'Add New Volunteer'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name*
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={volunteer.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name*
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={volunteer.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address*
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={volunteer.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={volunteer.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={volunteer.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {volunteer.skills.map((skill, index) => (
                                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSkill();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Availability
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {availabilityOptions.map((option) => (
                                <div key={option} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={option}
                                        name={option}
                                        checked={volunteer.availability.includes(option)}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor={option} className="ml-2 text-sm text-gray-700">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={volunteer.notes}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete Volunteer
                                </button>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                href="/volunteers"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center ${
                                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Save Volunteer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}