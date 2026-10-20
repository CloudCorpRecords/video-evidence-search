// Independent prototype. Not affiliated with Twelve Labs.
// All videos and segments are synthetic. No real video analysis runs.

import { EVIDENCE_FLOOR, formatTimestamp, search } from "./scoring.ts";
import type { Answer, Citation, Segment } from "./types.ts";

// Question answering grounded strictly in segment evidence.
// Every claim cites the segments it came from; if the best evidence is
// below the floor, the system refuses instead of inventing an answer.
// This refusal rule is the honest-engineering core of the prototype.

export function ask(segments: Segment[], query: string): Answer {
  const hits = search(query, segments);
  if (hits.length === 0) {
    return {
      refused: true,
      reason:
        "No segment in this video scores at or above the evidence floor for this question. " +
        "Refusing rather than guessing.",
      summary: "",
      citations: [],
    };
  }

  // Cite the top two evidence segments at or above the floor.
  const used = hits.slice(0, 2);
  const citations: Citation[] = used.map((hit) => ({
    segmentId: hit.segment.id,
    startSec: hit.segment.startSec,
    endSec: hit.segment.endSec,
    quote: firstSentence(hit.segment.transcript),
  }));

  const summary =
    `Based on the video evidence, the most relevant moment is at ` +
    `${formatTimestamp(citations[0].startSec)}: ${citations[0].quote}` +
    (citations.length > 1
      ? ` A supporting moment appears at ${formatTimestamp(citations[1].startSec)}.`
      : "");

  return { refused: false, reason: "", summary, citations };
}

function firstSentence(text: string): string {
  const idx = text.indexOf(".");
  if (idx === -1) return text.trim();
  return text.slice(0, idx + 1).trim();
}

// Sanity check for QA endpoints: confirm every citation in an answer
// actually points at a real segment of this video. Deterministic
// answers can still be wrong in construction; this keeps them honest.
export function citationsAreValid(answer: Answer, segments: Segment[]): boolean {
  if (answer.refused) return answer.citations.length === 0;
  const ids = new Set(segments.map((s) => s.id));
  if (answer.citations.length === 0) return false;
  return answer.citations.every(
    (c) => ids.has(c.segmentId) && c.quote.length > 0 && c.endSec > c.startSec,
  );
}

export { EVIDENCE_FLOOR };
