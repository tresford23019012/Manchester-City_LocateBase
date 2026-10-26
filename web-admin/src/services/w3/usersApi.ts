import type { AdminAccount, ManagedUser, NewAdminInput } from "./userTypes";
import * as mock from "./usersMock";

// Mock mode is on unless VITE_USE_MOCK=false (same switch as the other W3 pages).
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const notConnected = () => new Error("Real API is not connected yet.");

// Replace each TODO with W1's API client call when it lands.
// The backend must check the Firebase token and the admin role on every call.

export async function listUsers(): Promise<ManagedUser[]> {
  if (USE_MOCK) return mock.listUsers();
  // TODO: apiClient.get<ManagedUser[]>("/admin/users")
  throw notConnected();
}

export async function blockUser(id: string, reason: string): Promise<ManagedUser> {
  if (USE_MOCK) return mock.block(id, reason);
  // TODO: apiClient.post<ManagedUser>(`/admin/users/${id}/block`, { reason })
  throw notConnected();
}

export async function unblockUser(id: string): Promise<ManagedUser> {
  if (USE_MOCK) return mock.unblock(id);
  // TODO: apiClient.post<ManagedUser>(`/admin/users/${id}/unblock`)
  throw notConnected();
}

export async function listAdmins(): Promise<AdminAccount[]> {
  if (USE_MOCK) return mock.listAdmins();
  // TODO: apiClient.get<AdminAccount[]>("/admin/admins")
  throw notConnected();
}

export async function createAdmin(input: NewAdminInput): Promise<AdminAccount> {
  if (USE_MOCK) return mock.createAdmin(input);
  // TODO: apiClient.post<AdminAccount>("/admin/admins", input)
  // The backend creates the Firebase user and sets the admin role. Never log the password.
  throw notConnected();
}
