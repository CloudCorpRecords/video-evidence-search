// Independent prototype. Not affiliated with Twelve Labs.
// All videos and segments are synthetic. No real video analysis runs.

import type { Segment, Video } from "./types.ts";

const SEG = (
  id: string,
  videoId: string,
  startSec: number,
  endSec: number,
  transcript: string,
  objects: string[],
  actions: string[],
): Segment => ({ id, videoId, startSec, endSec, transcript, objects, actions });

export const VIDEOS: Video[] = [
  {
    id: "v_ramen",
    title: "Harbor Ramen Crawl",
    durationSec: 600,
    description:
      "Synthetic food vlog: a host visits a fictional ramen shop by the harbor.",
  },
  {
    id: "v_demoday",
    title: "North Bay Demo Day Keynote",
    durationSec: 1800,
    description:
      "Synthetic startup event: a CEO keynotes a fictional demo day.",
  },
  {
    id: "v_cupfinal",
    title: "Weekend Cup Final Highlights",
    durationSec: 540,
    description:
      "Synthetic sports highlights: a fictional soccer cup final.",
  },
  {
    id: "v_tomato",
    title: "Tomato Season",
    durationSec: 420,
    description:
      "Synthetic gardening guide: growing tomatoes through one season.",
  },
];

export const SEGMENTS: Segment[] = [
  // ---- Harbor Ramen Crawl ----
  SEG(
    "s_ramen_1", "v_ramen", 0, 45,
    "The host pushes through the blue noren curtain as the little bell over the door rings. Inside, six counter seats face the open kitchen and the smell of pork broth fills the air.",
    ["noren curtain", "bell", "counter seats"], ["walking", "greeting"],
  ),
  SEG(
    "s_ramen_2", "v_ramen", 45, 140,
    "At the counter the host orders a shio ramen with extra chashu and a side of gyoza. The ticket printer rattles out the order ticket and the cook nods without looking up.",
    ["ticket printer", "menu board", "counter"], ["ordering", "talking"],
  ),
  SEG(
    "s_ramen_3", "v_ramen", 140, 260,
    "The chef pulls the fresh noodles by hand, stretching them twice before dropping them into the rolling boil. Steam rises as he ladles the clear shio broth over the noodles.",
    ["noodles", "steam", "chef hat", "pot"], ["cooking", "stretching"],
  ),
  SEG(
    "s_ramen_4", "v_ramen", 260, 420,
    "The host lifts the first spoonful of broth, tastes it, and goes quiet for a full three seconds. Clean salt flavor, rich pork depth, she says, and calls it the best bowl of the crawl.",
    ["ramen bowl", "spoon", "chopsticks"], ["eating", "reacting", "talking"],
  ),
  SEG(
    "s_ramen_5", "v_ramen", 420, 600,
    "Walking back along the harbor with the paper takeout bag, the host gives the final verdict: shio ramen at nine dollars eighty is the stop to beat on this crawl.",
    ["harbor", "paper bag", "seagulls"], ["walking", "talking"],
  ),
  // ---- North Bay Demo Day Keynote ----
  SEG(
    "s_demo_1", "v_demoday", 0, 300,
    "The CEO walks onto a dark stage as a giant revenue chart glows behind her. She opens by announcing annual recurring revenue crossed forty million dollars this quarter.",
    ["stage", "revenue chart", "spotlight"], ["presenting", "walking"],
  ),
  SEG(
    "s_demo_2", "v_demoday", 300, 780,
    "Live product demo. The CEO types into an editor projected on the wall and the app rebuilds itself in front of the audience. The crowd gasps when the autocomplete suggests her next line of code.",
    ["projector", "code editor", "laptop"], ["typing", "demonstrating"],
  ),
  SEG(
    "s_demo_3", "v_demoday", 780, 1050,
    "Pricing announcement. The new team plan is twenty nine dollars per seat per month, and every beta customer in the room gets six months free starting today.",
    ["pricing slide", "audience"], ["announcing", "talking"],
  ),
  SEG(
    "s_demo_4", "v_demoday", 1050, 1500,
    "Question time. An investor in the front row asks about net revenue churn, and the CEO answers that it sits at four percent annually, which she calls boring in a good way.",
    ["microphone", "investor"], ["answering", "discussing"],
  ),
  SEG(
    "s_demo_5", "v_demoday", 1500, 1800,
    "The CEO closes with the hiring slide, thirty open roles across engineering and design, and the audience gives a standing ovation as the lights come up.",
    ["hiring slide", "audience"], ["closing", "clapping"],
  ),
  // ---- Weekend Cup Final Highlights ----
  SEG(
    "s_cup_1", "v_cupfinal", 0, 60,
    "Kickoff under the floodlights. The crowd roars as the home team, in blue, takes possession and moves the ball down the right wing.",
    ["floodlights", "crowd", "ball"], ["playing", "cheering"],
  ),
  SEG(
    "s_cup_2", "v_cupfinal", 60, 180,
    "Goal in the twenty third minute. A corner swings in from the left and the number nine rises highest to head it into the top corner. One nil to the home side.",
    ["goal", "corner flag", "net"], ["heading", "scoring", "celebrating"],
  ),
  SEG(
    "s_cup_3", "v_cupfinal", 180, 300,
    "Controversy. A late two footed challenge in midfield earns the away captain a straight red card, and he walks off shaking his head.",
    ["red card", "referee"], ["tackling", "arguing"],
  ),
  SEG(
    "s_cup_4", "v_cupfinal", 300, 420,
    "Penalty awarded, and the keeper guesses right. He dives low to his left and pushes the spot kick around the post. Incredible save.",
    ["penalty spot", "goalkeeper", "goalpost"], ["diving", "saving"],
  ),
  SEG(
    "s_cup_5", "v_cupfinal", 420, 540,
    "Full time. The captain lifts the cup as confetti falls over the blue end of the stadium, and the players do a lap of honor with the trophy.",
    ["trophy", "confetti", "stadium"], ["lifting", "celebrating"],
  ),
  // ---- Tomato Season ----
  SEG(
    "s_tom_1", "v_tomato", 0, 90,
    "Early spring. The gardener presses cherry tomato seedlings into dark potting mix, two per cell, and waters them gently with a fine rose head.",
    ["seedlings", "potting mix", "watering can"], ["planting", "watering"],
  ),
  SEG(
    "s_tom_2", "v_tomato", 90, 200,
    "Setting up the trellis. Bamboo stakes go in a foot from each stem and twine is looped in figure eights so the growing vines have something to climb.",
    ["bamboo stakes", "twine"], ["tying", "building"],
  ),
  SEG(
    "s_tom_3", "v_tomato", 200, 300,
    "Watering schedule tips. Deep soak twice a week rather than a daily sprinkle, and always water at the base to keep the leaves dry and blight away.",
    ["hose", "mulch"], ["explaining", "watering"],
  ),
  SEG(
    "s_tom_4", "v_tomato", 300, 380,
    "First harvest. The gardener picks a basket of ripe cherry tomatoes, pops one in her mouth on camera, and calls it the payoff for ten weeks of patience.",
    ["basket", "tomatoes"], ["harvesting", "eating", "talking"],
  ),
  SEG(
    "s_tom_5", "v_tomato", 380, 420,
    "Dealing with aphids. A blast of water knocks the colonies off the leaves, and ladybug larvae finish the job within a few days.",
    ["aphids", "ladybug larvae", "leaves"], ["spraying", "explaining"],
  ),
];

export function videoById(id: string): Video | undefined {
  return VIDEOS.find((v) => v.id === id);
}

export function segmentsOfVideo(videoId: string): Segment[] {
  return SEGMENTS.filter((s) => s.videoId === videoId);
}

export function segmentById(id: string): Segment | undefined {
  return SEGMENTS.find((s) => s.id === id);
}
