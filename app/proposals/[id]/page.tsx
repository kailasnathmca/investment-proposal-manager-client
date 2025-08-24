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