// app/login/page.tsx
// The login page for the application.
// Renders the LoginForm component and handles navigation after successful login.

"use client"; // Indicates this is a Client Component.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoggedIn } from "@/app/lib/auth";
import LoginForm from "@/app/components/LoginForm";

// The Login Page component.
export default function LoginPage() {
  const router = useRouter(); // Hook for navigation.

  // useEffect to check if the user is already logged in.
  useEffect(() => {
    // If the user is already logged in, redirect them away from the login page.
    if (isLoggedIn()) {
      router.push("/proposals"); // Redirect to the proposals list.
    }
  }, [router]); // Run effect when router changes.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Login to Investment Manager</h1>
      {/* Render the LoginForm component */}
      <LoginForm />
    </div>
  );
}