#!/usr/bin/env node
// Fetch events from UniClubs and write them to data/events.json
// Designed for GitHub Actions (or manual runs) on GitHub Pages hosting.
const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, '..', 'data', 'events.json');
const SOURCE_URL = 'https://uniclubs.ch/hsg/clubs/philosophy-club';

async function fetchEvents() {
  const res = await fetch(SOURCE_URL, { headers: { 'user-agent': 'philosophy-site-event-fetcher' } });
  if (!res.ok) {
    throw new Error(`Upstream responded with ${res.status}`);
  }
  const html = await res.text();
  const match = html.match(/"events":(\[.*?\])\s*,\s*"tiers"/s);
  if (!match) {
    throw new Error('Could not parse events array');
  }
  const events = JSON.parse(match[1]);
  return events.map((ev) => ({
    title: ev.title,
    date: ev.startDate || ev.date || '',
    time: ev.time || '',
    location: ev.location || ev.locationDetails || '',
    url: ev.externalRegistrationUrl || ev.featuredImage || SOURCE_URL,
    description: ev.description || ev.longDescription || ''
  }));
}

async function main() {
  try {
    const events = await fetchEvents();
    const payload = { events };
    fs.writeFileSync(TARGET, JSON.stringify(payload, null, 2) + '\n');
    console.log(`Saved ${events.length} events to ${path.relative(process.cwd(), TARGET)}`);
  } catch (err) {
    console.error(`Failed to update events: ${err.message}`);
    process.exit(1);
  }
}

main();
