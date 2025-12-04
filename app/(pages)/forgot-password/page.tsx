"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../logo.png";

export default function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.error || 'Please provide a valid email address.');
        } else if (response.status === 500) {
          throw new Error(data.error || 'Failed to send reset email. Please try again.');
        } else {
          throw new Error(data.error || 'Something went wrong. Please try again.');
        }
      }

      setSubmitted(true);
      
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12" 
      style={{ 
        background: 'linear-gradient(135deg, #f5f8fc 0%, #e3ecf5 100%)' 
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

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        
        {!submitted ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl text-[#2f4b7c] font-light text-center mb-3">
              Forgot Password?
            </h1>
            
            <p className="text-gray-600 text-sm text-center mb-8">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

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
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-lg font-medium py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <Link href="/" className="text-gray-600 text-sm hover:text-[#2f4b7c] transition-colors inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl text-[#2f4b7c] font-light text-center mb-3">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 text-sm text-center mb-8">
              If an account exists with <strong className="text-gray-800">{email}</strong>, 
              you&apos;ll receive a password reset link shortly. Please check your inbox and follow the instructions.
            </p>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 text-center">
                Didn&apos;t receive the email? Check your spam folder or 
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="text-[#4a6fa5] font-medium hover:text-[#2f4b7c] ml-1"
                >
                  try again
                </button>
              </p>
            </div>

            {/* Back to Login */}
            <Link 
              href="/" 
              className="block text-center text-gray-600 text-sm hover:text-[#2f4b7c] transition-colors"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
