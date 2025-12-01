// Shared helpers for small enhancements across the site
(function initSite() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const accordionItems = Array.from(document.querySelectorAll('.board-accordion details'));
  const parser = new DOMParser();

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

  const eventsGrid = document.getElementById('events-grid');
  if (eventsGrid) {
    const render = (events) => {
      if (!events.length) {
        eventsGrid.innerHTML = '<p class="event-meta">No upcoming events right now. Follow us on Instagram for updates.</p>';
        return;
      }
      eventsGrid.innerHTML = events.map((event) => {
        const { title, date, time, location, url, description } = event;
        const meta = [date, time, location].filter(Boolean).join(' · ');
        const link = url ? `<a class="event-link" href="${url}" target="_blank" rel="noopener noreferrer">Learn more</a>` : '';
        const desc = description ? `<p class="event-desc">${description}</p>` : '';
        return `
          <article class="event-card">
            <h3 class="event-title">${title || 'Event'}</h3>
            ${meta ? `<p class="event-meta">${meta}</p>` : ''}
            ${desc}
            ${link}
          </article>
        `;
      }).join('');
    };

    fetch('/.netlify/functions/uniclubs-events')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => render(Array.isArray(data.events) ? data.events : []))
      .catch(() => {
        fetch('data/events.json')
          .then((res) => res.json())
          .then((data) => render(Array.isArray(data.events) ? data.events : []))
          .catch(() => {
            eventsGrid.innerHTML = '<p class="event-meta">Could not load events. Check back soon.</p>';
          });
      });
  }
})();
