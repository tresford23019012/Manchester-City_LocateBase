const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadPhoto(file: File): Promise<string> {
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (
    !cloudName ||
    cloudName === "your_cloud_name" ||
    !uploadPreset
  ) {
    throw new Error(
      "Add your Cloudinary cloud name and upload preset to .env, " +
        "then restart the development server.",
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `${file.name}: choose a JPEG, PNG or WebP image.`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${file.name}: each photo must be 5 MB or smaller.`,
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(
        cloudName,
      )}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed for ${file.name}. Check your cloud name, ` +
          "unsigned preset and Cloudinary upload restrictions.",
      );
    }

    const result: unknown = await response.json();

    if (
      typeof result !== "object" ||
      result === null ||
      !("secure_url" in result) ||
      typeof result.secure_url !== "string" ||
      !result.secure_url.startsWith("https://")
    ) {
      throw new Error(
        "Cloudinary did not return a valid photo URL.",
      );
    }

    return result.secure_url;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `Upload timed out for ${file.name}. Try again.`,
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Could not reach Cloudinary. Check your internet connection.",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}