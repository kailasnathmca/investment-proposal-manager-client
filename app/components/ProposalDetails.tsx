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