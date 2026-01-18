# Quick Start Guide - Website Improvements

## Immediate Actions Required

### 1. Update HTML Files (5-10 minutes)

Add these snippets to your HTML files to enable all new features:

#### A. Add Event Search (index.html)

Find line ~82 (before `<div id="upcoming-events-grid">`) and add:

```html
<div class="event-search-wrapper">
  <input
    type="search"
    id="event-search"
    class="event-search"
    placeholder="Search events..."
    aria-label="Search events by title, description, or location"
  />
</div>
```

#### B. Add Mobile Menu Button (All HTML files)

In the `<header>` section, after the logo `<a>` tag and before `<nav class="nav-links">`, add:

```html
<button class="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
</button>
```

#### C. Update about-us.html Board Rendering

Replace the hardcoded board member HTML (lines ~29-119) with:

```html
<h2 class="section-heading" style="text-align:center;">Our current Board.</h2>
<div id="current-board-grid" class="board-grid">
  <!-- Board members loaded dynamically from data/board.json -->
</div>
```

Replace distinguished members section (lines ~149-189) with:

```html
<h2 class="section-heading" style="margin-top: 2.5rem;">Distinguished Members</h2>
<div id="distinguished-grid" class="board-grid">
  <!-- Loaded dynamically from data/board.json -->
</div>
```

Replace faculty section (lines ~191-236) with:

```html
<hr class="section-divider" style="margin: 2rem 0;">
<div id="faculty-grid" class="board-grid">
  <!-- Loaded dynamically from data/board.json -->
</div>
```

#### D. Add Blog Link to Navigation

In all navigation menus, add:

```html
<a href="blog.html">News</a>
```

#### E. Add SEO Meta Tags (All HTML files)

In the `<head>` section after `<title>`, add:

```html
<meta name="description" content="Your page-specific description here" />
<meta name="theme-color" content="#0b2f5e" />
```

For the homepage (index.html), also add:

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://philosophyclubsg.com/" />
<meta property="og:title" content="Philosophy Club St. Gallen" />
<meta property="og:description" content="The Philosophy Club at the University of St.Gallen connects students who enjoy philosophical discussions, critical thinking, and intellectual exchange." />
<meta property="og:image" content="https://philosophyclubsg.com/images/header.jpg" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://philosophyclubsg.com/" />
<meta property="twitter:title" content="Philosophy Club St. Gallen" />
<meta property="twitter:description" content="The Philosophy Club at the University of St.Gallen connects students who enjoy philosophical discussions, critical thinking, and intellectual exchange." />
<meta property="twitter:image" content="https://philosophyclubsg.com/images/header.jpg" />
```

### 2. Optional: Enable Analytics (2 minutes)

If you want analytics:

1. Sign up at https://plausible.io (€9/month or self-host for free)
2. Edit `docs/js/analytics.js`:
   ```javascript
   enabled: true, // Change to true
   ```
3. Add before `</body>` in all HTML files:
   ```html
   <script src="js/analytics.js"></script>
   ```

### 3. Optional: Optimize Images (30-60 minutes)

```bash
# Install Python dependencies
pip install Pillow

# Run optimization
python3 optimize-images.py

# This creates docs/images/optimized/ with WebP versions
# Manually update HTML to use optimized images
```

---

## Testing Your Changes

### Local Testing

```bash
# Simple HTTP server
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Check Everything Works

- [ ] Board members load on About Us page
- [ ] Event search filters events
- [ ] "Add to Calendar" buttons download .ics files
- [ ] Mobile menu toggles on small screens
- [ ] Blog page displays (even if empty)
- [ ] No console errors
- [ ] All images load

### Deploy to GitHub

```bash
git add .
git commit -m "feat: implement website improvements

- Add dynamic board rendering
- Implement event search and calendar export
- Create blog/news page
- Add SEO meta tags and structured data
- Implement service worker for offline support
- Enhance mobile UX with hamburger menu
- Improve accessibility (reduced-motion, ARIA labels)
- Add privacy-friendly analytics support"

git push origin main
```

---

## Quick Reference

### Update Board Members

Edit `docs/data/board.json`:

```json
{
  "current": [
    {
      "name": "Full Name",
      "initials": "FN",
      "role": "Position Title",
      "image": "images/board/photo.jpg",
      "linkedin": "https://linkedin.com/in/username"
    }
  ]
}
```

### Publish Blog Posts

Edit `docs/data/posts.json`:

```json
{
  "posts": [
    {
      "title": "Post Title",
      "date": "2026-01-18",
      "summary": "Brief description for preview",
      "url": "https://link-to-full-post.com",
      "content": "Full post text (optional)"
    }
  ]
}
```

### Check Analytics

Visit https://plausible.io/philosophyclubsg.com (after setup)

---

## Troubleshooting

### Service Worker Not Working

- Service workers require HTTPS (GitHub Pages has this)
- Check browser console for errors
- Clear cache and reload: Ctrl+Shift+R (Cmd+Shift+R on Mac)

### Board Members Not Loading

- Check browser console for errors
- Verify `docs/data/board.json` is valid JSON
- Ensure no trailing commas in JSON

### Mobile Menu Not Toggling

- Check that JavaScript is loaded
- Verify button HTML is correct
- Inspect browser console for errors

### Images Not Optimized

- Install Pillow: `pip install Pillow`
- Run script from project root: `python3 optimize-images.py`
- Check `docs/images/optimized/` for output

---

## Need Help?

1. Check `IMPLEMENTATION.md` for detailed documentation
2. Review browser console for error messages
3. Verify all files are in correct locations
4. Test in different browsers
5. Check GitHub Actions logs for deployment issues

---

**Quick Links:**
- Full Documentation: `IMPLEMENTATION.md`
- Image Optimization: `optimize-images.py`
- Analytics Config: `docs/js/analytics.js`
- Board Data: `docs/data/board.json`
- Blog Posts: `docs/data/posts.json`
