"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; 

export default function AccountSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("/accountSetting/image.png");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageError, setImageError] = useState(false); 

  const router = useRouter(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.success) {
          setName(`${data.user.firstName} ${data.user.lastName}`);
          setEmail(data.user.email);
          setPhone(data.user.phone || "");
          setTwoFactorEnabled(data.user.twoFactorEnabled || false);
          if (data.user.avatar) {
            setAvatar(data.user.avatar);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setMessage({ type: "error", text: "Failed to load user data" });
      }
    };
    fetchUserData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
        setImageError(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          avatar,
          twoFactorEnabled
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    
    try {
      await fetch('/api/user/toggle-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue })
      });
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      setTwoFactorEnabled(!newValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f5597] via-[#4a6fa5] to-white flex flex-col items-center py-8 px-6 overflow-auto">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-8">
        <div className="border-b border-gray-200 pb-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#2f5597] hover:text-[#24447b] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <h1 className="text-3xl font-semibold text-[#2f5597]">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile and security settings</p>
        </div>

        {message.text && (
          <div className={`mb-5 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
          {!imageError ? (
            <div className="relative w-[100px] h-[100px] rounded-full border-2 border-[#2f5597] overflow-hidden flex-shrink-0">
              <Image
                src={avatar}
                alt="User Avatar"
                fill
                sizes="100px"
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized={avatar.startsWith('data:')}
              />
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-full border-2 border-[#2f5597] bg-gradient-to-br from-[#2f5597] to-[#4a6fa5] flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0">
              {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Profile Photo</h3>
            <label className="inline-block px-4 py-2 bg-[#2f5597] bg-opacity-10 text-[#2f5597] text-sm font-medium rounded-lg hover:bg-[#2f5597] hover:bg-opacity-20 cursor-pointer transition-colors">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597] focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597] focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597] focus:border-transparent transition-all"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2f5597] mb-4">Security</h2>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2f5597] bg-opacity-10 rounded-lg">
                <svg className="w-5 h-5 text-[#2f5597]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            
            <button
              onClick={handle2FAToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-[#2f5597]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button 
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            disabled={loading}
            className="px-6 py-2.5 bg-[#2f5597] text-white rounded-lg hover:bg-[#24447b] transition-colors disabled:bg-[#2f5597] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
