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