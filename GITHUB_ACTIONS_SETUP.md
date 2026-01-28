# GitHub Actions Setup Guide

## Fixing the Event Sync Workflow

The "Update events data" GitHub Actions workflow is failing. Here's how to fix it.

## Quick Fix Checklist

### 1. ✅ Code Fix (Already Done)

The fetch-events.js script has been updated with:
- ✅ Native Node.js HTTPS (no fetch polyfill needed)
- ✅ Retry logic with exponential backoff
- ✅ Detailed error logging
- ✅ Better error messages

**Status**: Committed in `4162f1f` and pushed to GitHub.

### 2. ⚠️ Configure GitHub Secret (Action Required)

The workflow needs the `UNICLUBS_API_KEY` secret to be set.

#### Step-by-Step Instructions:

1. **Go to your repository on GitHub**:
   ```
   https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website
   ```

2. **Navigate to Settings**:
   - Click the "Settings" tab at the top
   - You must be a repository admin to access this

3. **Go to Secrets and Variables**:
   - In the left sidebar, find "Secrets and variables"
   - Click on "Actions"

4. **Add or Update the Secret**:
   - Click "New repository secret" (or "Update" if it already exists)
   - **Name**: `UNICLUBS_API_KEY`
   - **Value**: Your UniClubs API key (get from UniClubs dashboard)
   - Click "Add secret"

5. **Get Your API Key**:
   - Log in to [UniClubs](https://uniclubs.ch)
   - Navigate to your club dashboard
   - Find "API Keys" or "External API" section
   - Copy the API key

### 3. 🧪 Test the Workflow

After setting the secret:

1. **Go to the Actions Tab**:
   ```
   https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/actions
   ```

2. **Find the "Update events data" Workflow**:
   - Click on "Update events data" in the left sidebar

3. **Trigger Manually**:
   - Click "Run workflow" button
   - Select branch: `main`
   - Click "Run workflow"

4. **Monitor the Run**:
   - Click on the running workflow
   - Watch the logs for errors
   - Look for success message: "✅ Success! Saved X events"

### 4. 🔍 Check the Logs

The improved script now provides detailed logs:

#### Success Output:
```
═══════════════════════════════════════
  Philosophy Club - Event Sync
═══════════════════════════════════════

✓ API key found
🚀 Starting event fetch from UniClubs API...
📡 Fetching page 1 from https://uniclubs.ch/api/external/v1/events?...
✓ Fetched 12 events (page 1)
✓ Collected 12 total events

═══════════════════════════════════════
✅ Success! Saved 12 events
📁 File: docs/data/events.json
═══════════════════════════════════════
```

#### Error Output Examples:

**Missing API Key:**
```
❌ Missing UNICLUBS_API_KEY environment variable.
   Set it in GitHub Settings → Secrets → Actions
```

**Invalid API Key (401):**
```
❌ HTTP 401 Unauthorized
Response body: {"success":false,"error":"Invalid API key"}
```

**API Timeout:**
```
❌ Attempt 1/3 failed: Request timeout after 30 seconds
⏳ Retrying in 1000ms...
📡 Fetching page 1 from https://...
```

### 5. 📊 Verify the Results

After a successful run:

1. **Check for a New Commit**:
   - Look for commit message: `chore: update events data`
   - Author: `github-actions[bot]`

2. **Verify events.json Updated**:
   ```
   https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/blob/main/docs/data/events.json
   ```

3. **Check Website**:
   - Visit: `https://philosophyclubsg.com`
   - Events should show on the homepage

## Common Issues & Solutions

### Issue: "Missing UNICLUBS_API_KEY"

**Cause**: Secret not configured in GitHub

**Solution**:
1. Follow Step 2 above to add the secret
2. Make sure the name is exactly `UNICLUBS_API_KEY` (case-sensitive)

### Issue: "HTTP 401 Unauthorized"

**Cause**: Invalid or expired API key

**Solution**:
1. Get a fresh API key from UniClubs dashboard
2. Update the secret in GitHub (Settings → Secrets → Actions → Update)
3. Re-run the workflow

### Issue: "HTTP 404 Not Found"

**Cause**: API endpoint or club slug incorrect

**Solution**:
1. Check if UniClubs API has changed
2. Verify `API_BASE` in [scripts/fetch-events.js](scripts/fetch-events.js):
   ```javascript
   const API_BASE = 'https://uniclubs.ch/api/external/v1';
   const CLUB_SLUG = 'philosophy-club';
   ```
3. Contact UniClubs support if the endpoint changed

### Issue: "Request timeout after 30 seconds"

**Cause**: Network issues or API slowness

**Solution**:
- The script will automatically retry 3 times
- If it keeps failing, check UniClubs API status
- Try again later

### Issue: "Invalid JSON response"

**Cause**: API returned HTML or malformed data

**Solution**:
1. Check the error logs for the response body
2. Verify the API endpoint is correct
3. Contact UniClubs support with the error details

## Workflow Schedule

The workflow runs automatically:
- **Every 2 hours**: Via cron schedule `0 */2 * * *`
- **Manual**: Via "Run workflow" button in Actions tab

## Monitoring

### Enable Email Notifications

1. Go to [GitHub notification settings](https://github.com/settings/notifications)
2. Under "Actions", enable "Send notifications for failed workflows only"
3. Choose delivery method (Email, Web + Mobile)

### Check Workflow Status Badge

Add this to your README.md:

```markdown
[![Update Events](https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/actions/workflows/fetch-events.yml/badge.svg)](https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/actions/workflows/fetch-events.yml)
```

Result: ![Update Events](https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/actions/workflows/fetch-events.yml/badge.svg)

## Next Steps

1. ✅ Set up the `UNICLUBS_API_KEY` secret
2. ✅ Run the workflow manually to test
3. ✅ Verify events appear on the website
4. ✅ Enable email notifications for failures
5. ✅ Add status badge to README (optional)

## Need Help?

- 📖 Read [scripts/README.md](scripts/README.md) for detailed troubleshooting
- 🐛 Check [GitHub Issues](https://github.com/TMLoew/Philosophy-Club-St.-Gallen-Website/issues)
- 📧 Contact UniClubs support for API issues
