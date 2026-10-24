import type { DashboardData } from "../types";

// Fixed values (no Math.random) so the UI doesn't change on every refresh.
const dailyViews = [112, 98, 130, 145, 120, 160, 175, 150, 138, 190, 205, 180, 168, 220];

function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const mockDashboard: DashboardData = {
  stats: {
    totalGuesthouses: 48,
    topCity: { name: "Gaborone", count: 17 },
    highestRated: { id: "gh_021", name: "Okavango Gate", city: "Maun", rating: 4.9 },
  },
  viewsOverTime: lastNDays(dailyViews.length).map((date, i) => ({ date, views: dailyViews[i] })),
  topFavourited: [
    { name: "Okavango Gate", favourites: 64 },
    { name: "Chobe Riverside", favourites: 52 },
    { name: "Kalahari Rest", favourites: 41 },
    { name: "Limpopo View", favourites: 33 },
    { name: "Tswapong Lodge", favourites: 27 },
  ],
  statusBreakdown: { published: 36, draft: 8, suspended: 4 },
};

export const emptyDashboard: DashboardData = {
  stats: { totalGuesthouses: 0, topCity: null, highestRated: null },
  viewsOverTime: [],
  topFavourited: [],
  statusBreakdown: { published: 0, draft: 0, suspended: 0 },
};