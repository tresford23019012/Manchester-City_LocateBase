import type { OwnerRequest } from "./requestTypes";

// In-memory mock backend. Changes last until you reload the browser tab.
// The rules in the action functions below are the same rules the real backend
// must enforce (never rely on the UI hiding a button).
//
// Test scenarios with a query string on the page you open directly:
//   ?mock=empty        no requests
//   ?mock=error        the list fails to load
//   ?mock=failaction   every approve/reject/dispatch/etc. fails (tests rollback)
//   ?mock=slow         3 second delay
// Note: client-side navigation drops the query string, so open the page URL
// directly with the query when testing.

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

function seed(): OwnerRequest[] {
  const base = { approvedAt: null, rejectReason: null, rep: null, onSiteCollectedAt: null, publishedAt: null, guesthouseId: null };
  return [
    { ...base, id: "rq_001", ownerName: "Neo Molefe", email: "neo.molefe@example.com", phone: "+267 71 000 101", guesthouseName: "Pula Palms Guesthouse", city: "Gaborone", address: "Plot 1234, Extension 9", note: "Six rooms, breakfast included, near the main mall.", createdAt: daysAgo(1), status: "pending" },
    { ...base, id: "rq_002", ownerName: "Kabo Sebina", email: "kabo.sebina@example.com", phone: "+267 72 000 102", guesthouseName: "Okavango Reed Lodge", city: "Maun", address: "Shorobe Road, Plot 88", note: "Riverside lodge with a tour desk.", createdAt: daysAgo(3), status: "pending" },
    { ...base, id: "rq_003", ownerName: "Tumelo Dube", email: "tumelo.dube@example.com", phone: "+267 73 000 103", guesthouseName: "Chobe Edge Stay", city: "Kasane", address: "Plot 45, Kazungula Road", note: "", createdAt: daysAgo(5), status: "pending" },
    { ...base, id: "rq_004", ownerName: "Boitumelo Kgosi", email: "boitumelo.kgosi@example.com", phone: "+267 74 000 104", guesthouseName: "Tati River Rooms", city: "Francistown", address: "Blue Jacket Street, Plot 12", note: "Family run, ten rooms.", createdAt: daysAgo(8), status: "approved", approvedAt: daysAgo(6) },
    { ...base, id: "rq_005", ownerName: "Lesego Mmusi", email: "lesego.mmusi@example.com", phone: "+267 75 000 105", guesthouseName: "Kgale View Guesthouse", city: "Gaborone", address: "Plot 77, Kgale Hill Road", note: "Hill views, secure parking.", createdAt: daysAgo(12), status: "approved", approvedAt: daysAgo(10), rep: { name: "Thato Ramotswe", dispatchedAt: daysAgo(4) } },
    { ...base, id: "rq_006", ownerName: "Mpho Tau", email: "mpho.tau@example.com", phone: "+267 76 000 106", guesthouseName: "Palapye Rest Stop", city: "Palapye", address: "Main Road, Plot 301", note: "Good for travellers on the A1.", createdAt: daysAgo(15), status: "approved", approvedAt: daysAgo(13), rep: { name: "Kagiso Motsumi", dispatchedAt: daysAgo(9) }, onSiteCollectedAt: daysAgo(2) },
    { ...base, id: "rq_007", ownerName: "Onkabetse Seretse", email: "onkabetse.seretse@example.com", phone: "+267 77 000 107", guesthouseName: "Serowe Heritage Stay", city: "Serowe", address: "Plot 9, Heritage Lane", note: "", createdAt: daysAgo(30), status: "published", approvedAt: daysAgo(28), rep: { name: "Naledi Bogatsu", dispatchedAt: daysAgo(24) }, onSiteCollectedAt: daysAgo(20), publishedAt: daysAgo(18), guesthouseId: "gh_007" },
    { ...base, id: "rq_008", ownerName: "Refilwe Pheko", email: "refilwe.pheko@example.com", phone: "+267 78 000 108", guesthouseName: "Quick Stay Rooms", city: "Gaborone", address: "Unknown", note: "Please approve quickly.", createdAt: daysAgo(20), status: "rejected", rejectReason: "The property address could not be verified." },
  ];
}

let store: OwnerRequest[] = seed();
const REPS = ["Thato Ramotswe", "Kagiso Motsumi", "Naledi Bogatsu"];

const scenario = () => new URLSearchParams(window.location.search).get("mock");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const delay = () => wait(scenario() === "slow" ? 3000 : 400);
const copy = (r: OwnerRequest): OwnerRequest => ({ ...r, rep: r.rep ? { ...r.rep } : null });

function find(id: string): OwnerRequest {
  const r = store.find((x) => x.id === id);
  if (!r) throw new Error("Request not found.");
  return r;
}

async function change(id: string, apply: (r: OwnerRequest) => void): Promise<OwnerRequest> {
  await delay();
  if (scenario() === "failaction") throw new Error("The server rejected this change. Try again.");
  const r = find(id);
  apply(r);
  return copy(r);
}

export async function list(): Promise<OwnerRequest[]> {
  await delay();
  if (scenario() === "error") throw new Error("Could not load requests. Check your connection and try again.");
  if (scenario() === "empty") return [];
  return store.map(copy);
}

export async function get(id: string): Promise<OwnerRequest> {
  await delay();
  if (scenario() === "error") throw new Error("Could not load this request. Check your connection and try again.");
  return copy(find(id));
}

export async function listReps(): Promise<string[]> {
  await wait(200);
  return [...REPS];
}

export const approve = (id: string) =>
  change(id, (r) => {
    if (r.status !== "pending") throw new Error("Only pending requests can be approved.");
    r.status = "approved";
    r.approvedAt = new Date().toISOString();
  });

export const reject = (id: string, reason: string) =>
  change(id, (r) => {
    if (r.status !== "pending") throw new Error("Only pending requests can be rejected.");
    r.status = "rejected";
    r.rejectReason = reason.trim() || null;
  });

export const dispatchRep = (id: string, repName: string) =>
  change(id, (r) => {
    if (r.status !== "approved") throw new Error("Approve the request before dispatching a rep.");
    if (r.rep) throw new Error("A rep has already been dispatched.");
    if (!REPS.includes(repName)) throw new Error("Choose a valid rep.");
    r.rep = { name: repName, dispatchedAt: new Date().toISOString() };
  });

export const markOnSiteCollected = (id: string) =>
  change(id, (r) => {
    if (r.status !== "approved" || !r.rep) throw new Error("Dispatch a rep before marking on-site data as collected.");
    if (r.onSiteCollectedAt) throw new Error("On-site data is already marked as collected.");
    r.onSiteCollectedAt = new Date().toISOString();
  });

export const publish = (id: string) =>
  change(id, (r) => {
    if (r.status !== "approved" || !r.rep || !r.onSiteCollectedAt) {
      throw new Error("A rep must be dispatched and on-site data collected before publishing.");
    }
    r.status = "published";
    r.publishedAt = new Date().toISOString();
    r.guesthouseId = `gh_${r.id.slice(3)}`;
  });