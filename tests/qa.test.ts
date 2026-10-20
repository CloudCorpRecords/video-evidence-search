// Independent prototype. Not affiliated with Twelve Labs.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ask, citationsAreValid } from "../src/qa.ts";
import { segmentsOfVideo } from "../src/data.ts";

const CUP = segmentsOfVideo("v_cupfinal");
const RAMEN = segmentsOfVideo("v_ramen");

describe("ask", () => {
  it("answers the goal question from the goal segment", () => {
    const ans = ask(CUP, "When was the goal scored?");
    assert.equal(ans.refused, false);
    assert.ok(ans.summary.length > 0);
    assert.ok(
      ans.citations.some((c) => c.segmentId === "s_cup_2"),
      "expected citation of the goal segment",
    );
    assert.ok(citationsAreValid(ans, CUP));
  });
  it("answers the ordering question from the ordering segment", () => {
    const ans = ask(RAMEN, "What did the host order at the counter?");
    assert.equal(ans.refused, false);
    assert.ok(ans.citations.some((c) => c.segmentId === "s_ramen_2"));
    assert.ok(ans.summary.includes("shio ramen") || ans.summary.includes("shio"));
    assert.ok(citationsAreValid(ans, RAMEN));
  });
  it("refuses a question with no evidence in the video", () => {
    const ans = ask(RAMEN, "How many championships did the away captain win?");
    assert.equal(ans.refused, true);
    assert.ok(ans.reason.length > 0);
    assert.equal(ans.citations.length, 0);
  });
  it("refuses off-topic questions on the cup final", () => {
    const ans = ask(CUP, "What is the capital of France?");
    assert.equal(ans.refused, true);
  });
  it("cites the penalty save segment for the save question", () => {
    const ans = ask(CUP, "Who saved the penalty kick?");
    assert.equal(ans.refused, false);
    assert.ok(ans.citations.some((c) => c.segmentId === "s_cup_4"));
    assert.ok(citationsAreValid(ans, CUP));
  });
});

describe("citationsAreValid", () => {
  it("accepts empty citations on a refused answer", () => {
    assert.equal(
      citationsAreValid({ refused: true, reason: "x", summary: "", citations: [] }, CUP),
      true,
    );
  });
  it("rejects citations pointing at unknown segments", () => {
    assert.equal(
      citationsAreValid(
        {
          refused: false,
          reason: "",
          summary: "x",
          citations: [{ segmentId: "nope", startSec: 0, endSec: 5, quote: "q" }],
        },
        CUP,
      ),
      false,
    );
  });
  it("rejects answers with no citations when not refused", () => {
    assert.equal(
      citationsAreValid({ refused: false, reason: "", summary: "x", citations: [] }, CUP),
      false,
    );
  });
});
