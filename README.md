# Philosophy Club St. Gallen – Website

What it is: a simple HTML/CSS/JS site hosted on GitHub Pages, code in GitHub. No database.

## Who updates what
- Current board: edit `about-us.html` and replace photos in `images/board/`.
- Former boards: edit the matching `board-*.html` and photos in `images/board/`.
- Events: auto-pulled from UniClubs by a GitHub Action that writes `data/events.json` (see below); you can also edit that file manually.
- Posts/updates: edit `data/posts.json` (or use `/admin` if you keep Decap CMS; note GitHub Pages has no auth layer by default).
- Styles: `css/style.css`. Scripts: `js/site.js`.
- Admin extras: add `?admin=1` to the site URL to reveal the “Refresh events” button (cache-busts `data/events.json` fetch). On GitHub Pages there is no server-side auth; `/admin` is public unless protected at the repo level.

## GitHub Pages + UniClubs events
- GitHub Pages can’t run Netlify Functions. A GitHub Action now runs every 6 hours (and on demand) to pull UniClubs events and write `data/events.json` (`.github/workflows/fetch-events.yml`).
- The front-end reads `data/events.json` directly (no functions). You can still click “Refresh events” with `?admin=1` to re-fetch the static JSON with cache-busting.
- To manually update events, run `node scripts/fetch-events.js` locally and commit the updated `data/events.json`.

## Editing workflow
- Make changes in GitHub (HTML, CSS, images, `data/events.json`, `data/posts.json`).
- GitHub Actions handle events sync (scheduled) and GitHub Pages auto-publishes from the default branch.
- If you want a UI, keep `/admin/` (Decap CMS) but note GitHub Pages doesn’t provide auth; you’d need to gate it elsewhere (e.g., private repo or external auth proxy).

## DNS and domain (GitHub Pages)
- Set CNAME `www` (or root via ALIAS/ANAME) to `<username>.github.io` or your Pages custom domain target.
- In the repo settings, configure Pages, set the custom domain, and enable HTTPS.
- Lima DNS (do not change):
  - `philosophyclubsg.com` A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `philosophyclubsg.com` AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `www.philosophyclubsg.com` CNAME to `TMLoew.github.io`

## Social links
- Instagram: https://www.instagram.com/philosophyclub.sg/
- LinkedIn: https://www.linkedin.com/company/philosophy-club/posts/?feedView=all
- LinkedIn: https://www.linkedin.com/company/philosophy-club
