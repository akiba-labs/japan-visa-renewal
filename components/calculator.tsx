"use client";

import { useState, useSyncExternalStore } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import type { Holder, Method } from "@/lib/renewal";
import { EXAMPLE_SHARED, PUBLIC_URL, resultPath, safeCheck, type Shared } from "@/lib/share";
import { VERDICT_LABEL, VERDICT_STYLE } from "@/lib/verdict";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";
const noopSubscribe = () => () => {};
const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;

function DateField({ label, value, set, testid }: { label: string; value: string; set: (v: string) => void; testid?: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input data-testid={testid} type="date" className={field} value={value} onChange={(e) => set(e.target.value)} />
    </label>
  );
}

const PERIODS = [
  { v: 3, l: "3 months" },
  { v: 6, l: "6 months" },
  { v: 12, l: "1 year" },
  { v: 36, l: "3 years" },
  { v: 60, l: "5 years" },
];

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [holder, setHolder] = useState<Holder>(start.holder);
  const [expiryDate, setExpiry] = useState(start.expiryDate);
  const [period, setPeriod] = useState(String(start.currentPeriodMonths ?? 12));
  const [grant, setGrant] = useState(String(start.expectedGrantMonths ?? start.currentPeriodMonths ?? 12));
  const [applied, setApplied] = useState(start.appliedDate ?? "");
  const [birth, setBirth] = useState(start.birthDate ?? "");
  const [method, setMethod] = useState<Method>(start.method);
  const [special, setSpecial] = useState(start.wantSpecialCard);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [todayEdit, setToday] = useState<string | null>(null);
  const today = todayEdit ?? (initial || !hydrated ? (start.today ?? "") : "");

  const fixed = holder === "fixed";
  const shared: Shared = {
    holder,
    expiryDate,
    currentPeriodMonths: fixed ? Number(period) : null,
    expectedGrantMonths: fixed ? Number(grant) : null,
    appliedDate: applied || null,
    birthDate: birth || null,
    method,
    wantSpecialCard: special,
    today: today || null,
  };
  const r = expiryDate ? safeCheck(shared) : null;
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your card</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">What are you renewing?</span>
          <select data-testid="holder" className={field} value={holder} onChange={(e) => setHolder(e.target.value as Holder)}>
            <option value="fixed">Period of stay (work, student, spouse, dependent… 在留期間更新)</option>
            <option value="permanent">Permanent resident card (永住者の在留カード)</option>
            <option value="hsp2">Highly Skilled Professional (ii) card (高度専門職2号)</option>
          </select>
        </label>
        <DateField label={fixed ? "Period of stay expires (在留期間満了日)" : "Card valid until (有効期間満了日)"} value={expiryDate} set={setExpiry} testid="expiry" />
        {fixed ? (
          <>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-foreground">Current period of stay</span>
              <select data-testid="period" className={field} value={period} onChange={(e) => setPeriod(e.target.value)}>
                {PERIODS.map((p) => (
                  <option key={p.v} value={p.v}>
                    {p.l}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-foreground">Period you hope to get (sets the fee)</span>
              <select data-testid="grant" className={field} value={grant} onChange={(e) => setGrant(e.target.value)}>
                {PERIODS.map((p) => (
                  <option key={p.v} value={p.v}>
                    {p.l}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-foreground">How you will apply</span>
              <select data-testid="method" className={field} value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                <option value="counter">At the immigration bureau (窓口)</option>
                <option value="online">Online (オンライン申請)</option>
              </select>
            </label>
          </>
        ) : null}
        <DateField label="Already applied on (optional)" value={applied} set={setApplied} testid="applied" />
        <DateField label="Date of birth (optional, for under-16 and new card rules)" value={birth} set={setBirth} testid="birth" />
        <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
          <input data-testid="special" type="checkbox" className="mt-1" checked={special} onChange={(e) => setSpecial(e.target.checked)} />
          <span>I want the 特定在留カード (residence card + My Number card)</span>
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-muted">Check as of (optional, default today)</span>
          <input type="date" className={field} value={today} onChange={(e) => setToday(e.target.value)} />
        </label>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/60">
        <div className="p-5 sm:p-7" data-testid="result">
          {r ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {VERDICT_LABEL[r.verdict]} · {r.procedure.ja}
              </p>
              <p className={`mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl ${VERDICT_STYLE[r.verdict]}`}>{r.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.windowOpens}</p>
                  <p className="text-xs text-muted">window opens</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.lastDay}</p>
                  <p className="text-xs text-muted">last day to apply</p>
                </div>
                <div className="rounded-2xl border border-line bg-black/30 p-3">
                  <p className="font-mono text-lg text-foreground">{r.fee ? yen(r.fee.totalJPY) : "Free"}</p>
                  <p className="text-xs text-muted">{r.fee ? `fee · ${r.fee.band}` : "card renewal fee"}</p>
                </div>
              </div>

              {r.specialPeriodEnd ? (
                <p className="mt-4 text-sm text-muted">
                  Special period (特例期間): if you apply by {r.lastDay} and ISA has not decided, you can stay until the decision or{" "}
                  <span className="font-mono text-foreground">{r.specialPeriodEnd}</span>, whichever comes first.
                </p>
              ) : null}
              {r.fee ? <p className="mt-2 text-xs text-muted">{r.fee.note}</p> : null}
              {r.card16 ? <p className="mt-3 text-sm text-amber-100">{r.card16.note}</p> : null}
              {r.nextCardValidity ? (
                <p className="mt-3 text-sm text-muted">
                  If your new card is issued around {r.nextCardValidity.assumedIssueDate}, it should be valid until{" "}
                  <span className="font-mono text-foreground">{r.nextCardValidity.validUntil}</span>. {r.nextCardValidity.rule}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-muted">{r.processing}</p>

              <h3 className="mt-6 text-sm font-semibold text-foreground">Dates</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {r.deadlines.map((d) => (
                  <li key={d.date + d.what} className={d.passed ? "line-through opacity-60" : ""}>
                    <span className="mr-2 font-mono text-foreground">{d.date}</span>
                    {d.what} <span className="text-xs">· {d.ja}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold text-foreground">To do</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                {r.actions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {r.warnings.length ? (
                <>
                  <h3 className="mt-6 text-sm font-semibold text-foreground">Watch out</h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {r.warnings.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <h3 className="mt-6 text-sm font-semibold text-foreground">Applying earlier than the window</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted">
                {r.earlyExceptions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="mt-6">
                <ShareBar url={shareUrl} text={`Japan visa renewal: ${r.summary}`} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Enter the expiry date printed on your residence card. Dates must be real.</p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}
