"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "./logo.png";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-start pt-16 px-4" 
      style={{ 
        background: 'linear-gradient(to bottom, #e8f0f8 0%, #8ba9d4 50%, #4a6fa5 100%)' 
      }}
    >
      
      {/* Logo */}
      <div className="mb-8">
        <Image
          src={logo}
          alt="Kids University Logo"
          width={180}
          height={83}
          priority
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Welcome Text */}
        <h1 className="text-3xl text-gray-400 font-light text-center mb-8">
          Welcome To Kids-U!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Field */}
          <div>
            <label className="block text-gray-800 text-base font-normal mb-2">
              Username
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-800 text-base font-normal mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-black focus:outline-none focus:border-blue-500 transition-colors tracking-wide"
              style={{ fontFamily: 'Verdana, sans-serif', letterSpacing: '0.125em' }}
              required
            />
            <div className="text-right mt-2">
              <a href="#" className="text-gray-500 text-xs hover:text-gray-700 transition-colors">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#1a3a5c] text-white text-xl font-light py-3 rounded-full hover:bg-[#142d47] transition-colors shadow-md mt-6"
          >
            Sign in
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-6">
            <span className="text-gray-600 text-sm">Don&apos;t have an Account? </span>
            <a href="#" className="text-gray-900 text-sm font-semibold hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
