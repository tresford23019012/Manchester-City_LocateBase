import type { User } from "firebase/auth";

type UserProfile = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function syncUserProfile(
  firebaseUser: User,
  profile: UserProfile = {}
) {
  if (!API_URL) {
    throw new Error("API_URL is not configured.");
  }

  const token = await firebaseUser.getIdToken();

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/v1/users/sync`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "User synchronisation failed.");
  }

  return data;
}
