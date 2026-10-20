// Independent prototype. Not affiliated with Twelve Labs.
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "../src/server.ts";

const server = createAppServer();
let base = "";
let ready: Promise<void> | null = null;

async function setup(): Promise<void> {
  if (!ready) {
    ready = new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  }
  await ready;
  const addr = server.address();
  if (typeof addr !== "object" || !addr) throw new Error("Server did not bind a port");
  base = `http://127.0.0.1:${addr.port}`;
}

async function get(path: string) {
  await setup();
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json() };
}

describe("http api", () => {
  it("serves the console page", async () => {
    await setup();
    const res = await fetch(base + "/");
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("SYNTHETIC DATA"));
  });

  it("lists videos", async () => {
    const { status, body } = await get("/api/videos");
    assert.equal(status, 200);
    assert.equal(body.videos.length, 4);
  });

  it("lists segments for a video, 404 for unknown", async () => {
    const { status, body } = await get("/api/videos/v_cupfinal/segments");
    assert.equal(status, 200);
    assert.equal(body.segments.length, 5);
    assert.ok(body.segments[0].start.length > 0);
    const missing = await get("/api/videos/v_nope/segments");
    assert.equal(missing.status, 404);
  });

  it("searches segments", async () => {
    const { status, body } = await get("/api/search?q=red%20card");
    assert.equal(status, 200);
    assert.ok(body.results.length > 0);
    assert.equal(body.results[0].segmentId, "s_cup_3");
  });

  it("400s on empty search query", async () => {
    const { status } = await get("/api/search?q=%20");
    assert.equal(status, 400);
  });

  it("answers grounded questions and refuses the rest", async () => {
    const good = await get("/api/ask?videoId=v_cupfinal&q=" + encodeURIComponent("When was the goal scored?"));
    assert.equal(good.status, 200);
    assert.equal(good.body.refused, false);
    assert.ok(good.body.citations.length > 0);

    const bad = await get("/api/ask?videoId=v_ramen&q=" + encodeURIComponent("How many championships did the away captain win?"));
    assert.equal(bad.status, 200);
    assert.equal(bad.body.refused, true);
  });

  it("404s on unknown video and segment ids", async () => {
    const v = await get("/api/ask?videoId=v_nope&q=hello");
    assert.equal(v.status, 404);
    const s = await get("/api/segments/s_nope");
    assert.equal(s.status, 404);
  });

  it("serves segment detail with formatted timestamps", async () => {
    const { status, body } = await get("/api/segments/s_cup_2");
    assert.equal(status, 200);
    assert.equal(body.start, "1:00");
    assert.equal(body.end, "3:00");
    assert.ok(body.objects.includes("goal"));
  });
});

// Registered at top level so the server closes after the suite,
// not before it.
after(() => {
  server.close();
});
