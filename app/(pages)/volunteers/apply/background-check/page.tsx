'use client';

import { useState } from 'react';

const BackgroundCheckForm = () => {
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        dateOfBirth: '',
        //ssn: '',
        currentAddress: '',
        city: '',
        state: '',
        zipCode: '',
        county: '',

        // Race/Gender
        race: '',
        gender: '',
        
        // Certification
        agreeToBackgroundCheck: false,
        electronicSignature: '',
        signatureDate: new Date().toISOString().split('T')[0],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type, checked } = target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Update this API endpoint as needed
            const response = await fetch('/api/background-check/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitMessage('Background check form submitted successfully!');
                // Reset form or redirect
                setFormData({
                    fullName: '',
                    dateOfBirth: '',
                    //ssn: '',
                    currentAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    county: '',
                    race: '',
                    gender: '',
                    agreeToBackgroundCheck: false,
                    electronicSignature: '',
                    signatureDate: new Date().toISOString().split('T')[0],
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage('There was an error submitting your background check form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Background Check Form</h1>
                <p className="text-gray-600 mt-2">
                    Please complete this background check form as part of our volunteer screening process.
                </p>
            </header>

            <form className="bg-white rounded-lg shadow-md p-6 space-y-8" onSubmit={handleSubmit}>
                
                {/* Personal Information Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* <div>
                            <label className="block mb-2 font-medium">Social Security Number</label>
                            <input
                                type="text"
                                name="ssn"
                                value={formData.ssn}
                                onChange={handleChange}
                                placeholder="XXX-XX-XXXX"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div> */}

                        <div>
                            <label className="block mb-2 font-medium">County</label>
                            <input
                                type="text"
                                name="county"
                                value={formData.county}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Current Address</label>
                            <input
                                type="text"
                                name="currentAddress"
                                value={formData.currentAddress}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Race/Gender Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Race/Gender</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Race</label>
                            <select
                                name="race"
                                value={formData.race}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Select Race --</option>
                                <option value="White">White</option>
                                <option value="Black or African American">Black or African American</option>
                                <option value="Asian">Asian</option>
                                <option value="Native Hawaiian or Pacific Islander">Native Hawaiian or Pacific Islander</option>
                                <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                                <option value="Hispanic or Latino">Hispanic or Latino</option>
                                <option value="Two or More Races">Two or More Races</option>
                                <option value="Other">Other</option>
                                <option value="Prefer Not to Say">Prefer Not to Say</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Other">Other</option>
                                <option value="Prefer Not to Say">Prefer Not to Say</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Certification Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Certification</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="agreeToBackgroundCheck"
                                    checked={formData.agreeToBackgroundCheck}
                                    onChange={handleChange}
                                    className="mr-2"
                                    required
                                />
                                <span className="font-medium">I agree to a background check and authorize the release of background check information</span>
                            </label>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Electronic Signature</label>
                            <input
                                type="text"
                                name="electronicSignature"
                                value={formData.electronicSignature}
                                onChange={handleChange}
                                placeholder="Type your full name as signature"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Date</label>
                            <input
                                type="date"
                                name="signatureDate"
                                value={formData.signatureDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Background Check Form'}
                    </button>
                </div>

                {/* Message Display */}
                {submitMessage && (
                    <div className={`p-4 rounded ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {submitMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default BackgroundCheckForm;
