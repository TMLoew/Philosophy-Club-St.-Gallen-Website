// Shared helpers for small enhancements across the site
(function initSite() {
  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      }).catch((err) => {
        console.log('ServiceWorker registration failed:', err);
      });
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Render board members dynamically
  const renderBoardMembers = (container, members) => {
    if (!container || !members || !members.length) return;
    container.innerHTML = members.map((member) => {
      const { name, initials, role, image, linkedin } = member;
      const hasPhoto = image ? ' has-photo' : '';
      const bgStyle = image ? ` data-bg-image="${image}"` : '';
      const photoContent = `
        <div class="board-photo${hasPhoto}"${bgStyle}>
          <span class="board-initials">${initials}</span>
          <div class="board-overlay">
            <div>
              <h3>${name}</h3>
              <p>${role}</p>
            </div>
          </div>
        </div>
      `;
      if (linkedin) {
        return `
          <article class="board-card">
            <a href="${linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${name} on LinkedIn">
              ${photoContent}
            </a>
          </article>
        `;
      }
      return `<article class="board-card">${photoContent}</article>`;
    }).join('');
  };

  // Load board data
  const currentBoardGrid = document.getElementById('current-board-grid');
  const distinguishedGrid = document.getElementById('distinguished-grid');
  const facultyGrid = document.getElementById('faculty-grid');
  if (currentBoardGrid || distinguishedGrid || facultyGrid) {
    fetch('data/board.json')
      .then((res) => res.json())
      .then((data) => {
        renderBoardMembers(currentBoardGrid, data.current);
        renderBoardMembers(distinguishedGrid, data.distinguished);
        renderBoardMembers(facultyGrid, data.faculty);
      })
      .catch((err) => {
        console.error('Could not load board data:', err);
      });
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
  const searchInput = document.getElementById('event-search');
  const isAdminView = new URLSearchParams(window.location.search).has('admin');

  // Generate iCalendar file for an event
  const generateICS = (event) => {
    const { title, date, time, location, description, url } = event;
    const eventDate = new Date(date);
    if (!title || isNaN(eventDate.getTime())) return null;

    const formatICSDate = (d) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatICSDate(eventDate);
    const endDate = formatICSDate(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)); // 2 hour default

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Philosophy Club St. Gallen//Event//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@philosophyclubsg.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
      location ? `LOCATION:${location}` : '',
      url ? `URL:${url}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    return icsContent;
  };

  if (upcomingGrid || pastGrid) {
    let allUpcoming = [];
    let allPast = [];

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
        const img = image ? `<div class="event-image" data-bg-image="${image}" role="img" aria-label="${title} event image"></div>` : '';
        const icsData = generateICS(event);
        const addToCalBtn = icsData ? `<button class="event-calendar-btn" data-ics="${encodeURIComponent(icsData)}" data-title="${title}" aria-label="Add ${title} to calendar">+ Add to Calendar</button>` : '';
        return `
          <article class="event-card">
            ${img}
            <h3 class="event-title">${title || 'Event'}</h3>
            ${meta ? `<p class="event-meta">${meta}</p>` : ''}
            ${desc}
            <div class="event-actions">
              ${link}
              ${addToCalBtn}
            </div>
          </article>
        `;
      }).join('');

      // Add event listeners for calendar buttons
      container.querySelectorAll('.event-calendar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const icsData = decodeURIComponent(e.target.dataset.ics);
          const title = e.target.dataset.title || 'event';
          const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
          link.click();
        });
      });
    };

    const filterEvents = (searchTerm) => {
      const term = searchTerm.toLowerCase();
      const filteredUpcoming = allUpcoming.filter(event =>
        (event.title && event.title.toLowerCase().includes(term)) ||
        (event.description && event.description.toLowerCase().includes(term)) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
      const filteredPast = allPast.filter(event =>
        (event.title && event.title.toLowerCase().includes(term)) ||
        (event.description && event.description.toLowerCase().includes(term)) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
      renderList(upcomingGrid, filteredUpcoming, 'No matching upcoming events.');
      renderList(pastGrid, filteredPast, 'No matching past events.');
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterEvents(e.target.value);
      });
    }

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
          allUpcoming = upcoming;
          allPast = past;
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

  // Blog page rendering
  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid) {
    fetch('data/posts.json')
      .then((res) => res.json())
      .then((data) => {
        const posts = Array.isArray(data.posts) ? data.posts : [];
        if (!posts.length) {
          blogGrid.innerHTML = '<p class="post-meta">No posts yet. Check back soon for updates!</p>';
          return;
        }
        blogGrid.innerHTML = posts.map((post) => {
          const { title, date, summary, url, content } = post;
          const formattedDate = formatDate(date);
          const excerpt = summary || (content ? content.substring(0, 200) + '...' : '');
          const link = url ? `<a class="blog-post-link" href="${url}">Read more →</a>` : '';
          return `
            <article class="blog-post-card">
              <h2 class="blog-post-title">${title || 'Untitled Post'}</h2>
              ${formattedDate ? `<p class="blog-post-date">${formattedDate}</p>` : ''}
              ${excerpt ? `<p class="blog-post-excerpt">${excerpt}</p>` : ''}
              ${link}
            </article>
          `;
        }).join('');
      })
      .catch(() => {
        blogGrid.innerHTML = '<p class="post-meta">Could not load posts. Please try again later.</p>';
      });
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-open') &&
          !navLinks.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on navigation
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
      }
    });
  }

  // Mobile touch optimizations
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }

  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300 && e.target.closest('button, a')) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Lazy load images with Intersection Observer for better mobile performance
  const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgUrl = element.dataset.bgImage;

          if (bgUrl) {
            element.style.backgroundImage = `url('${bgUrl}')`;
            element.removeAttribute('data-bg-image');
          }

          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('[data-bg-image]').forEach(img => {
      imageObserver.observe(img);
    });
  };

  // Run lazy loading after DOM content is ready
  lazyLoadImages();
})();
