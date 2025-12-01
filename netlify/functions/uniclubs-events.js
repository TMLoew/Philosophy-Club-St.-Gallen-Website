exports.handler = async () => {
  const url = "https://uniclubs.ch/hsg/clubs/philosophy-club";
  try {
    const res = await fetch(url, { headers: { "user-agent": "philosophy-site-netlify-function" } });
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: `Upstream ${res.status}` }) };
    }
    const html = await res.text();
    const match = html.match(/"events":(\[.*?\])\s*,\s*"tiers"/s);
    if (!match) {
      return { statusCode: 502, body: JSON.stringify({ error: "Could not parse events" }) };
    }
    const events = JSON.parse(match[1]);
    const simplified = events.map((ev) => ({
      title: ev.title,
      date: ev.startDate || ev.date || "",
      time: ev.time || "",
      location: ev.location || ev.locationDetails || "",
      url: ev.externalRegistrationUrl || ev.featuredImage || url,
      description: ev.description || ev.longDescription || ""
    }));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
      body: JSON.stringify({ events: simplified })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Fetch failed" }) };
  }
};
