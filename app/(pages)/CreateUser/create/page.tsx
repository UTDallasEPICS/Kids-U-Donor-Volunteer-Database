"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-9 items-center justify-center bg-[conic-gradient(from_30deg_at_50%_50%,rgba(47,85,151,1)_47%,rgba(255,255,255,1)_95%)]">
      
      {/* Logo */}
      <Image
        src="/ee472083-b210-44ad-bb79-df75b701333a.png"
        alt="Kids University Logo"
        width={350}
        height={150}
        className="mb-4"
        priority
      />

      {/* Card */}
      <div className="w-[649px] flex flex-col bg-[#fffbfb] rounded-[20px] p-10 shadow-lg">
        
        {/* Welcome Text */}
        <div className="font-extralight text-[#656565] text-5xl text-center mb-10">
          Welcome To Kids-U!
        </div>

        {/* Username Field */}
        <div className="mb-6">
          <label className="block text-black text-[28px] mb-2">Username</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border-2 border-black rounded-[15px] p-3 text-xl focus:outline-none focus:border-[#2f5597]"
          />
        </div>

        {/* Password Field */}
        <div className="mb-8">
          <label className="block text-black text-[28px] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border-2 border-black rounded-[15px] p-3 text-xl focus:outline-none focus:border-[#2f5597]"
          />
          <div className="text-right mt-2 text-[#122d5d] text-lg cursor-pointer hover:underline">
            Forgot Password?
          </div>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-[67px] bg-[#122d5d] text-white text-[28px] rounded-[20px] hover:bg-[#0e244b] transition"
        >
          Sign in
        </button>

        {/* Sign Up Link */}
        <div className="mt-8 flex justify-center items-center gap-2 text-xl">
          <span className="text-black font-extralight">
            Don’t have an Account?
          </span>
          <span className="font-normal text-black cursor-pointer hover:underline">
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
