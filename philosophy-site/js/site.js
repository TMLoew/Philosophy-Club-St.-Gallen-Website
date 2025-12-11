// Shared helpers for small enhancements across the site
(function initSite() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const accordionItems = Array.from(document.querySelectorAll('.board-accordion details'));
  const parser = new DOMParser();

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatEventDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const day = date.getDate();
    const suffix = (n) => {
      if (n >= 11 && n <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix(day)} of ${month} ${year}`;
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

  const upcomingGrid = document.getElementById('upcoming-events-grid');
  const pastGrid = document.getElementById('past-events-grid');
  const refreshBtn = document.getElementById('refresh-events');
  const isAdminView = new URLSearchParams(window.location.search).has('admin');
  if (upcomingGrid || pastGrid) {
    const renderList = (container, events, emptyMsg) => {
      if (!container) return;
      if (!events.length) {
        container.innerHTML = `<p class="event-meta">${emptyMsg}</p>`;
        return;
      }
      container.innerHTML = events.map((event) => {
        const { title, date, time, location, url, description, image } = event;
        const prettyDate = formatEventDate(date);
        const meta = [prettyDate, time, location].filter(Boolean).join(' · ');
        const link = url ? `<a class="event-link" href="${url}" target="_blank" rel="noopener noreferrer">Learn more</a>` : '';
        const desc = description ? `<p class="event-desc">${description}</p>` : '';
        const img = image ? `<div class="event-image" style="background-image: url('${image}')"></div>` : '';
        return `
          <article class="event-card">
            ${img}
            <h3 class="event-title">${title || 'Event'}</h3>
            ${meta ? `<p class="event-meta">${meta}</p>` : ''}
            ${desc}
            ${link}
          </article>
        `;
      }).join('');
    };

    const splitEvents = (events) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = [];
      const past = [];
      events.forEach((ev) => {
        const d = ev.date ? new Date(ev.date) : null;
        if (!d || Number.isNaN(d.getTime())) {
          upcoming.push(ev);
          return;
        }
        d.setHours(0, 0, 0, 0);
        if (d >= today) {
          upcoming.push(ev);
        } else {
          past.push(ev);
        }
      });
      const byDateAsc = (a, b) => new Date(a.date) - new Date(b.date);
      const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
      return {
        upcoming: upcoming.sort(byDateAsc),
        past: past.sort(byDateDesc)
      };
    };

    const loadEvents = (force = false) => {
      const bust = `?bust=${force ? Date.now() : 'static'}`;
      const options = { cache: 'no-store' };
      return fetch(`data/events.json${bust}`, options)
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data.events) ? data.events : [];
          const { upcoming, past } = splitEvents(list);
          renderList(upcomingGrid, upcoming, 'No upcoming events right now. Follow us on Instagram for updates.');
          renderList(pastGrid, past, 'No past events listed yet.');
        })
        .catch(() => {
          if (upcomingGrid) {
            upcomingGrid.innerHTML = '<p class="event-meta">Could not load events. Check back soon.</p>';
          }
          if (pastGrid) {
            pastGrid.innerHTML = '';
          }
        });
    };

    if (refreshBtn) {
      if (isAdminView) {
        refreshBtn.classList.add('is-visible');
      }
      refreshBtn.addEventListener('click', () => {
        if (upcomingGrid) {
          upcomingGrid.innerHTML = '<p class="event-meta">Refreshing feed…</p>';
        }
        refreshBtn.disabled = true;
        loadEvents(true).finally(() => {
          refreshBtn.disabled = false;
        });
      });
    }

    loadEvents(false);
  }

  const postsGrid = document.getElementById('posts-grid');
  if (postsGrid) {
    const renderPosts = (posts) => {
      if (!posts.length) {
        postsGrid.innerHTML = '<p class="post-meta">No posts yet. Check back soon.</p>';
        return;
      }
      postsGrid.innerHTML = posts.map((post) => {
        const { title, date, summary, url } = post;
        const meta = formatDate(date);
        const link = url ? `<a class="post-link" href="${url}" target="_blank" rel="noopener noreferrer">Read more</a>` : '';
        const desc = summary ? `<p class="post-desc">${summary}</p>` : '';
        return `
          <article class="post-card">
            <h3 class="post-title">${title || 'Post'}</h3>
            ${meta ? `<p class="post-meta">${meta}</p>` : ''}
            ${desc}
            ${link}
          </article>
        `;
      }).join('');
    };

    fetch('data/posts.json')
      .then((res) => res.json())
      .then((data) => renderPosts(Array.isArray(data.posts) ? data.posts : []))
      .catch(() => {
        postsGrid.innerHTML = '<p class="post-meta">Could not load posts. Check back soon.</p>';
      });
  }

  const eventForm = document.getElementById('event-request-form');
  const eventStatus = document.getElementById('event-form-status');
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(eventForm);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const title = data.get('title') || '';
      const date = data.get('date') || '';
      const description = data.get('description') || '';
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nTitle: ${title}\nPreferred date: ${date}\n\n${description}`
      );
      const subject = encodeURIComponent(`Event request: ${title}`);
      const mailto = `mailto:philosophyclubstgallen@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      if (eventStatus) {
        eventStatus.textContent = 'Opening your email client…';
      }
    });
  }
})();
