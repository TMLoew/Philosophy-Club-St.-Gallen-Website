# Philosophy Club St. Gallen – Website

Static site for the Philosophy Club St. Gallen with former boards, current board, events, membership CTA, and social embeds.

## Getting started
1. Install a recent Node or Python (for quick local serving).
2. Clone and install (optional, no build step required):
   ```bash
   git clone https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website.git
   cd Philosophy-Club-St.-Gallen-Website
   ```
3. Serve locally:
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser.

## How the site is managed (new board members, read this)
- The site is a static HTML/CSS/JS project. No database.
- Editing happens via GitHub and Netlify (free tiers are fine).
- Content sources:
  - **Events**: auto-fetched from UniClubs via a Netlify Function. If the function fails, it falls back to `data/events.json`. You can edit `data/events.json` manually if needed.
  - **Current board**: `about-us.html` and images in `images/board/`. Replace images and update names/roles directly in the HTML.
  - **Former boards**: `board-*.html` files and their images in `images/board/`.
  - **Styles**: `css/style.css`
  - **Scripts**: `js/site.js`
- Admin UI (Decap CMS) can be used for events via `/admin/` when Netlify Identity + Git Gateway are enabled.

## Editing content (manual)
- **Events (manual fallback)**: edit `data/events.json`; the homepage renders from it if the Netlify Function fails.
- **Board pages**: edit `about-us.html` (current board) and `board-*.html` (former boards). Update images in `images/board/`.
- **Text/links**: edit the relevant HTML files. Social links are in the footer of each page.
- **Design**: adjust `css/style.css`. JS behaviors live in `js/site.js`.

## Netlify integration
- `/.netlify/functions/uniclubs-events` scrapes UniClubs and returns `{ events: [...] }`.
- `js/site.js` tries the function first, then falls back to `data/events.json`.
- `netlify.toml` sets `publish="."`, no build step, functions in `netlify/functions`.
- To enable `/admin/` (Decap CMS):
  1) In Netlify, enable Identity + Git Gateway.
  2) Invite editors by email; they log in at `/admin/`.
  3) Events collection edits `data/events.json`.
- Instagram feed: embedded via LightWidget on the homepage. Widget iframe is set in `index.html`. If you change the widget, replace the script + iframe URL.

## Deploy
- Netlify: connect the GitHub repo, no build command needed, publish dir `.`. Functions auto-deploy from `netlify/functions`.
- GitHub Pages: works for the static site, but Netlify Functions won’t run there (events would fall back to `data/events.json` only).

## Admin (Netlify + Decap CMS)
- `/admin/` is wired for Decap CMS with `git-gateway` on the `main` branch.
- On Netlify, enable Identity + Git Gateway, invite editors, then log in at `/admin/` to edit events via a UI (updates `data/events.json` in the repo).

## Deploy
- Netlify (recommended): connect the GitHub repo, no build command needed (static). Set publish directory to `/`.
- GitHub Pages: enable Pages from the repo; push to `main` and Pages serves the site.

## Custom domain
Point your domain’s DNS (CNAME/ALIAS) to your host (e.g., `your-site.netlify.app`), then add the custom domain in the host settings and enable HTTPS.

## Social links
- Instagram: https://www.instagram.com/philosophyclub.sg/
- LinkedIn: https://www.linkedin.com/company/philosophy-club/posts/?feedView=all
