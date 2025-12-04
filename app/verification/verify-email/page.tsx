"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "../../logo.png";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. Please check your email link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/emailverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Your email has been successfully verified!");
          setTimeout(() => router.push("/"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may be invalid or expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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

      {/* Verification Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
        
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4a6fa5] to-[#2f4b7c] rounded-full flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl text-[#2f4b7c] font-light mb-3">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 text-sm">
              Please wait while we verify your account...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl text-green-600 font-light mb-3">
              Email Verified!
            </h1>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                Redirecting you to login in a few seconds...
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <svg className="animate-spin h-6 w-6 text-[#4a6fa5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl text-red-600 font-light mb-3">
              Verification Failed
            </h1>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                The verification link may have expired or been used already.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-[#4a6fa5] to-[#2f4b7c] text-white text-base font-medium py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                Go to Login
              </Link>
              <Link
                href="/signup"
                className="block w-full border-2 border-gray-200 text-gray-700 text-base font-medium py-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Create New Account
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Help Text */}
      {status === "error" && (
        <p className="mt-6 text-gray-500 text-sm text-center max-w-md">
          Need help? Contact support or try requesting a new verification email.
        </p>
      )}
    </div>
  );
}
