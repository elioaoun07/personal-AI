# Fix "Invalid API" Error - Supabase Setup

## The Problem
You're getting "Invalid API" error because your Supabase database has Row Level Security (RLS) enabled, which requires authentication to access data.

## Solutions (Choose ONE)

### Option 1: Disable RLS Temporarily (Quick Fix for Testing)

**In Supabase Dashboard:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Authentication** → **Policies** → **tasks** table
4. Click on "Disable RLS" (toggle at top)

⚠️ **WARNING**: This makes your data publicly accessible. Only for testing!

---

### Option 2: Set Up Proper RLS Policies (Recommended)

**In Supabase Dashboard → SQL Editor**, run this:

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see only their own tasks
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);

-- Do the same for subtasks table
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subtasks of their tasks"
ON subtasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = subtasks.task_id 
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert subtasks to their tasks"
ON subtasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = subtasks.task_id 
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update subtasks of their tasks"
ON subtasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = subtasks.task_id 
    AND tasks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete subtasks of their tasks"
ON subtasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = subtasks.task_id 
    AND tasks.user_id = auth.uid()
  )
);
```

---

### Option 3: Sign In to See Your Tasks

If RLS is already set up, you just need to authenticate:

1. **In your app, navigate to `/auth` screen**
2. Sign in with your Supabase account:
   - Email: your account email
   - Password: your account password

3. **Don't have an account?** Create one:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" → "Create New User"
   - Set email and password
   - **IMPORTANT**: Make sure the UUID matches your `EXPO_PUBLIC_DEV_USER_ID`
   - Or sign up through your app (if you add a signup screen)

---

## Environment Variables - What You Have Now

✅ **Good - Keep these:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://fuoodwihdqliuiovoyxb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
EXPO_PUBLIC_DEV_USER_ID=1cb9c50a-2a41-4fb3-8e90-2e270ca28830
```

❌ **Remove this (not used in client):**
```env
SUPABASE_SERVICE_ROLE_KEY=...
```

The service role key is for server-side operations only and should **NEVER** be exposed in a client app.

---

## Quick Test to Verify Connection

Add this to your app temporarily to test the connection:

```typescript
// In app/index.tsx or any component
import { supabase } from '../lib/supabase';

useEffect(() => {
  testSupabaseConnection();
}, []);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check if Supabase client is initialized
  console.log('Supabase URL:', supabase.supabaseUrl);
  
  // Test 2: Try to query tasks (will fail if not authenticated or RLS is blocking)
  const { data, error } = await supabase.from('tasks').select('count');
  
  if (error) {
    console.error('❌ Supabase error:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Supabase connected! Task count:', data);
  }
  
  // Test 3: Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log('✅ Authenticated as:', session.user.email);
    console.log('User ID:', session.user.id);
  } else {
    console.log('❌ Not authenticated - need to sign in');
  }
}
```

---

## Recommended Steps (In Order)

1. ✅ **Remove service_role_key from `.env`** (you don't need it)
2. ✅ **Set up RLS policies** (Option 2 above)
3. ✅ **Create a user account** in Supabase with ID: `1cb9c50a-2a41-4fb3-8e90-2e270ca28830`
4. ✅ **Sign in via `/auth` screen** in your app
5. ✅ **Your tasks should now appear!**

---

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid API" | Wrong URL or key | Check `.env` values match Supabase dashboard |
| "new row violates row-level security" | RLS blocking insert | Set up INSERT policy or disable RLS |
| "No rows returned" | RLS blocking SELECT | Sign in or set up SELECT policy |
| "JWT expired" | Session expired | Sign in again |
| "Anonymous sign-ins are disabled" | Trying to access without auth | Sign in with email/password |

---

## After Fixing

Once you're authenticated and RLS is set up:
- ✅ Tasks will load automatically
- ✅ Creating new tasks will work
- ✅ Only YOUR tasks will be visible (filtered by user_id)
- ✅ Multi-device sync will work
