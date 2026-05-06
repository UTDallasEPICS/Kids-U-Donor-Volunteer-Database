'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import logo from '@/app/logo.png';

interface SentEmail {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}

export default function VolunteerTopNavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: 'Name',
    email: 'email',
    role: 'Volunteer',
    initials: 'V',
    avatar: ''
  });
  const [avatarError, setAvatarError] = useState(false);
  const [bgCheckApproved, setBgCheckApproved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.success) {
          setUser({
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
            role: 'Volunteer',
            initials: `${data.user.firstName[0]}${data.user.lastName[0]}`,
            avatar: data.user.avatar || ''
          });
          setAvatarError(false);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const fetchBgCheckStatus = async () => {
      try {
        const res = await fetch('/api/background-check/get');
        const data = await res.json();
        if (data.status === "APPROVED") {
          setBgCheckApproved(true);
        }
      } catch {
        // non-blocking
      }
    };

    const fetchInbox = async () => {
      try {
        const res = await fetch('/api/volunteer/inbox/get');
        const data = await res.json();
        if (data.emails) {
          setEmails(data.emails);
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch {
        // non-blocking
      }
    };

    fetchUserData();
    fetchBgCheckStatus();
    fetchInbox();
  }, []);

  const handleEmailOpen = async (email: SentEmail) => {
    if (expandedId === email.id) { setExpandedId(null); return; }
    setExpandedId(email.id);
    if (!email.isRead) {
      await fetch(`/api/volunteer/inbox/${email.id}/read`, { method: 'PATCH' });
      setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, isRead: true } : e));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore network errors
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
      }
    } catch { }
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    router.push('/accountSetting'); 
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-5">
            <div className="relative h-12 w-36">
              <Image
                src={logo}
                alt="Kids University Logo"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-2 border-gray-300 h-10"></div>
            <div>
              <p className="text-xl text-[#2f4b7c] font-bold">Volunteer Portal</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Kids-U Volunteer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* Inbox */}
            <div className="relative">
              <button
                onClick={() => { setInboxOpen((p) => !p); setMenuOpen(false); }}
                className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Inbox"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {inboxOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setInboxOpen(false)} />
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Inbox</p>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {emails.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-400">No messages yet.</div>
                      ) : (
                        emails.map((email) => (
                          <div key={email.id}>
                            <button
                              onClick={() => handleEmailOpen(email)}
                              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!email.isRead ? 'bg-blue-50/40' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!email.isRead ? 'bg-blue-500' : ''}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                  {email.subject}
                                </p>
                                <p className="text-xs text-gray-400">Kids-U Admin</p>
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {new Date(email.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <svg className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${expandedId === email.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {expandedId === email.id && (
                              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                <p className="text-xs text-gray-400 mb-2">
                                  {new Date(email.sentAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </p>
                                {email.body}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

          <div className="relative">
            <button
              onClick={() => { setMenuOpen(!menuOpen); setInboxOpen(false); }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="relative">
                {user.avatar && !avatarError ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={user.avatar}
                      alt="Profile avatar"
                      fill
                      sizes="40px"
                      className="object-cover"
                      onError={() => setAvatarError(true)}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] flex items-center justify-center text-white font-semibold shadow-md">
                    {user.initials}
                  </div>
                )}
                {bgCheckApproved && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </button>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
