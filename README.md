# BASS website (bassbrisbane.com)

One-page website for BASS (Brisbane Autism Social Space). Plain HTML, no build step.

## Files
- `index.html`: the whole page. Styles and script are inside it. Colours and sizes are variables at the top of the `<style>` block.
- `assets/fonts/`: Atkinson Hyperlegible (SIL Open Font Licence, licence included).
- `assets/images/favicon.svg`: the browser tab icon.
- `_redirects`: sends the old pages to the home page (Cloudflare Pages only).
- `robots.txt`, `sitemap.xml`: for search engines.

## Changing things
- The Discord link (`https://discord.gg/QpfH5bfpbb`) appears several times in `index.html`. If it changes, find and replace all of them.
- Questions in the FAQ appear twice: once on the page and once in the `application/ld+json` block near the top. Change both together.

## Deploying
Commit to `main`. Cloudflare Pages settings: Framework preset None, build command blank, output directory blank.
After the first deploy, submit `https://bassbrisbane.com/sitemap.xml` in Google Search Console.

## Preview on your computer
Run `python3 -m http.server 8000` in this folder and open http://localhost:8000
