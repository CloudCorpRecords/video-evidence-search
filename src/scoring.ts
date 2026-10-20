// Independent prototype. Not affiliated with Twelve Labs.
// All videos and segments are synthetic. No real video analysis runs.

import type { ScoredSegment, Segment } from "./types.ts";

// Transparent, deterministic scoring for ranking video segments.
// This is a teaching stand-in for learned video understanding embeddings:
// every factor is explainable and its weight is documented in the breakdown.

export const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "about", "but", "by", "did", "do",
  "does", "for", "from", "how", "he", "in", "is", "it", "its", "i", "my",
  "of", "on", "or", "our", "she", "that", "the", "their", "them", "there",
  "these", "they", "this", "those", "to", "was", "we", "were", "what",
  "when", "where", "which", "who", "with", "you", "your",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

// A score below this means the segment barely overlaps the query.
export const EVIDENCE_FLOOR = 2;

export function scoreSegment(query: string, segment: Segment): ScoredSegment {
  const queryTerms = tokenize(query);
  const breakdown: { factor: string; points: number }[] = [];
  if (queryTerms.length === 0) {
    return { segment, score: 0, breakdown: [{ factor: "empty query", points: 0 }] };
  }

  const transcriptTerms = tokenize(segment.transcript);
  const transcriptSet = new Set(transcriptTerms);
  const tagTerms = new Set([
    ...segment.objects.flatMap(tokenize),
    ...segment.actions.flatMap(tokenize),
  ]);

  // 1. Transcript term hits: +1 per query term found in the transcript.
  let transcriptHits = 0;
  for (const term of queryTerms) {
    if (transcriptSet.has(term)) transcriptHits += 1;
  }
  if (transcriptHits > 0) {
    breakdown.push({ factor: "transcript term hits", points: transcriptHits });
  }

  // 2. Phrase bonus: +3 when a contiguous multi-word query phrase appears.
  const lowerTranscript = segment.transcript.toLowerCase();
  let phraseBonus = 0;
  for (let len = 2; len <= queryTerms.length; len += 1) {
    for (let i = 0; i + len <= queryTerms.length; i += 1) {
      const phrase = queryTerms.slice(i, i + len).join(" ");
      if (lowerTranscript.includes(phrase)) {
        phraseBonus += 3 * len;
        break;
      }
    }
    if (phraseBonus > 0) break;
  }
  if (phraseBonus > 0) {
    breakdown.push({ factor: "contiguous phrase match", points: phraseBonus });
  }

  // 3. Tag hits: +2 per query term found in the detected objects/actions.
  let tagHits = 0;
  for (const term of queryTerms) {
    if (tagTerms.has(term)) tagHits += 1;
  }
  if (tagHits > 0) {
    breakdown.push({ factor: "object/action tag hits", points: tagHits * 2 });
  }

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { segment, score, breakdown };
}

// Search a segment list, best first. Only segments at or above the
// evidence floor are returned, so weak matches never masquerade as hits.
export function search(query: string, segments: Segment[]): ScoredSegment[] {
  return segments
    .map((segment) => scoreSegment(query, segment))
    .filter((s) => s.score >= EVIDENCE_FLOOR)
    .sort((a, b) => b.score - a.score || a.segment.startSec - b.segment.startSec);
}

export function formatTimestamp(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
