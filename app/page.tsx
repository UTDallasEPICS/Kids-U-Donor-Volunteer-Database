"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "./logo.png";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.requires2FA) {
        router.push(`/verification/verify-2fa?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        return;
      }

      if (data.requiresVerification) {
        setError(data.message || "Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      if (data.success) {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/volunteers");
        }
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] flex-col justify-center items-start p-16 text-white">
        
        {/* Main Content */}
        <div className="max-w-xl">
          <h1 className="text-6xl font-extralight mb-6 leading-tight">
            Join Our<br />Community
          </h1>
          
          <div className="w-20 h-1 bg-gradient-to-r from-[#d32f2f] to-[#4a6fa5] mb-8 rounded-full"></div>
          
          <p className="text-lg text-gray-200 mb-12 font-light leading-relaxed">
            Create an account to start making a difference in your community
          </p>

          {/* Feature Cards */}
          <div className="space-y-4">
            {/* Volunteer Opportunities */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-0.5">Volunteer Opportunities</h3>
                <p className="text-sm text-gray-200 font-light">Register for events and activities</p>
              </div>
            </div>

            {/* Track Your Impact */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-0.5">Track Your Impact</h3>
                <p className="text-sm text-gray-200 font-light">Monitor contributions and hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div 
        className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-16 px-8 lg:px-16" 
        style={{ 
          background: 'linear-gradient(135deg, #f5f8fc 0%, #e3ecf5 100%)' 
        }}
      >
        
        {/* Logo */}
        <div className="mb-10">
          <Image
            src={logo}
            alt="Kids University Logo"
            width={180}
            height={83}
            priority
          />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          
          {/* Welcome Text */}
          <h1 className="text-4xl text-[#2f4b7c] font-light text-center mb-10">
            Welcome to Kids U
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your email"
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your password"
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
                required
                disabled={loading}
              />
              <div className="text-right mt-3">
                <a href="/forgot-password" className="text-[#4a6fa5] text-sm font-medium hover:text-[#2f4b7c] transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-lg font-medium py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-100 mt-6">
              <span className="text-gray-600 text-sm">Don&apos;t have an account? </span>
              <a href="/signup" className="text-[#4a6fa5] text-sm font-semibold hover:text-[#2f4b7c] transition-colors">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
