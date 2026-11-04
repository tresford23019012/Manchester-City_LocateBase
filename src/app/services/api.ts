const API_URL = process.env.EXPO_PUBLIC_API_URL;
import type { User } from "firebase/auth";

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

type GuesthouseApiResponse = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  city: string;
  address: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  pricePerNight: number;
  amenities?: string[];
  photos?: string[];
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  ratingAverage?: number;
  ratingCount?: number;
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function mapGuesthouse(place: GuesthouseApiResponse): Guesthouse {
  return {
    id: place.id ?? place._id ?? "",
    name: place.name,
    description: place.description,
    city: place.city,
    address: place.address,
    latitude: place.location?.coordinates?.[1] ?? NaN,
    longitude: place.location?.coordinates?.[0] ?? NaN,
    pricePerNight: place.pricePerNight,
    amenities: place.amenities ?? [],
    images: place.photos ?? [],
    contactPhone: place.contact?.phone ?? "",
    contactEmail: place.contact?.email ?? "",
    averageRating: place.ratingAverage ?? 0,
    ratingCount: place.ratingCount ?? 0,
  };
}

async function fetchGuesthouses(
  endpoint: string,
  user?: User | null
): Promise<PageResponse<Guesthouse>> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const headers: HeadersInit = {};

  if (user) {
    const token = await user.getIdToken();

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}${endpoint}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Guesthouse API returned ${response.status}`);
  }

  const data: PageResponse<GuesthouseApiResponse> =
    await response.json();

  return {
    ...data,
    content: (data.content ?? []).map(mapGuesthouse),
  };
}

export function getGuesthouses(user?: User | null) {
  return fetchGuesthouses("/api/v1/guesthouses", user);
}

export function searchGuesthouses(
  query: string,
  user?: User | null
) {
  return fetchGuesthouses(
    `/api/v1/guesthouses?search=${encodeURIComponent(query)}`,
    user
  );
}

export async function getGuesthouseById(id: string): Promise<Guesthouse> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/v1/guesthouses/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error(`Could not load guesthouse (${response.status})`);
  }

  const place: GuesthouseApiResponse = await response.json();

  return mapGuesthouse(place);
}

// Shared helper for authenticated wishlist requests
async function wishlistRequest(
  user: User,
  endpoint: string,
  method: "GET" | "PUT" | "DELETE"
) {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/v1${endpoint}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Wishlist request failed (${response.status})`);
  }

  // Some successful PUT/DELETE requests may return no content.
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Retrieve the signed-in user's wishlist
export function getFavourites(user: User) {
  return wishlistRequest(user, "/me/favourites", "GET");
}

// Add a guesthouse to the wishlist
export function addFavourite(user: User, guesthouseId: string) {
  return wishlistRequest(
    user,
    `/me/favourites/${encodeURIComponent(guesthouseId)}`,
    "PUT"
  );
}

// Remove a guesthouse from the wishlist
export function removeFavourite(user: User, guesthouseId: string) {
  return wishlistRequest(
    user,
    `/me/favourites/${encodeURIComponent(guesthouseId)}`,
    "DELETE"
  );
}

export type Review = {
  id: string;
  guesthouseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

// Fetch reviews for a particular guesthouse.
// This endpoint is public, so authentication is not required.
export async function getGuesthouseReviews(
  guesthouseId: string
): Promise<Review[]> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/v1/guesthouses/${encodeURIComponent(guesthouseId)}/reviews`
  );

  if (!response.ok) {
    throw new Error(`Could not load reviews (${response.status})`);
  }

  const data = await response.json();

  // Support common response formats while we verify the backend response.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.reviews)) return data.reviews;
  if (Array.isArray(data.content)) return data.content;

  return [];
}

// Shared helper for authenticated review requests.
async function authenticatedReviewRequest(
  user: User,
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: object
) {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not configured");
  }

  const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}${endpoint}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Review request failed (${response.status})`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Submit a review.
export function submitReview(
  user: User,
  guesthouseId: string,
  review: { rating: number; comment: string }
) {
  return authenticatedReviewRequest(
    user,
    `/api/v1/guesthouses/${encodeURIComponent(guesthouseId)}/reviews`,
    "POST",
    review
  );
}

// Retrieve reviews written by the signed-in user.
export async function getMyReviews(user: User): Promise<Review[]> {
  const data = await authenticatedReviewRequest(
    user,
    "/api/v1/users/me/reviews",
    "GET"
  );

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.content)) return data.content;

  return [];
}

// Edit an existing review.
export function updateReview(
  user: User,
  reviewId: string,
  review: { rating: number; comment: string }
) {
  return authenticatedReviewRequest(
    user,
    `/api/v1/reviews/${encodeURIComponent(reviewId)}`,
    "PUT",
    review
  );
}

// Delete an existing review.
export function deleteReview(user: User, reviewId: string) {
  return authenticatedReviewRequest(
    user,
    `/api/v1/reviews/${encodeURIComponent(reviewId)}`,
    "DELETE"
  );
}