# Walkthrough: Video Evidence Search Console

Use these five bullets if this comes up in the Twelve Labs loop. Every claim
ties to the actual code in `src/` and the tests in `tests/`.

1. **I built a working prototype of their core product pattern.** The console
   ingests timestamped video segments, searches them with transparent scoring,
   and answers questions with timestamp citations. It is fully runnable:
   `npm start` serves the console and the API.
2. **The QA layer refuses instead of hallucinating.** An evidence floor
   (`src/scoring.ts`, score 2) filters weak matches, and anything below it
   becomes a refusal with a reason, not a guess. `src/qa.ts` has a validation
   guard that refuses to serve malformed citations.
3. **All scoring is explainable.** Every search result ships a breakdown
   (transcript hits, phrase bonus, tag hits) so an evaluator can audit why a
   segment ranked where it did. This is a deliberate teaching stand-in for
   learned embeddings, stated as such in the README.
4. **It is built from my real domain.** Clipwise is my MCP-first AI video
   clipping app in production: submit a video, an agent pipeline finds the
   moments worth keeping, returns them with timestamps. The segment-citation
   pattern here is the same instinct I ship there, just with a synthetic
   corpus instead of a real video pipeline.
5. **Tests are real and the failures were real too.** 29 tests, 29 pass,
   re-run at the end. During the build, two bugs surfaced honestly: a test
   question about the Super Bowl matched a "ramen bowl" object tag, and the
   server test raced the listen callback. Both are fixed and documented in the
   test suite.

## Likely follow-ups, answered honestly

- "Did you use Twelve Labs' API?" No. This is a synthetic prototype built
  from my knowledge of how video understanding platforms structure their
  indexes. Nothing is affiliated with or connected to Twelve Labs.
- "Why no embedding model?" A learned model was out of scope for a
  prototype; the deterministic scorer is auditable by design, and the
  architecture keeps the retrieval layer swappable.
- "What would change for real video?" Replace the corpus with an indexing
  pipeline that emits segments from actual video analysis, add proper text
  analysis (the naive tokenizer is documented), and add multimodal retrieval.
- "Have you built video products for real?" Yes. Clipwise has been live
  since 2026-10-02: video ingestion, server-side editing pipeline, and an
  MCP server so agents can submit videos and get clips back. That is the
  production version of this instinct.
