"use client";

import { useState, useEffect } from "react";

// Could be removed

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
    <label className="block mb-2 font-medium">
      {label}
      {required && <span className="text-red-500 ml-0.5"> *</span>}
    </label>
    {children}
  </div>
);

const defaultFormData = {
  fullName: "",
  dateOfBirth: "",
  currentAddress: "",
  city: "",
  state: "",
  zipCode: "",
  county: "",
  race: "",
  sex: "",
  agreeToBackgroundCheck: false,
  electronicSignature: "",
  signatureDate: new Date().toISOString().split("T")[0],
};

const BackgroundCheckForm = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [bgCheckApproved, setBgCheckApproved] = useState(false);
  const [bgCheckRejected, setBgCheckRejected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetch("/api/background-check/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.submitted) setAlreadySubmitted(true);
        if (data.submitted && data.record?.status === "APPROVED") setBgCheckApproved(true);
        if (data.submitted && data.record?.status === "REJECTED") setBgCheckRejected(true);
      })
      .catch(() => {
        /* non-blocking */
      })
      .finally(() => setStatusLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type, checked } = target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/background-check/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlreadySubmitted(true);
        setShowForm(false);
        setFormData(defaultFormData);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("There was an error submitting your background check form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (statusLoading) {
    return <div className="container mx-auto px-4 py-8 max-w-4xl text-center text-gray-500">Loading...</div>;
  }

  if (bgCheckApproved) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Background Check Form</h1>
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
          <p className="text-gray-600">Your background check has been reviewed and approved.</p>
        </div>
      </div>
    );
  }

  if (bgCheckRejected && !showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Background Check Form</h1>
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
            Your background check was not approved. Please contact Kids-U for more information.
          </p>
          <button
            onClick={() => {
              setBgCheckRejected(false);
              setAlreadySubmitted(false);
              setShowForm(true);
            }}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Submit a New Form
          </button>
        </div>
      </div>
    );
  }

  if (alreadySubmitted && !showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Background Check Form</h1>
        </header>
        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
            Sent
          </div>
          <p className="text-gray-600">Your background check form has been submitted and is pending review.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Submit a New Form
          </button>
        </div>
      </div>
    );
  }

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
            <Field label="Full Name" required>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </Field>

            <Field label="Date of Birth" required>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </Field>

            <Field label="Current Address">
              <input
                type="text"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="City">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="State">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="Zip Code">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>

            <Field label="County">
              <input
                type="text"
                name="county"
                value={formData.county}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>
          </div>
        </section>

        {/* Race/Gender Section */}
        <section>
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Race/Gender</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Race" required>
              <select
                name="race"
                value={formData.race}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select Race --</option>
                <option value="African American">African American</option>
                <option value="American Indian">American Indian</option>
                <option value="Asian">Asian</option>
                <option value="Anglo">Anglo</option>
                <option value="Hispanic or Latino">Hispanic or Latino</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Sex" required>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
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
                <span className="font-medium">
                  I agree to a background check and authorize the release of background check information
                  <span className="text-red-500 ml-0.5"> *</span>
                </span>
              </label>
            </div>

            <Field label="Electronic Signature" required>
              <input
                type="text"
                name="electronicSignature"
                value={formData.electronicSignature}
                onChange={handleChange}
                placeholder="Type your full name as signature"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Field>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit Background Check Form"}
          </button>
          {alreadySubmitted && (
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSubmitMessage("");
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {submitMessage && <div className="p-4 rounded bg-red-100 text-red-700">{submitMessage}</div>}
      </form>
    </div>
  );
};

export default BackgroundCheckForm;
