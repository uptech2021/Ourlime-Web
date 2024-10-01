"use client";

import Navbar from "@/comm/Navbar";
import { auth } from "@/firebaseConfig";
import { Input } from "@nextui-org/react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

 // Suggested code may be subject to a license. Learn more: ~LicenseLog:4228037765.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4093211205.
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    console.log("Sending password reset email to:", email);
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully.");
      setMessage("Password reset email sent!");
      setTimeout(() => {
        router.push("/login");
      }, 2000); 
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setError("User not found.");
          break;
        case "auth/invalid-email":
          setError("Invalid email.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <Navbar>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <Input
              variant="bordered"
              label="Email"
              labelPlacement="outside"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
          >
            Reset Password
          </button>

          <p className="mt-3 text-gray-600 hover:text-gray-800 underline">
            <Link href="/login" className="font-medium">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    </Navbar>
  );
}
