"use client";

import { useEffect, useState } from 'react';

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

interface MailLog {
  id: string;
  recipientType: string;
  to?: string | null;
  subject: string;
  body: string;
  sentAt: string;
  senderEmail?: string | null;
  totalRecipients: number;
  successCount: number;
  failureCount: number;
}

export default function EmailPage() {
  const [recipientType, setRecipientType] = useState('individual');
  const [recipient, setRecipient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [history, setHistory] = useState<MailLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const response = await fetch('/api/admin/mail/history');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load mail history');
      }
      setHistory(Array.isArray(data.emails) ? data.emails : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load mail history';
      setHistoryError(message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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


      //where to fetch for the email variable for the from field in the post request //

      const userResponse = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const userObject = await userResponse.json();
      const email = userObject.user.email;


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
          from: email,//look for the admin email varibale // 
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
        fetchHistory();
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#2f4b7c]/10 text-[#2f4b7c] p-2 rounded-xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#2f4b7c]">Send Email</h1>
          </div>

          <div className="space-y-6">
            {/* Recipient Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send To
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setRecipientType('individual')}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                    recipientType === 'individual'
                      ? 'border-[#2f4b7c] bg-[#2f4b7c]/10 text-[#2f4b7c]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#4a6fa5]'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setRecipientType('volunteers')}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                    recipientType === 'volunteers'
                      ? 'border-[#2f4b7c] bg-[#2f4b7c]/10 text-[#2f4b7c]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#4a6fa5]'
                  }`}
                >
                  All Volunteers
                </button>
                <button
                  onClick={() => setRecipientType('admins')}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                    recipientType === 'admins'
                      ? 'border-[#2f4b7c] bg-[#2f4b7c]/10 text-[#2f4b7c]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#4a6fa5]'
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent outline-none transition"
                />
              </div>
            )}

            {/* Mass Email Info */}
            {recipientType !== 'individual' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent outline-none transition bg-white"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <div
                className={`p-4 rounded-xl ${
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
              className="w-full bg-[#2f4b7c] hover:bg-[#4a6fa5] disabled:bg-[#2f4b7c]/60 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-sm"
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

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#2f4b7c]/10 text-[#2f4b7c] p-2 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2f4b7c]">Past Emails</h2>
                <p className="text-sm text-gray-500">Most recent 100 messages</p>
              </div>
            </div>
            <button
              onClick={fetchHistory}
              className="text-sm font-semibold text-[#2f4b7c] hover:text-[#4a6fa5]"
            >
              Refresh
            </button>
          </div>

          {historyLoading && (
            <div className="text-sm text-gray-500">Loading history...</div>
          )}

          {historyError && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {historyError}
            </div>
          )}

          {!historyLoading && !historyError && history.length === 0 && (
            <div className="text-sm text-gray-500">No sent emails yet.</div>
          )}

          {!historyLoading && !historyError && history.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Recipient</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const recipientLabel = item.recipientType === 'individual'
                      ? item.to || 'Individual'
                      : item.recipientType === 'volunteers'
                        ? 'All Volunteers'
                        : item.recipientType === 'admins'
                          ? 'All Admins'
                          : item.recipientType;

                    return (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(item.sentAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="font-medium text-gray-800">{recipientLabel}</div>
                          <div className="text-xs text-gray-400">
                            {item.totalRecipients} total
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <details className="group">
                            <summary className="cursor-pointer list-none">
                              <span className="font-semibold text-[#2f4b7c]">{item.subject}</span>
                              <span className="ml-2 text-xs text-gray-400 group-open:hidden">View</span>
                            </summary>
                            <div className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                              {item.body}
                            </div>
                          </details>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="font-medium text-gray-800">{item.successCount} sent</div>
                          <div className="text-xs text-gray-400">{item.failureCount} failed</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}