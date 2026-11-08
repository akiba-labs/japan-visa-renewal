import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/renewal";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational date calculator. It applies a dated reading (as of {RULES_AS_OF}) of the Immigration Services Agency&apos;s pages on extending a period of stay, the special period, renewing a residence card&apos;s validity, the 特定在留カード introduced on 2026-06-14 and the residence-permit fees revised on 2026-10-01 to the dates you enter.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not immigration or legal advice and is not affiliated with the Immigration Services Agency of Japan or the Ministry of Justice. It does not decide whether ISA will grant a renewal, which period ISA will grant, or whether an early application will be accepted. The fee depends on the period actually granted. ISA decides; confirm with your regional immigration bureau, ISA&apos;s information centre (0570-013904) or a licensed gyoseishoshi / lawyer.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How dates are counted</h2>
          <p className="mt-2">
            &quot;3 months before expiry&quot; is the same calendar day three months earlier (moved to the month&apos;s last day when that day does not exist). The special period ends at the end of the day on which two months have passed from the expiry date, counted from the next day. The next permanent-resident card validity assumes a new-format card issued on the date shown. Treat every date as the latest safe day, not a target, and apply with a margin.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
