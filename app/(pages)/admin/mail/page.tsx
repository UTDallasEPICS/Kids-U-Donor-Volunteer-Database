"use client";

import { useState } from 'react';

const EMAIL_TEMPLATES = {
  'thank-you': {
    name: 'Thank You',
    subject: 'Thank You for Your Support',
    body: `Dear Team Member,

We wanted to take a moment to express our heartfelt gratitude for your continued support and dedication. Your contributions make a real difference in our community.

Thank you for being an essential part of our mission.

Warm regards,
The Team`
  },
  'reminder': {
    name: 'Reminder',
    subject: 'Upcoming Event Reminder',
    body: `Dear Team Member,

This is a friendly reminder about our upcoming event. We're looking forward to seeing you there!

Event Details:
Date: [Add date]
Time: [Add time]
Location: [Add location]

Please confirm your attendance at your earliest convenience.

Best regards,
The Team`
  },
  'fundraising': {
    name: 'Fundraising',
    subject: 'Support Our Fundraising Campaign',
    body: `Dear Team Member,

We're excited to announce our latest fundraising campaign! Your support can help us reach our goals and continue making a positive impact.

Campaign Details:
Goal: [Add goal]
Duration: [Add dates]
How to Help: [Add information]

Every contribution, no matter the size, makes a difference. Thank you for considering supporting our cause.

With gratitude,
The Team`
  },
  'announcement': {
    name: 'Announcement',
    subject: 'Important Announcement',
    body: `Dear Team Member,

We have an important announcement to share with you.

[Add your announcement details here]

If you have any questions, please don't hesitate to reach out.

Best regards,
The Team`
  },
  'custom': {
    name: 'Custom Message',
    subject: '',
    body: ''
  }
};

export default function EmailPage() {
  const [recipientType, setRecipientType] = useState('individual');
  const [recipient, setRecipient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleSendEmail = async () => {
    if (recipientType === 'individual' && !recipient) {
      setStatus({ type: 'error', message: 'Please enter a recipient email address' });
      return;
    }

    if (!subject || !body) {
      setStatus({ type: 'error', message: 'Please fill in subject and message fields' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Sending email with data:', {
        recipientType,
        to: recipientType === 'individual' ? recipient : null,
        subject,
        body
      });

      const response = await fetch('/api/send-mail/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientType: recipientType,
          to: recipientType === 'individual' ? recipient : null,
          subject: subject,
          body: body,
        }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        const message = recipientType === 'individual' 
          ? 'Email sent successfully!' 
          : `Email sent successfully to ${data.count || 'all'} ${recipientType === 'volunteers' ? 'volunteers' : 'admins'}!`;
        setStatus({ type: 'success', message });
        setRecipient('');
        setSubject('');
        setBody('');
        setSelectedTemplate('custom');
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send email' });
      }
    } catch (error) {
      console.error('Caught error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ type: 'error', message: `An error occurred: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800">Send Email</h1>
          </div>

          <div className="space-y-6">
            {/* Recipient Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send To
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setRecipientType('individual')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    recipientType === 'individual'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setRecipientType('volunteers')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    recipientType === 'volunteers'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  All Volunteers
                </button>
                <button
                  onClick={() => setRecipientType('admins')}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    recipientType === 'admins'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  All Admins
                </button>
              </div>
            </div>

            {/* Individual Recipient Field */}
            {recipientType === 'individual' && (
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            )}

            {/* Mass Email Info */}
            {recipientType !== 'individual' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    This email will be sent to all users with the {recipientType === 'volunteers' ? 'VOLUNTEER' : 'ADMIN'} role.
                  </p>
                </div>
              </div>
            )}

            {/* Template Selection */}
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
              >
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Body Field */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <div
                className={`p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Email
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}