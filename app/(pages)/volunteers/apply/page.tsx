'use client';

import { useState } from 'react';

const VolunteerApplication = () => {
    const [step, setStep] = useState<'form' | 'confirm'>('form');
    const [formData, setFormData] = useState({
        // Personal Information
        date: new Date().toISOString().split('T')[0],
        legalName: '',
        preferredName: '',
        maidenName: '',
        ssn: '',
        currentAddress: '',
        phone: '',
        email: '',
        isCitizen: '',
        hasDriverLicense: '',
        drivesOwnVehicle: '',
        languages: '',
        otherLanguages: '',
        heardAboutPosition: '',

        // Emergency Contacts
        emergencyContactName: '',
        emergencyContactPhone: '',
        professionalReferenceName: '',
        professionalReferencePhone: '',
        personalReferenceName: '',
        personalReferencePhone: '',

        // Education
        highestEducation: '',
        highSchoolName: '',
        collegeDegree: '',
        collegeName: '',

        // Volunteer Questions
        whyVolunteer: '',

        // Legal
        hasCriminalRecord: '',
        criminalRecordExplanation: '',

        // Background Check
        dob: '',
        driversLicenseNumber: '',
        driversLicenseState: '',
        positionAppliedFor: '',
        gender: '',
        race: '',

        // Certification
        agreeToBackgroundCheck: false,
        electronicSignature: '',
        parentSignature: '',
        parentSignatureDate: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                legalName: formData.legalName,
                maidenName: formData.maidenName || null,
                ssn: formData.ssn,
                preferredName: formData.preferredName || null,
                currentAddress: formData.currentAddress,
                phoneNumber: formData.phone,
                email: formData.email,
                usCitizen: formData.isCitizen === 'yes',
                driversLicense: formData.hasDriverLicense === 'yes',
                ownCar: formData.drivesOwnVehicle === 'yes',
                speakSpanish: formData.languages === 'yes',
                otherLanguages: formData.otherLanguages || null,
                heardAbout: formData.heardAboutPosition || null,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                professionalRefName: formData.professionalReferenceName,
                professionalRefPhone: formData.professionalReferencePhone,
                personalRefName: formData.personalReferenceName,
                personalRefPhone: formData.personalReferencePhone,
                educationLevel: formData.highestEducation,
                highSchoolName: formData.highSchoolName || null,
                collegeName: formData.collegeName || null,
                degreeObtained: formData.collegeDegree || null,
                additionalInfo1: null, // or use formData fields if you have more
                additionalInfo2: null,
                arrestedOrConvicted: formData.hasCriminalRecord === 'yes',
                convictionExplanation: formData.criminalRecordExplanation || null,
                agreedToTerms: formData.agreeToBackgroundCheck,
                eSignature: formData.electronicSignature
            };
    
            const response = await fetch('/api/volunteer/application/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                alert('Application submitted successfully!');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your application.');
        }
    };
    

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Kids-U Volunteer Application</h1>
                <p className="text-gray-600 mt-2">
                    Dallas Community Lighthouse dba Kids-U is a nonprofit, 501c3 organization which does not discriminate in the recruitment and placement of volunteers.
                </p>
            </header>

            {step === 'form' ? (
                <form className="bg-white rounded-lg shadow-md p-6 space-y-8">
                    {/* Personal Information Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Legal Name</label>
                                <input
                                    type="text"
                                    name="legalName"
                                    value={formData.legalName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Preferred Name</label>
                                <input
                                    type="text"
                                    name="preferredName"
                                    value={formData.preferredName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Maiden Name (if applicable)</label>
                                <input
                                    type="text"
                                    name="maidenName"
                                    value={formData.maidenName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">SSN (Last 4 digits only)</label>
                                <input
                                    type="text"
                                    name="ssn"
                                    value={formData.ssn}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    pattern="\d{4}"
                                    maxLength={4}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Current Address</label>
                                <input
                                    type="text"
                                    name="currentAddress"
                                    value={formData.currentAddress}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex items-center">
                                <label className="mr-4">Are you a U.S. citizen or lawful permanent resident?</label>
                                <label className="mr-4">
                                    <input
                                        type="radio"
                                        name="isCitizen"
                                        value="yes"
                                        checked={formData.isCitizen === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="isCitizen"
                                        value="no"
                                        checked={formData.isCitizen === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>

                            <div className="flex items-center">
                                <label className="mr-4">Do you have a driver's license?</label>
                                <label className="mr-4">
                                    <input
                                        type="radio"
                                        name="hasDriverLicense"
                                        value="yes"
                                        checked={formData.hasDriverLicense === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="hasDriverLicense"
                                        value="no"
                                        checked={formData.hasDriverLicense === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>

                            {formData.hasDriverLicense === 'yes' && (
                                <div className="flex items-center">
                                    <label className="mr-4">Do you drive your own vehicle?</label>
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            name="drivesOwnVehicle"
                                            value="yes"
                                            checked={formData.drivesOwnVehicle === 'yes'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="drivesOwnVehicle"
                                            value="no"
                                            checked={formData.drivesOwnVehicle === 'no'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        No
                                    </label>
                                </div>
                            )}

                                
                                <div className="flex items-center">
                                    <label className="mr-4">Do you speak Spanish?</label>
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            name="languages"
                                            value="yes"
                                            checked={formData.languages === 'yes'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="languages"
                                            value="no"
                                            checked={formData.languages === 'no'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        No
                                    </label>
                                </div>
                            
                                <div>
                                <label className="block mb-2">Do you speak other languages?</label>
                                <input
                                    type="text"
                                    name="otherLanguages"
                                    value={formData.otherLanguages}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-2">How did you hear about this volunteer position?</label>
                                <input
                                    type="text"
                                    name="heardAboutPosition"
                                    value={formData.heardAboutPosition}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contacts & References Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Contacts & References</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2">Emergency Contact Name</label>
                                <input
                                    type="text"
                                    name="emergencyContactName"
                                    value={formData.emergencyContactName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Emergency Contact Phone</label>
                                <input
                                    type="tel"
                                    name="emergencyContactPhone"
                                    value={formData.emergencyContactPhone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Professional Reference Name</label>
                                <input
                                    type="text"
                                    name="professionalReferenceName"
                                    value={formData.professionalReferenceName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Professional Reference Phone</label>
                                <input
                                    type="tel"
                                    name="professionalReferencePhone"
                                    value={formData.professionalReferencePhone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Personal Reference Name</label>
                                <input
                                    type="text"
                                    name="personalReferenceName"
                                    value={formData.personalReferenceName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Personal Reference Phone</label>
                                <input
                                    type="tel"
                                    name="personalReferencePhone"
                                    value={formData.personalReferencePhone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Education Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Education</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2">Highest level of education completed</label>
                                <select
                                    name="highestEducation"
                                    value={formData.highestEducation}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select education level</option>
                                    <option value="high_school">High School</option>
                                    <option value="some_college">Some College</option>
                                    <option value="associate">Associate Degree</option>
                                    <option value="bachelor">Bachelor's Degree</option>
                                    <option value="master">Master's Degree</option>
                                    <option value="doctorate">Doctorate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2">Name of High School</label>
                                <input
                                    type="text"
                                    name="highSchoolName"
                                    value={formData.highSchoolName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">What degree was obtained? (if applicable)</label>
                                <input
                                    type="text"
                                    name="collegeDegree"
                                    value={formData.collegeDegree}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Name of College/University (if applicable)</label>
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Volunteer Questions */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Volunteer Questions</h2>

                        <div>
                            <label className="block mb-2">Why do you want to volunteer at Kids-U?</label>
                            <textarea
                                name="whyVolunteer"
                                value={formData.whyVolunteer}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                rows={4}
                                required
                            />
                        </div>
                    </section>

                    {/* Legal Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Legal Information</h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="mr-4">Have you ever been arrested or convicted of any criminal offense?</label>
                                <label className="mr-4">
                                    <input
                                        type="radio"
                                        name="hasCriminalRecord"
                                        value="yes"
                                        checked={formData.hasCriminalRecord === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="hasCriminalRecord"
                                        value="no"
                                        checked={formData.hasCriminalRecord === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>

                            {formData.hasCriminalRecord === 'yes' && (
                                <div>
                                    <label className="block mb-2">Please explain:</label>
                                    <textarea
                                        name="criminalRecordExplanation"
                                        value={formData.criminalRecordExplanation}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                        required={formData.hasCriminalRecord === 'yes'}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Background Check Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Background Verification</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Driver's License Number</label>
                                <input
                                    type="text"
                                    name="driversLicenseNumber"
                                    value={formData.driversLicenseNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">State Issued</label>
                                <input
                                    type="text"
                                    name="driversLicenseState"
                                    value={formData.driversLicenseState}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Position Applied For</label>
                                <input
                                    type="text"
                                    name="positionAppliedFor"
                                    value={formData.positionAppliedFor}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2">Race/Ethnicity</label>
                                <select
                                    name="race"
                                    value={formData.race}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select race/ethnicity</option>
                                    <option value="african_american">African American</option>
                                    <option value="american_indian">American Indian</option>
                                    <option value="anglo">Anglo</option>
                                    <option value="asian">Asian</option>
                                    <option value="hispanic">Hispanic</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Certification Section */}
                    <section>
                        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Certification</h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeToBackgroundCheck"
                                    checked={formData.agreeToBackgroundCheck}
                                    onChange={handleChange}
                                    className="mt-1 mr-2"
                                    required
                                />
                                <label>
                                    I hereby certify that all information submitted on this application is true and give Dallas Community Lighthouse dba Kids-U permission to conduct a criminal background check and contact my references.
                                </label>
                            </div>

                            <div>
                                <label className="block mb-2">Applicant Electronic Signature (Full Name)</label>
                                <input
                                    type="text"
                                    name="electronicSignature"
                                    value={formData.electronicSignature}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2">Parent/Guardian Signature (if under 18)</label>
                                    <input
                                        type="text"
                                        name="parentSignature"
                                        value={formData.parentSignature}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2">Parent/Guardian Signature Date</label>
                                    <input
                                        type="date"
                                        name="parentSignatureDate"
                                        value={formData.parentSignatureDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => window.scrollTo(0, 0)}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Back to Top
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('confirm')}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Review Application
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>

                    <div className="space-y-8">
                        {/* Personal Information Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Date:</p>
                                    <p>{formData.date}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Legal Name:</p>
                                    <p>{formData.legalName}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Preferred Name:</p>
                                    <p>{formData.preferredName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Maiden Name:</p>
                                    <p>{formData.maidenName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">SSN (Last 4 digits):</p>
                                    <p>{formData.ssn}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Current Address:</p>
                                    <p>{formData.currentAddress}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Phone:</p>
                                    <p>{formData.phone}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Email:</p>
                                    <p>{formData.email}</p>
                                </div>
                                <div>
                                    <p className="font-medium">U.S. Citizen/Permanent Resident:</p>
                                    <p>{formData.isCitizen === 'yes' ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Has Driver's License:</p>
                                    <p>{formData.hasDriverLicense === 'yes' ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Drives own car:</p>
                                    <p>{formData.drivesOwnVehicle === 'yes' ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Speaks Spanish:</p>
                                    <p>{formData.languages === 'yes' ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Speaks other languages:</p>
                                    <p>{formData.otherLanguages || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">How heard about position:</p>
                                    <p>{formData.heardAboutPosition || 'Not specified'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Contacts & References Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contacts & References</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="font-medium">Emergency Contact:</p>
                                    <p>{formData.emergencyContactName}</p>
                                    <p>{formData.emergencyContactPhone}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Professional Reference:</p>
                                    <p>{formData.professionalReferenceName}</p>
                                    <p>{formData.professionalReferencePhone}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Personal Reference:</p>
                                    <p>{formData.personalReferenceName}</p>
                                    <p>{formData.personalReferencePhone}</p>
                                </div>
                            </div>
                        </section>

                        {/* Education Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Education</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Highest Education:</p>
                                    <p>{formData.highestEducation}</p>
                                </div>
                                <div>
                                    <p className="font-medium">High School Name:</p>
                                    <p>{formData.highSchoolName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">College Degree:</p>
                                    <p>{formData.collegeDegree || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">College Name:</p>
                                    <p>{formData.collegeName || 'N/A'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Volunteer Questions Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Why Volunteer at Kids-U?</h3>
                            <p className="whitespace-pre-line">{formData.whyVolunteer}</p>
                        </section>

                        {/* Legal Information Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Legal Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Criminal Record:</p>
                                    <p>{formData.hasCriminalRecord === 'yes' ? 'Yes' : 'No'}</p>
                                </div>
                                {formData.hasCriminalRecord === 'yes' && (
                                    <div>
                                        <p className="font-medium">Explanation:</p>
                                        <p className="whitespace-pre-line">{formData.criminalRecordExplanation}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Background Verification Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Background Verification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Date of Birth:</p>
                                    <p>{formData.dob}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Driver's License Number:</p>
                                    <p>{formData.driversLicenseNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">State Issued:</p>
                                    <p>{formData.driversLicenseState || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Position Applied For:</p>
                                    <p>{formData.positionAppliedFor}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Gender:</p>
                                    <p>{formData.gender}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Race/Ethnicity:</p>
                                    <p>{formData.race}</p>
                                </div>
                            </div>
                        </section>

                        {/* Certification Review */}
                        <section>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Certification</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Agrees to background check:</p>
                                    <p>{formData.agreeToBackgroundCheck ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Applicant Signature:</p>
                                    <p>{formData.electronicSignature}</p>
                                    <p>Date: {formData.date}</p>
                                </div>
                                {formData.parentSignature && (
                                    <div>
                                        <p className="font-medium">Parent/Guardian Signature:</p>
                                        <p>{formData.parentSignature}</p>
                                        <p>Date: {formData.parentSignatureDate}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={() => setStep('form')}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Back to Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerApplication;