
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Guesthouse = {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  contactPhone: string;
  contactEmail: string;
  averageRating: number;
  ratingCount: number;
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export async function getGuesthouses(): Promise<PageResponse<Guesthouse>> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/v1/guesthouses`);

  if (!response.ok) {
    throw new Error(`Guesthouse API returned ${response.status}`);
  }

  return response.json();
}
