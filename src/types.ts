// Independent prototype. Not affiliated with Twelve Labs.
// All videos and segments are synthetic. No real video analysis runs.

// A corpus of synthetic videos broken into timestamped segments.
// A segment is the atomic retrievable unit: transcript text plus
// detected objects and actions, the way a video understanding index
// would store them. Everything here is invented for practice.

export interface Video {
  id: string;
  title: string;
  durationSec: number;
  description: string;
}

export interface Segment {
  id: string;
  videoId: string;
  startSec: number;
  endSec: number;
  transcript: string;
  objects: string[];
  actions: string[];
}

export interface ScoredSegment {
  segment: Segment;
  score: number;
  // Human-readable explanation of how the score was computed.
  breakdown: { factor: string; points: number }[];
}

export interface Citation {
  segmentId: string;
  startSec: number;
  endSec: number;
  quote: string;
}

export interface Answer {
  refused: boolean;
  reason: string;
  summary: string;
  citations: Citation[];
}
