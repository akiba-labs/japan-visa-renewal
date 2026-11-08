import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RuleInputError, checkRenewal, monthsBefore, nthBirthdayAfter, periodEnd } from "./renewal";

describe("date helpers", () => {
  it("monthsBefore clamps to month end", () => {
    assert.equal(monthsBefore("2027-02-15", 3), "2026-11-15");
    assert.equal(monthsBefore("2027-05-31", 3), "2027-02-28");
    assert.equal(monthsBefore("2027-01-31", 3), "2026-10-31");
  });
  it("special period end", () => {
    assert.equal(periodEnd("2027-01-15", 2), "2027-03-15");
    assert.equal(periodEnd("2026-12-30", 2), "2027-02-28");
    assert.equal(periodEnd("2026-12-31", 2), "2027-02-28");
  });
  it("nth birthday after issue", () => {
    assert.equal(nthBirthdayAfter("1990-05-10", "2026-11-08", 10), "2036-05-10");
    assert.equal(nthBirthdayAfter("1990-05-10", "2026-05-10", 1), "2027-05-10");
    assert.equal(nthBirthdayAfter("2015-03-01", "2026-11-08", 5), "2031-03-01");
  });
});

describe("period renewal", () => {
  it("too early for a 1-year stay", () => {
    const r = checkRenewal({ expiryDate: "2027-03-20", currentPeriodMonths: 12, today: "2026-11-08" });
    assert.equal(r.verdict, "too_early");
    assert.equal(r.windowOpens, "2026-12-20");
    assert.equal(r.specialPeriodEnd, "2027-05-20");
    assert.equal(r.fee?.feeJPY, 33000);
  });
  it("open window and online fee", () => {
    const r = checkRenewal({ expiryDate: "2027-01-31", currentPeriodMonths: 36, expectedGrantMonths: 60, method: "online", today: "2026-11-08" });
    assert.equal(r.verdict, "open");
    assert.equal(r.windowOpens, "2026-10-31");
    assert.equal(r.fee?.feeJPY, 65000);
    assert.equal(r.fee?.processingFeeJPY, 550);
    assert.equal(r.fee?.totalJPY, 65550);
  });
  it("urgent in last 14 days", () => {
    const r = checkRenewal({ expiryDate: "2026-11-15", today: "2026-11-08" });
    assert.equal(r.verdict, "urgent");
    assert.equal(r.daysLeft, 7);
  });
  it("short stay has no 3-month rule", () => {
    const r = checkRenewal({ expiryDate: "2027-02-01", currentPeriodMonths: 3, today: "2026-11-08" });
    assert.equal(r.verdict, "open");
    assert.equal(r.windowOpens, "2026-11-08");
    assert.equal(r.fee?.feeJPY, 10000);
  });
  it("special period after applying in time", () => {
    const r = checkRenewal({ expiryDate: "2026-10-31", appliedDate: "2026-10-01", today: "2026-11-08" });
    assert.equal(r.verdict, "special_period");
    assert.equal(r.specialPeriodEnd, "2026-12-31");
    assert.equal(r.fee?.feeJPY, 33000);
  });
  it("old fee for applications received before Oct 2026", () => {
    const r = checkRenewal({ expiryDate: "2026-10-31", appliedDate: "2026-09-20", today: "2026-11-08" });
    assert.equal(r.fee?.feeJPY, 6000);
  });
  it("special period ended", () => {
    const r = checkRenewal({ expiryDate: "2026-08-31", appliedDate: "2026-08-01", today: "2026-11-08" });
    assert.equal(r.verdict, "expired");
  });
  it("expired without application", () => {
    const r = checkRenewal({ expiryDate: "2026-11-01", today: "2026-11-08" });
    assert.equal(r.verdict, "expired");
    assert.ok(r.warnings.some((w) => w.includes("overstay")));
  });
  it("pending before expiry", () => {
    const r = checkRenewal({ expiryDate: "2026-12-10", appliedDate: "2026-11-01", today: "2026-11-08" });
    assert.equal(r.verdict, "pending");
  });
  it("under-16 old card note", () => {
    const r = checkRenewal({ expiryDate: "2028-04-01", currentPeriodMonths: 36, birthDate: "2011-03-01", cardIssueDate: "2025-04-01", today: "2026-11-08" });
    assert.ok(r.card16);
    assert.equal(r.card16?.cardExpiry, "2027-02-28");
    assert.equal(r.card16?.windowOpens, "2026-08-28");
  });
  it("new-format card has no 16th-birthday expiry", () => {
    const r = checkRenewal({ expiryDate: "2028-04-01", currentPeriodMonths: 36, birthDate: "2011-03-01", cardIssueDate: "2026-07-01", today: "2026-11-08" });
    assert.equal(r.card16, null);
  });
});

describe("card renewal", () => {
  it("permanent resident 3-month window, free", () => {
    const r = checkRenewal({ holder: "permanent", expiryDate: "2027-01-20", birthDate: "1985-06-02", today: "2026-11-08" });
    assert.equal(r.verdict, "open");
    assert.equal(r.windowOpens, "2026-10-20");
    assert.equal(r.fee, null);
    assert.equal(r.specialPeriodEnd, null);
    assert.equal(r.nextCardValidity?.validUntil, "2036-06-02");
  });
  it("PR card expiring at 16 opens 6 months before", () => {
    const r = checkRenewal({ holder: "permanent", expiryDate: "2027-04-09", birthDate: "2011-04-10", today: "2026-11-08" });
    assert.equal(r.windowOpens, "2026-10-09");
    assert.equal(r.verdict, "open");
  });
  it("too early for HSP(ii)", () => {
    const r = checkRenewal({ holder: "hsp2", expiryDate: "2028-01-01", today: "2026-11-08" });
    assert.equal(r.verdict, "too_early");
    assert.equal(r.windowOpens, "2027-10-01");
  });
});

describe("input errors", () => {
  it("bad date", () => assert.throws(() => checkRenewal({ expiryDate: "2026-02-30" }), RuleInputError));
  it("bad holder", () => assert.throws(() => checkRenewal({ expiryDate: "2027-01-01", holder: "x" as never }), RuleInputError));
  it("future applied", () => assert.throws(() => checkRenewal({ expiryDate: "2027-01-01", appliedDate: "2026-12-01", today: "2026-11-08" }), RuleInputError));
});
