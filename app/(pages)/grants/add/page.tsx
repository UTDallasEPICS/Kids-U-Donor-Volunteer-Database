"use client";
import React, { useState } from "react";
import { PlusCircle, X } from 'lucide-react';
import axios, { AxiosError } from 'axios';

interface FormData {
  name: string;
  status: string;
  amountRequested: string;
  amountAwarded: string;
  purpose: string;
  startDate: string;
  endDate: string;
  isMultipleYears: boolean;
  quarter: string;
  acknowledgementSent: boolean;
  awardNotificationDate: string;
  fundingArea: string;
  proposalDueDate: string;
  proposalSummary: string;
  proposalSubmissionDate: string;
  applicationType: string;
  internalOwner: string;
  fundingRestriction: string;
  matchingRequirement: string;
  useArea: string;
  isEligibleForRenewal: boolean;
  renewalApplicationDate: string;
  renewalAwardStatus: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: '',
    amountRequested: '',
    amountAwarded: '',
    purpose: '',
    startDate: '',
    endDate: '',
    isMultipleYears: false,
    quarter: '',
    acknowledgementSent: false,
    awardNotificationDate: '',
    fundingArea: '',
    proposalDueDate: '',
    proposalSummary: '',
    proposalSubmissionDate: '',
    applicationType: '',
    internalOwner: '',
    fundingRestriction: '',
    matchingRequirement: '',
    useArea: '',
    isEligibleForRenewal: false,
    renewalApplicationDate: '',
    renewalAwardStatus: '',
  });

  const [showGrantorModal, setShowGrantorModal] = useState(false);
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [newGrantor, setNewGrantor] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  });
  const [newPurpose, setNewPurpose] = useState('');

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    // @ts-ignore
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        amountRequested: Number(formData.amountRequested),
        amountAwarded: Number(formData.amountAwarded),
      };

      const response = await axios.post('/api/grants', dataToSend);
      console.log('Grant submitted successfully:', response.data);
      alert('Grant submitted successfully!');

      setFormData({
        name: '',
        status: '',
        amountRequested: '',
        amountAwarded: '',
        purpose: '',
        startDate: '',
        endDate: '',
        isMultipleYears: false,
        quarter: '',
        acknowledgementSent: false,
        awardNotificationDate: '',
        fundingArea: '',
        proposalDueDate: '',
        proposalSummary: '',
        proposalSubmissionDate: '',
        applicationType: '',
        internalOwner: '',
        fundingRestriction: '',
        matchingRequirement: '',
        useArea: '',
        isEligibleForRenewal: false,
        renewalApplicationDate: '',
        renewalAwardStatus: '',
      });

    } catch (error) {
      console.error('Error submitting grant:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.missingFields) {
          alert(`Error: Missing fields: ${error.response.data.missingFields.join(', ')}`);
          return;
        }
      }
      alert('Error submitting grant. Please try again.');
    }
  };

  const handleAddGrantor = () => {
    console.log('New grantor:', newGrantor);
    setShowGrantorModal(false);
    setFormData(prev => ({ ...prev, grantor: newGrantor.name }));
    setNewGrantor({ name: '', title: '', email: '', phone: '', address: '', website: '' });
  };

  const handleAddPurpose = () => {
    console.log('New purpose:', newPurpose);
    setShowPurposeModal(false);
    setFormData(prev => ({ ...prev, purpose: newPurpose }));
    setNewPurpose('');
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Add New Grant</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grantor Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Grantor</label>
                  <div className="flex gap-2">
                    <select
                        name="grantor"
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Grantor</option>
                      <option value="example">Example Grantor</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => setShowGrantorModal(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      New
                    </button>
                  </div>
                </div>

                {/* Two Column Layout - Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grant Name*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grant Status*</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="LOI Submitted">LOI Submitted</option>
                      <option value="Proposal Submitted">Proposal Submitted</option>
                      <option value="Awarded">Awarded</option>
                      <option value="Declined">Declined</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount Requested*</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                          type="number"
                          name="amountRequested"
                          value={formData.amountRequested}
                          onChange={handleInputChange}
                          required
                          className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount Awarded*</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                          type="number"
                          name="amountAwarded"
                          value={formData.amountAwarded}
                          onChange={handleInputChange}
                          required
                          className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grant Purpose*</label>
                    <div className="flex gap-2">
                      <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Purpose</option>
                        <option value="After-School Tutoring">After-School Tutoring</option>
                        <option value="Summer Program">Summer Program</option>
                        <option value="FACE">Family & Community Engagement</option>
                      </select>
                      <button
                          type="button"
                          onClick={() => setShowPurposeModal(true)}
                          className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Funding Area*</label>
                    <select
                        name="fundingArea"
                        value={formData.fundingArea}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Funding Area</option>
                      <option value="Education">Education</option>
                      <option value="Health">Health</option>
                      <option value="Community Development">Community Development</option>
                      <option value="Arts & Culture">Arts & Culture</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date*</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quarter*</label>
                    <select
                        name="quarter"
                        value={formData.quarter}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Quarter</option>
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proposal Due Date*</label>
                    <input
                        type="date"
                        name="proposalDueDate"
                        value={formData.proposalDueDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proposal Submission Date</label>
                    <input
                        type="date"
                        name="proposalSubmissionDate"
                        value={formData.proposalSubmissionDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Award Notification Date</label>
                    <input
                        type="date"
                        name="awardNotificationDate"
                        value={formData.awardNotificationDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Type*</label>
                    <select
                        name="applicationType"
                        value={formData.applicationType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Application Type</option>
                      <option value="New">New</option>
                      <option value="Renewal">Renewal</option>
                      <option value="Supplemental">Supplemental</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Internal Owner*</label>
                    <input
                        type="text"
                        name="internalOwner"
                        value={formData.internalOwner}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Use Area*</label>
                    <select
                        name="useArea"
                        value={formData.useArea}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Use Area</option>
                      <option value="Program">Program</option>
                      <option value="Operations">Operations</option>
                      <option value="Capital">Capital</option>
                      <option value="Technology">Technology</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Funding Restriction</label>
                    <input
                        type="text"
                        name="fundingRestriction"
                        value={formData.fundingRestriction}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Matching Requirement</label>
                    <input
                        type="text"
                        name="matchingRequirement"
                        value={formData.matchingRequirement}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proposal Summary</label>
                    <textarea
                        name="proposalSummary"
                        value={formData.proposalSummary}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                {/* Checkbox Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isMultipleYears"
                        checked={formData.isMultipleYears}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Multi-Year Grant</label>
                  </div>

                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="acknowledgementSent"
                        checked={formData.acknowledgementSent}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Acknowledgement Sent</label>
                  </div>

                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isEligibleForRenewal"
                        checked={formData.isEligibleForRenewal}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Eligible For Renewal</label>
                  </div>
                </div>

                {/* Renewal Information - Conditional */}
                {formData.isEligibleForRenewal && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Renewal Application Date</label>
                        <input
                            type="date"
                            name="renewalApplicationDate"
                            value={formData.renewalApplicationDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Renewal Award Status</label>
                        <select
                            name="renewalAwardStatus"
                            value={formData.renewalAwardStatus}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Awarded">Awarded</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Grant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Grantor Modal */}
        {showGrantorModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add New Grantor</h3>
                  <button
                      onClick={() => setShowGrantorModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <input
                        type="text"
                        value={newGrantor.name}
                        onChange={(e) => setNewGrantor({ ...newGrantor, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={newGrantor.title}
                        onChange={(e) => setNewGrantor({ ...newGrantor, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={newGrantor.email}
                        onChange={(e) => setNewGrantor({ ...newGrantor, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        value={newGrantor.phone}
                        onChange={(e) => setNewGrantor({ ...newGrantor, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        value={newGrantor.address}
                        onChange={(e) => setNewGrantor({ ...newGrantor, address: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                        type="url"
                        value={newGrantor.website}
                        onChange={(e) => setNewGrantor({ ...newGrantor, website: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAddGrantor}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Grantor
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Purpose Modal */}
        {showPurposeModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add New Grant Purpose</h3>
                  <button
                      onClick={() => setShowPurposeModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose Name</label>
                    <input
                        type="text"
                        value={newPurpose}
                        onChange={(e) => setNewPurpose(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAddPurpose}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Purpose
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default App;