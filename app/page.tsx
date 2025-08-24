// app/page.tsx
// The main landing page of the application.
// Redirects authenticated users to the proposals list or shows a welcome message for guests.

"use client"; // Indicates this is a Client Component, allowing client-side interactions like useEffect and useRouter.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/app/lib/auth";

// The main Home Page component.
export default function Home() {
  const router = useRouter(); // Hook to programmatically navigate between pages.

  // useEffect hook to run code after the component mounts.
  useEffect(() => {
    // Check if the user is logged in using the auth utility.
    if (isLoggedIn()) {
      // If logged in, redirect the user to the proposals list page.
      router.push("/proposals");
    }
  }, [router]); // Dependency array ensures this effect runs only when the router changes.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Investment Proposal Manager</h1>
      <p className="text-lg mb-6">
        Manage your investment proposals through their entire lifecycle.
      </p>
      {!isLoggedIn() && ( // Conditional rendering based on authentication status.
        <div>
          <p className="mb-4">Please log in to continue.</p>
          {/* Link to the login page */}
          <a href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </div>
      )}
    </div>
  );
}