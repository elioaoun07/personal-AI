# 🚨 URGENT: Fix Supabase Configuration

## Current Problem
Your app cannot see tasks because:
1. ❌ **Supabase URL is incorrect** in `.env`
2. ❌ **Anon Key is incomplete** in `.env`
3. ❌ **Not authenticated** with Supabase

## ✅ Solution Steps

### Step 1: Get Your Correct Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy these two values:

   - **Project URL**: Should look like `https://fuoodwihdqliuiovoyxb.supabase.co`
   - **anon public key**: Starts with `eyJ...` (very long, ~200+ characters)

### Step 2: Update Your `.env` File

Replace the current values in `.env` with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://fuoodwihdqliuiovoyxb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz.....[COMPLETE KEY HERE]
EXPO_PUBLIC_DEV_USER_ID=1cb9c50a-2a41-4fb3-8e90-2e270ca28830
```

**IMPORTANT**: 
- Remove `//home-management-app-murex.vercel.app/` - that's not your Supabase URL
- Make sure the anon key is the COMPLETE key, not cut off

### Step 3: Restart Your App

```bash
# Stop the current server (Ctrl+C)
pnpm start
```

### Step 4: Sign In to Supabase

Your app now uses Supabase. You need to sign in with credentials:

**Option A: Use the Auth Screen**
1. Navigate to `/auth` in your app
2. Enter your email and password
3. Click "Sign In"
4. Once signed in, you'll see your tasks!

**Option B: Create a Test Account**
If you don't have an account yet, you need to create one in Supabase:

1. Go to your Supabase Dashboard
2. Go to **Authentication** → **Users**  
3. Click "Add User" → "Create New User"
4. Enter email and password
5. Make sure the user_id matches: `1cb9c50a-2a41-4fb3-8e90-2e270ca28830`
   - OR update `EXPO_PUBLIC_DEV_USER_ID` in `.env` to match your user's ID

### Step 5: Verify Your Tasks

Once authenticated:
1. Your tasks should appear
2. Tasks are filtered by `user_id = auth.uid()`
3. Only YOUR tasks will be visible

## What Changed in Your App

✅ **Migrated from SQLite to Supabase**
- Tasks are now stored in Supabase (cloud database)
- Multi-device sync enabled
- User authentication required

✅ **Files Updated**
- `lib/repo/tasks.ts` - Now uses Supabase API instead of SQLite
- `lib/supabase.ts` - Added auth functions
- `lib/auth.ts` - Updated to use Supabase session
- `app/auth.tsx` - NEW: Authentication screen

## Troubleshooting

### "Can't see any tasks"
→ Check that you're signed in with the correct user account
→ Verify `user_id` in tasks table matches your authenticated user

### "Connection failed"
→ Double-check Supabase URL and anon key in `.env`
→ Make sure both are complete and correct
→ Restart the app

### "Auth error"
→ Create a user account in Supabase Dashboard
→ Use those credentials to sign in

### Want to go back to SQLite?
```bash
# Restore the backup
mv lib/repo/tasks.sqlite.ts.backup lib/repo/tasks.ts
# Restart app
pnpm start
```

## Next Steps

1. **Fix your `.env` file** with correct Supabase credentials
2. **Restart the app**
3. **Sign in** using `/auth` screen or create user in Supabase
4. **Your tasks will appear!**

Need help? Check:
- Supabase logs: https://app.supabase.com → Logs
- App console: Look for error messages
- Auth screen: Navigate to `/auth` to test connection
