import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { uploadPhoto } from "./cloudinary";
import "./GuesthouseForm.css";

export type GuesthouseStatus =
  | "published"
  | "draft"
  | "suspended";

export type Guesthouse = {
  id: string;
  name: string;
  city: string;
  description: string;
  address: string;
  pricePerNight: number;
  contactPhone: string;
  contactEmail: string;
  status: GuesthouseStatus;
  images?: string[];
  amenities?: string[];
  latitude?: number;
  longitude?: number;
};

type GuesthouseFormProps = {
  initialGuesthouse?: Guesthouse;
  onSave: (guesthouse: Guesthouse) => void;
  onClose: () => void;
};

const MAX_PHOTOS = 7;

const AMENITIES = [
  "WiFi",
  "Parking",
  "Breakfast",
  "Air conditioning",
  "Swimming pool",
  "Restaurant",
  "Laundry",
  "Wheelchair access",
];

function GuesthouseForm({
  initialGuesthouse,
  onSave,
  onClose,
}: GuesthouseFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uploadBusyRef = useRef(false);

  const [name, setName] = useState(
    initialGuesthouse?.name ?? "",
  );
  const [city, setCity] = useState(
    initialGuesthouse?.city ?? "",
  );
  const [description, setDescription] = useState(
    initialGuesthouse?.description ?? "",
  );
  const [address, setAddress] = useState(
    initialGuesthouse?.address ?? "",
  );
  const [price, setPrice] = useState(
    initialGuesthouse
      ? String(initialGuesthouse.pricePerNight)
      : "",
  );
  const [phone, setPhone] = useState(
    initialGuesthouse?.contactPhone ?? "",
  );
  const [email, setEmail] = useState(
    initialGuesthouse?.contactEmail ?? "",
  );
  const [status, setStatus] = useState<GuesthouseStatus>(
    initialGuesthouse?.status ?? "draft",
  );
  const [images, setImages] = useState<string[]>(
    initialGuesthouse?.images ?? [],
  );
  const [amenities, setAmenities] = useState<string[]>(
    initialGuesthouse?.amenities ?? [],
  );

  const [latitude, setLatitude] = useState(
    initialGuesthouse?.latitude !== undefined
      ? String(initialGuesthouse.latitude)
      : "",
  );
  const [longitude, setLongitude] = useState(
    initialGuesthouse?.longitude !== undefined
      ? String(initialGuesthouse.longitude)
      : "",
  );

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const isEditing = Boolean(initialGuesthouse);

  // Preserve any existing amenities received from the backend.
  const availableAmenities = [
    ...new Set([...AMENITIES, ...amenities]),
  ];

  useEffect(() => {
    const previousElement =
      document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      dialog?.close();
      previousElement?.focus();
    };
  }, []);

  function toggleAmenity(amenity: string) {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity],
    );
  }

  async function handlePhotos(files: File[]) {
    if (files.length === 0 || uploadBusyRef.current) {
      return;
    }

    setError("");
    setUploadMessage("");

    if (images.length + files.length > MAX_PHOTOS) {
      setError(
        `You can add only ${MAX_PHOTOS - images.length} more photos.`,
      );
      return;
    }

    for (const file of files) {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(
          file.type,
        )
      ) {
        setError(
          `${file.name}: choose a JPEG, PNG or WebP image.`,
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `${file.name}: each photo must be 5 MB or smaller.`,
        );
        return;
      }
    }

    uploadBusyRef.current = true;
    setUploading(true);

    try {
      for (let index = 0; index < files.length; index++) {
        setUploadMessage(
          `Uploading photo ${index + 1} of ${files.length}…`,
        );

        const url = await uploadPhoto(files[index]);

        setImages((previous) => [...previous, url]);
      }

      setUploadMessage(
        "Photos uploaded. Save the guesthouse to keep their links.",
      );
    } catch (uploadError) {
      setUploadMessage("");

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Photo upload failed.",
      );
    } finally {
      uploadBusyRef.current = false;
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    setImages((previous) =>
      previous.filter((_, photoIndex) => photoIndex !== index),
    );

    setError("");
    setUploadMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploadBusyRef.current) {
      return;
    }

    setError("");

    const priceNumber = Number(price);
    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);

    if (!name.trim() || !city.trim() || !description.trim()) {
      setError("Enter a name, city and description.");
      return;
    }

    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0
    ) {
      setError("Enter a price greater than zero.");
      return;
    }

    if (
      latitude.trim() === "" ||
      !Number.isFinite(latitudeNumber) ||
      latitudeNumber < -90 ||
      latitudeNumber > 90
    ) {
      setError("Enter a latitude between -90 and 90.");
      return;
    }

    if (
      longitude.trim() === "" ||
      !Number.isFinite(longitudeNumber) ||
      longitudeNumber < -180 ||
      longitudeNumber > 180
    ) {
      setError("Enter a longitude between -180 and 180.");
      return;
    }

    if (!/^\+?[\d\s()-]{7,20}$/.test(phone.trim())) {
      setError("Enter a valid contact phone number.");
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError("Enter a valid email address.");
      return;
    }

    if (images.length > MAX_PHOTOS) {
      setError("A guesthouse can have only seven photos.");
      return;
    }

    try {
      onSave({
        id: initialGuesthouse?.id ?? crypto.randomUUID(),
        name: name.trim(),
        city: city.trim(),
        description: description.trim(),
        address: address.trim(),
        pricePerNight: priceNumber,
        contactPhone: phone.trim(),
        contactEmail: email.trim(),
        status,
        images,
        amenities,
        latitude: latitudeNumber,
        longitude: longitudeNumber,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save the guesthouse.",
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="guesthouse-dialog"
      aria-labelledby="form-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!uploadBusyRef.current) {
          onClose();
        }
      }}
    >
      <div className="form-heading">
        <div>
          <h2 id="form-title">
            {isEditing ? "Edit guesthouse" : "Add guesthouse"}
          </h2>
          <p>Fields marked * are required.</p>
        </div>

        <button
          type="button"
          aria-label="Close form"
          onClick={onClose}
          disabled={uploading}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <fieldset
          className="guesthouse-fields"
          disabled={uploading}
        >
          <div className="guesthouse-form-grid">
            <label>
              Guesthouse name *
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              City *
              <input
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>

            <label className="full-width">
              Description *
              <textarea
                required
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </label>

            <label className="full-width">
              Address
              <input
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
              />
            </label>

            <label>
              Price per night (P) *
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>

            <label>
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as GuesthouseStatus,
                  )
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>

            <label>
              Contact phone *
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+267 71 000 000"
              />
            </label>

            <label>
              Contact email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              Latitude *
              <input
                required
                type="number"
                min="-90"
                max="90"
                step="any"
                placeholder="For example, -24.65"
                value={latitude}
                onChange={(event) =>
                  setLatitude(event.target.value)
                }
              />
            </label>

            <label>
              Longitude *
              <input
                required
                type="number"
                min="-180"
                max="180"
                step="any"
                placeholder="For example, 25.91"
                value={longitude}
                onChange={(event) =>
                  setLongitude(event.target.value)
                }
              />
            </label>
          </div>

          <p className="photo-help">
            Enter the guesthouse’s actual coordinates. The values
            shown as examples are for testing only.
          </p>

          <fieldset
            style={{
              margin: "24px 0",
              padding: "16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          >
            <legend>Amenities</legend>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "14px",
              }}
            >
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    style={{
                      width: "17px",
                      height: "17px",
                      accentColor: "var(--primary)",
                    }}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </fieldset>

          <section
            className="photo-section"
            aria-labelledby="photos-heading"
          >
            <div className="photo-heading">
              <h3 id="photos-heading">Guesthouse photos</h3>
              <span>{images.length} / {MAX_PHOTOS}</span>
            </div>

            <p className="photo-help">
              JPEG, PNG or WebP. Maximum 5 MB per photo.
            </p>

            <p className="photo-demo-notice">
              New photos upload to Cloudinary. Click Save to
              attach their links to this guesthouse.
            </p>

            <label className="photo-upload">
              <span>Choose photos</span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={images.length >= MAX_PHOTOS}
                onChange={(event) => {
                  const files = Array.from(
                    event.target.files ?? [],
                  );

                  event.target.value = "";
                  void handlePhotos(files);
                }}
              />
            </label>

            {images.length === 0 ? (
              <p className="no-photos">
                No photos uploaded yet.
              </p>
            ) : (
              <div className="photo-grid">
                {images.map((image, index) => (
                  <div className="photo-card" key={index}>
                    <img
                      src={image}
                      alt={`Guesthouse photo ${index + 1}`}
                    />

                    <div className="photo-card-footer">
                      <span>Photo {index + 1}</span>

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </fieldset>

        <p className="photo-help" role="status">
          {uploadMessage}
        </p>

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="olive-button"
            disabled={uploading}
          >
            {uploading
              ? "Uploading photos…"
              : isEditing
                ? "Save changes"
                : "Save guesthouse"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default GuesthouseForm;