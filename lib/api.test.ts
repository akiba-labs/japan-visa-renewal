import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InputError } from "./agent-api";
import { EXAMPLE_GET, computeCheck } from "./api";

describe("computeCheck", () => {
  it("example get works", () => {
    const q = Object.fromEntries(new URL(`https://x.example${EXAMPLE_GET}`).searchParams);
    const r = computeCheck({ ...q, today: "2026-11-08" });
    assert.equal(r.windowOpens, "2026-12-20");
    assert.equal(r.verdict, "too_early");
    assert.ok(r.sources.length >= 5);
  });
  it("accepts aliases and year strings", () => {
    const r = computeCheck({ expiry: "2027-01-31", status: "永住者", today: "2026-11-08" });
    assert.equal(r.holder, "permanent");
    const f = computeCheck({ expiryDate: "2027-01-31", period: "3y", grantMonths: "5年", method: "オンライン", today: "2026-11-08" });
    assert.equal(f.fee?.feeJPY, 65000);
  });
  it("missing date → InputError", () => {
    assert.throws(() => computeCheck({}), InputError);
  });
  it("bad holder → InputError", () => {
    assert.throws(() => computeCheck({ expiryDate: "2027-01-31", holder: "tourist" }), InputError);
  });
  it("bad date → InputError", () => {
    assert.throws(() => computeCheck({ expiryDate: "2027-02-30" }), InputError);
  });
});
