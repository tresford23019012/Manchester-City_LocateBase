import type { OwnerRequest } from "./requestTypes";
import * as mock from "./requestsMock";

// Mock mode is on unless VITE_USE_MOCK=false (same switch as the dashboard).
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const notConnected = () => new Error("Real API is not connected yet.");

// Replace each TODO with W1's API client call when it lands.
// The backend must check the Firebase token, the admin role, and the status rules on every call.

export async function listRequests(): Promise<OwnerRequest[]> {
  if (USE_MOCK) return mock.list();
  // TODO: apiClient.get<OwnerRequest[]>("/admin/requests")
  throw notConnected();
}

export async function getRequest(id: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.get(id);
  // TODO: apiClient.get<OwnerRequest>(`/admin/requests/${id}`)
  throw notConnected();
}

export async function listReps(): Promise<string[]> {
  if (USE_MOCK) return mock.listReps();
  // TODO: apiClient.get<string[]>("/admin/reps")
  throw notConnected();
}

export async function approveRequest(id: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.approve(id);
  // TODO: apiClient.post<OwnerRequest>(`/admin/requests/${id}/approve`)
  throw notConnected();
}

export async function rejectRequest(id: string, reason: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.reject(id, reason);
  // TODO: apiClient.post<OwnerRequest>(`/admin/requests/${id}/reject`, { reason })
  throw notConnected();
}

export async function dispatchRep(id: string, repName: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.dispatchRep(id, repName);
  // TODO: apiClient.post<OwnerRequest>(`/admin/requests/${id}/dispatch`, { repName })
  throw notConnected();
}

export async function markOnSiteCollected(id: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.markOnSiteCollected(id);
  // TODO: apiClient.post<OwnerRequest>(`/admin/requests/${id}/on-site-collected`)
  throw notConnected();
}

export async function publishRequest(id: string): Promise<OwnerRequest> {
  if (USE_MOCK) return mock.publish(id);
  // TODO: apiClient.post<OwnerRequest>(`/admin/requests/${id}/publish`)
  throw notConnected();
}