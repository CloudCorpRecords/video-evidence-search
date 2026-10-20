// Independent prototype. Not affiliated with Twelve Labs.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EVIDENCE_FLOOR,
  formatTimestamp,
  scoreSegment,
  search,
  STOPWORDS,
  tokenize,
} from "../src/scoring.ts";
import { SEGMENTS, segmentById, segmentsOfVideo } from "../src/data.ts";

describe("tokenize", () => {
  it("lowercases and strips stopwords", () => {
    assert.deepEqual(tokenize("What Was The Goal?"), ["goal"]);
  });
  it("splits on punctuation", () => {
    assert.deepEqual(tokenize("twenty-third minute!"), ["twenty", "third", "minute"]);
  });
});

describe("formatTimestamp", () => {
  it("formats mm:ss", () => {
    assert.equal(formatTimestamp(60), "1:00");
    assert.equal(formatTimestamp(65), "1:05");
    assert.equal(formatTimestamp(0), "0:00");
    assert.equal(formatTimestamp(140), "2:20");
  });
});

describe("scoreSegment", () => {
  it("ranks the goal segment top for a goal query", () => {
    const hits = SEGMENTS.map((s) => scoreSegment("goal twenty third minute", s)).sort(
      (a, b) => b.score - a.score,
    );
    assert.equal(hits[0].segment.id, "s_cup_2");
    assert.ok(hits[0].score >= EVIDENCE_FLOOR);
  });
  it("gives phrase bonus for contiguous query phrases", () => {
    const hit = scoreSegment("shio ramen", segmentById("s_ramen_2")!);
    const phrase = hit.breakdown.find((b) => b.factor === "contiguous phrase match");
    assert.ok(phrase && phrase.points > 0, "expected phrase bonus");
  });
  it("rewards object and action tag hits", () => {
    const hit = scoreSegment("goalkeeper diving", segmentById("s_cup_4")!);
    const tags = hit.breakdown.find((b) => b.factor === "object/action tag hits");
    assert.ok(tags && tags.points > 0, "expected tag hits");
  });
  it("scores zero with an empty explanation for stopword-only queries", () => {
    const hit = scoreSegment("what is the", segmentById("s_cup_1")!);
    assert.equal(hit.score, 0);
    assert.equal(hit.breakdown[0].factor, "empty query");
  });
  it("deterministic: same input, same score", () => {
    const a = scoreSegment("red card tackle", segmentById("s_cup_3")!);
    const b = scoreSegment("red card tackle", segmentById("s_cup_3")!);
    assert.equal(a.score, b.score);
  });
});

describe("search", () => {
  it("returns only segments at or above the evidence floor", () => {
    const hits = search("penalty save goalkeeper", segmentsOfVideo("v_cupfinal"));
    assert.ok(hits.length > 0);
    assert.ok(hits.every((h) => h.score >= EVIDENCE_FLOOR));
    assert.equal(hits[0].segment.id, "s_cup_4");
  });
  it("sorts best first", () => {
    const hits = search("broth noodles steam ramen", SEGMENTS);
    for (let i = 1; i < hits.length; i += 1) {
      assert.ok(hits[i - 1].score >= hits[i].score);
    }
    assert.ok(hits.length >= 2);
  });
  it("returns nothing for queries with no evidence", () => {
    assert.deepEqual(search("quantum entanglement neutrino", SEGMENTS), []);
  });
  it("searches across all videos when no video is given", () => {
    const hits = search("trellis bamboo stakes", SEGMENTS);
    assert.equal(hits[0].segment.id, "s_tom_2");
  });
});

describe("corpus", () => {
  it("has 20 segments across 4 videos, all well formed", () => {
    assert.equal(SEGMENTS.length, 20);
    for (const s of SEGMENTS) {
      assert.ok(s.id && s.videoId && s.transcript.length > 0);
      assert.ok(s.endSec > s.startSec);
      assert.ok(s.objects.length > 0 || s.actions.length > 0);
    }
  });
});
