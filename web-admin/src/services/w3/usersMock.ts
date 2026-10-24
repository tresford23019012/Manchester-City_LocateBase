import type { AdminAccount, ManagedUser, NewAdminInput } from "./userTypes";

// In-memory mock backend. Changes last until you reload the browser tab.
// The rules below are the ones the real backend must enforce.
//
// Scenarios (open the page URL directly, because in-app links drop the query string):
//   ?mock=empty        no users
//   ?mock=error        the list fails to load
//   ?mock=failaction   block / unblock / create admin fail (tests rollback and errors)
//   ?mock=slow         3 second delay

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const owner = (
  id: string,
  name: string,
  listingCount: number,
  overdueDays: number,
  extra: Partial<ManagedUser> = {},
): ManagedUser => ({
  id,
  name,
  email: `${name.toLowerCase().replace(/ /g, ".")}@example.com`,
  role: "owner",
  status: "active",
  listingCount,
  paymentStatus: overdueDays > 0 ? "overdue" : "current",
  overdueDays,
  blockedAt: null,
  blockReason: null,
  ...extra,
});

const guest = (id: string, name: string): ManagedUser => ({
  id,
  name,
  email: `${name.toLowerCase().replace(/ /g, ".")}@example.com`,
  role: "guest",
  status: "active",
  listingCount: null,
  paymentStatus: null,
  overdueDays: 0,
  blockedAt: null,
  blockReason: null,
});

function seedUsers(): ManagedUser[] {
  return [
    guest("u_001", "Naledi Kebonang"),
    guest("u_002", "Thabo Ntshole"),
    guest("u_003", "Amantle Rakgare"),
    guest("u_004", "Wame Gaolathe"),
    owner("u_005", "Orapeleng Mothibi", 3, 0),
    owner("u_006", "Gofaone Baitsile", 1, 12),
    owner("u_007", "Masego Lekoko", 2, 34),
    owner("u_008", "Tshepo Mogapi", 1, 60, { status: "blocked", blockedAt: daysAgo(5), blockReason: "Overdue payment" }),
    owner("u_009", "Dineo Phiri", 5, 0),
  ];
}

function seedAdmins(): AdminAccount[] {
  return [
    { id: "a_001", name: "Lorato Sekgoma", email: "lorato.sekgoma@example.com", createdAt: daysAgo(120) },
    { id: "a_002", name: "Karabo Moeng", email: "karabo.moeng@example.com", createdAt: daysAgo(45) },
  ];
}

let users = seedUsers();
let admins = seedAdmins();

const scenario = () => new URLSearchParams(window.location.search).get("mock");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const delay = () => wait(scenario() === "slow" ? 3000 : 400);
const copyUser = (u: ManagedUser): ManagedUser => ({ ...u });

function find(id: string): ManagedUser {
  const u = users.find((x) => x.id === id);
  if (!u) throw new Error("User not found.");
  return u;
}

async function change(id: string, apply: (u: ManagedUser) => void): Promise<ManagedUser> {
  await delay();
  if (scenario() === "failaction") throw new Error("The server rejected this change. Try again.");
  const u = find(id);
  apply(u);
  return copyUser(u);
}

export async function listUsers(): Promise<ManagedUser[]> {
  await delay();
  if (scenario() === "error") throw new Error("Could not load users. Check your connection and try again.");
  if (scenario() === "empty") return [];
  return users.map(copyUser);
}

export const block = (id: string, reason: string) =>
  change(id, (u) => {
    if (u.role !== "owner") throw new Error("Only owners can be blocked.");
    if (u.status === "blocked") throw new Error("This owner is already blocked.");
    u.status = "blocked";
    u.blockedAt = new Date().toISOString();
    u.blockReason = reason.trim() || null;
  });

export const unblock = (id: string) =>
  change(id, (u) => {
    if (u.status !== "blocked") throw new Error("This owner is not blocked.");
    u.status = "active";
    u.blockedAt = null;
    u.blockReason = null;
  });

export async function listAdmins(): Promise<AdminAccount[]> {
  await delay();
  if (scenario() === "error") throw new Error("Could not load admins. Check your connection and try again.");
  return admins.map((a) => ({ ...a }));
}

export async function createAdmin(input: NewAdminInput): Promise<AdminAccount> {
  await delay();
  if (scenario() === "failaction") throw new Error("The server rejected this change. Try again.");
  const email = input.email.trim().toLowerCase();
  if (input.name.trim().length < 2) throw new Error("Enter the admin's full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (input.password.length < 12) throw new Error("The password must be at least 12 characters.");
  if (admins.some((a) => a.email === email)) throw new Error("An admin with this email already exists.");
  const created: AdminAccount = {
    id: `a_${String(admins.length + 1).padStart(3, "0")}`,
    name: input.name.trim(),
    email,
    createdAt: new Date().toISOString(),
  };
  admins = [...admins, created];
  return { ...created };
}
