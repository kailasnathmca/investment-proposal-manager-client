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