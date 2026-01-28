# Scripts Documentation

## fetch-events.js

Automatically fetches events from the UniClubs API and updates `docs/data/events.json`.

### Features

- ✅ **Retry Logic**: 3 attempts with exponential backoff for transient errors
- ✅ **Detailed Logging**: Clear status messages and error diagnostics
- ✅ **Error Handling**: Differentiates between client errors (4xx) and server/network errors
- ✅ **Node.js Native**: Uses built-in `https` module (no fetch polyfill needed)
- ✅ **Timeout Protection**: 30-second timeout per request
- ✅ **Pagination Support**: Automatically fetches all pages
- ✅ **Safety Limits**: Stops at 100 pages to prevent infinite loops

### Usage

#### Local Testing

```bash
# Set API key (get from UniClubs dashboard)
export UNICLUBS_API_KEY="your-api-key-here"

# Run the script
node scripts/fetch-events.js
```

#### GitHub Actions

The script runs automatically:
- **Schedule**: Every 2 hours via cron (`0 */2 * * *`)
- **Manual**: Trigger via Actions tab → "Update events data" → "Run workflow"

### Configuration

The API key must be set in **GitHub Settings → Secrets and variables → Actions**:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `UNICLUBS_API_KEY`
5. Value: Your UniClubs API key
6. Click "Add secret"

### Troubleshooting

#### Error: "Missing UNICLUBS_API_KEY"

**Solution**: Set the secret in GitHub Actions settings (see Configuration above)

#### Error: "HTTP 401 Unauthorized"

**Causes**:
- Invalid API key
- API key expired
- Wrong API key format

**Solution**: Verify your API key in the UniClubs dashboard and update the GitHub secret

#### Error: "HTTP 404 Not Found"

**Causes**:
- API endpoint changed
- Club slug is incorrect

**Solution**: Check the `API_BASE` and `CLUB_SLUG` constants in the script

#### Error: "Request timeout"

**Causes**:
- Slow network connection
- API is experiencing high load

**Solution**: The script will automatically retry. If it persists, check UniClubs API status

#### Error: "Invalid JSON response"

**Causes**:
- API returned HTML instead of JSON (often an error page)
- API response format changed

**Solution**: Check the error logs for the response body and contact UniClubs support

### API Response Format

Expected response structure from UniClubs API:

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "title": "Event Title",
        "startDate": "2026-02-15T18:00:00Z",
        "location": "HSG Campus",
        "description": "Event description",
        "slug": "event-slug",
        "featuredImage": "https://...",
        "eventUrl": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 200,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

### Output Format

The script writes to `docs/data/events.json`:

```json
{
  "events": [
    {
      "title": "Event Title",
      "date": "2026-02-15T18:00:00Z",
      "time": "18:00",
      "location": "HSG Campus",
      "url": "https://uniclubs.ch/hsg/clubs/philosophy-club/events/event-slug",
      "description": "Event description",
      "image": "https://..."
    }
  ]
}
```

### Development

To modify the event mapping logic, edit the `mapEvent()` function:

```javascript
function mapEvent(ev) {
  // Add custom field transformations here
  return {
    title: ev.title,
    date: ev.startDate || ev.date || '',
    // ... more fields
  };
}
```

### Monitoring

Check the GitHub Actions tab to view:
- Last run status
- Execution logs
- Error messages
- Commit history

The workflow will create a commit if events have changed:
```
chore: update events data
```
