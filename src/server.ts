// Independent prototype. Not affiliated with Twelve Labs.
// All videos and segments are synthetic. No real video analysis runs.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import { SEGMENTS, segmentById, segmentsOfVideo, videoById, VIDEOS } from "./data.ts";
import { ask, citationsAreValid } from "./qa.ts";
import { formatTimestamp, search } from "./scoring.ts";

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function handler(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname;

  if (path === "/api/videos") {
    return json(res, 200, { videos: VIDEOS });
  }

  const videoSegments = path.match(/^\/api\/videos\/([a-z_]+)\/segments$/);
  if (videoSegments) {
    const video = videoById(videoSegments[1]);
    if (!video) return json(res, 404, { error: "unknown video" });
    return json(res, 200, {
      video,
      segments: segmentsOfVideo(video.id).map((s) => ({
        ...s,
        start: formatTimestamp(s.startSec),
        end: formatTimestamp(s.endSec),
      })),
    });
  }

  if (path === "/api/search") {
    const q = url.searchParams.get("q") ?? "";
    if (q.trim().length === 0) return json(res, 400, { error: "q is required" });
    const pool = url.searchParams.has("videoId")
      ? segmentsOfVideo(url.searchParams.get("videoId") as string)
      : SEGMENTS;
    return json(res, 200, {
      query: q,
      results: search(q, pool).map((hit) => ({
        segmentId: hit.segment.id,
        videoId: hit.segment.videoId,
        startSec: hit.segment.startSec,
        start: formatTimestamp(hit.segment.startSec),
        score: hit.score,
        breakdown: hit.breakdown,
        transcript: hit.segment.transcript,
      })),
    });
  }

  if (path === "/api/ask") {
    const q = url.searchParams.get("q") ?? "";
    const videoId = url.searchParams.get("videoId") ?? "";
    if (q.trim().length === 0) return json(res, 400, { error: "q is required" });
    if (!videoById(videoId)) return json(res, 404, { error: "unknown video" });
    const segments = segmentsOfVideo(videoId);
    const answer = ask(segments, q);
    if (!citationsAreValid(answer, segments)) {
      // Internal consistency guard: never serve a malformed answer.
      return json(res, 500, { error: "citation validation failed" });
    }
    return json(res, 200, answer);
  }

  const segmentDetail = path.match(/^\/api\/segments\/([a-z0-9_]+)$/);
  if (segmentDetail) {
    const segment = segmentById(segmentDetail[1]);
    if (!segment) return json(res, 404, { error: "unknown segment" });
    return json(res, 200, {
      ...segment,
      start: formatTimestamp(segment.startSec),
      end: formatTimestamp(segment.endSec),
    });
  }

  if (path === "/" || path === "/index.html") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(INDEX_HTML);
  }

  return json(res, 404, { error: "not found" });
}

export function createAppServer() {
  return createServer(handler);
}

const INDEX_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Video Evidence Search Console (synthetic prototype)</title>
<style>
body{font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.5}
.banner{background:#fff3cd;border:1px solid #e0a800;padding:.75rem;border-radius:8px;margin-bottom:1rem}
.card{border:1px solid #ddd;border-radius:8px;padding:1rem;margin:.75rem 0}
.muted{color:#666}.cite{font-size:.85rem;color:#444;background:#f6f6f6;border-radius:6px;padding:.5rem;margin-top:.5rem}
button{padding:.4rem .8rem;cursor:pointer}
input[type=text]{width:70%;padding:.4rem}
ul{list-style:none;padding:0}
li.card video{max-width:100%}
</style></head><body>
<div class="banner"><strong>SYNTHETIC DATA.</strong> Independent prototype, not affiliated with Twelve Labs. All videos and segments are invented; no real video analysis runs.</div>
<h1>Video Evidence Search Console</h1>
<p>Search and QA over a synthetic corpus of 4 videos and 20 timestamped segments. Every answer cites its evidence, and the system refuses when the evidence is not there.</p>

<h2>Videos</h2>
<div id="videos"></div>

<h2>Search segments</h2>
<input type="text" id="q" placeholder="e.g. goal in the twenty third minute">
<button onclick="doSearch()">Search</button>
<div id="searchResults"></div>

<h2>Ask about a video</h2>
<input type="text" id="aq" placeholder="e.g. When was the goal scored?">
<button onclick="doAsk()">Ask</button>
<div id="askResult"></div>

<script>
async function j(u){const r=await fetch(u);return {s:r.status,b:await r.json()};}
async function loadVideos(){
  const {b}=await j('/api/videos');
  document.getElementById('videos').innerHTML=b.videos.map(v=>
    '<div class="card"><strong>'+v.title+'</strong> <span class="muted">'+v.id+' | '+v.description+'</span><br><button onclick="showSegments(\\''+v.id+'\\')">Show segments</button></div>').join('');
}
async function showSegments(id){
  const {b}=await j('/api/videos/'+id+'/segments');
  document.getElementById('videos').innerHTML='<button onclick="loadVideos()">Back</button>'+b.segments.map(s=>
    '<div class="card"><strong>'+s.id+'</strong> <span class="muted">['+s.start+' - '+s.end+']</span><br>'+s.transcript+'<br><span class="muted">objects: '+s.objects.join(', ')+' | actions: '+s.actions.join(', ')+'</span></div>').join('');
}
async function doSearch(){
  const q=document.getElementById('q').value;
  const {b}=await j('/api/search?q='+encodeURIComponent(q));
  document.getElementById('searchResults').innerHTML=b.results.length?b.results.map(r=>
    '<div class="card"><strong>'+r.segmentId+'</strong> ['+r.start+'] score '+r.score+'<br>'+r.transcript+'<div class="cite">'+r.breakdown.map(x=>x.factor+': +'+x.points).join(' | ')+'</div></div>').join('')
    :'<p class="muted">No segments met the evidence floor.</p>';
}
async function doAsk(){
  const q=document.getElementById('aq').value;
  const {b}=await j('/api/ask?videoId=v_cupfinal&q='+encodeURIComponent(q));
  const el=document.getElementById('askResult');
  if(b.refused){el.innerHTML='<div class="card"><strong>Refused.</strong> '+b.reason+'</div>';return;}
  el.innerHTML='<div class="card"><strong>Answer</strong><br>'+b.summary+b.citations.map(c=>
    '<div class="cite">'+c.segmentId+' @ '+fmt(c.startSec)+': '+c.quote+'</div>').join('')+'</div>';
}
function fmt(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}
loadVideos();
</script></body></html>`;

const isMainModule = process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  const port = Number(process.env.PORT ?? 8788);
  createAppServer().listen(port, () => {
    console.log(`Video evidence search console on http://localhost:${port}`);
  });
}
