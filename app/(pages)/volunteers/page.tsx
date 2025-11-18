"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from '/app/logo.png';


export default function VolunteerDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [nextEventDays, setNextEventDays] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("Volunteer");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);


  useEffect(() => {
    Promise.all([
      fetch('/api/volunteer/events/upcoming').then(res => res.json()),
      fetch('/api/volunteer/hours').then(res => res.json()),
      fetch('/api/auth/me').then(res => res.json()),
      fetch('/api/gallery/images').then(res => res.json()).catch(() => ({ images: [] })),
    ]).then(([events, hours, userData, gallery]) => {
      setUpcomingEvents(events);
      setTotalHours(hours.total || 0);
      
      if (userData.success) {
        setUserName(userData.user.firstName);
      }
      
      if (events.length > 0) {
        const nextEvent = new Date(events[0].date);
        const today = new Date();
        const diffTime = nextEvent.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNextEventDays(diffDays);
      }

      if (gallery.images) {
        setGalleryImages(gallery.images);
      }
    }).catch(err => console.error('Failed to fetch dashboard data:', err));
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2f4b7c] mb-1">Welcome back, {userName}</h1>
          <p className="text-gray-600 text-sm">Track your volunteer journey and upcoming opportunities</p>
        </div>
        <Image
          src={logo}
          alt="Kids University Logo"
          width={150}
          height={65}
          className="object-contain"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="space-y-4">
            {/* Total Hours Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-[#2f4b7c] mb-1">{totalHours}</p>
                  <p className="text-xs text-gray-500">hours logged</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">Total Volunteer Hours</p>
              <p className="text-xs text-gray-500 mt-1">All time contribution</p>
            </div>


            {/* Events Attended Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#4a6fa5] to-[#668dc4] rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-[#2f4b7c] mb-1">{upcomingEvents.filter(e => e.attended).length}</p>
                  <p className="text-xs text-gray-500">this year</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">Events Attended</p>
              <p className="text-xs text-gray-500 mt-1">Your participation count</p>
            </div>


            {/* Status Badge */}
            <div className="bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-2xl p-6 text-white shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <p className="text-sm font-bold uppercase tracking-wide">Active Volunteer</p>
              </div>
              <p className="text-sm opacity-90">Member since 2024</p>
              <p className="text-xs opacity-75 mt-2">Keep up the amazing work!</p>
            </div>
          </div>


          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/volunteers/registration'}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-semibold">Register for Event</span>
              </button>


              <button 
                onClick={() => window.location.href = '/volunteers/check_in_out'}
                className="w-full flex items-center gap-3 p-4 bg-white border-2 border-[#2f4b7c] text-[#2f4b7c] rounded-xl hover:bg-[#2f4b7c] hover:text-white hover:scale-[1.02] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-semibold">Check In/Out</span>
              </button>
            </div>
          </div>
        </div>


        {/* Events */}
        <div className="lg:col-span-6 space-y-6">
          {/* Events Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2f4b7c]">Upcoming Events</h2>
                <p className="text-sm text-gray-500 mt-1">Your registered volunteer opportunities</p>
              </div>
              <div className="flex items-center gap-2 bg-[#2f4b7c]/10 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold text-[#2f4b7c]">{upcomingEvents.length} events</span>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, idx) => (
                  <div 
                    key={idx} 
                    className="group bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border-2 border-gray-100 hover:border-[#4a6fa5] hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-2xl flex flex-col items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-[#2f4b7c] transition-colors">
                          {event.name}
                        </h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Next Event Badge */}
                      {idx === 0 && nextEventDays !== null && (
                        <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-2xl shadow-md">
                          <p className="text-xs font-bold uppercase tracking-wide mb-1">Next Event</p>
                          <p className="text-2xl font-bold">{nextEventDays} <span className="text-sm font-normal">days</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#2f4b7c]/10 to-[#4a6fa5]/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-14 h-14 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No Upcoming Events</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
                    Check back soon for exciting volunteer opportunities. Events are posted regularly and we'd love to see you there!
                  </p>
                  <button 
                    onClick={() => window.location.href = '/volunteers/registration'}
                    className="px-8 py-3 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                  >
                    Browse All Events
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2f4b7c]">Event Gallery</h2>
              <p className="text-sm text-gray-500 mt-1">Recent moments from our volunteer activities</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.length > 0 ? (
                galleryImages.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Gallery image ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#2f4b7c]/10 to-[#4a6fa5]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">No images available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Resources & Contact */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Stay Connected</h3>
            <div className="space-y-3">
              <a 
                href="https://www.instagram.com/kidsudallas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-semibold">Follow us on Instagram</span>
              </a>


              <a 
                href="https://kids-u.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] hover:opacity-90 text-white rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="font-semibold">Visit our Website</span>
              </a>
            </div>
          </div>


          {/* Need Help Card */}
          <div className="bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Need Help?</h3>
            </div>
            <p className="text-sm opacity-95 leading-relaxed mb-3">
              Have questions or need assistance? Our team is here to help you make the most of your volunteer experience.
            </p>
            <a 
              href="mailto:volunteer@kids-u.org" 
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              volunteer@kids-u.org
            </a>
          </div>


          {/* My Profile Button */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <button 
              onClick={() => window.location.href = '/accountSetting'}
              className="w-full bg-white hover:bg-gray-50 border-2 border-[#2f4b7c] text-[#2f4b7c] rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3 mb-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-bold">View My Profile</span>
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-600 leading-relaxed">
                Manage your personal information, preferences, and volunteer history
              </p>
            </div>
          </div>
        </div>
      </div>


      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
