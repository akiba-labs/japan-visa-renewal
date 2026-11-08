// Japan Visa Renewal Window Check: when you can (and must) renew your period of stay or residence card.
// Educational reading of ISA 在留期間更新許可申請 (16-3), 特例期間, 在留カードの有効期間の更新申請,
// the 2026-06-14 new-format / 特定在留カード rules and the 2026-10-01 fee table. Not immigration or legal advice.

export const RULES_AS_OF = "2026-11-08";

export const SOURCES = [
  "https://www.moj.go.jp/isa/applications/procedures/16-3.html",
  "https://www.moj.go.jp/isa/applications/procedures/tokureikikan_00001.html",
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00011.html",
  "https://www.moj.go.jp/isa/tokutei.html",
  "https://www.moj.go.jp/isa/applications/procedures/whatzairyu_00001.html",
  "https://www.moj.go.jp/isa/01_00644.html",
  "https://laws.e-gov.go.jp/law/326CO0000000319",
] as const;

export const DISCLAIMER =
  "Educational date calculator, not immigration or legal advice. Not affiliated with the Immigration Services Agency of Japan (ISA) or the Ministry of Justice. It applies ISA's published application windows, special-period rule, card-validity rules and 2026-10-01 fee table to the dates you enter; it cannot see your real permit, card or any decision. ISA decides; leave a margin and confirm with your regional immigration bureau, ISA's information centre (0570-013904) or a licensed gyoseishoshi / lawyer.";

export const HOLDERS = ["fixed", "permanent", "hsp2"] as const;
export const METHODS = ["counter", "online"] as const;
export type Holder = (typeof HOLDERS)[number];
export type Method = (typeof METHODS)[number];
export type Verdict = "too_early" | "open" | "urgent" | "pending" | "special_period" | "expired";

export class RuleInputError extends Error {}

export const NEW_CARD_DATE = "2026-06-14";
export const FEE_REFORM_DATE = "2026-10-01";

export type FeeBand = { id: string; label: string; labelJa: string; maxMonths: number; counterJPY: number; onlineJPY: number; onlineProcessingJPY: number };
// Granted-period bands (counter = ISA 16-3 table; online = ISA online-fee page, same as japan-visa-fee).
export const FEE_BANDS: FeeBand[] = [
  { id: "up_to_3m", label: "3 months or less", labelJa: "3月以下", maxMonths: 3, counterJPY: 10000, onlineJPY: 10000, onlineProcessingJPY: 330 },
  { id: "over_3m_to_6m", label: "Over 3 up to 6 months", labelJa: "3月超6月以下", maxMonths: 6, counterJPY: 18000, onlineJPY: 15000, onlineProcessingJPY: 330 },
  { id: "over_6m_under_1y", label: "Over 6 months, under 1 year", labelJa: "6月超1年未満", maxMonths: 11.99, counterJPY: 25000, onlineJPY: 21000, onlineProcessingJPY: 330 },
  { id: "1y", label: "1 year", labelJa: "1年", maxMonths: 12, counterJPY: 33000, onlineJPY: 27000, onlineProcessingJPY: 330 },
  { id: "over_1y_under_3y", label: "Over 1 year, under 3 years", labelJa: "1年超3年未満", maxMonths: 35.99, counterJPY: 48000, onlineJPY: 42000, onlineProcessingJPY: 330 },
  { id: "3y_under_5y", label: "3 years or more, under 5 years", labelJa: "3年以上5年未満", maxMonths: 59.99, counterJPY: 64000, onlineJPY: 56000, onlineProcessingJPY: 550 },
  { id: "5y_plus", label: "5 years or more", labelJa: "5年以上", maxMonths: Infinity, counterJPY: 75000, onlineJPY: 65000, onlineProcessingJPY: 550 },
];

export const EARLY_EXCEPTIONS = [
  "Study abroad (海外に留学する場合)",
  "Long business trip or posting abroad by work order (業務命令による長期の海外出張・赴任)",
  "Pregnancy with the due date overlapping the window, or giving birth in your home country (出産・里帰り出産)",
  "Hospital treatment in Japan or planned hospital treatment at home (入院)",
  "Family members applying at the same time (家族が同時申請する場合)",
  "A foreign visa that needs 6+ months left on your Japanese period of stay",
] as const;

export const RULES = {
  periodRenewal: {
    nameEn: "Extension of period of stay",
    nameJa: "在留期間更新許可申請",
    window: "Up to the expiry date. If your current period of stay is 6 months or longer, from 3 months before expiry (ISA 16-3). Earlier only for genuinely unavoidable reasons, by prior consultation.",
    processing: "Standard processing 2 weeks to 1 month (ISA 16-3).",
    specialPeriod: "If you apply by the expiry date and no decision is made by then, you may stay and continue the same activity until the decision or the end of the day 2 months after expiry, whichever comes first (Immigration Control Act art. 20(6) / 21(4)).",
    fees: "Fee by period GRANTED (applications received on or after 2026-10-01): counter ¥10,000–¥75,000 in revenue stamps; online ¥10,000–¥65,000 plus a ¥330/¥550 payment processing fee. Received by 2026-09-30: old ¥6,000.",
  },
  cardRenewal: {
    nameEn: "Renewal of residence card validity",
    nameJa: "在留カードの有効期間の更新申請",
    who: "Permanent residents aged 16+ and Highly Skilled Professional (ii) holders; also anyone whose card issued on or before 2026-06-13 expires on their 16th birthday or the day before.",
    window: "From 3 months before the card's expiry date to the expiry date (16th-birthday cards: from 6 months before). Earlier if you will be abroad for a long time.",
    fee: "Free. Usually issued the same day.",
    newFormat: "Cards issued on or after 2026-06-14 for permanent residents / HSP (ii) are valid until the 10th birthday after issue (5th birthday if under 18). Older cards: 7 years after issue (under 16: until the day before the 16th birthday).",
  },
  specialCard: "特定在留カード (residence card + My Number card) since 2026-06-14: optional, counter applications only (not with online filing), takes about 10 days longer than a normal card. Its My Number validity ends on your original period expiry, so if your application is still pending, change that validity at the city office before the original expiry.",
} as const;

export type RenewalInput = {
  holder?: Holder;
  /** fixed: period-of-stay expiry (在留期間満了日). permanent/hsp2: residence card expiry (有効期間満了日). */
  expiryDate: string;
  /** fixed only: length of the current period of stay in months (default 12). */
  currentPeriodMonths?: number | null;
  /** fixed only: the period you expect ISA to grant, for the fee band (default = current period). */
  expectedGrantMonths?: number | null;
  /** Date you already applied, if any. */
  appliedDate?: string | null;
  birthDate?: string | null;
  /** Card issue date (helps with the 16th-birthday and new-format rules). */
  cardIssueDate?: string | null;
  method?: Method;
  wantSpecialCard?: boolean;
  today?: string | null;
};

export type Deadline = { date: string; what: string; ja: string; passed: boolean };

export type RenewalResult = {
  holder: Holder;
  procedure: { en: string; ja: string };
  verdict: Verdict;
  summary: string;
  today: string;
  expiryDate: string;
  windowOpens: string;
  lastDay: string;
  daysUntilWindow: number;
  daysLeft: number;
  appliedDate: string | null;
  specialPeriodEnd: string | null;
  fee: null | { band: string; bandJa: string; method: Method; feeJPY: number; processingFeeJPY: number; totalJPY: number; note: string };
  card16: null | { cardExpiry: string; windowOpens: string; note: string };
  nextCardValidity: null | { assumedIssueDate: string; validUntil: string; rule: string };
  processing: string;
  earlyExceptions: readonly string[];
  deadlines: Deadline[];
  actions: string[];
  warnings: string[];
  rulesAsOf: string;
  sources: readonly string[];
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function validDate(s: string): boolean {
  if (!ISO.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function toDate(s: string): Date {
  return new Date(`${s}T00:00:00Z`);
}
function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function addDays(s: string, n: number): string {
  const d = toDate(s);
  d.setUTCDate(d.getUTCDate() + n);
  return fmt(d);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000);
}
export function todayJst(now: Date = new Date()): string {
  return fmt(new Date(now.getTime() + 9 * 3_600_000));
}
/** Same calendar day `months` earlier (clamped to month end): "3 months before 2027-05-31" → 2027-02-28. */
export function monthsBefore(s: string, months: number): string {
  const d = toDate(s);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() - months;
  const ty = y + Math.floor(m / 12);
  const tm = ((m % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  return fmt(new Date(Date.UTC(ty, tm, Math.min(d.getUTCDate(), lastDay))));
}
/**
 * End of "the day on which 2 months have passed from the expiry date" (art. 20(6)): count from the day
 * after expiry (Civil Code 140, 143). 2027-01-15 → 2027-03-15; 2026-12-30 → 2027-02-28.
 */
export function periodEnd(from: string, months: number): string {
  const start = toDate(addDays(from, 1));
  const y = start.getUTCFullYear();
  const m = start.getUTCMonth() + months;
  const day = start.getUTCDate();
  const ty = y + Math.floor(m / 12);
  const tm = ((m % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  if (day > lastDay) return fmt(new Date(Date.UTC(ty, tm, lastDay)));
  return addDays(fmt(new Date(Date.UTC(ty, tm, day))), -1);
}
function birthdayIn(birth: string, year: number): string {
  const [, mm, dd] = birth.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, mm, 0)).getUTCDate();
  // Feb 29 births: treat Feb 28 as the birthday in non-leap years.
  return fmt(new Date(Date.UTC(year, mm - 1, Math.min(dd, lastDay))));
}
export function ageOn(birth: string, on: string): number {
  const by = Number(birth.slice(0, 4));
  const oy = Number(on.slice(0, 4));
  return oy - by - (on < birthdayIn(birth, oy) ? 1 : 0);
}
/** The n-th birthday strictly after `issue`. */
export function nthBirthdayAfter(birth: string, issue: string, n: number): string {
  let y = Number(issue.slice(0, 4));
  let count = 0;
  for (;;) {
    const b = birthdayIn(birth, y);
    if (b > issue && b > birth) {
      count++;
      if (count === n) return b;
    }
    y++;
  }
}
export function feeBand(months: number): FeeBand {
  return FEE_BANDS.find((b) => months <= b.maxMonths) ?? FEE_BANDS[FEE_BANDS.length - 1];
}

function need(v: string | null | undefined, name: string): string {
  if (!v || !validDate(v)) throw new RuleInputError(`${name} must be a real date in YYYY-MM-DD format`);
  return v;
}
function opt(v: string | null | undefined, name: string): string | null {
  if (v === undefined || v === null || v === "") return null;
  return need(v, name);
}

export function checkRenewal(input: RenewalInput): RenewalResult {
  const holder: Holder = input.holder ?? "fixed";
  if (!(HOLDERS as readonly string[]).includes(holder)) throw new RuleInputError(`holder must be one of ${HOLDERS.join(", ")}`);
  const method: Method = input.method ?? "counter";
  if (!(METHODS as readonly string[]).includes(method)) throw new RuleInputError("method must be counter or online");
  const expiry = need(input.expiryDate, "expiryDate");
  const today = opt(input.today, "today") ?? todayJst();
  const applied = opt(input.appliedDate, "appliedDate");
  const birth = opt(input.birthDate, "birthDate");
  const cardIssue = opt(input.cardIssueDate, "cardIssueDate");
  if (birth && birth > today) throw new RuleInputError("birthDate cannot be in the future");
  if (applied && applied > today) throw new RuleInputError("appliedDate cannot be after today");
  const period = input.currentPeriodMonths ?? 12;
  if (!Number.isFinite(period) || period <= 0 || period > 120) throw new RuleInputError("currentPeriodMonths must be between 1 and 120");
  const grant = input.expectedGrantMonths ?? period;
  if (!Number.isFinite(grant) || grant <= 0 || grant > 120) throw new RuleInputError("expectedGrantMonths must be between 1 and 120");
  const wantSpecial = input.wantSpecialCard === true;

  const isCard = holder !== "fixed";
  const age = birth ? ageOn(birth, today) : null;
  const sixteenthEve = birth ? addDays(birthdayIn(birth, Number(birth.slice(0, 4)) + 16), -1) : null;
  const oldCard = cardIssue ? cardIssue < NEW_CARD_DATE : null; // null = unknown
  const cardTo16 = isCard && birth && sixteenthEve && oldCard !== false && expiry <= addDays(sixteenthEve, 1) && expiry >= addDays(sixteenthEve, -1);

  let windowOpens: string;
  if (isCard) windowOpens = monthsBefore(expiry, cardTo16 ? 6 : 3);
  else if (period >= 6) windowOpens = monthsBefore(expiry, 3);
  else windowOpens = today <= expiry ? today : expiry; // under 6 months: any time up to expiry

  const procedure = isCard ? { en: RULES.cardRenewal.nameEn, ja: RULES.cardRenewal.nameJa } : { en: RULES.periodRenewal.nameEn, ja: RULES.periodRenewal.nameJa };
  const spEnd = !isCard ? periodEnd(expiry, 2) : null;
  const daysUntilWindow = Math.max(0, daysBetween(today, windowOpens));
  const daysLeft = daysBetween(today, expiry);

  const actions: string[] = [];
  const warnings: string[] = [];
  let verdict: Verdict;
  let summary: string;

  const appliedInTime = applied !== null && applied <= expiry;
  if (applied && !appliedInTime) warnings.push(`Your application date (${applied}) is after the expiry date (${expiry}); the special period does not cover late applications. Contact ISA now.`);
  if (applied && applied < windowOpens && !isCard) warnings.push(`You applied on ${applied}, before the normal window opened (${windowOpens}). That is fine only if ISA accepted it as an early application.`);

  if (appliedInTime) {
    if (today <= expiry) {
      verdict = "pending";
      summary = isCard ? `Card renewal filed on ${applied}; keep your old card until you collect the new one.` : `Applied on ${applied}. If there is no decision by ${expiry}, the special period lets you stay until ${spEnd} at the latest.`;
    } else if (!isCard && spEnd && today <= spEnd) {
      verdict = "special_period";
      summary = `You are in the special period: you can stay and keep doing the same activity until the decision or ${spEnd}, whichever comes first (${daysBetween(today, spEnd)} days left).`;
    } else {
      verdict = "expired";
      summary = isCard ? `Your card expired on ${expiry}. If the renewal is still pending, ask the bureau about your status today.` : `The special period ended on ${spEnd}. Contact your immigration bureau today.`;
    }
  } else if (today > expiry) {
    verdict = "expired";
    summary = isCard
      ? `Your residence card expired on ${expiry}. Apply for card renewal now and bring a written reason for the delay (理由書).`
      : `Your period of stay ended on ${expiry} and no renewal was filed in time. Contact your regional immigration bureau today.`;
  } else if (today < windowOpens) {
    verdict = "too_early";
    summary = `Your ${isCard ? "card renewal" : "renewal"} window opens on ${windowOpens} (${daysUntilWindow} days). Last day to apply: ${expiry}.`;
  } else if (daysLeft <= 14) {
    verdict = "urgent";
    summary = `Apply now: only ${daysLeft} day${daysLeft === 1 ? "" : "s"} left. Last day to apply is ${expiry}.`;
  } else {
    verdict = "open";
    summary = `Your window is open: apply any time from ${windowOpens} to ${expiry} (${daysLeft} days left).`;
  }

  // Fee (period renewal only)
  let fee: RenewalResult["fee"] = null;
  if (!isCard) {
    const b = feeBand(grant);
    const received = applied ?? (today > windowOpens ? today : windowOpens);
    if (received < FEE_REFORM_DATE) {
      fee = { band: "old flat fee", bandJa: "旧手数料", method, feeJPY: method === "counter" ? 6000 : 5500, processingFeeJPY: 0, totalJPY: method === "counter" ? 6000 : 5500, note: "Applications received by 2026-09-30 pay the old flat fee even if the decision comes later." };
    } else {
      const f = method === "counter" ? b.counterJPY : b.onlineJPY;
      const p = method === "online" ? b.onlineProcessingJPY : 0;
      fee = {
        band: b.label,
        bandJa: b.labelJa,
        method,
        feeJPY: f,
        processingFeeJPY: p,
        totalJPY: f + p,
        note: `Depends on the period ISA actually GRANTS (here assumed ${grant} months), paid when you collect the decision${method === "counter" ? " in revenue stamps (収入印紙)" : ""}. A narrow hardship reduction to ¥10,000 exists.`,
      };
    }
  }

  // 16th-birthday card (old-format cards) for fixed holders under 16
  let card16: RenewalResult["card16"] = null;
  if (!isCard && birth && sixteenthEve && oldCard !== false && sixteenthEve < expiry && sixteenthEve >= addDays(today, -1)) {
    card16 = {
      cardExpiry: sixteenthEve,
      windowOpens: monthsBefore(sixteenthEve, 6),
      note: `${oldCard === null ? "If the card was issued on or before 2026-06-13, it" : "The card"} expires around the 16th birthday (${sixteenthEve} or the birthday itself), before the period of stay. Renew the card from ${monthsBefore(sixteenthEve, 6)}; it is free and needs a photo.`,
    };
  }

  // Next card validity for PR / HSP(ii) (new format)
  let nextCardValidity: RenewalResult["nextCardValidity"] = null;
  if (isCard && birth) {
    const issue = today > windowOpens ? today : windowOpens;
    const under18 = ageOn(birth, issue) < 18;
    nextCardValidity = {
      assumedIssueDate: issue,
      validUntil: nthBirthdayAfter(birth, issue, under18 ? 5 : 10),
      rule: `New-format cards (issued from ${NEW_CARD_DATE}) are valid until the ${under18 ? "5th" : "10th"} birthday after issue (${under18 ? "under 18" : "18 or older"} at issue).`,
    };
  }

  const deadlines: Deadline[] = [];
  const dl = (date: string, what: string, ja: string) => deadlines.push({ date, what, ja, passed: date < today });
  if (!isCard && period >= 6) dl(windowOpens, "Renewal window opens (3 months before expiry)", "申請受付開始（満了3か月前）");
  if (isCard) dl(windowOpens, `Card renewal window opens (${cardTo16 ? "6" : "3"} months before expiry)`, "有効期間更新の受付開始");
  dl(expiry, isCard ? "Card expires: last day to apply" : "Period of stay expires: last day to apply", isCard ? "在留カード有効期間満了日" : "在留期間満了日（申請期限）");
  if (spEnd && (appliedInTime || verdict === "open" || verdict === "urgent" || verdict === "too_early")) dl(spEnd, "Special period ends at the latest (only if you applied in time and no decision yet)", "特例期間の終期");
  if (card16) {
    dl(card16.windowOpens, "Under-16 card renewal window opens", "16歳の在留カード更新 受付開始");
    dl(card16.cardExpiry, "Old-format card expires around the 16th birthday", "在留カード有効期間（16歳）");
  }
  deadlines.sort((a, b) => a.date.localeCompare(b.date));

  // Actions
  if (verdict === "too_early") {
    actions.push(`Put ${windowOpens} in your calendar and start gathering documents now.`);
    if (!isCard) actions.push("If you will be abroad, giving birth, in hospital or need 6+ months left for a foreign visa, ask your bureau about applying early with proof.");
  }
  if (verdict === "open" || verdict === "urgent") {
    actions.push(isCard ? "Apply at the regional immigration bureau for your address with a photo, passport and current card." : "Apply at the regional immigration bureau for your address, or online through ISA's residence application system.");
    if (!isCard) actions.push("Do not leave it to the last week: if anything is missing, the bureau may ask you to come back, and the special period only protects applications filed by the expiry date.");
  }
  if (verdict === "pending" || verdict === "special_period") {
    actions.push("Keep the application receipt (申請受付票) and check the back of your residence card for the 申請中 stamp (counter applications only).");
    if (!isCard) actions.push("Travel abroad while pending only after checking your re-entry deadline: deemed re-entry ends no later than the special period.");
  }
  if (verdict === "expired") {
    actions.push("Go to (or call) your regional immigration bureau or ISA's information centre (0570-013904) today, with passport and card.");
  }
  if (!isCard) {
    actions.push("Typical documents: application form for your status, a photo meeting ISA's size rules, passport, residence card, plus status-specific papers (employment certificate, tax and resident-tax certificates, pension/health insurance proof).");
    actions.push("Your employer or a registered gyoseishoshi can file for you (申請取次); you must still be in Japan.");
  } else {
    actions.push("Bring the card renewal form, one photo, passport and current card. Usually issued the same day; no fee.");
  }
  if (wantSpecial) {
    actions.push("特定在留カード: apply at the counter (not online), expect about 10 extra days, and if your application is still pending near your original expiry, change the My Number validity at your city office before that date.");
  }

  if (!isCard && period < 6) warnings.push("Periods shorter than 6 months have no 3-month rule: you may apply any time before expiry.");
  if (!isCard && method === "online") warnings.push("A 特定在留カード cannot be requested together with an online application.");
  if (isCard && holder === "permanent" && age !== null && age < 16 && !cardTo16) warnings.push("Under 16: check your card's printed expiry; old-format cards end around the 16th birthday.");
  if (isCard && verdict === "expired") warnings.push("Not renewing a residence card's validity on time is an offence under the Immigration Control Act and can be punished.");
  if (!isCard && verdict === "expired") warnings.push("Staying past your period without a timely application is overstay. It can lead to deportation and a re-entry ban; talk to ISA before anything else.");
  if (holder === "permanent") warnings.push("Card renewal does not re-examine your permanent residence, but from 2027-04-01 new revocation grounds (intentional non-payment of taxes or public dues, certain offences) apply.");

  return {
    holder,
    procedure,
    verdict,
    summary,
    today,
    expiryDate: expiry,
    windowOpens,
    lastDay: expiry,
    daysUntilWindow,
    daysLeft,
    appliedDate: applied,
    specialPeriodEnd: spEnd,
    fee,
    card16,
    nextCardValidity,
    processing: isCard ? "Card renewal: usually issued the same day." : RULES.periodRenewal.processing,
    earlyExceptions: isCard ? ["Long stay abroad (study, work posting) that stops you returning during the window"] : EARLY_EXCEPTIONS,
    deadlines,
    actions,
    warnings,
    rulesAsOf: RULES_AS_OF,
    sources: SOURCES,
  };
}
