"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../../logo.png";

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('An account with this email already exists.');
        } else if (response.status === 400) {
          throw new Error(data.error || 'Please check your information and try again.');
        } else {
          throw new Error(data.error || 'Something went wrong. Please try again.');
        }
      }

      setSuccess(true);
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8" 
        style={{ 
          background: 'linear-gradient(135deg, #f5f8fc 0%, #e3ecf5 100%)' 
        }}
      >
        <div className="mb-6">
          <Image
            src={logo}
            alt="Kids University Logo"
            width={150}
            height={69}
            priority
          />
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl text-green-600 font-light mb-2">
            Account Created!
          </h1>
          
          <p className="text-gray-600 text-sm mb-4">
            We&apos;ve sent a verification email to <strong className="text-gray-800">{formData.email}</strong>. 
            Please check your inbox and verify your account.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-700">
              <strong>Important:</strong> Check your spam folder if you don&apos;t see the email.
            </p>
          </div>

          <Link 
            href="/" 
            className="inline-block w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-base font-medium py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 overflow-y-auto" 
      style={{ 
        background: 'linear-gradient(135deg, #f5f8fc 0%, #e3ecf5 100%)' 
      }}
    >
      
      {/* Logo */}
      <div className="mb-6">
        <Image
          src={logo}
          alt="Kids University Logo"
          width={150}
          height={69}
          priority
        />
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-6">
        
        {/* Title */}
        <h1 className="text-3xl text-[#2f4b7c] font-light text-center mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-red-600">{error}</p>
                  {error.includes('already exists') && (
                    <Link 
                      href="/" 
                      className="text-sm text-red-700 font-medium hover:text-red-800 underline mt-1 inline-block"
                    >
                      Sign in instead?
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* First Name & Last Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
              required
              minLength={8}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-base font-medium py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-100 mt-4">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link href="/" className="text-[#d32f2f] text-sm font-semibold hover:text-[#b71c1c] transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      </div>

      {/* Footer Text */}
      <p className="text-gray-500 text-xs text-center max-w-md px-4 pb-4">
            @2024 Kids U. All rights reserved.
      </p>
    </div>
  );
}
