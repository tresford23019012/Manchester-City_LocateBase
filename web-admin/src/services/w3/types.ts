// Response shapes for the dashboard (tasks 79-80).
// Confirm these with the backend owner before connecting the real API.

export type DashboardStats = {
  totalGuesthouses: number;
  topCity: { name: string; count: number } | null;
  highestRated: { id: string; name: string; city: string; rating: number } | null;
};

export type ViewsPoint = { date: string; views: number }; // date as YYYY-MM-DD
export type FavouritesItem = { name: string; favourites: number };
export type StatusBreakdown = { published: number; draft: number; suspended: number };

export type DashboardData = {
  stats: DashboardStats;
  viewsOverTime: ViewsPoint[];
  topFavourited: FavouritesItem[];
  statusBreakdown: StatusBreakdown;
};