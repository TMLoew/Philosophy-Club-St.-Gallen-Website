// Shared helpers for small enhancements across the site
(function initSite() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const accordionItems = Array.from(document.querySelectorAll('.board-accordion details'));
  const parser = new DOMParser();

  const closeOthers = (current) => {
    accordionItems.forEach((item) => {
      if (item !== current) item.removeAttribute('open');
    });
  };

  const loadBoard = async (details) => {
    if (details.dataset.loaded === 'true') return;
    const src = details.dataset.boardSrc;
    const panel = details.querySelector('.board-panel');
    if (!src || !panel) return;
    panel.innerHTML = '<p class="board-panel__loading">Loading…</p>';
    try {
      const res = await fetch(src);
      const html = await res.text();
      const doc = parser.parseFromString(html, 'text/html');
      const grid = doc.querySelector('.board-grid');
      if (grid) {
        panel.innerHTML = grid.outerHTML;
      } else {
        panel.innerHTML = '<p class="board-panel__error">Could not load this board.</p>';
      }
      details.dataset.loaded = 'true';
    } catch (err) {
      panel.innerHTML = '<p class="board-panel__error">Could not load this board.</p>';
    }
  };

  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        closeOthers(item);
        loadBoard(item);
      }
    });
  });

  document.querySelectorAll('.ig-embed-frame').forEach((frame) => {
    const fallback = frame.parentElement?.querySelector('.ig-fallback');
    if (!fallback) return;
    const hide = () => fallback.style.display = 'none';
    frame.addEventListener('load', hide, { once: true });
  });
})();
