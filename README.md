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

## Editing content
- **Events**: edit `data/events.json` (used to render the events section on the homepage).
- **Board pages**: static HTML under `about-us.html` and `board-*.html`. Images live in `images/board/`.
- **Styles**: `css/style.css`
- **Scripts**: `js/site.js`

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
