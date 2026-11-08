import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXAMPLES, EXAMPLE_PR, EXAMPLE_SHARED, parseShared, resultPath, safeCheck, sharedQuery } from "./share";

describe("share", () => {
  it("round-trips examples", () => {
    for (const e of EXAMPLES) {
      assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(e))), e);
      assert.ok(safeCheck(e));
    }
    assert.ok(resultPath(EXAMPLE_SHARED).startsWith("/r?"));
  });
  it("PR example encodes holder", () => {
    assert.ok(sharedQuery(EXAMPLE_PR).includes("h=permanent"));
  });
});
