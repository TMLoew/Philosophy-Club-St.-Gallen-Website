#!/usr/bin/env node
// Fetch events from UniClubs and write them to data/events.json
// Designed for GitHub Actions (or manual runs) on GitHub Pages hosting.
const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, '..', 'data', 'events.json');
const SOURCE_URL = 'https://uniclubs.ch/hsg/clubs/philosophy-club';

// Find and return the first JSON array value for a key by bracket matching
function extractArrayByKey(html, key) {
  const candidates = [`"${key}":`, `\\"${key}\\":`];
  for (const pat of candidates) {
    const idx = html.indexOf(pat);
    if (idx === -1) continue;
    const arrStart = html.indexOf('[', idx);
    if (arrStart === -1) continue;
    let depth = 0;
    for (let i = arrStart; i < html.length; i++) {
      const ch = html[i];
      if (ch === '[') depth += 1;
      else if (ch === ']') depth -= 1;
      if (depth === 0) {
        return html.slice(arrStart, i + 1);
      }
    }
  }
  return null;
}

// Try multiple safe parsing strategies
function parseEventsBlock(block) {
  try {
    return JSON.parse(block);
  } catch (e) {
    // continue
  }

  if (block[0] === '"' && block[block.length - 1] === '"') {
    try {
      const unquoted = JSON.parse(block);
      return JSON.parse(unquoted);
    } catch (e) {
      // continue
    }
  }

  const tryText = block.replace(/\\"/g, '"').replace(/\\\//g, '/');
  try {
    return JSON.parse(tryText);
  } catch (e) {
    // continue
  }

  throw new Error('Failed to JSON-parse events');
}

async function fetchEvents() {
  const res = await fetch(SOURCE_URL, { headers: { 'user-agent': 'philosophy-site-event-fetcher' } });
  if (!res.ok) {
    throw new Error(`Upstream responded with ${res.status}`);
  }
  const html = await res.text();

  const block = extractArrayByKey(html, 'events');
  if (!block) {
    throw new Error('Could not find events array');
  }

  let events;
  try {
    events = parseEventsBlock(block);
  } catch (err) {
    try {
      const dbgPath = path.join(__dirname, '..', 'data', 'events-debug.json');
      fs.writeFileSync(dbgPath, block.slice(0, 500000) + '\n');
      console.error(`Failed to parse events — dumped captured block to ${dbgPath}`);
    } catch (e) {
      console.error('Failed to write debug file:', e.message);
    }
    return null;
  }

  return events.map((ev) => ({
    title: ev.title,
    date: ev.startDate || ev.date || '',
    time: ev.time || '',
    location: ev.location || ev.locationDetails || '',
    url: ev.externalRegistrationUrl || (ev.slug ? `https://uniclubs.ch/hsg/events/${ev.slug}` : '') || ev.featuredImage || SOURCE_URL,
    description: ev.description || ev.longDescription || '',
    image: ev.featuredImage || (ev.image?.s3Key ? `https://d396kn70sxtfio.cloudfront.net/${ev.image.s3Key}` : '')
  }));
}

async function main() {
  try {
    const events = await fetchEvents();
    if (!events) {
      console.error('Could not parse events; keeping existing data/events.json.');
      return;
    }
    const payload = { events };
    fs.writeFileSync(TARGET, JSON.stringify(payload, null, 2) + '\n');
    console.log(`Saved ${events.length} events to ${path.relative(process.cwd(), TARGET)}`);
  } catch (err) {
    console.error(`Failed to update events: ${err.message}`);
    process.exit(1);
  }
}

main();
