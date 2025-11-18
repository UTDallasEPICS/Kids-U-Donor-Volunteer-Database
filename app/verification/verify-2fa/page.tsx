"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "../../logo.png";

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");

    if (!emailParam || !passwordParam) {
      router.push("/");
      return;
    }

    setEmail(emailParam);
    setPassword(passwordParam);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/volunteers");
        }
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.requires2FA) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setCode(value);
      if (error) setError("");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #f5f8fc 0%, #e3ecf5 100%)",
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

      {/* 2FA Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl text-[#2f4b7c] font-light mb-3">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {/* Success message */}
        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700">New code sent!</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              autoComplete="off"
              autoFocus
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center tracking-[0.5em] font-mono focus:outline-none focus:border-[#4a6fa5] focus:ring-2 focus:ring-[#4a6fa5]/20 transition-all"
              style={{ letterSpacing: "0.5em" }}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Code expires in 10 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-lg font-medium py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>

        {/* Helper Links */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-[#4a6fa5] font-medium hover:text-[#2f4b7c] transition-colors disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </p>
          
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#2f4b7c] transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
