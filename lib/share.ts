import { HOLDERS, METHODS, checkRenewal, type Holder, type Method, type RenewalInput } from "./renewal";

export { PUBLIC_URL } from "./api";

type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, k: string): string | null {
  const v = p instanceof URLSearchParams ? p.get(k) : p[k];
  const f = Array.isArray(v) ? v[0] : v;
  return f === undefined || f === null || f === "" ? null : String(f);
}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
function date(p: Params, k: string): string | null {
  const v = one(p, k);
  return v && ISO.test(v) ? v : null;
}
function oneOf<T extends string>(p: Params, k: string, allowed: readonly T[], fallback: T): T {
  const v = one(p, k);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}
function num(p: Params, k: string): number | null {
  const v = one(p, k);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export type Shared = {
  holder: Holder;
  expiryDate: string;
  currentPeriodMonths: number | null;
  expectedGrantMonths: number | null;
  appliedDate: string | null;
  birthDate: string | null;
  method: Method;
  wantSpecialCard: boolean;
  today: string | null;
};

export const EXAMPLE_SHARED: Shared = {
  holder: "fixed",
  expiryDate: "2027-03-20",
  currentPeriodMonths: 12,
  expectedGrantMonths: 12,
  appliedDate: null,
  birthDate: null,
  method: "counter",
  wantSpecialCard: false,
  today: "2026-11-08",
};
export const EXAMPLE_PENDING: Shared = { ...EXAMPLE_SHARED, expiryDate: "2026-10-31", appliedDate: "2026-10-01" };
export const EXAMPLE_PR: Shared = { ...EXAMPLE_SHARED, holder: "permanent", expiryDate: "2027-01-20", currentPeriodMonths: null, expectedGrantMonths: null, birthDate: "1985-06-02" };
export const EXAMPLES = [EXAMPLE_SHARED, EXAMPLE_PENDING, EXAMPLE_PR];

export function parseShared(p: Params): Shared | null {
  const e = date(p, "e");
  if (!e) return null;
  return {
    holder: oneOf(p, "h", HOLDERS, "fixed"),
    expiryDate: e,
    currentPeriodMonths: num(p, "pm"),
    expectedGrantMonths: num(p, "gm"),
    appliedDate: date(p, "a"),
    birthDate: date(p, "b"),
    method: oneOf(p, "m", METHODS, "counter"),
    wantSpecialCard: one(p, "sc") === "1",
    today: date(p, "t"),
  };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("e", s.expiryDate);
  if (s.holder !== "fixed") q.set("h", s.holder);
  if (s.currentPeriodMonths != null) q.set("pm", String(s.currentPeriodMonths));
  if (s.expectedGrantMonths != null) q.set("gm", String(s.expectedGrantMonths));
  if (s.appliedDate) q.set("a", s.appliedDate);
  if (s.birthDate) q.set("b", s.birthDate);
  if (s.method !== "counter") q.set("m", s.method);
  if (s.wantSpecialCard) q.set("sc", "1");
  if (s.today) q.set("t", s.today);
  return q.toString();
}

export function toCheckInput(s: Shared): RenewalInput {
  return { ...s };
}
export function safeCheck(s: Shared) {
  try {
    return checkRenewal(toCheckInput(s));
  } catch {
    return null;
  }
}
export function resultPath(s: Shared): string {
  return `/r?${sharedQuery(s)}`;
}
export function ogPath(s: Shared): string {
  return `/og?${sharedQuery(s)}`;
}
export function isIndexable(s: Shared): boolean {
  return EXAMPLES.some((e) => resultPath(e) === resultPath(s));
}
