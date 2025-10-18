"use client";

import React from "react";
import Image from "next/image";
import logo from "./CreateUser.png";
import rectangle4 from "./rectangle-4.svg";

export default function CreateUserPage() {
  return (
    <div className="w-[1440px] h-[1024px] flex flex-col gap-9 border border-solid border-black [background:conic-gradient(from_30deg_at_50%_50%,rgba(47,85,151,1)_47%,rgba(255,255,255,1)_95%)]">
      
      {/* Logo */}
      <Image
        src={logo}
        alt="Logo"
        width={257}
        height={118}
        className="ml-[592px] mt-[71px] aspect-[2.19]"
        priority
      />

      {/* Card */}
      <div className="ml-[396px] w-[649px] h-[711px] flex flex-col bg-[#fffbfb] rounded-[20px]">
        
        {/* Welcome Text */}
        <div className="h-[46px] mt-[54px] font-extralight text-[#656565] text-5xl text-center">
          Welcome To Kids-U!
        </div>

        {/* Username Field */}
        <div className="ml-[60px] w-[533px] h-[105px] relative mt-[54px]">
          <div className="absolute top-[50px] left-0 w-[529px] h-[55px] rounded-[20px] border-2 border-black" />
          <div className="absolute top-[63px] left-5 font-extralight text-[#656565] text-2xl text-center">
            Enter Your Email
          </div>
          <div className="absolute top-0 left-[9px] font-light text-black text-[32px] text-center">
            Username
          </div>
        </div>

        {/* Password Field */}
        <div className="ml-[60px] w-[533px] h-[145px] relative mt-[71px]">
          <div className="absolute top-0 left-[7px] font-light text-black text-[32px] text-center">
            Password
          </div>

          <Image
            src={rectangle4}
            alt="Password background"
            width={533}
            height={59}
            className="absolute top-12 left-0"
          />

          <div className="absolute top-[116px] left-[331px] font-extralight text-black text-2xl text-center">
            Forgot Password?
          </div>

          {/* Password dots */}
          <div className="flex w-[279px] h-[15px] items-center gap-[9px] absolute top-[70px] left-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-black rounded-md" />
            ))}
          </div>
        </div>

        {/* Sign In Button */}
        <div className="ml-[149px] w-[341px] h-[67px] mt-[54px] bg-[#122d5d] flex rounded-[20px] cursor-pointer hover:bg-[#0e244b] transition">
          <div className="m-auto font-extralight text-white text-[32px] text-center">
            Sign in
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="ml-[166px] w-[313px] mt-[70px] flex justify-between items-center">
          <div className="font-extralight text-black text-xl text-center">
            Don’t have an Account?
          </div>
          <div className="font-normal text-black text-xl text-center cursor-pointer hover:underline">
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
}
