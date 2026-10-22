import { useState } from "react";
import GuesthouseForm from "./GuesthouseForm";
import ExportCSV from "./ExportCSV";
import type {
  Guesthouse,
  GuesthouseStatus,
} from "./GuesthouseForm";
import "./App.css";

const STORAGE_KEY = "locatebase-w2-guesthouses";
const PAGE_SIZE = 5;

const statuses: GuesthouseStatus[] = [
  "published",
  "draft",
  "suspended",
];

const sampleGuesthouses: Guesthouse[] = [
  {
    id: "demo-1",
    name: "Acacia Rest Guesthouse",
    city: "Gaborone",
    description: "A fictional guesthouse for demonstration.",
    address: "",
    pricePerNight: 450,
    contactPhone: "+26771000000",
    contactEmail: "",
    status: "published",
    images: [],
  },
  {
    id: "demo-2",
    name: "Mophane Guesthouse",
    city: "Selebi Phikwe",
    description: "A fictional guesthouse for demonstration.",
    address: "",
    pricePerNight: 350,
    contactPhone: "+26772000000",
    contactEmail: "",
    status: "draft",
    images: [],
  },
  {
    id: "demo-3",
    name: "Chobe Riverside Lodge",
    city: "Kasane",
    description: "A fictional guesthouse for demonstration.",
    address: "",
    pricePerNight: 750,
    contactPhone: "+26773000000",
    contactEmail: "",
    status: "suspended",
    images: [],
  },
];

function isGuesthouse(value: unknown): value is Guesthouse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  const validImages =
    item.images === undefined ||
    (Array.isArray(item.images) &&
      item.images.length <= 7 &&
      item.images.every((image) => typeof image === "string"));

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.city === "string" &&
    typeof item.description === "string" &&
    typeof item.address === "string" &&
    typeof item.pricePerNight === "number" &&
    Number.isFinite(item.pricePerNight) &&
    item.pricePerNight > 0 &&
    typeof item.contactPhone === "string" &&
    typeof item.contactEmail === "string" &&
    (item.status === "published" ||
      item.status === "draft" ||
      item.status === "suspended") &&
    validImages
  );
}

function loadGuesthouses(): {
  guesthouses: Guesthouse[];
  error: string;
} {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return { guesthouses: sampleGuesthouses, error: "" };
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed) || !parsed.every(isGuesthouse)) {
      throw new Error("Invalid saved data");
    }

    const ids = parsed.map((guesthouse) => guesthouse.id);

    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate saved IDs");
    }

    return { guesthouses: parsed, error: "" };
  } catch {
    return {
      guesthouses: sampleGuesthouses,
      error:
        "Saved listings could not be loaded. Sample data is shown. " +
        "Saving is disabled to protect existing stored data. " +
        "Check browser storage permissions or back up your data " +
        "before clearing this site's storage.",
    };
  }
}

function statusLabel(status: GuesthouseStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function actionLabel(status: GuesthouseStatus) {
  if (status === "published") return "Publish";
  if (status === "suspended") return "Suspend";
  return "Draft";
}

function App() {
  const [initialData] = useState(loadGuesthouses);

  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>(
    initialData.guesthouses,
  );

  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingGuesthouse, setEditingGuesthouse] =
    useState<Guesthouse | undefined>();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const storageBlocked = Boolean(initialData.error);

  const cities = [
    ...new Set(guesthouses.map((guesthouse) => guesthouse.city)),
  ].sort();

  const invalidPriceRange =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  const filteredGuesthouses = guesthouses
    .filter((guesthouse) => {
      const text = search.trim().toLowerCase();

      return (
        !invalidPriceRange &&
        (guesthouse.name.toLowerCase().includes(text) ||
          guesthouse.city.toLowerCase().includes(text)) &&
        (!cityFilter || guesthouse.city === cityFilter) &&
        (!statusFilter || guesthouse.status === statusFilter) &&
        (minPrice === "" ||
          guesthouse.pricePerNight >= Number(minPrice)) &&
        (maxPrice === "" ||
          guesthouse.pricePerNight <= Number(maxPrice))
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return a.pricePerNight - b.pricePerNight;
      }

      if (sortBy === "price-high") {
        return b.pricePerNight - a.pricePerNight;
      }

      if (sortBy === "city") {
        return (
          a.city.localeCompare(b.city) ||
          a.name.localeCompare(b.name)
        );
      }

      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGuesthouses.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const pageGuesthouses = filteredGuesthouses.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const allPageSelected =
    pageGuesthouses.length > 0 &&
    pageGuesthouses.every((guesthouse) =>
      selectedIds.includes(guesthouse.id),
    );

  function resetSelectionAndPage() {
    setSelectedIds([]);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCityFilter("");
    setStatusFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("name");
    resetSelectionAndPage();
  }

  function persistGuesthouses(updated: Guesthouse[]) {
    if (storageBlocked) {
      throw new Error(initialData.error);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      throw new Error(
        "Your browser could not save the changes. " +
          "Check storage permissions and available space.",
      );
    }

    setGuesthouses(updated);
  }

  function openForm(guesthouse?: Guesthouse) {
    setEditingGuesthouse(guesthouse);
    setMessage("");
    setActionError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingGuesthouse(undefined);
  }

  function saveGuesthouse(guesthouse: Guesthouse) {
    const isEditing = Boolean(editingGuesthouse);

    const updated = isEditing
      ? guesthouses.map((item) =>
          item.id === guesthouse.id ? guesthouse : item,
        )
      : [...guesthouses, guesthouse];

    persistGuesthouses(updated);
    closeForm();
    clearFilters();
    setActionError("");

    setMessage(
      `${guesthouse.name} was ${
        isEditing ? "updated" : "added"
      } successfully.`,
    );
  }

  function toggleSelection(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function toggleSelectPage() {
    const pageIds = pageGuesthouses.map(
      (guesthouse) => guesthouse.id,
    );

    setSelectedIds((previous) =>
      allPageSelected
        ? previous.filter((id) => !pageIds.includes(id))
        : [...new Set([...previous, ...pageIds])],
    );
  }

  function changeStatuses(
    ids: string[],
    nextStatus: GuesthouseStatus,
  ) {
    const affected = guesthouses.filter(
      (guesthouse) =>
        ids.includes(guesthouse.id) &&
        guesthouse.status !== nextStatus,
    );

    if (affected.length === 0) {
      setActionError("");
      setMessage(
        `Selected listings are already ${statusLabel(nextStatus)}.`,
      );
      return;
    }

    const target =
      ids.length === 1
        ? `"${affected[0].name}"`
        : `${affected.length} guesthouses`;

    const explanation =
      nextStatus === "published"
        ? "Published listings are intended for public discovery."
        : "Draft and suspended listings are hidden from public discovery.";

    if (
      !window.confirm(
        `Change ${target} to ${statusLabel(nextStatus)}?\n\n` +
          explanation +
          "\n\nThis demo updates browser data only.",
      )
    ) {
      return;
    }

    setMessage("");
    setActionError("");

    try {
      persistGuesthouses(
        guesthouses.map((guesthouse) =>
          ids.includes(guesthouse.id)
            ? { ...guesthouse, status: nextStatus }
            : guesthouse,
        ),
      );

      setSelectedIds([]);

      setMessage(
        `${affected.length} listing(s) changed to ` +
          `${statusLabel(nextStatus)}.`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update listing statuses.",
      );
    }
  }

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="topbar">
        <div>
          <strong>Guesthouse Administration</strong>
          <p>W2 · Guesthouse Management</p>
        </div>

        <button
          type="button"
          aria-pressed={darkMode}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <main className="main-content">
        <div className="page-heading">
          <p className="eyebrow">LISTING MANAGEMENT</p>
          <h1>Guesthouses</h1>

          <p className="subtitle">
            Manage guesthouse listings, photos and publication status.
          </p>

          <button
            type="button"
            className="olive-button add-guesthouse-button"
            disabled={storageBlocked}
            onClick={() => openForm()}
          >
            + Add guesthouse
          </button>
        </div>

        <p className="demo-notice">
          Demo mode: listings and status changes are saved in this
          browser. They are not connected to the group backend yet.
        </p>

        {initialData.error && (
          <p className="form-error" role="alert">
            {initialData.error}
          </p>
        )}

        {actionError && (
          <p className="form-error" role="alert">
            {actionError}
          </p>
        )}

        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}

        <section className="stats" aria-label="Listing statistics">
          <article className="stat-card">
            <p>Total guesthouses</p>
            <strong>{guesthouses.length}</strong>
          </article>

          {statuses.map((status) => (
            <article className="stat-card" key={status}>
              <p>{statusLabel(status)}</p>
              <strong>
                {
                  guesthouses.filter(
                    (guesthouse) => guesthouse.status === status,
                  ).length
                }
              </strong>
            </article>
          ))}
        </section>

        <section className="list-panel" aria-labelledby="list-heading">
          <div className="panel-heading">
            <h2 id="list-heading">Guesthouse list</h2>
            <span aria-live="polite">
              {filteredGuesthouses.length} matching listings
            </span>
          </div>

          <div className="filter-bar">
            <label className="search-field">
              Search guesthouses
              <input
                type="search"
                placeholder="Search by name or city..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetSelectionAndPage();
                }}
              />
            </label>

            <label>
              City
              <select
                value={cityFilter}
                onChange={(event) => {
                  setCityFilter(event.target.value);
                  resetSelectionAndPage();
                }}
              >
                <option value="">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  resetSelectionAndPage();
                }}
              >
                <option value="">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Minimum price (P)
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No minimum"
                value={minPrice}
                onChange={(event) => {
                  setMinPrice(event.target.value);
                  resetSelectionAndPage();
                }}
              />
            </label>

            <label>
              Maximum price (P)
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No maximum"
                value={maxPrice}
                onChange={(event) => {
                  setMaxPrice(event.target.value);
                  resetSelectionAndPage();
                }}
              />
            </label>

            <label>
              Sort by
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
              >
                <option value="name">Name A–Z</option>
                <option value="city">City A–Z</option>
                <option value="price-low">Cheapest first</option>
                <option value="price-high">Most expensive first</option>
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          {invalidPriceRange && (
            <p className="form-error" role="alert">
              Minimum price cannot exceed maximum price.
            </p>
          )}

          <ExportCSV
            guesthouses={filteredGuesthouses}
            selectedIds={selectedIds}
          />

          {selectedIds.length > 0 && (
            <div className="demo-notice">
              <strong role="status">
                {selectedIds.length} selected across all pages
              </strong>

              <div
                role="group"
                aria-label="Bulk status actions"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={storageBlocked}
                    onClick={() =>
                      changeStatuses(selectedIds, status)
                    }
                  >
                    {actionLabel(status)} selected
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      type="checkbox"
                      aria-label="Select all guesthouses on this page"
                      checked={allPageSelected}
                      disabled={
                        storageBlocked ||
                        pageGuesthouses.length === 0
                      }
                      onChange={toggleSelectPage}
                    />
                  </th>
                  <th scope="col">Guesthouse name</th>
                  <th scope="col">City</th>
                  <th scope="col">Price per night</th>
                  <th scope="col">Status</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Change status</th>
                </tr>
              </thead>

              <tbody>
                {pageGuesthouses.map((guesthouse) => (
                  <tr key={guesthouse.id}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${guesthouse.name}`}
                        checked={selectedIds.includes(guesthouse.id)}
                        disabled={storageBlocked}
                        onChange={() =>
                          toggleSelection(guesthouse.id)
                        }
                      />
                    </td>

                    <td className="guesthouse-name">
                      {guesthouse.name}
                    </td>

                    <td>{guesthouse.city}</td>
                    <td>P {guesthouse.pricePerNight.toFixed(2)}</td>

                    <td>
                      <span className={`status ${guesthouse.status}`}>
                        {guesthouse.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        disabled={storageBlocked}
                        aria-label={`Edit ${guesthouse.name}`}
                        onClick={() => openForm(guesthouse)}
                      >
                        Edit
                      </button>
                    </td>

                    <td>
                      <div
                        role="group"
                        aria-label={`Status actions for ${guesthouse.name}`}
                        style={{ display: "flex", gap: "8px" }}
                      >
                        {statuses.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={
                              storageBlocked ||
                              guesthouse.status === status
                            }
                            onClick={() =>
                              changeStatuses(
                                [guesthouse.id],
                                status,
                              )
                            }
                          >
                            {actionLabel(status)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}

                {pageGuesthouses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      {invalidPriceRange
                        ? "Correct the price range to see listings."
                        : "No guesthouses match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav
            aria-label="Guesthouse pagination"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              padding: "20px",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              {filteredGuesthouses.length === 0
                ? "Showing 0 listings"
                : `Showing ${startIndex + 1}–${Math.min(
                    startIndex + PAGE_SIZE,
                    filteredGuesthouses.length,
                  )} of ${filteredGuesthouses.length}`}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>

              <span aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </nav>
        </section>
      </main>

      {showForm && (
        <GuesthouseForm
          key={editingGuesthouse?.id ?? "new"}
          initialGuesthouse={editingGuesthouse}
          onSave={saveGuesthouse}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default App;