# Philosophy Club St. Gallen – Website

What it is: a simple HTML/CSS/JS site hosted on Netlify, code in GitHub. No database.

## Who updates what
- Current board: edit `about-us.html` and replace photos in `images/board/`.
- Former boards: edit the matching `board-*.html` and photos in `images/board/`.
- Events: auto-pulled from UniClubs via a Netlify Function; if that fails, it falls back to `data/events.json` (you can edit that file manually).
- Posts/updates: edit `data/posts.json` (or use `/admin` once Netlify Identity + Git Gateway are configured).
- Styles: `css/style.css`. Scripts: `js/site.js`.
- Admin extras: add `?admin=1` to the site URL to reveal the “Refresh events” button (forces a fresh fetch from UniClubs, bypassing cached responses).
- Admin password: `/admin` is protected by Netlify Basic Auth. Set `ADMIN_PASSWORD` (required) and optionally `ADMIN_USER` in Netlify env vars; the build script (`scripts/build.sh`) writes `_headers` with `Basic-Auth: user:pass`. Deploy will fail if `ADMIN_PASSWORD` is missing on Netlify; local builds fall back to a placeholder password.

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
