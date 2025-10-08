# "Invalid API" Error - Complete Solution

## What I Fixed

### 1. ✅ Removed Service Role Key from `.env`
- **Why**: Service role keys should NEVER be used in client applications
- **What it was**: `SUPABASE_SERVICE_ROLE_KEY=...`
- **Action**: Removed it - you only need the `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 2. ✅ Your Current `.env` (Correct)
```env
EXPO_PUBLIC_SUPABASE_URL=https://fuoodwihdqliuiovoyxb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...FdnICbqQ0VseQh3DnCGp6aSXVXR6cKlbhkpIqazCUjw
EXPO_PUBLIC_DEV_USER_ID=1cb9c50a-2a41-4fb3-8e90-2e270ca28830
```

---

## Why You're Getting "Invalid API" Error

The error means one of these:

### Most Likely: Row Level Security (RLS) is Blocking Access

Supabase has **Row Level Security** enabled on your `tasks` table. This means:
- ❌ You can't access data without being authenticated
- ❌ Even when authenticated, you can only access YOUR data

**Solution**: You need to either:
1. **Sign in** with a Supabase account
2. **Set up RLS policies** (see below)
3. **Temporarily disable RLS** (for testing only)

---

## Quick Fixes (Choose One)

### Option A: Sign In to Your App (Recommended)

1. Navigate to `/auth` screen in your app
2. Sign in with:
   - **Email**: your Supabase account email
   - **Password**: your Supabase account password

3. **Don't have an account?**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" → "Create New User"
   - Use email + password
   - **Important**: Make sure the user's UUID is `1cb9c50a-2a41-4fb3-8e90-2e270ca28830`

### Option B: Temporarily Disable RLS (Testing Only)

**In Supabase Dashboard:**
1. Go to https://app.supabase.com → Your Project
2. Go to **Database** → **Tables** → `tasks`
3. Look for "RLS" toggle at the top
4. Click to **Disable RLS**
5. Repeat for `subtasks` table

⚠️ **Warning**: This makes your data publicly accessible! Only for testing.

### Option C: Set Up Proper RLS Policies (Best Practice)

**Run this in Supabase SQL Editor:**

```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Subtasks policies
CREATE POLICY "Users can view own subtasks" ON subtasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = subtasks.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own subtasks" ON subtasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = subtasks.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own subtasks" ON subtasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = subtasks.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own subtasks" ON subtasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = subtasks.task_id 
      AND tasks.user_id = auth.uid()
    )
  );
```

---

## Debug Your App

I created a debug component for you. Add it to your home screen:

**In `app/index.tsx`:**

```typescript
import { SupabaseDebugPanel } from '../components/SupabaseDebugPanel';

// Add this inside your component's return
<SupabaseDebugPanel />
```

This will show you:
- ✅ Configuration status
- ✅ Authentication status  
- ✅ Database connection status
- ✅ What errors you're getting
- ✅ Sample of your tasks

---

## Step-by-Step: Get Your Tasks Visible

### Step 1: Restart Your App
```bash
# Make sure .env changes are loaded
pnpm start
```

### Step 2: Add Debug Panel
Add `<SupabaseDebugPanel />` to your home screen to see what's happening

### Step 3: Check Debug Panel
Look for:
- **Configuration**: Should show your Supabase URL
- **Authentication**: Should show if you're signed in
- **Database**: Will show the exact error

### Step 4: Fix Based on Error

**If it says "Not Authenticated":**
→ Go to `/auth` screen and sign in

**If it says "Row level security" error:**
→ Set up RLS policies (Option C above) OR temporarily disable RLS (Option B)

**If it says "Invalid API key":**
→ Check your `.env` file has the correct anon key
→ Restart the app

### Step 5: Verify
Once authenticated and RLS is configured:
- ✅ Debug panel should show "✅ CONNECTED"
- ✅ Tasks should appear in your app
- ✅ You can create new tasks

---

## Files I Created for You

1. **`FIX_INVALID_API.md`** - Detailed troubleshooting guide
2. **`components/SupabaseDebugPanel.tsx`** - Debug component to add to your app
3. **Updated `.env`** - Removed dangerous service_role_key

---

## Summary

**The "Invalid API" error is NORMAL** when using Supabase with RLS. You just need to:

1. ✅ **Be authenticated** (sign in)
2. ✅ **Have RLS policies** set up (or temporarily disabled for testing)
3. ✅ **Use the ANON key** (not service role key)

**Next Step**: Add the `SupabaseDebugPanel` to your app to see exactly what's wrong, then follow the fix for that specific error.
