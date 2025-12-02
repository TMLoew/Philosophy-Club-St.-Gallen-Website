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

  // UniClubs now renders the events array inside the HTML (escaped) with "$D" prefix on dates.
  const startToken = '\\"events\\":[';
  const endToken = '],\\"tiers\\":';
  const startIdx = html.indexOf(startToken);
  if (startIdx === -1) throw new Error('Could not find events start');
  const afterStart = html.slice(startIdx + startToken.length - 1); // keep leading '['
  const endIdx = afterStart.indexOf(endToken);
  if (endIdx === -1) throw new Error('Could not find events end');

  const block = afterStart.slice(0, endIdx + 1).trim(); // include closing ]

  // Normalize escape sequences: collapse over-escaped quotes, drop $D prefixes, and fix stray escapes.
  const jsonText = block
    .replace(/\\\\\"/g, '"')    // remove double-escaped quotes (e.g., \"\"Title\"\")
    .replace(/\\"/g, '"')      // unescape structural quotes
    .replace(/\$D/g, '')       // strip date prefix
    .replace(/\\([A-Za-z])/g, '$1') // fix stray escapes like \D
    .replace(/""/g, '"');      // collapse double quotes inside values

  let events;
  try {
    events = JSON.parse(jsonText);
  } catch (err) {
    throw new Error('Failed to JSON-parse events');
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
    const payload = { events };
    fs.writeFileSync(TARGET, JSON.stringify(payload, null, 2) + '\n');
    console.log(`Saved ${events.length} events to ${path.relative(process.cwd(), TARGET)}`);
  } catch (err) {
    console.error(`Failed to update events: ${err.message}`);
    process.exit(1);
  }
}

main();
