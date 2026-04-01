'use client';

import { useState } from 'react';

const BackgroundCheckForm = () => {
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        dateOfBirth: '',
        ssn: '',
        email: '',
        phoneNumber: '',
        currentAddress: '',
        city: '',
        state: '',
        zipCode: '',
        
        // Identification
        driversLicenseNumber: '',
        driversLicenseState: '',
        driversLicenseExpiration: '',
        
        // Employment History
        currentEmployer: '',
        currentPosition: '',
        yearsAtCurrentJob: '',
        previousEmployer: '',
        previousPosition: '',
        
        // Background Information
        hasCriminalHistory: '',
        criminalHistoryDetails: '',
        hasBeenDeniedJob: '',
        denialDetails: '',
        hasBeenTerminated: '',
        terminationDetails: '',
        
        // References
        referenceName1: '',
        referencePhone1: '',
        referenceCompany1: '',
        referenceName2: '',
        referencePhone2: '',
        referenceCompany2: '',
        
        // Additional Information
        additionalInfo: '',
        agreeToBackgroundCheck: false,
        electronicSignature: '',
        signatureDate: new Date().toISOString().split('T')[0],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
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
                    ssn: '',
                    email: '',
                    phoneNumber: '',
                    currentAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    driversLicenseNumber: '',
                    driversLicenseState: '',
                    driversLicenseExpiration: '',
                    currentEmployer: '',
                    currentPosition: '',
                    yearsAtCurrentJob: '',
                    previousEmployer: '',
                    previousPosition: '',
                    hasCriminalHistory: '',
                    criminalHistoryDetails: '',
                    hasBeenDeniedJob: '',
                    denialDetails: '',
                    hasBeenTerminated: '',
                    terminationDetails: '',
                    referenceName1: '',
                    referencePhone1: '',
                    referenceCompany1: '',
                    referenceName2: '',
                    referencePhone2: '',
                    referenceCompany2: '',
                    additionalInfo: '',
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

                        <div>
                            <label className="block mb-2 font-medium">Social Security Number</label>
                            <input
                                type="text"
                                name="ssn"
                                value={formData.ssn}
                                onChange={handleChange}
                                placeholder="XXX-XX-XXXX"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
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

                {/* Identification Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Identification</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Driver's License Number</label>
                            <input
                                type="text"
                                name="driversLicenseNumber"
                                value={formData.driversLicenseNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">State</label>
                            <input
                                type="text"
                                name="driversLicenseState"
                                value={formData.driversLicenseState}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Expiration Date</label>
                            <input
                                type="date"
                                name="driversLicenseExpiration"
                                value={formData.driversLicenseExpiration}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Employment History Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Employment History</h2>

                    <div className="mb-6 pb-6 border-b">
                        <h3 className="font-medium mb-3">Current Employment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">Employer</label>
                                <input
                                    type="text"
                                    name="currentEmployer"
                                    value={formData.currentEmployer}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Position</label>
                                <input
                                    type="text"
                                    name="currentPosition"
                                    value={formData.currentPosition}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Years at Job</label>
                                <input
                                    type="text"
                                    name="yearsAtCurrentJob"
                                    value={formData.yearsAtCurrentJob}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Previous Employment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">Employer</label>
                                <input
                                    type="text"
                                    name="previousEmployer"
                                    value={formData.previousEmployer}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Position</label>
                                <input
                                    type="text"
                                    name="previousPosition"
                                    value={formData.previousPosition}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Background Information Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Background Information</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-medium">Have you ever been convicted of a crime?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasCriminalHistory"
                                        value="yes"
                                        checked={formData.hasCriminalHistory === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasCriminalHistory"
                                        value="no"
                                        checked={formData.hasCriminalHistory === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                            {formData.hasCriminalHistory === 'yes' && (
                                <textarea
                                    name="criminalHistoryDetails"
                                    value={formData.criminalHistoryDetails}
                                    onChange={handleChange}
                                    placeholder="Please explain in detail..."
                                    className="w-full p-2 border rounded mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Have you ever been denied employment due to background check?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasBeenDeniedJob"
                                        value="yes"
                                        checked={formData.hasBeenDeniedJob === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasBeenDeniedJob"
                                        value="no"
                                        checked={formData.hasBeenDeniedJob === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                            {formData.hasBeenDeniedJob === 'yes' && (
                                <textarea
                                    name="denialDetails"
                                    value={formData.denialDetails}
                                    onChange={handleChange}
                                    placeholder="Please explain in detail..."
                                    className="w-full p-2 border rounded mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Have you ever been terminated from employment?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasBeenTerminated"
                                        value="yes"
                                        checked={formData.hasBeenTerminated === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="hasBeenTerminated"
                                        value="no"
                                        checked={formData.hasBeenTerminated === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                            {formData.hasBeenTerminated === 'yes' && (
                                <textarea
                                    name="terminationDetails"
                                    value={formData.terminationDetails}
                                    onChange={handleChange}
                                    placeholder="Please explain in detail..."
                                    className="w-full p-2 border rounded mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* References Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Professional References</h2>

                    <div className="mb-6 pb-6 border-b">
                        <h3 className="font-medium mb-3">Reference 1</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">Name</label>
                                <input
                                    type="text"
                                    name="referenceName1"
                                    value={formData.referenceName1}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="referencePhone1"
                                    value={formData.referencePhone1}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Company/Organization</label>
                                <input
                                    type="text"
                                    name="referenceCompany1"
                                    value={formData.referenceCompany1}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Reference 2</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">Name</label>
                                <input
                                    type="text"
                                    name="referenceName2"
                                    value={formData.referenceName2}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="referencePhone2"
                                    value={formData.referencePhone2}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Company/Organization</label>
                                <input
                                    type="text"
                                    name="referenceCompany2"
                                    value={formData.referenceCompany2}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Information Section */}
                <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">Additional Information</h2>

                    <div>
                        <label className="block mb-2 font-medium">Additional Comments or Information</label>
                        <textarea
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Please provide any additional information you feel is relevant..."
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={5}
                        />
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
