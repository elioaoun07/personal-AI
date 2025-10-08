# Test Your Supabase API Key

## Quick Test

Run this in your browser console or in a Node.js script to test if your API key is valid:

```javascript
fetch('https://fuoodwihdqliuiovoyxb.supabase.co/rest/v1/tasks?select=count', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1b29kd2loZHFsaXVpb3ZveXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTg5OTAsImV4cCI6MjA2OTQ3NDk5MH0.FdnICbqQ0VseQh3DnCGp6aSXVXR6cKlbhkpIqazCUjw',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1b29kd2loZHFsaXVpb3ZveXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTg5OTAsImV4cCI6MjA2OTQ3NDk5MH0.FdnICbqQ0VseQh3DnCGp6aSXVXR6cKlbhkpIqazCUjw'
  }
})
.then(r => r.json())
.then(d => console.log('SUCCESS:', d))
.catch(e => console.error('ERROR:', e));
```

## If This Fails

Go to Supabase Dashboard and get a FRESH API key:

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Look for **Project API keys**
5. Copy the **`anon` `public`** key (not service_role!)
6. Replace in your `.env` file
7. Restart your app

## Common Reasons for "Invalid API Key"

1. ❌ **API key regenerated** - If you regenerated keys in Supabase, the old one won't work
2. ❌ **Wrong project** - Make sure the URL matches the API key project
3. ❌ **Typo in key** - Even one character wrong will fail
4. ❌ **Using service_role instead of anon** - Client apps need the anon key

## What to Do Now

**Check the app logs after reloading**. You should see:

```
🔍 Supabase Config Debug:
  URL: https://fuoodwihdqliuiovoyxb.supabase.co
  Has Anon Key: true
  Anon Key (first 20 chars): eyJhbGciOiJIUzI1NiIs
  Key length: 205  <-- Should be around 200-250 characters
```

If the key length is wrong or it shows "placeholder-key", the env vars aren't loading.
