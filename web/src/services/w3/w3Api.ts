import type { DashboardData } from "./types";
import { emptyDashboard, mockDashboard } from "./mockData";

// Mock mode is on unless you set VITE_USE_MOCK=false in .env.
// (VITE_ variables are public in the browser bundle. Never put secrets here.)
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Test the other UI states in mock mode by adding a query string:
 *   /admin?mock=empty   no guesthouses yet
 *   /admin?mock=error   failed request
 *   /admin?mock=slow    4 second delay (to see skeletons)
 */
export async function getDashboard(): Promise<DashboardData> {
  if (USE_MOCK) {
    const scenario = new URLSearchParams(window.location.search).get("mock");
    await wait(scenario === "slow" ? 4000 : 600);
    if (scenario === "error") {
      throw new Error("Could not load dashboard data. Check your connection and try again.");
    }
    return scenario === "empty" ? emptyDashboard : mockDashboard;
  }

  // TODO: replace with W1's API client when it lands, e.g.
  // return apiClient.get<DashboardData>("/admin/dashboard");
  throw new Error("Real API is not connected yet.");
}