// app/lib/auth.ts
// Utility functions for handling simple client-side authentication (mocked for this example).
// Manages login state using localStorage.

// Key used to store the authentication token in localStorage.
const AUTH_TOKEN_KEY = "investment_auth_token";

// Function to simulate user login.
// In a real application, this would make an API call to authenticate the user.
export const login = async (username: string, password: string): Promise<boolean> => {
  // Simple mock authentication logic.
  // In a real app, you would validate credentials against a backend.
  if (username && password) {
    // Store a mock token in localStorage upon successful "login".
    localStorage.setItem(AUTH_TOKEN_KEY, `mock_token_for_${username}`);
    return true; // Indicate successful login.
  }
  return false; // Indicate failed login.
};

// Function to simulate user logout.
export const logout = (): void => {
  // Remove the authentication token from localStorage.
  localStorage.removeItem(AUTH_TOKEN_KEY);
  // Redirect the user to the login page after logout.
  window.location.href = "/login";
};

// Function to check if the user is currently logged in.
export const isLoggedIn = (): boolean => {
  // Check if the authentication token exists in localStorage.
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Function to get the current authentication token.
export const getToken = (): string | null => {
  // Retrieve the authentication token from localStorage.
  return localStorage.getItem(AUTH_TOKEN_KEY);
};