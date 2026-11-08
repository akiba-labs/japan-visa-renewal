export const SITE_NAME = "Japan Visa Renewal Window Check";

export const SITE_TAGLINE =
  "When can you renew your visa in Japan? See the day your renewal window opens (3 months before expiry), your last day, the 2-month special period while ISA decides, the 2026-10-01 fee for the period you expect, and permanent-resident card renewal dates under the June 2026 card rules.";

export const DISCLAIMER_SHORT =
  "Educational date calculator, not immigration or legal advice; not affiliated with the Immigration Services Agency of Japan or the Ministry of Justice. ISA decides; confirm with your regional immigration bureau before you rely on a date.";

export const HONESTY =
  "Rules as of 2026-11-08 from ISA's 在留期間更新許可申請 page, the 特例期間 explainer, the 在留カード有効期間更新 page, the 特定在留カード Q&A (new card rules from 2026-06-14) and the 2026-10-01 fee table. It works from the dates you type; it cannot see your real card, permit or any decision.";

export const SIBLING_TOOLS = [
  { href: "https://japan-job-loss.vercel.app", label: "Japan Job Loss Check" },
  { href: "https://japan-medical-cost-cap.vercel.app", label: "Japan High-Cost Medical Expense Check" },
  { href: "https://japan-lost-item.vercel.app", label: "Japan Lost Item Check" },
  { href: "https://japan-leaving-tax.vercel.app", label: "Japan Leaving Tax Check" },
  { href: "https://japan-disaster-prep.vercel.app", label: "Japan Disaster Prep Check" },
  { href: "https://japan-parttime-check.vercel.app", label: "Japan Part-time Work Check" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-hsp-points.vercel.app", label: "Japan HSP Points Calculator" },
  { href: "https://japan-mynumber-card-check.vercel.app", label: "Japan My Number Card Check" },
  { href: "https://japan-pet-quarantine.vercel.app", label: "Japan Pet Quarantine Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-driving-check.vercel.app", label: "Japan Driving Check" },
  { href: "https://japan-tb-screening.vercel.app", label: "Japan TB Screening Check" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-intl-postage.vercel.app", label: "Japan Postage Calculator" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing Check" },
  { href: "https://kyushu-travel-discount.vercel.app", label: "Kyushu Travel Discount" },
  { href: "https://house-rules-check.vercel.app", label: "House Rules Check" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-visa-renewal.vercel.app";
}
