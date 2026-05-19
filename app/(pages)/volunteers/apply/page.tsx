"use client";

import { useState, useEffect, type ChangeEvent } from "react";

const Field = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block mb-2">
      {label}
      {required && <span className="text-red-500 ml-0.5"> *</span>}
    </label>
    {children}
  </div>
);

const RadioGroup = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-center">
    <span className="mr-4">
      {label}
      {required && <span className="text-red-500 ml-0.5"> *</span>}
    </span>
    {children}
  </div>
);

const VolunteerApplication = () => {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [appStatus, setAppStatus] = useState<"loading" | "NONE" | "PENDING" | "APPROVED" | "REJECTED">("loading");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/volunteer/application/check")
      .then((res) => res.json())
      .then((data) => setAppStatus(data.status ?? "NONE"))
      .catch(() => setAppStatus("NONE"));
  }, []);

  const [formData, setFormData] = useState({
    // Personal Information
    date: new Date().toISOString().split("T")[0],
    legalName: "",
    preferredName: "",
    maidenName: "",
    // ssn: "",
    currentAddress: "",
    phone: "",
    email: "",
    isCitizen: "",
    hasDriverLicense: "",
    drivesOwnVehicle: "",
    languages: "",
    otherLanguages: "",
    heardAboutPosition: "",

    // Emergency Contacts
    emergencyContactName: "",
    emergencyContactPhone: "",
    professionalReferenceName: "",
    professionalReferencePhone: "",
    personalReferenceName: "",
    personalReferencePhone: "",

    // Education
    highestEducation: "",
    highSchoolName: "",
    collegeDegree: "",
    collegeName: "",

    // Volunteer Questions
    whyVolunteer: "",

    // Legal
    hasCriminalRecord: "",
    criminalRecordExplanation: "",

    // Background Check
    dob: "",
    driversLicenseNumber: "",
    driversLicenseState: "",
    positionAppliedFor: "",
    gender: "",
    race: "",

    // Certification
    agreeToBackgroundCheck: false,
    electronicSignature: "",
    parentSignature: "",
    parentSignatureDate: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const nextValue = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({
      ...prev,
      [target.name]: nextValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        legalName: formData.legalName,
        maidenName: formData.maidenName || null,
        ssn: "",
        preferredName: formData.preferredName || null,
        currentAddress: formData.currentAddress,
        phoneNumber: formData.phone,
        email: formData.email,
        usCitizen: formData.isCitizen === "yes",
        driversLicense: formData.hasDriverLicense === "yes",
        ownCar: formData.drivesOwnVehicle === "yes",
        speakSpanish: formData.languages === "yes",
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
        additionalInfo1: null,
        additionalInfo2: null,
        arrestedOrConvicted: formData.hasCriminalRecord === "yes",
        convictionExplanation: formData.criminalRecordExplanation || null,
        agreedToTerms: formData.agreeToBackgroundCheck,
        eSignature: formData.electronicSignature,
      };

      const response = await fetch("/api/volunteer/application/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAppStatus("PENDING");
        setShowForm(false);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your application.");
    }
  };

  if (appStatus === "loading") {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  if (appStatus === "PENDING" && !showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Kids-U Volunteer Application</h1>
        </header>
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
            Sent
          </div>
          <p className="text-gray-600">Your volunteer application has been submitted and is pending review.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Submit a New Application
          </button>
        </div>
      </div>
    );
  }

  if (appStatus === "APPROVED") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Kids-U Volunteer Application</h1>
        </header>
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Approved
          </div>
          <p className="text-gray-600">
            Your volunteer application has been reviewed and approved. Welcome to the team!
          </p>
        </div>
      </div>
    );
  }

  if (appStatus === "REJECTED" && !showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Kids-U Volunteer Application</h1>
        </header>
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-full text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Not Approved
          </div>
          <p className="text-gray-600">
            Your application was not approved. Please contact Kids-U for more information.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Submit a New Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Kids-U Volunteer Application</h1>
        <p className="text-gray-600 mt-2">
          Dallas Community Lighthouse dba Kids-U is a nonprofit, 501c3 organization which does not discriminate in the
          recruitment and placement of volunteers.
        </p>
      </header>

      {step === "form" ? (
        <form className="bg-white rounded-lg shadow-md p-6 space-y-8">
          {/* Personal Information Section */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Date" required>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Legal Name" required>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Preferred Name">
                <input
                  type="text"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              <Field label="Maiden Name (if applicable)">
                <input
                  type="text"
                  name="maidenName"
                  value={formData.maidenName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              {/* <Field label="SSN (Last 4 digits only)" required>
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
              </Field> */}

              <Field label="Current Address" required>
                <input
                  type="text"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Phone Number" required>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>
            </div>

            <div className="mt-4 space-y-4">
              <RadioGroup label="Are you a U.S. citizen or lawful permanent resident?" required>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="isCitizen"
                    value="yes"
                    checked={formData.isCitizen === "yes"}
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
                    checked={formData.isCitizen === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </RadioGroup>

              <RadioGroup label="Do you have a driver's license?" required>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="hasDriverLicense"
                    value="yes"
                    checked={formData.hasDriverLicense === "yes"}
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
                    checked={formData.hasDriverLicense === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </RadioGroup>

              {formData.hasDriverLicense === "yes" && (
                <RadioGroup label="Do you drive your own vehicle?">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="drivesOwnVehicle"
                      value="yes"
                      checked={formData.drivesOwnVehicle === "yes"}
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
                      checked={formData.drivesOwnVehicle === "no"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </RadioGroup>
              )}

              <RadioGroup label="Do you speak Spanish?">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="languages"
                    value="yes"
                    checked={formData.languages === "yes"}
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
                    checked={formData.languages === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </RadioGroup>

              <Field label="Do you speak other languages?" required>
                <input
                  type="text"
                  name="otherLanguages"
                  value={formData.otherLanguages}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="How did you hear about this volunteer position?">
                <input
                  type="text"
                  name="heardAboutPosition"
                  value={formData.heardAboutPosition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>
            </div>
          </section>

          {/* Contacts & References Section */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Contacts & References</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Emergency Contact Name" required>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Emergency Contact Phone" required>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Professional Reference Name" required>
                <input
                  type="text"
                  name="professionalReferenceName"
                  value={formData.professionalReferenceName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Professional Reference Phone" required>
                <input
                  type="tel"
                  name="professionalReferencePhone"
                  value={formData.professionalReferencePhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Personal Reference Name" required>
                <input
                  type="text"
                  name="personalReferenceName"
                  value={formData.personalReferenceName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Personal Reference Phone" required>
                <input
                  type="tel"
                  name="personalReferencePhone"
                  value={formData.personalReferencePhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Education</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Highest level of education completed" required>
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
                  <option value="bachelor">Bachelor&apos;s Degree</option>
                  <option value="master">Master&apos;s Degree</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </Field>

              <Field label="Name of High School">
                <input
                  type="text"
                  name="highSchoolName"
                  value={formData.highSchoolName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              <Field label="What degree was obtained? (if applicable)">
                <input
                  type="text"
                  name="collegeDegree"
                  value={formData.collegeDegree}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              <Field label="Name of College/University (if applicable)">
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>
            </div>
          </section>

          {/* Volunteer Questions */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Volunteer Questions</h2>

            <Field label="Why do you want to volunteer at Kids-U?" required>
              <textarea
                name="whyVolunteer"
                value={formData.whyVolunteer}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </Field>
          </section>

          {/* Legal Section */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Legal Information</h2>

            <div className="space-y-4">
              <RadioGroup label="Have you ever been arrested or convicted of any criminal offense?" required>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="hasCriminalRecord"
                    value="yes"
                    checked={formData.hasCriminalRecord === "yes"}
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
                    checked={formData.hasCriminalRecord === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </RadioGroup>

              {formData.hasCriminalRecord === "yes" && (
                <Field label="Please explain:" required>
                  <textarea
                    name="criminalRecordExplanation"
                    value={formData.criminalRecordExplanation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </Field>
              )}
            </div>
          </section>

          {/* Background Verification Section */}
          <section>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Background Verification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Date of Birth" required>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Driver's License Number">
                <input
                  type="text"
                  name="driversLicenseNumber"
                  value={formData.driversLicenseNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              <Field label="State Issued">
                <input
                  type="text"
                  name="driversLicenseState"
                  value={formData.driversLicenseState}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </Field>

              <Field label="Position Applied For" required>
                <input
                  type="text"
                  name="positionAppliedFor"
                  value={formData.positionAppliedFor}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Gender" required>
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
              </Field>

              <Field label="Race/Ethnicity" required>
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
              </Field>
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
                  I hereby certify that all information submitted on this application is true and give Dallas Community
                  Lighthouse dba Kids-U permission to conduct a criminal background check and contact my references.
                  <span className="text-red-500 ml-0.5"> *</span>
                </label>
              </div>

              <Field label="Applicant Electronic Signature (Full Name)" required>
                <input
                  type="text"
                  name="electronicSignature"
                  value={formData.electronicSignature}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <Field label="Date" required>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Parent/Guardian Signature (if under 18)">
                  <input
                    type="text"
                    name="parentSignature"
                    value={formData.parentSignature}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </Field>

                <Field label="Parent/Guardian Signature Date">
                  <input
                    type="date"
                    name="parentSignatureDate"
                    value={formData.parentSignatureDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </Field>
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
              onClick={() => setStep("confirm")}
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
                  <p>{formData.preferredName || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Maiden Name:</p>
                  <p>{formData.maidenName || "N/A"}</p>
                </div>
                {/* <div>
                  <p className="font-medium">SSN (Last 4 digits):</p>
                  <p>{formData.ssn}</p>
                </div> */}
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
                  <p>{formData.isCitizen === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-medium">Has Driver&apos;s License:</p>
                  <p>{formData.hasDriverLicense === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-medium">Drives own car:</p>
                  <p>{formData.drivesOwnVehicle === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-medium">Speaks Spanish:</p>
                  <p>{formData.languages === "yes" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="font-medium">Speaks other languages:</p>
                  <p>{formData.otherLanguages || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-medium">How heard about position:</p>
                  <p>{formData.heardAboutPosition || "Not specified"}</p>
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
                  <p>{formData.highSchoolName || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">College Degree:</p>
                  <p>{formData.collegeDegree || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">College Name:</p>
                  <p>{formData.collegeName || "N/A"}</p>
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
                  <p>{formData.hasCriminalRecord === "yes" ? "Yes" : "No"}</p>
                </div>
                {formData.hasCriminalRecord === "yes" && (
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
                  <p className="font-medium">Driver&apos;s License Number:</p>
                  <p>{formData.driversLicenseNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">State Issued:</p>
                  <p>{formData.driversLicenseState || "N/A"}</p>
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
                  <p>{formData.agreeToBackgroundCheck ? "Yes" : "No"}</p>
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
                onClick={() => setStep("form")}
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
