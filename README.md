# BASS website (bassbrisbane.com)

A plain static website: HTML, CSS and one small JavaScript file. No build step.

## Pages

- `/` Home
- `/events/` Events
- `/meet-our-community/` Meet Our Community (was Find a Friend)
- `/about/` About Us
- "Join our Discord" is a button in the menu, not a page.
- `_redirects` sends the old pages (autism groups, adult groups, resources, contact) to `/about/`, and `/find-a-friend/` to `/meet-our-community/`.

## Before launch (important)

1. The Discord invite link (`https://discord.gg/QpfH5bfpbb`) is already in place on every page. If it ever changes, search the project for the old link and replace it everywhere.
2. Search for `TO BE ADDED` to find every other placeholder. They show as yellow dashed highlights.
3. Optional: add a share image (`assets/images/og-image.png`, 1200x630) and an `og:image` tag.

## Events (Luma)

The Events page shows the BASS calendar from Luma (https://luma.com/bassevents) in a frame. Create or edit events on Luma and they appear on the website automatically. The calendar must stay public on Luma. If the frame ever shows an error, copy the embed code from Luma (calendar Settings, then Embed) and put its `src` address into `events/index.html`.

## Community posts from Discord (Meet Our Community page)

The page shows introductions from the Discord forum channel `1460246806247112890`, with names, usernames, photos and links removed. Visitors can hide the posts, and long posts can be minimised.

**Only posts you approve are shown.** These are members' own words, so nothing is copied unless a moderator has read it and added the forum tag **Share on website** (with the member's OK). Automatic clean-up removes usernames, @mentions, links, emails, phone numbers and phrases like "my name is ...", but it cannot catch every real name written in a sentence, so always read a post before tagging it.

To remove a post, take the tag off it. It disappears at the next sync (every 6 hours, or run it by hand from the Actions tab). The old text stays in the repo's history, so for something urgent also edit `data/community-posts.json` directly.

One-time setup:
1. Go to https://discord.com/developers/applications, make a New Application, open **Bot**, switch on **Message Content Intent**, then **Reset Token** and copy it.
2. Under **OAuth2 > URL Generator** tick `bot`, then the permissions **View Channels** and **Read Message History**. Open the link and add the bot to the BASS server. Give the bot access to the forum channel only.
3. In the forum channel, open Edit Channel > Tags and create a tag named **Share on website**.
4. In GitHub: Settings > Secrets and variables > Actions > New repository secret. Name it `DISCORD_BOT_TOKEN` and paste the token. Never put the token in any file in the repo.
5. In GitHub: Actions > "Sync community posts from Discord" > Run workflow.

Files: `.github/workflows/sync-community-posts.yml`, `scripts/sync-community-posts.mjs`, `data/community-posts.json` (written by the sync), `assets/js/community.js`.

## Editing

- Every page is an `index.html` inside its own folder (e.g. `events/index.html`).
- The menu and footer are repeated on each page. If you change one, change it on all 4 pages.
- Colours, font sizes and spacing are variables at the top of `assets/css/styles.css`.
- Font: Atkinson Hyperlegible, hosted in `assets/fonts/` (SIL Open Font Licence, licence file included).
- The footer has "Display options" for text size and light/dark colours. `assets/js/main.js` remembers the choice in the visitor's browser.

## Previewing on your computer

Links start with `/`, so open a terminal in this folder and run `python3 -m http.server 8000`, then visit <http://localhost:8000>
(The `_redirects` file only works on Cloudflare Pages, not in this local preview.)

## Deploying (GitHub + Cloudflare Pages)

Unchanged: commit to `main` and Cloudflare Pages deploys it. Framework preset: None. Build command: blank. Output directory: blank.
Submit <https://bassbrisbane.com/sitemap.xml> in Google Search Console again after launch.
