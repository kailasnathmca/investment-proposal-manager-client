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