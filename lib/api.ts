import { InputError, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, HOLDERS, METHODS, RULES_AS_OF, RuleInputError, checkRenewal, type Holder, type Method } from "./renewal";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-visa-renewal.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?expiryDate=2027-03-20&currentPeriodMonths=12&holder=fixed";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function s(v: unknown): string | null {
  const f = first(v);
  return f === undefined || f === null || String(f).trim() === "" ? null : String(f).trim();
}
function tb(v: unknown, name: string): boolean | undefined {
  const f = first(v);
  if (typeof f === "boolean") return f;
  if (f === undefined || f === null || String(f).trim() === "") return undefined;
  const t = String(f).trim();
  if (/^(1|true|yes|y|on|はい)$/i.test(t)) return true;
  if (/^(0|false|no|n|off|いいえ)$/i.test(t)) return false;
  throw new InputError(`${name} must be true or false`);
}
/** Accepts "12", "1y", "3 years", "6m", "5年", "6か月". */
function months(v: unknown, name: string): number | null {
  const f = s(v);
  if (f === null) return null;
  const m = f.toLowerCase().replace(/\s+/g, "").match(/^(\d+(?:\.\d+)?)(y|yr|yrs|year|years|年|m|mo|month|months|か月|ヶ月|ケ月|月)?$/);
  if (!m) throw new InputError(`${name} must be months (e.g. 12) or years (e.g. 3y)`);
  const x = Number(m[1]);
  return m[2] && /^(y|yr|yrs|year|years|年)$/.test(m[2]) ? x * 12 : x;
}

const HOLDER_ALIASES: Record<string, Holder> = {
  visa: "fixed", period: "fixed", work: "fixed", student: "fixed", spouse: "fixed", dependent: "fixed", engineer: "fixed", 在留期間: "fixed", 更新: "fixed",
  pr: "permanent", permanent_resident: "permanent", 永住: "permanent", 永住者: "permanent",
  hsp_ii: "hsp2", "hsp(ii)": "hsp2", highly_skilled_2: "hsp2", 高度専門職2号: "hsp2",
};
const METHOD_ALIASES: Record<string, Method> = { window: "counter", in_person: "counter", 窓口: "counter", オンライン: "online", web: "online" };

function pick<T extends string>(raw: string | null, allowed: readonly T[], aliases: Record<string, T>, name: string): T | undefined {
  if (raw === null) return undefined;
  const k = raw.toLowerCase().replace(/[\s-]+/g, "_");
  const v = (aliases[k] ?? aliases[raw] ?? k) as T;
  if (!(allowed as readonly string[]).includes(v)) throw new InputError(`Invalid ${name} "${raw}". Allowed: ${allowed.join(", ")}`);
  return v;
}

export function computeCheck(input: Input) {
  try {
    const expiryDate = s(input.expiryDate ?? input.expiry ?? input.periodExpiry ?? input.cardExpiry ?? input.満了日 ?? input.date);
    if (!expiryDate) throw new InputError("Missing expiryDate (YYYY-MM-DD: period-of-stay expiry, or card expiry for permanent residents).");
    return checkRenewal({
      holder: pick(s(input.holder ?? input.status ?? input.type), HOLDERS, HOLDER_ALIASES, "holder"),
      expiryDate,
      currentPeriodMonths: months(input.currentPeriodMonths ?? input.periodMonths ?? input.period, "currentPeriodMonths"),
      expectedGrantMonths: months(input.expectedGrantMonths ?? input.grantMonths ?? input.expectedPeriod, "expectedGrantMonths"),
      appliedDate: s(input.appliedDate ?? input.applied),
      birthDate: s(input.birthDate ?? input.dob),
      cardIssueDate: s(input.cardIssueDate ?? input.issueDate),
      method: pick(s(input.method), METHODS, METHOD_ALIASES, "method"),
      wantSpecialCard: tb(input.wantSpecialCard ?? input.specialCard ?? input.tokutei, "wantSpecialCard"),
      today: s(input.today),
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanVisaRenewalCheck",
    summary: "When can I renew my visa / residence card in Japan? Window, last day, special period, fee",
    description: `Applies ISA's renewal rules (as of ${RULES_AS_OF}). Period of stay (在留期間更新): window opens 3 months before expiry when the current period is 6 months or longer (any time before expiry for shorter periods; earlier only for listed unavoidable reasons); last day is the expiry date; if you applied in time and no decision has come, the special period lets you stay until the decision or 2 months after expiry. Fee by period granted (2026-10-01 table: counter ¥10,000–¥75,000, online ¥10,000–¥65,000 + ¥330/¥550). Permanent residents / HSP(ii) (在留カード有効期間更新): free, from 3 months before card expiry (6 months for old cards ending at the 16th birthday); new-format cards from 2026-06-14 last until the 10th birthday after issue (5th if under 18). Returns verdict (too_early | open | urgent | pending | special_period | expired), summary, windowOpens, lastDay, daysLeft, specialPeriodEnd, fee, card16, nextCardValidity, deadlines, actions, warnings, sources, disclaimer.`,
    params: [
      { name: "expiryDate", type: "string", required: true, description: "YYYY-MM-DD period-of-stay expiry on your residence card (for permanent / hsp2: the card's validity expiry). Aliases: expiry, periodExpiry, cardExpiry, 満了日." },
      { name: "holder", type: "string", enum: HOLDERS, default: "fixed", description: "fixed (any status with a period of stay) | permanent (永住者) | hsp2 (高度専門職2号). Aliases: pr, 永住…" },
      { name: "currentPeriodMonths", type: "string", default: "12", description: "Length of your current period of stay: months (12) or years (3y). Under 6 months removes the 3-month rule." },
      { name: "expectedGrantMonths", type: "string", description: "Period you expect ISA to grant, for the fee band (default = current period). Months or years (5y)." },
      { name: "appliedDate", type: "string", description: "YYYY-MM-DD if you already applied (turns on special-period logic)." },
      { name: "birthDate", type: "string", description: "Optional YYYY-MM-DD; enables the under-16 card rule and the next card's validity." },
      { name: "cardIssueDate", type: "string", description: "Optional YYYY-MM-DD card issue date (cards from 2026-06-14 follow new validity rules)." },
      { name: "method", type: "string", enum: METHODS, default: "counter", description: "counter (revenue stamps) or online." },
      { name: "wantSpecialCard", type: "boolean", default: false, description: "You want the 特定在留カード (residence card + My Number card)." },
      { name: "today", type: "string", description: "Override today's date (default: today in Japan)." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan Visa Renewal Window Check",
  nameForModel: "japan_visa_renewal",
  descriptionForHuman: "When can I renew my Japan visa? Window, last day, special period and fee.",
  descriptionForModel:
    "Use when someone in Japan asks when they can apply to extend their period of stay (在留期間更新, 'visa renewal'), whether it is too early or too late, what happens if ISA has not decided by the expiry date (special period, 特例期間, 2 months), how much the renewal costs under the 2026-10-01 fees, or when a permanent resident / HSP(ii) must renew the residence card (free, 3 months before card expiry; new 2026-06-14 card rules). Computes dated answers instead of guessing; relay the disclaimer (educational; ISA decides).",
  logo: "/icon.svg",
};
