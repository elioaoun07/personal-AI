# Fix: Tasks Not Showing (RLS Blocking Access)

## The Problem

You have tasks in your Supabase database, but RLS (Row Level Security) is blocking access because you're **not authenticated**.

Your tasks all have `user_id: "1cb9c50a-2a41-4fb3-8e90-2e270ca28830"` which is perfect, but Supabase RLS requires you to be signed in to access them.

## Quick Solution (Choose One)

### Option 1: Temporarily Disable RLS (Fastest - For Testing Only)

**In Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Select your project  
3. Go to **Database** → **Tables** → **tasks**
4. Toggle **"Enable RLS"** to OFF (disable it)
5. Refresh your app

⚠️ **WARNING**: This makes your data publicly accessible. Only for testing!

---

### Option 2: Set Up RLS Policies to Allow Access (Recommended)

**Run this SQL in Supabase SQL Editor:**

```sql
-- Create a policy that allows users to see their own tasks
CREATE POLICY "Enable read access for users" ON public.tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own tasks  
CREATE POLICY "Enable insert for users" ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own tasks
CREATE POLICY "Enable update for users" ON public.tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own tasks
CREATE POLICY "Enable delete for users" ON public.tasks
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Then sign in to your app** (see Option 3 below).

---

### Option 3: Sign In to Your App (Required if using RLS)

You need to authenticate with Supabase. Add this authentication to your app:

1. **Create a user in Supabase:**
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Click "Add User" → "Create New User"
   - Set email (e.g., `test@example.com`) and password
   - **IMPORTANT**: The user's ID should be `1cb9c50a-2a41-4fb3-8e90-2e270ca28830`

2. **Sign in via the `/auth` screen** I created for you:
   - Navigate to `/auth` in your app
   - Enter email and password
   - Click "Sign In"

---

## Recommended Approach

I recommend **Option 1 temporarily** to test that everything works, then implement Option 2 + 3 for production.

### Step-by-Step:

1. ✅ **Disable RLS temporarily** (Option 1)
2. ✅ **Verify tasks appear** in your app
3. ✅ **Re-enable RLS** and set up policies (Option 2)
4. ✅ **Create user account** with the correct UUID
5. ✅ **Sign in** via `/auth` screen
6. ✅ **Tasks should appear again** (now properly secured)

---

## Why This Happened

Supabase has RLS enabled by default for security. The SQL schema you showed has:

```sql
user_id uuid NOT NULL DEFAULT auth.uid()
```

This means:
- Tasks require a `user_id`
- The `auth.uid()` function returns the authenticated user's ID
- Without authentication, `auth.uid()` returns NULL
- RLS policies block access if `auth.uid()` doesn't match the task's `user_id`

---

## Quick Test: Check RLS Status

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'tasks';

-- See existing policies
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

If `rowsecurity = true` and you have no policies (or restrictive ones), that's why tasks aren't showing.
