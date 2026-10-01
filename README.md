# BASS website (bassbrisbane.com)

A plain static website: just HTML, CSS and one small JavaScript file. No build step.

## Editing
- Every page is an `index.html` inside its own folder (e.g. `events/index.html`).
- Search the whole project for `TO BE ADDED` to find every placeholder. They show as yellow highlights on the page.
- Replace the `#` in `contact/index.html` (the Join button) with your real join link. The other Join buttons point to the Contact page.
- The menu and footer are repeated on each page. If you change one, change it on all 7 pages.
- Colours live at the top of `assets/css/styles.css`. The site is dark by default, with a Light mode button in the menu (`assets/js/main.js` remembers the choice).

## Previewing on your computer
Links start with `/`, so open a terminal in this folder and run `python3 -m http.server 8000`, then visit http://localhost:8000

## Deploying (GitHub + Cloudflare Pages)
1. Put this folder's contents in a GitHub repository (index.html at the top level).
2. In Cloudflare Pages, create a project from that repository.
3. Framework preset: None. Build command: leave blank. Output directory: leave blank (or `/`).
4. Add bassbrisbane.com as the custom domain.
5. Submit https://bassbrisbane.com/sitemap.xml in Google Search Console.

## Before launch
- Replace every placeholder and add a share image (`assets/images/og-image.png`, 1200x630) plus an `og:image` tag if you want link previews with a picture.
