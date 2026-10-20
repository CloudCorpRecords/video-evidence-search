# Video Evidence Search Console

**Independent prototype. Not affiliated with Twelve Labs. All videos and segments are synthetic; no real video analysis runs.**

A zero-dependency TypeScript/Node web app that models the core product pattern of
a video understanding platform: search across timestamped video segments, and
question answering that is grounded strictly in segment evidence with timestamp
citations, refusing when the evidence is not there.

## What it is

A synthetic corpus of 4 invented videos broken into 20 timestamped segments
(food vlog, demo day keynote, soccer highlights, gardening guide). Each segment
carries a transcript plus detected objects and actions, the shape a real video
understanding index would store after analysis. Nothing here is real video, and
no video model runs anywhere in this prototype.

## Run it

```bash
npm start
# open http://localhost:8788
```

No install step needed: zero dependencies, Node 22+ runs the TypeScript directly.

The console lets you browse videos, search segments (each result shows its
scoring breakdown), and ask questions about a video. Every answer cites its
evidence as `[segmentId @ mm:ss]`; ask something the video cannot support and
the system refuses instead of inventing.

## Architecture

- `src/data.ts` - the synthetic corpus (4 videos, 20 segments).
- `src/scoring.ts` - transparent, deterministic ranking: transcript term hits,
  contiguous-phrase bonus, object/action tag hits, with a per-result breakdown.
  This is a teaching stand-in for learned video embeddings; every factor is
  explainable and weighted on purpose.
- `src/qa.ts` - grounded QA over the retrieved segments. An evidence floor
  (score 2) filters weak matches; answers cite the top two evidence segments;
  anything below the floor becomes a refusal.
- `src/server.ts` - zero-dependency HTTP server with the `/api/videos`,
  `/api/segments`, `/api/search`, and `/api/ask` endpoints, plus the console UI.

## Tests

Command: `npm test` (`node --test tests/*.test.ts`, no install required).

Result recorded 2026-10-19: **29 tests, 29 pass, 0 fail** (tokenizer/timestamps,
scoring breakdowns and determinism, search ranking and floor behavior, QA
grounding/refusal/citation validation, and 8 end-to-end HTTP tests).

## Mapping to a real video-understanding API integration

In production this pattern maps 1:1 onto a platform like Twelve Labs:
index a video to get timestamped segments, replace `scoring.ts` with embedding
search over those segments, keep the QA layer exactly as built, citations,
evidence floor, and refusal included. The refused-answer behavior is the part
that transfers most directly: a hallucinated answer about video content is
worse than no answer.

## Known limitations (stated honestly)

- The tokenizer is naive (no stemming, so "order" does not match "orders");
  a real index would use proper text analysis.
- Segment boundaries and transcripts are hand-authored, not detected.
- No real video processing, embedding model, or multimodal model is used.
