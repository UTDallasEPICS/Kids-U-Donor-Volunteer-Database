"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function AccountSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png"); // image in /public

  // Optional: handle photo change (preview only)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#2f5597] to-[#ffffff] flex flex-col items-center py-16 px-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-light text-[#2f5597] mb-8">
          Account Settings
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-[#2f5597]"
          />
          <label className="mt-3 text-[#2f5597] text-sm hover:underline cursor-pointer">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        {/* Editable Info Section */}
        <div className="w-full space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597]"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5597]"
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="mt-10 bg-[#2f5597] text-white text-lg font-light px-10 py-3 rounded-lg hover:bg-[#24447b] transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}
