// app/components/LoginForm.tsx
// A reusable React component for the user login form.
// Handles form state, submission, and integration with the authentication logic.

"use client"; // Indicates this is a Client Component.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/auth"; // Import the login utility function.

// The LoginForm component definition.
export default function LoginForm() {
  const router = useRouter(); // Hook for navigation after successful login.
  const [username, setUsername] = useState(""); // State for the username input field.
  const [password, setPassword] = useState(""); // State for the password input field.
  const [error, setError] = useState(""); // State to display login errors.
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator during login.

  // Handler for the form submission event.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload).
    setIsLoading(true); // Set loading state to true while attempting login.
    setError(""); // Clear any previous error messages.

    try {
      // Call the login utility function with the entered credentials.
      const success = await login(username, password);
      if (success) {
        // If login is successful, redirect the user to the proposals page.
        router.push("/proposals");
      } else {
        // If login fails, set an error message.
        setError("Invalid username or password.");
      }
    } catch (err) {
      // Handle any unexpected errors during the login process.
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      // Regardless of success or failure, set loading state back to false.
      setIsLoading(false);
    }
  };

  return (
    // The main form element with onSubmit handler.
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      {/* Error message display */}
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      
      {/* Username input field */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          value={username} // Bind input value to state.
          onChange={(e) => setUsername(e.target.value)} // Update state on change.
          required // Make the field required.
        />
      </div>
      
      {/* Password input field */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          value={password} // Bind input value to state.
          onChange={(e) => setPassword(e.target.value)} // Update state on change.
          required // Make the field required.
        />
      </div>
      
      {/* Submit button */}
      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isLoading} // Disable button while loading.
        >
          {/* Show "Signing In..." or "Sign In" based on loading state */}
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}