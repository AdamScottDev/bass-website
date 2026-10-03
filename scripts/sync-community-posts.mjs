// Copies APPROVED posts from the BASS Discord forum into data/community-posts.json,
// with names, usernames, links and other personal details removed.
// Runs on GitHub (see .github/workflows/sync-community-posts.yml). Needs Node 18+.
//
// Only forum posts that a moderator has tagged with the approval tag are copied.
// Automatic clean-up is a safety net, not a guarantee: a person must read each
// post before tagging it.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const API = "https://discord.com/api/v10";
const OUT = "data/community-posts.json";
const MAX_POSTS = 12;
const MAX_CHARS = 1200;

export function clean(input, names = []) {
  let t = String(input || "");
  t = t.replace(/\|\|[\s\S]*?\|\|/g, "");                    // spoilers
  t = t.replace(/```[\s\S]*?```/g, "");                       // code blocks
  t = t.replace(/<a?:\w+:\d+>/g, "");                         // custom emoji
  t = t.replace(/<@&\d+>|<#\d+>/g, "");                       // role / channel mentions
  t = t.replace(/<@!?\d+>/g, "[member]");                     // user mentions
  t = t.replace(/@(everyone|here)\b/g, "");
  t = t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email removed]");
  t = t.replace(/(^|\s)@[\w.]{2,}/g, "$1[member]");           // @handles
  t = t.replace(/(https?:\/\/|www\.)\S+/gi, "");              // links
  t = t.replace(/\b(?:discord\.gg|discord\.com|discordapp\.com)\/\S+/gi, "");
  t = t.replace(/\+?\d[\d\s().-]{7,}\d/g, "[number removed]"); // phone numbers
  // "my name is Sam", "call me Sam", "I go by Sam": hide the name that follows
  t = t.replace(
    /\b([Mm]y name is|[Mm]y name's|[Cc]all me|[Yy]ou can call me|[Ii] go by|[Pp]eople call me|[Tt]hey call me)\s+[\p{L}][\p{L}'’-]*(\s+\p{Lu}[\p{L}'’-]*)?/gu,
    "$1 [name]"
  );
  // the poster's own display name / username, and anyone they mentioned
  for (const n of names) {
    if (!n || n.length < 3) continue;
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp("\\b" + esc + "\\b", "gi"), "[name]");
  }
  t = t.replace(/^#{1,3}\s+/gm, "").replace(/^>\s?/gm, "");   // headings, quotes
  t = t.replace(/(\*\*|__|~~)/g, "");                         // bold, underline, strike
  t = t.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (t.length > MAX_CHARS) t = t.slice(0, MAX_CHARS).replace(/\s+\S*$/, "") + "…";
  return t;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(path, token) {
  const res = await fetch(API + path, {
    headers: { Authorization: `Bot ${token}`, "User-Agent": "bass-website-sync (https://bassbrisbane.com, 1.0)" },
  });
  if (res.status === 429) {
    const j = await res.json();
    await sleep((j.retry_after || 1) * 1000 + 250);
    return api(path, token);
  }
  if (!res.ok) throw new Error(`Discord API ${path} returned ${res.status}`);
  return res.json();
}
const snowflakeDate = (id) => new Date(Number((BigInt(id) >> 22n) + 1420070400000n));

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_FORUM_CHANNEL_ID;
  const tagName = (process.env.APPROVAL_TAG_NAME || "Share on website").toLowerCase();
  if (!token) { console.log("DISCORD_BOT_TOKEN is not set, so nothing was synced."); return; }

  const channel = await api(`/channels/${channelId}`, token);
  if (channel.type !== 15) throw new Error("That channel is not a forum channel.");
  const tags = channel.available_tags || [];
  const approval = tags.find((t) => t.name.toLowerCase() === tagName);
  if (!approval) throw new Error(`Create a forum tag named "${process.env.APPROVAL_TAG_NAME || "Share on website"}" in the channel first.`);

  const active = await api(`/guilds/${channel.guild_id}/threads/active`, token);
  const archived = await api(`/channels/${channelId}/threads/archived/public?limit=100`, token);
  const threads = new Map();
  for (const th of [...(active.threads || []), ...(archived.threads || [])]) {
    if (th.parent_id === channelId && (th.applied_tags || []).includes(approval.id)) threads.set(th.id, th);
  }
  const chosen = [...threads.values()].sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1)).slice(0, MAX_POSTS);

  const posts = [];
  for (const th of chosen) {
    let msg;
    try { msg = await api(`/channels/${th.id}/messages/${th.id}`, token); } catch { continue; }
    const names = [msg.author?.username, msg.author?.global_name,
      ...(msg.mentions || []).flatMap((u) => [u.username, u.global_name])];
    const text = clean(msg.content, names);
    if (text.length < 20) continue;
    const d = snowflakeDate(th.id);
    posts.push({
      date: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      tags: (th.applied_tags || []).filter((id) => id !== approval.id)
        .map((id) => tags.find((t) => t.id === id)?.name).filter(Boolean),
      text,
    });
  }

  let previous = [];
  try { previous = JSON.parse(fs.readFileSync(OUT, "utf8")).posts || []; } catch {}
  if (JSON.stringify(previous) === JSON.stringify(posts)) { console.log("No changes."); return; }
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), posts }, null, 2) + "\n");
  console.log(`Wrote ${posts.length} post(s).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
