import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { EXAMPLE_GET } from "@/lib/api";
import { SOURCES } from "@/lib/renewal";
import { EXAMPLE_PENDING, EXAMPLE_PR, EXAMPLE_SHARED, PUBLIC_URL, resultPath } from "@/lib/share";

const title = "When can I renew my visa in Japan? Renewal window, special period and fee (free checker)";
const description =
  "Free checker for renewing a period of stay (在留期間更新) or residence card in Japan. See the day your window opens (3 months before expiry), your last day, the 2-month special period while ISA decides, the 2026-10-01 fee for the period you hope to get, and permanent-resident card renewal under the June 2026 card rules. Free JSON API for AI agents. Educational, not advice.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan Visa Renewal Window Check",
  alternateName: ["在留期間更新 いつから 計算", "特例期間 計算", "永住者 在留カード 更新 いつから", "Japan visa renewal when to apply"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description: "Unofficial, free date calculator for Japan's period-of-stay renewal window, special period, renewal fee and permanent-resident card renewal, with a keyless JSON API. Not affiliated with ISA. Not advice.",
};

const faq: FaqItem[] = [
  {
    q: "When can I apply to renew my visa (period of stay) in Japan?",
    a: "If your current period of stay is 6 months or longer, from 3 months before the expiry date printed on your residence card, up to and including the expiry date. Shorter periods can apply any time before expiry. ISA accepts earlier applications only for genuinely unavoidable reasons (study or posting abroad, childbirth, hospital treatment, family applying together, a foreign visa needing 6+ months left), by consulting the bureau first.",
  },
  {
    q: "Is there a free tool that tells me my exact renewal dates?",
    a: `Yes, this one. Enter the expiry date and your current period, and it shows the day the window opens, your last day, the special-period end, the fee band and dated next steps, with ISA sources. AI agents can call ${PUBLIC_URL}/api/check. Not advice; not affiliated with ISA.`,
  },
  {
    q: "What happens if my visa expires while the renewal is still being processed?",
    a: "If you applied on or before the expiry date, the special period (特例期間) lets you stay and keep doing the same activity until ISA decides or until the end of the day 2 months after expiry, whichever comes first. Counter applications get a 申請中 note on the back of the card; online applications do not. Travel abroad during this time needs care because deemed re-entry also ends with the special period.",
  },
  {
    q: "How much does a visa renewal cost in Japan now?",
    a: "For applications received on or after 2026-10-01 the fee depends on the period ISA grants: at the counter ¥10,000 (3 months or less), ¥18,000, ¥25,000, ¥33,000 (1 year), ¥48,000, ¥64,000 (3–5 years) or ¥75,000 (5 years+); online ¥10,000–¥65,000 plus a ¥330/¥550 payment fee. Applications received by 2026-09-30 pay the old ¥6,000.",
  },
  {
    q: "Do permanent residents need to renew anything?",
    a: "Not the status, but the residence card. Permanent residents aged 16+ and HSP (ii) holders renew the card's validity from 3 months before its expiry date, free, usually issued the same day. Cards issued from 2026-06-14 are valid until the 10th birthday after issue (5th if under 18); older cards were 7 years.",
  },
  {
    q: "What is the 特定在留カード and should I ask for it at renewal?",
    a: "Since 2026-06-14 you can get a residence card that is also your My Number card. It is optional, only available with counter (not online) applications, and takes about 10 days longer. If your renewal is still pending near your original expiry, change the My Number validity at your city office before that date.",
  },
  {
    q: "Is there a free API or MCP tool for AI agents?",
    a: `Yes. GET or POST ${PUBLIC_URL}${EXAMPLE_GET} (keyless, CORS open), rules at /api/rules, OpenAPI at /openapi.json, llms.txt, and the MCP tool japan_visa_renewal_check on free-agent-tools.vercel.app/mcp. Every response carries rulesAsOf, sources and a disclaimer.`,
  },
  {
    q: "在留期間の更新はいつから申請できますか？",
    a: "在留期間が6か月以上ある方は、満了日の3か月前から満了日まで申請できます（6か月未満は満了日までいつでも）。留学・海外赴任・出産・入院・家族の同時申請など、真にやむを得ない事情があれば、事前に相談のうえ3か月より前でも受け付けられることがあります。",
  },
  {
    q: "特例期間はいつまでですか？",
    a: "満了日までに更新（または変更）を申請し、満了日までに結果が出ない場合、処分の時か、満了日から2か月が経過する日の終了時の早い方まで、今の在留資格のまま在留・活動できます。満了日を過ぎてからの申請には特例期間はありません。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · 在留期間更新 · 特例期間 · 在留カード</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">When can I renew my visa in Japan?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          From <strong>3 months before your expiry date</strong> if your period of stay is 6 months or longer, and <strong>no later than the expiry date</strong>. Apply in time and the <strong>2-month special period</strong> covers you while ISA decides. Enter your card&apos;s date to get your exact days, fee and to-do list.
        </p>
        <p className="mt-3 text-sm text-muted">
          Examples:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SHARED)}>
            1-year visa expiring March 2027
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_PENDING)}>
            applied, still waiting after expiry
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_PR)}>
            permanent resident card
          </a>
        </p>
      </section>

      <section className="mt-10">
        <Calculator />
      </section>

      <FaqSection items={faq} />

      <section className="mt-12 max-w-3xl text-sm leading-relaxed text-muted">
        <h2 className="text-base font-semibold text-foreground">Official sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>
              <a className="underline underline-offset-2 hover:text-foreground" href={s} target="_blank" rel="noopener noreferrer">
                {s}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs">
          Agent docs:{" "}
          <a className="underline" href="/llms.txt">
            llms.txt
          </a>
          {" · "}
          <a className="underline" href="/openapi.json">
            OpenAPI
          </a>
          {" · "}
          <a className="underline" href="/api/rules">
            /api/rules
          </a>
          {" · "}
          <a className="underline" href={EXAMPLE_GET}>
            example /api/check
          </a>
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
    </div>
  );
}
