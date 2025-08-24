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