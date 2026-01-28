#!/usr/bin/env node
// Fetch events from UniClubs External API and write them to docs/data/events.json
// Designed for GitHub Actions (or manual runs) on GitHub Pages hosting.
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET = path.join(__dirname, '..', 'docs', 'data', 'events.json');
const API_BASE = 'https://uniclubs.ch/api/external/v1';
const API_KEY = process.env.UNICLUBS_API_KEY;
const CLUB_SLUG = 'philosophy-club';

function requireApiKey() {
  if (!API_KEY) {
    console.error('❌ Missing UNICLUBS_API_KEY environment variable.');
    console.error('   Set it in GitHub Settings → Secrets → Actions');
    throw new Error('Missing UNIClubs API key. Set UNICLUBS_API_KEY in your environment.');
  }
  console.log('✓ API key found');
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

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (err) {
            console.error('❌ Failed to parse JSON response');
            console.error('Response body:', data);
            reject(new Error(`Invalid JSON response: ${err.message}`));
          }
        } else {
          console.error(`❌ HTTP ${res.statusCode} ${res.statusMessage}`);
          console.error('Response body:', data);
          let detail = '';
          try {
            const body = JSON.parse(data);
            detail = body?.error || body?.message || '';
          } catch {
            // ignore
          }
          reject(new Error(`HTTP ${res.statusCode} ${res.statusMessage}${detail ? `: ${detail}` : ''}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Network request failed:', err.message);
      reject(err);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout after 30 seconds'));
    });

    req.end();
  });
}

async function fetchEventsPage(page = 1, limit = 200, retries = 3) {
  const url = new URL(`${API_BASE}/events`);
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);
  url.searchParams.set('includePast', 'true');
  url.searchParams.set('includeDetails', 'true');
  url.searchParams.set('onlyPublished', 'true');
  url.searchParams.set('excludeStaffOnly', 'true');
  url.searchParams.set('excludeDrafts', 'true');
  url.searchParams.set('sort', 'date');

  const options = {
    method: 'GET',
    headers: {
      'X-API-Key': API_KEY,
      'Accept': 'application/json',
      'User-Agent': 'Philosophy-Club-Website/2.0'
    }
  };

  console.log(`📡 Fetching page ${page} from ${url.toString()}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { body: json } = await httpsRequest(url, options);

      if (!json.success) {
        throw new Error(`API responded with success=false (${json.error || 'unknown error'})`);
      }

      const events = json.data?.events || json.data?.items || [];
      const pagination = json.data?.pagination || {};
      console.log(`✓ Fetched ${events.length} events (page ${page})`);
      return { events, pagination };

    } catch (err) {
      console.error(`❌ Attempt ${attempt}/${retries} failed: ${err.message}`);

      // Don't retry on 4xx errors (client errors)
      if (err.message.includes('HTTP 4')) {
        throw err;
      }

      if (attempt === retries) {
        throw err;
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function fetchAllEvents() {
  requireApiKey();
  console.log('🚀 Starting event fetch from UniClubs API...');

  const collected = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { events, pagination } = await fetchEventsPage(page);
    collected.push(...events);
    const { hasMore: pagHasMore, totalPages } = pagination;
    hasMore = typeof pagHasMore === 'boolean' ? pagHasMore : page < (totalPages || page);
    page += 1;

    // Safety limit to prevent infinite loops
    if (page > 100) {
      console.warn('⚠️  Reached page limit of 100, stopping');
      break;
    }
  }

  console.log(`✓ Collected ${collected.length} total events`);
  return collected.map(mapEvent);
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  Philosophy Club - Event Sync');
  console.log('═══════════════════════════════════════\n');

  try {
    const events = await fetchAllEvents();
    const payload = { events };

    // Ensure directory exists
    const dir = path.dirname(TARGET);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(TARGET, JSON.stringify(payload, null, 2) + '\n');
    const relativePath = path.relative(process.cwd(), TARGET);

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Success! Saved ${events.length} events`);
    console.log(`📁 File: ${relativePath}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('\n═══════════════════════════════════════');
    console.error('❌ Failed to update events');
    console.error('═══════════════════════════════════════');
    console.error('\nError details:', err.message);
    console.error('\nStack trace:', err.stack);
    console.error('\nTroubleshooting:');
    console.error('1. Check that UNICLUBS_API_KEY is set correctly');
    console.error('2. Verify API endpoint is accessible');
    console.error('3. Check GitHub Actions secrets configuration');
    console.error('═══════════════════════════════════════\n');
    process.exit(1);
  }
}

main();
