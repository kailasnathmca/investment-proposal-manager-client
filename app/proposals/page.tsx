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