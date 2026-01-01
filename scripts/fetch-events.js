#!/usr/bin/env node
// Fetch events from UniClubs External API and write them to docs/data/events.json
// Designed for GitHub Actions (or manual runs) on GitHub Pages hosting.
const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, '..', 'docs', 'data', 'events.json');
const API_BASE = 'https://uniclubs.ch/api/external/v1';
const API_KEY = process.env.UNICLUBS_API_KEY;
const CLUB_SLUG = 'philosophy-club';

function requireApiKey() {
  if (!API_KEY) {
    throw new Error('Missing UNIClubs API key. Set UNICLUBS_API_KEY in your environment.');
  }
}

function formatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
}

function mapEvent(ev) {
  const date = ev.startDate || ev.date || '';
  const time = formatTime(date);
  const slug = ev.slug || ev.handle || '';

  const location = ev.location || ev.locationDetails || ev.venueName || ev.venue || '';
  const url = ev.eventUrl
    || ev.externalRegistrationUrl
    || (slug ? `https://uniclubs.ch/hsg/clubs/${CLUB_SLUG}/events/${slug}` : '');
  const description = ev.longDescription || ev.description || '';
  const image = ev.featuredImage
    || (ev.image?.s3Key ? `https://d396kn70sxtfio.cloudfront.net/${ev.image.s3Key}` : '');

  return {
    title: ev.title,
    date,
    time,
    location,
    url,
    description,
    image
  };
}

async function fetchEventsPage(page = 1, limit = 200) {
  const url = new URL(`${API_BASE}/events`);
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);
  url.searchParams.set('includePast', 'true');
  url.searchParams.set('includeDetails', 'true');
  url.searchParams.set('onlyPublished', 'true');
  url.searchParams.set('excludeStaffOnly', 'true');
  url.searchParams.set('excludeDrafts', 'true');
  url.searchParams.set('sort', 'date');

  const res = await fetch(url, {
    headers: {
      'X-API-Key': API_KEY
    }
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error || body?.message || '';
    } catch {
      // ignore
    }
    throw new Error(`Upstream responded with ${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(`API responded with success=false (${json.error || 'unknown error'})`);
  }
  const events = json.data?.events || json.data?.items || [];
  const pagination = json.data?.pagination || {};
  return { events, pagination };
}

async function fetchAllEvents() {
  requireApiKey();
  const collected = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { events, pagination } = await fetchEventsPage(page);
    collected.push(...events);
    const { hasMore: pagHasMore, totalPages } = pagination;
    hasMore = typeof pagHasMore === 'boolean' ? pagHasMore : page < (totalPages || page);
    page += 1;
  }

  return collected.map(mapEvent);
}

async function main() {
  try {
    const events = await fetchAllEvents();
    const payload = { events };
    fs.writeFileSync(TARGET, JSON.stringify(payload, null, 2) + '\n');
    console.log(`Saved ${events.length} events to ${path.relative(process.cwd(), TARGET)}`);
  } catch (err) {
    console.error(`Failed to update events: ${err.message}`);
    process.exit(1);
  }
}

main();
