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