'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';
import logo from '/app/logo.png';

export default function TopNavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'Name',
    email: 'email',
    role: 'role',
    initials: 'initial'
  });
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
            role: data.user.role === 'ADMIN' ? 'Administrator' : 'User',
            initials: `${data.user.firstName[0]}${data.user.lastName[0]}`
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-2 border-gray-300 h-10"></div>
            <div>
              <p className="text-xl text-[#2f4b7c] font-bold">Dashboard</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Admin Portal</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] flex items-center justify-center text-white font-semibold shadow-md">
                {user.initials}
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
                  
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
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
    </nav>
  );
}
