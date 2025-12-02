# Philosophy Club St. Gallen – Website

What it is: a simple HTML/CSS/JS site hosted on Netlify, code in GitHub. No database.

## Who updates what
- Current board: edit `about-us.html` and replace photos in `images/board/`.
- Former boards: edit the matching `board-*.html` and photos in `images/board/`.
- Events: auto-pulled from UniClubs via a Netlify Function; if that fails, it falls back to `data/events.json` (you can edit that file manually).
- Posts/updates: edit `data/posts.json` (or use `/admin` once Netlify Identity + Git Gateway are configured).
- Styles: `css/style.css`. Scripts: `js/site.js`.
- Admin extras: add `?admin=1` to the site URL to reveal the “Refresh events” button (forces a fresh fetch from UniClubs, bypassing cached responses).
- Admin password: `/admin` can be protected by Netlify Basic Auth. Set `ADMIN_PASSWORD` (and optionally `ADMIN_USER`) in Netlify env vars; the build script (`scripts/build.sh`) writes `_headers` with `Basic-Auth: user:pass`. If `ADMIN_PASSWORD` is missing, the site still builds but `/admin` is unprotected.

## GitHub Pages + UniClubs events
- GitHub Pages can’t run Netlify Functions. A GitHub Action now runs every 6 hours (and on demand) to pull UniClubs events and write `data/events.json` (`.github/workflows/fetch-events.yml`).
- The front-end reads `data/events.json` directly (no functions). You can still click “Refresh events” with `?admin=1` to re-fetch the static JSON with cache-busting.
- To manually update events, run `node scripts/fetch-events.js` locally and commit the updated `data/events.json`.

## Editing workflow
- Make changes in GitHub (HTML, CSS, images, `data/events.json`).
- Netlify auto-deploys from the repo.
- If you want a UI for events, enable Netlify Identity + Git Gateway and use `/admin/` (Decap CMS) to edit `data/events.json`.

## DNS and domain
- Set A @ to `75.2.60.5` and `99.83.229.126`.
- Set CNAME `www` to your Netlify site (e.g., `your-site.netlify.app`).
- In Netlify, add the domain, set the primary, and enable HTTPS (Let’s Encrypt).

## Social links
- Instagram: https://www.instagram.com/philosophyclub.sg/
- LinkedIn: https://www.linkedin.com/company/philosophy-club/posts/?feedView=all
- Netlify: https://app.netlify.com/projects/philosophyclubstgallen/overview
