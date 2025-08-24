# investment-proposal-manager-client

Okay, here is a complete Next.js project structure and code implementing the Investment Proposal Management UI with login and API integration based on the provided cheat sheet. Each file includes detailed comments explaining the code's purpose within the investment management context.

**Project Structure:**

```
investment-proposal-manager/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── proposals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── ProposalList.tsx
│   │   ├── ProposalDetails.tsx
│   │   ├── ProposalForm.tsx
│   │   ├── ProposalActions.tsx
│   │   └── AuditTrail.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── public/
│   └── next.svg
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
``powershell script for generating folders and files in workspace`
# Set base path
$base = "investment-proposal-manager-client"

# Define folders
$folders = @(
    "$base/app",
    "$base/app/login",
    "$base/app/proposals",
    "$base/app/proposals/[id]",
    "$base/app/components",
    "$base/app/lib",
    "$base/app/types",
    "$base/public"
)

# Define files
$files = @(
    "$base/.gitignore",
    "$base/package.json",
    "$base/README.md",
    "$base/tsconfig.json",
    "$base/app/layout.tsx",
    "$base/app/page.tsx",
    "$base/app/login/page.tsx",
    "$base/app/proposals/page.tsx",
    "$base/app/proposals/[id]/page.tsx",
    "$base/app/components/LoginForm.tsx",
    "$base/app/components/ProposalList.tsx",
    "$base/app/components/ProposalDetails.tsx",
    "$base/app/components/ProposalForm.tsx",
    "$base/app/components/ProposalActions.tsx",
    "$base/app/components/AuditTrail.tsx",
    "$base/app/lib/auth.ts",
    "$base/app/lib/api.ts",
    "$base/app/types/index.ts",
    "$base/public/next.svg"
)

# Create folders
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

# Create files
foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}
---

### 1. `package.json`

```json
{
  "name": "investment-proposal-manager",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.4",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.4"
  }
}
```

### 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. `app/layout.tsx` (Root Layout)

```tsx
// app/layout.tsx
// Defines the root layout for the entire application.
// Provides a consistent structure, including navigation and authentication context.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application, displayed in the browser tab.
export const metadata: Metadata = {
  title: "Investment Proposal Manager",
  description: "Manage investment proposals through their lifecycle.",
};

// The main layout component that wraps all pages.
// It includes the HTML structure, metadata, and renders child pages.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The main content area where child pages will be rendered */}
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### 4. `app/page.tsx` (Home Page)

```tsx
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
```

### 5. `app/login/page.tsx` (Login Page)

```tsx
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
```

### 6. `app/proposals/page.tsx` (Proposals List Page)

```tsx
// app/proposals/page.tsx
// The page displaying the list of investment proposals.
// Integrates with the ProposalList component to fetch and display data.

"use client"; // Indicates this is a Client Component.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/app/lib/auth";
import ProposalList from "@/app/components/ProposalList";
import ProposalForm from "@/app/components/ProposalForm";
import { Proposal } from "@/app/types";

// The Proposals List Page component.
export default function ProposalsPage() {
  const router = useRouter(); // Hook for navigation.
  const [proposals, setProposals] = useState<Proposal[]>([]); // State to store the list of proposals.
  const [loading, setLoading] = useState(true); // State to track loading status.
  const [error, setError] = useState<string | null>(null); // State to store any errors.
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the create form.

  // useEffect to check authentication and fetch proposals on component mount.
  useEffect(() => {
    // Check if the user is logged in.
    if (!isLoggedIn()) {
      router.push("/login"); // Redirect to login if not authenticated.
      return;
    }

    // Function to fetch proposals from the API.
    const fetchProposals = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching.
        // Import the API utility function (dynamically to avoid SSR issues).
        const { getProposals } = await import("@/app/lib/api");
        const data = await getProposals(); // Call the API function.
        setProposals(data); // Update state with fetched proposals.
      } catch (err) {
        console.error("Failed to fetch proposals:", err); // Log the error.
        setError("Failed to load proposals. Please try again."); // Set error message.
      } finally {
        setLoading(false); // Set loading state to false after fetch attempt.
      }
    };

    fetchProposals(); // Call the fetch function.
  }, [router]); // Run effect when router changes.

  // Handler for creating a new proposal.
  const handleCreateProposal = async (newProposalData: Omit<Proposal, 'id' | 'status' | 'currentStepIndex' | 'steps'>) => {
    try {
      // Import the API utility function.
      const { createProposal } = await import("@/app/lib/api");
      const newProposal = await createProposal(newProposalData); // Call API to create proposal.
      setProposals([newProposal, ...proposals]); // Add the new proposal to the list (optimistic update).
      setShowForm(false); // Hide the form after successful creation.
    } catch (err) {
      console.error("Failed to create proposal:", err); // Log the error.
      alert("Failed to create proposal. Please try again."); // Show alert for user feedback.
    }
  };

  // Handler for refreshing the proposal list.
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const { getProposals } = await import("@/app/lib/api");
      const data = await getProposals();
      setProposals(data);
    } catch (err) {
      console.error("Failed to refresh proposals:", err);
      setError("Failed to refresh proposals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, render nothing (redirect handled by useEffect).
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investment Proposals</h1>
        <div>
          {/* Button to toggle the visibility of the create proposal form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {showForm ? "Cancel" : "New Proposal"}
          </button>
          {/* Button to refresh the proposal list */}
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Conditionally render the ProposalForm component */}
      {showForm && (
        <div className="mb-6 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
          <ProposalForm onSubmit={handleCreateProposal} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Display loading, error, or the ProposalList component */}
      {loading && <p>Loading proposals...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ProposalList proposals={proposals} onRefresh={handleRefresh} />
      )}
    </div>
  );
}
```

### 7. `app/proposals/[id]/page.tsx` (Proposal Detail Page)

```tsx
// app/proposals/[id]/page.tsx
// The page displaying the details of a single investment proposal.
// Integrates with ProposalDetails and AuditTrail components.

"use client"; // Indicates this is a Client Component.

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/app/lib/auth";
import ProposalDetails from "@/app/components/ProposalDetails";
import AuditTrail from "@/app/components/AuditTrail";
import { Proposal } from "@/app/types";

// The Proposal Detail Page component. It receives the proposal ID as a parameter.
export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter(); // Hook for navigation.
  const [proposal, setProposal] = useState<Proposal | null>(null); // State to store the proposal details.
  const [loading, setLoading] = useState(true); // State to track loading status.
  const [error, setError] = useState<string | null>(null); // State to store any errors.

  // useEffect to check authentication and fetch proposal details on component mount.
  useEffect(() => {
    // Check if the user is logged in.
    if (!isLoggedIn()) {
      router.push("/login"); // Redirect to login if not authenticated.
      return;
    }

    // Function to fetch proposal details from the API.
    const fetchProposal = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching.
        setError(null); // Clear any previous errors.
        // Import the API utility function.
        const { getProposalById } = await import("@/app/lib/api");
        // Call the API function with the proposal ID from the URL parameters.
        const data = await getProposalById(Number(params.id));
        setProposal(data); // Update state with fetched proposal details.
      } catch (err) {
        console.error("Failed to fetch proposal:", err); // Log the error.
        setError("Failed to load proposal details. Please try again."); // Set error message.
      } finally {
        setLoading(false); // Set loading state to false after fetch attempt.
      }
    };

    fetchProposal(); // Call the fetch function.
  }, [params.id, router]); // Run effect when the proposal ID or router changes.

  // If not logged in, render nothing (redirect handled by useEffect).
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proposal Details</h1>
        {/* Button to navigate back to the proposals list */}
        <button
          onClick={() => router.push("/proposals")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>

      {/* Display loading, error, or the ProposalDetails and AuditTrail components */}
      {loading && <p>Loading proposal details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {proposal && !loading && !error && (
        <div>
          {/* Render the ProposalDetails component, passing the proposal data and a refresh handler */}
          <ProposalDetails proposal={proposal} onRefresh={async () => {
            try {
              const { getProposalById } = await import("@/app/lib/api");
              const data = await getProposalById(Number(params.id));
              setProposal(data);
            } catch (err) {
              console.error("Failed to refresh proposal:", err);
              setError("Failed to refresh proposal details.");
            }
          }} />
          {/* Render the AuditTrail component, passing the proposal ID */}
          <AuditTrail proposalId={Number(params.id)} />
        </div>
      )}
    </div>
  );
}
```

### 8. `app/types/index.ts` (Type Definitions)

```typescript
// app/types/index.ts
// Defines TypeScript interfaces for data structures used in the application.
// Ensures type safety and better developer experience.

// Interface representing an investment proposal.
export interface Proposal {
  id: number; // Unique identifier for the proposal.
  title: string; // Title of the investment proposal.
  applicantName: string; // Name of the applicant submitting the proposal.
  amount: number; // Investment amount requested.
  description: string; // Description of the investment opportunity.
  status: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; // Current status of the proposal.
  currentStepIndex: number; // Index of the current approval step.
  steps: ProposalStep[]; // Array of approval steps for the proposal.
}

// Interface representing a single approval step within a proposal.
export interface ProposalStep {
  id: number; // Unique identifier for the step.
  name: string; // Name of the approval step (e.g., "PEER_REVIEW").
  status: "PENDING" | "APPROVED" | "REJECTED"; // Status of this specific step.
  approver?: string; // Name of the person who approved/rejected (optional).
  comments?: string; // Comments from the approver (optional).
  completedAt?: string; // Timestamp when the step was completed (optional).
}

// Interface representing an audit log entry.
export interface AuditEntry {
  id: number; // Unique identifier for the audit entry.
  proposalId: number; // ID of the proposal this entry relates to.
  action: string; // Type of action performed (e.g., "PROPOSAL_SUBMITTED").
  actor: string; // User who performed the action.
  timestamp: string; // When the action occurred.
  details?: string; // Additional details about the action (optional).
}
```

### 9. `app/lib/auth.ts` (Authentication Utilities)

```typescript
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
```

### 10. `app/lib/api.ts` (API Utility Functions)

```typescript
// app/lib/api.ts
// Centralized utility functions for interacting with the backend microservices.
// Handles API calls, authentication headers, and error responses.

import axios from 'axios';
import { Proposal, AuditEntry } from '@/app/types';
import { getToken } from '@/app/lib/auth';

// Base URLs for the backend microservices, matching the cheat sheet.
const PROPOSAL_SERVICE_URL = 'http://localhost:8081/api/proposals';
const AUDIT_SERVICE_URL = 'http://localhost:8082/api/audit';

// Create an Axios instance for the Proposal Service.
// This allows setting default configurations like base URL and headers.
const proposalApi = axios.create({
  baseURL: PROPOSAL_SERVICE_URL,
});

// Create an Axios instance for the Audit Service.
const auditApi = axios.create({
  baseURL: AUDIT_SERVICE_URL,
});

// Add a request interceptor to the proposal API instance.
// This automatically attaches the authentication token to outgoing requests.
proposalApi.interceptors.request.use((config) => {
  const token = getToken(); // Get the token from auth utilities.
  if (token) {
    // Add the Authorization header if a token exists.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Return the modified config.
});

// Add a request interceptor to the audit API instance.
auditApi.interceptors.request.use((config) => {
  const token = getToken(); // Get the token from auth utilities.
  if (token) {
    // Add the Authorization header if a token exists.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Return the modified config.
});

// --- Proposal Service API Calls ---

// Fetches a list of all proposals.
// This corresponds to the GET /api/proposals endpoint.
export const getProposals = async (): Promise<Proposal[]> => {
  try {
    // Make the GET request to the proposals endpoint.
    const response = await proposalApi.get<Proposal[]>('');
    // Return the data from the successful response.
    return response.data;
  } catch (error) {
    // Handle errors (e.g., network issues, non-2xx responses).
    console.error('API Error fetching proposals:', error);
    // Re-throw the error so the calling component can handle it.
    throw error;
  }
};

// Fetches a single proposal by its ID.
// This corresponds to the GET /api/proposals/{id} endpoint.
export const getProposalById = async (id: number): Promise<Proposal> => {
  try {
    // Make the GET request to the specific proposal endpoint.
    const response = await proposalApi.get<Proposal>(`/${id}`);
    // Return the data from the successful response.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error(`API Error fetching proposal ${id}:`, error);
    // Re-throw the error.
    throw error;
  }
};

// Creates a new proposal in DRAFT status.
// This corresponds to the POST /api/proposals endpoint.
export const createProposal = async (proposalData: Omit<Proposal, 'id' | 'status' | 'currentStepIndex' | 'steps'>): Promise<Proposal> => {
  try {
    // Make the POST request with the proposal data.
    const response = await proposalApi.post<Proposal>('', proposalData);
    // Return the newly created proposal data from the response.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error('API Error creating proposal:', error);
    // Re-throw the error.
    throw error;
  }
};

// Submits a DRAFT proposal for review, creating approval steps.
// This corresponds to the POST /api/proposals/{id}/submit endpoint.
export const submitProposal = async (id: number, customChain?: string[]): Promise<Proposal> => {
  try {
    let response;
    if (customChain && customChain.length > 0) {
      // If a custom chain is provided, send it in the request body.
      response = await proposalApi.post<Proposal>(`/${id}/submit`, customChain);
    } else {
      // Otherwise, submit with the default chain.
      response = await proposalApi.post<Proposal>(`/${id}/submit`);
    }
    // Return the updated proposal data.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error(`API Error submitting proposal ${id}:`, error);
    // Re-throw the error.
    throw error;
  }
};

// Approves the current step of a proposal under review.
// This corresponds to the POST /api/proposals/{id}/approve endpoint.
export const approveProposalStep = async (id: number, approver: string, comments?: string): Promise<Proposal> => {
  try {
    // Prepare the approval data.
    const approvalData = { approver, comments };
    // Make the POST request to approve the step.
    const response = await proposalApi.post<Proposal>(`/${id}/approve`, approvalData);
    // Return the updated proposal data.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error(`API Error approving proposal ${id}:`, error);
    // Re-throw the error.
    throw error;
  }
};

// Rejects the current step of a proposal, finalizing it as REJECTED.
// This corresponds to the POST /api/proposals/{id}/reject endpoint.
export const rejectProposal = async (id: number, approver: string, comments?: string): Promise<Proposal> => {
  try {
    // Prepare the rejection data.
    const rejectionData = { approver, comments };
    // Make the POST request to reject the proposal.
    const response = await proposalApi.post<Proposal>(`/${id}/reject`, rejectionData);
    // Return the updated proposal data.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error(`API Error rejecting proposal ${id}:`, error);
    // Re-throw the error.
    throw error;
  }
};

// --- Audit Service API Calls ---

// Fetches the audit trail, optionally filtered by proposal ID.
// This corresponds to the GET /api/audit endpoint.
export const getAuditTrail = async (proposalId?: number): Promise<AuditEntry[]> => {
  try {
    let url = ''; // Base URL for the audit endpoint.
    if (proposalId !== undefined) {
      // If a proposal ID is provided, add it as a query parameter.
      url = `?proposalId=${proposalId}`;
    }
    // Make the GET request to the audit endpoint.
    const response = await auditApi.get<AuditEntry[]>(url);
    // Return the audit entries from the response.
    return response.data;
  } catch (error) {
    // Handle errors.
    console.error('API Error fetching audit trail:', error);
    // Re-throw the error.
    throw error;
  }
};
```

### 11. `app/components/LoginForm.tsx` (Login Form Component)

```tsx
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
```

### 12. `app/components/ProposalList.tsx` (Proposal List Component)

```tsx
// app/components/ProposalList.tsx
// A reusable React component for displaying a table of investment proposals.
// Shows key proposal details and provides navigation to individual proposal pages.

"use client"; // Indicates this is a Client Component.

import Link from "next/link"; // Next.js component for client-side navigation.
import { Proposal } from "@/app/types"; // Import the Proposal type definition.

// Define the props that this component expects.
interface ProposalListProps {
  proposals: Proposal[]; // Array of proposals to display.
  onRefresh: () => void; // Function to call when refresh is requested (passed from parent).
}

// The ProposalList component definition.
export default function ProposalList({ proposals, onRefresh }: ProposalListProps) {
  return (
    <div className="overflow-x-auto">
      {/* Table element to structure the proposal data */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          {/* Table header row */}
          <tr className="bg-gray-100">
            {/* Header cells for each column */}
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Applicant</th>
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the proposals array to create a table row for each proposal */}
          {proposals.map((proposal) => (
            <tr key={proposal.id} className="hover:bg-gray-50">
              {/* Data cells corresponding to the headers */}
              <td className="py-2 px-4 border-b">{proposal.id}</td>
              <td className="py-2 px-4 border-b">{proposal.title}</td>
              <td className="py-2 px-4 border-b">{proposal.applicantName}</td>
              <td className="py-2 px-4 border-b">${proposal.amount.toLocaleString()}</td>
              {/* Status cell with conditional styling based on proposal status */}
              <td className="py-2 px-4 border-b">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${proposal.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    proposal.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                    proposal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                  {proposal.status}
                </span>
              </td>
              {/* Actions cell with a link to the proposal detail page */}
              <td className="py-2 px-4 border-b">
                <Link
                  href={`/proposals/${proposal.id}`} // Dynamic route to the detail page.
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Display a message if no proposals are found */}
      {proposals.length === 0 && (
        <p className="text-center py-4 text-gray-500">No proposals found.</p>
      )}
    </div>
  );
}
```

### 13. `app/components/ProposalDetails.tsx` (Proposal Detail Component)

```tsx
// app/components/ProposalDetails.tsx
// A reusable React component for displaying the detailed information of a single investment proposal.
// Shows proposal data, current step status, and provides action buttons (Submit, Approve, Reject).

"use client"; // Indicates this is a Client Component.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Proposal } from "@/app/types";
import ProposalActions from "@/app/components/ProposalActions";

// Define the props that this component expects.
interface ProposalDetailsProps {
  proposal: Proposal; // The proposal object to display details for.
  onRefresh: () => void; // Function to call to refresh the proposal data (passed from parent).
}

// The ProposalDetails component definition.
export default function ProposalDetails({ proposal, onRefresh }: ProposalDetailsProps) {
  const router = useRouter(); // Hook for navigation (e.g., after actions).
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if a submission action is in progress.

  // Handler for the submit action.
  const handleSubmit = async () => {
    setIsSubmitting(true); // Set submitting state to true.
    try {
      // Dynamically import the API utility to avoid SSR issues.
      const { submitProposal } = await import("@/app/lib/api");
      // Call the submitProposal API function.
      await submitProposal(proposal.id);
      alert("Proposal submitted for review!"); // Inform the user.
      onRefresh(); // Refresh the proposal data to reflect the new status and steps.
    } catch (err) {
      console.error("Failed to submit proposal:", err); // Log the error.
      alert("Failed to submit proposal. Please try again."); // Inform the user of the error.
    } finally {
      setIsSubmitting(false); // Reset submitting state.
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      {/* Card header with proposal title and ID */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Proposal #{proposal.id}: {proposal.title}
        </h3>
        {/* Display proposal status with styling */}
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Status:{" "}
          <span className={`font-semibold ${
            proposal.status === 'DRAFT' ? 'text-yellow-600' :
            proposal.status === 'UNDER_REVIEW' ? 'text-blue-600' :
            proposal.status === 'APPROVED' ? 'text-green-600' :
            'text-red-600'
          }`}>
            {proposal.status}
          </span>
        </p>
      </div>
      
      {/* Card body with proposal details */}
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {/* Applicant Name */}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Applicant</dt>
            <dd className="mt-1 text-sm text-gray-900">{proposal.applicantName}</dd>
          </div>
          {/* Amount */}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Amount</dt>
            <dd className="mt-1 text-sm text-gray-900">${proposal.amount.toLocaleString()}</dd>
          </div>
          {/* Description */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{proposal.description}</dd>
          </div>
        </dl>

        {/* Approval Steps Section */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Approval Steps</h4>
          {/* Display message if no steps exist (e.g., DRAFT status) */}
          {proposal.steps.length === 0 ? (
            <p className="text-gray-500 italic">No approval steps yet.</p>
          ) : (
            // List the approval steps
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {proposal.steps.map((step, index) => (
                <li key={step.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    {/* Step number and name */}
                    <span className="ml-2 flex-1 w-0 truncate">
                      {index + 1}. {step.name}
                    </span>
                  </div>
                  {/* Step status with styling */}
                  <div className="ml-4 flex-shrink-0">
                    <span className={`font-medium ${
                      step.status === 'PENDING' ? 'text-yellow-600' :
                      step.status === 'APPROVED' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {step.status}
                    </span>
                    {/* Display approver and comments if step is completed */}
                    {step.status !== 'PENDING' && step.approver && (
                      <span className="block text-xs text-gray-500 mt-1">
                        by {step.approver} {step.comments && `: ${step.comments}`}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons Section */}
        {/* Only show action buttons if the proposal is in DRAFT status */}
        {proposal.status === "DRAFT" && (
          <div className="mt-6 flex items-center">
            <button
              onClick={handleSubmit} // Attach the submit handler.
              disabled={isSubmitting} // Disable button while submitting.
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {/* Show loading text or button text */}
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        )}

        {/* Render ProposalActions component if proposal is UNDER_REVIEW */}
        {proposal.status === "UNDER_REVIEW" && (
          <ProposalActions proposal={proposal} onActionComplete={onRefresh} />
        )}
      </div>
    </div>
  );
}
```

### 14. `app/components/ProposalForm.tsx` (Proposal Creation Form Component)

```tsx
// app/components/ProposalForm.tsx
// A reusable React component for creating a new investment proposal.
// Handles form state, validation, and submission to the parent component.

"use client"; // Indicates this is a Client Component.

import { useState } from "react";
import { Proposal } from "@/app/types";

// Define the props that this component expects.
// It receives functions from the parent to handle submission and cancellation.
interface ProposalFormProps {
  onSubmit: (data: Omit<Proposal, 'id' | 'status' | 'currentStepIndex' | 'steps'>) => void;
  onCancel: () => void;
}

// The ProposalForm component definition.
export default function ProposalForm({ onSubmit, onCancel }: ProposalFormProps) {
  // State variables for each form field.
  const [title, setTitle] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // State for form validation errors.
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handler for the main form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default page reload.

    // Basic client-side validation.
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!applicantName.trim()) newErrors.applicantName = "Applicant name is required.";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        newErrors.amount = "Valid amount is required.";
    }
    if (!description.trim()) newErrors.description = "Description is required.";

    // If there are validation errors, display them and stop submission.
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    // If validation passes, prepare the data and call the parent's onSubmit handler.
    onSubmit({
      title,
      applicantName,
      amount: Number(amount),
      description,
    });
  };

  return (
    // The main form element.
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.title ? "border-red-500" : ""
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Applicant Name Input */}
      <div>
        <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">
          Applicant Name *
        </label>
        <input
          type="text"
          id="applicantName"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.applicantName ? "border-red-500" : ""
          }`}
        />
        {errors.applicantName && <p className="mt-1 text-sm text-red-600">{errors.applicantName}</p>}
      </div>

      {/* Amount Input */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount ($) *
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.amount ? "border-red-500" : ""
          }`}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.description ? "border-red-500" : ""
          }`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Proposal
        </button>
      </div>
    </form>
  );
}
```

### 15. `app/components/ProposalActions.tsx` (Proposal Action Buttons Component)

```tsx
// app/components/ProposalActions.tsx
// A reusable React component for displaying action buttons (Approve, Reject) for proposals under review.
// Handles the logic for these actions and integrates with the API.

"use client"; // Indicates this is a Client Component.

import { useState } from "react";
import { Proposal } from "@/app/types";

// Define the props that this component expects.
interface ProposalActionsProps {
  proposal: Proposal; // The proposal object for which actions are displayed.
  onActionComplete: () => void; // Function to call after an action is successful (e.g., to refresh data).
}

// The ProposalActions component definition.
export default function ProposalActions({ proposal, onActionComplete }: ProposalActionsProps) {
  // State variables for managing the action forms (Approve/Reject).
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approver, setApprover] = useState("");
  const [comments, setComments] = useState("");
  const [actionErrors, setActionErrors] = useState(""); // State for action-specific errors.

  // Handler for initiating the approve process.
  const handleApproveClick = () => {
    setIsApproving(true);
    setIsRejecting(false); // Ensure reject form is closed.
    setActionErrors(""); // Clear previous errors.
    setApprover(""); // Reset form fields.
    setComments("");
  };

  // Handler for initiating the reject process.
  const handleRejectClick = () => {
    setIsRejecting(true);
    setIsApproving(false); // Ensure approve form is closed.
    setActionErrors(""); // Clear previous errors.
    setApprover(""); // Reset form fields.
    setComments("");
  };

  // Handler for canceling the current action form.
  const handleCancelAction = () => {
    setIsApproving(false);
    setIsRejecting(false);
    setActionErrors("");
    setApprover("");
    setComments("");
  };

  // Handler for submitting the approve action.
  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approver.trim()) {
      setActionErrors("Approver name is required.");
      return;
    }

    try {
      const { approveProposalStep } = await import("@/app/lib/api");
      // Approve the *current* step of the proposal.
      await approveProposalStep(proposal.id, approver, comments);
      alert("Proposal step approved!");
      handleCancelAction(); // Close the form.
      onActionComplete(); // Refresh parent data.
    } catch (err) {
      console.error("Failed to approve proposal:", err);
      setActionErrors("Failed to approve proposal. Please try again.");
    }
  };

  // Handler for submitting the reject action.
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approver.trim()) {
      setActionErrors("Approver name is required.");
      return;
    }

    try {
      const { rejectProposal } = await import("@/app/lib/api");
      // Reject the *current* step, which finalizes the proposal as REJECTED.
      await rejectProposal(proposal.id, approver, comments);
      alert("Proposal rejected!");
      handleCancelAction(); // Close the form.
      onActionComplete(); // Refresh parent data.
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      setActionErrors("Failed to reject proposal. Please try again.");
    }
  };

  return (
    <div className="mt-6">
      {/* Main Action Buttons (Approve/Reject) */}
      {!isApproving && !isRejecting && (
        <div className="flex space-x-3">
          <button
            onClick={handleApproveClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Approve Current Step
          </button>
          <button
            onClick={handleRejectClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reject Proposal
          </button>
        </div>
      )}

      {/* Approve Form */}
      {isApproving && (
        <div className="mt-4 p-4 border border-green-200 rounded-md bg-green-50">
          <h4 className="text-md font-medium text-green-800 mb-3">Approve Current Step</h4>
          {actionErrors && <p className="text-red-600 mb-2">{actionErrors}</p>}
          <form onSubmit={handleApproveSubmit} className="space-y-3">
            <div>
              <label htmlFor="approve-approver" className="block text-sm font-medium text-green-700">
                Approver Name *
              </label>
              <input
                type="text"
                id="approve-approver"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="e.g., john.doe"
              />
            </div>
            <div>
              <label htmlFor="approve-comments" className="block text-sm font-medium text-green-700">
                Comments (Optional)
              </label>
              <textarea
                id="approve-comments"
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Add any relevant comments..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelAction}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
              >
                Confirm Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reject Form */}
      {isRejecting && (
        <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50">
          <h4 className="text-md font-medium text-red-800 mb-3">Reject Proposal</h4>
          <p className="text-sm text-red-700 mb-3">
            This will finalize the proposal status as REJECTED.
          </p>
          {actionErrors && <p className="text-red-600 mb-2">{actionErrors}</p>}
          <form onSubmit={handleRejectSubmit} className="space-y-3">
            <div>
              <label htmlFor="reject-approver" className="block text-sm font-medium text-red-700">
                Rejector Name *
              </label>
              <input
                type="text"
                id="reject-approver"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="e.g., qa.user"
              />
            </div>
            <div>
              <label htmlFor="reject-comments" className="block text-sm font-medium text-red-700">
                Rejection Comments *
              </label>
              <textarea
                id="reject-comments"
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Please provide reason for rejection..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelAction}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
```

### 16. `app/components/AuditTrail.tsx` (Audit Trail Component)

```tsx
// app/components/AuditTrail.tsx
// A reusable React component for displaying the audit trail of a specific investment proposal.
// Fetches and displays audit entries from the Audit Service.

"use client"; // Indicates this is a Client Component.

import { useEffect, useState } from "react";
import { AuditEntry } from "@/app/types";

// Define the props that this component expects.
interface AuditTrailProps {
  proposalId: number; // The ID of the proposal to fetch the audit trail for.
}

// The AuditTrail component definition.
export default function AuditTrail({ proposalId }: AuditTrailProps) {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]); // State to store audit entries.
  const [loading, setLoading] = useState(true); // State to track loading status.
  const [error, setError] = useState<string | null>(null); // State to store errors.

  // useEffect to fetch audit trail when the component mounts or proposalId changes.
  useEffect(() => {
    const fetchAuditTrail = async () => {
      try {
        setLoading(true); // Set loading state.
        setError(null); // Clear previous errors.
        // Dynamically import the API utility.
        const { getAuditTrail } = await import("@/app/lib/api");
        // Call the getAuditTrail API function, filtering by proposalId.
        const data = await getAuditTrail(proposalId);
        setAuditEntries(data); // Update state with fetched entries.
      } catch (err) {
        console.error("Failed to fetch audit trail:", err); // Log the error.
        setError("Failed to load audit trail. Please try again."); // Set error message.
      } finally {
        setLoading(false); // Set loading state to false.
      }
    };

    fetchAuditTrail(); // Call the fetch function.
  }, [proposalId]); // Dependency array includes proposalId.

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Trail</h3>
      
      {/* Display loading, error, or the audit trail list */}
      {loading && <p className="text-gray-500">Loading audit trail...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {/* Check if there are any audit entries */}
          {auditEntries.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {/* Map over audit entries to create list items */}
              {auditEntries.map((entry) => (
                <li key={entry.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {entry.action.replace(/_/g, ' ')} {/* Format action name */}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      {/* Display timestamp */}
                      <p className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      {/* Display actor */}
                      <p className="flex items-center text-sm text-gray-500">
                        Actor: {entry.actor}
                      </p>
                    </div>
                    {/* Display details if available */}
                    {entry.details && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>Details: {entry.details}</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // Message if no audit entries are found
            <p className="px-4 py-4 sm:px-6 text-gray-500 italic">No audit entries found for this proposal.</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 17. `app/globals.css` (Global Styles)

```css
/* app/globals.css */
/* Import Tailwind CSS directives to include its base styles, components, and utilities. */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Example of adding custom global styles if needed */
/* body {
  background-color: #f0f0f0;
} */
```

### 18. `.gitignore`

```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# vercel
.vercel
```

### 19. `README.md` (Instructions)

```markdown
# Investment Proposal Manager (Next.js Frontend)

This is a Next.js frontend application for managing investment proposals, interacting with the backend microservices described in the `UC IPM API cheat sheet.txt`.

## Features

- User login/logout
- View list of investment proposals
- Create new proposals (DRAFT status)
- View detailed proposal information
- Submit proposals for review (DRAFT → UNDER_REVIEW)
- Approve/Reject proposals (UNDER_REVIEW status)
- View audit trail for proposals

## Getting Started

1.  **Prerequisites:**
    *   Node.js (version 18 or later recommended)
    *   The backend services (Proposal, Audit, Notification) must be running on `localhost:8081`, `localhost:8082`, and `localhost:8083` respectively.

2.  **Installation:**
    *   Clone this repository.
    *   Navigate to the project directory: `cd investment-proposal-manager`
    *   Install dependencies: `npm install`

3.  **Running the Development Server:**
    *   Start the development server: `npm run dev`
    *   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Login:** Navigate to the login page and enter any username/password (authentication is mocked for this example).
2.  **Proposals List:** View all proposals. Create new ones.
3.  **Proposal Details:** Click "View Details" on a proposal to see its full information, steps, and audit trail.
4.  **Actions:**
    *   On a `DRAFT` proposal, you can click "Submit for Review".
    *   On an `UNDER_REVIEW` proposal, you can "Approve Current Step" or "Reject Proposal".

## Project Structure

- `app/`: Contains Next.js App Router pages and components.
- `app/lib/`: Contains utility functions for authentication (`auth.ts`) and API calls (`api.ts`).
- `app/types/`: Contains TypeScript type definitions.
- `app/components/`: Reusable React components for the UI.
```

---

This project provides a complete, commented frontend for the Investment Proposal Management system, demonstrating integration with the specified backend APIs using Next.js, React, and TypeScript. Remember to ensure the backend services are running on the specified ports (`8081`, `8082`, `8083`) for the application to function correctly.
