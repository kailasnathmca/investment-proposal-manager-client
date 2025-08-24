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