# BASS website (bassbrisbane.com)

A plain static website: HTML, CSS and one small JavaScript file. No build step.

## Pages

- `/` Home
- `/events/` Events
- `/find-a-friend/` Find a Friend
- `/about/` About Us
- "Join our Discord" is a button in the menu, not a page.
- `_redirects` sends the old pages (autism groups, adult groups, resources, contact) to `/about/`.

## Before launch (important)

1. The Discord invite link (`https://discord.gg/QpfH5bfpbb`) is already in place on every page. If it ever changes, search the project for the old link and replace it everywhere.
2. Search for `TO BE ADDED` to find every other placeholder. They show as yellow dashed highlights.
3. Optional: add a share image (`assets/images/og-image.png`, 1200x630) and an `og:image` tag.

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
