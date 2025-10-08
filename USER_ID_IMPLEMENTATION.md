# User ID Filtering Implementation

## Summary
Added user_id filtering to the task and event management system to ensure data isolation between users.

## Changes Made

### 1. Database Migration (`002_add_user_id.sql`)
- Added `user_id` column to `tasks` table
- Added `user_id` column to `events` table
- Created indexes for performance:
  - `idx_tasks_user_id`
  - `idx_tasks_user_status`
  - `idx_events_user_id`

### 2. Auth Utility (`lib/auth.ts`) - NEW
- `getCurrentUserId()` - Gets user ID from environment variables
- `isAuthenticated()` - Checks if user is authenticated

### 3. Task Repository Updates (`lib/repo/tasks.ts`)
- Updated `Task` interface to include `user_id` field
- Modified `createTask()` to automatically set user_id from environment
- Updated all query functions to filter by user_id:
  - `getTask()`
  - `getOverdueTasks()`
  - `getTodayTasks()`
  - `getWeekTasks()`
  - `getTimelessTasks()`
  - `getScheduledFutureTasks()`
  - `getCompletedTasks()`
  - `getAllTasks()`
  - `searchTasks()`

### 4. Event Repository Updates (`lib/repo/events.ts`)
- Updated `CalendarEvent` interface to include `user_id` field
- Modified `createEvent()` to automatically set user_id
- Updated query functions:
  - `getEvent()`
  - `getEventsBetween()`

### 5. Environment Configuration
- Added `EXPO_PUBLIC_DEV_USER_ID` to `.env` file
- Updated `app.config.js` to expose this variable

## How It Works

1. **User ID Source**: Currently from `EXPO_PUBLIC_DEV_USER_ID` environment variable
2. **Automatic Assignment**: All new tasks/events get the current user's ID
3. **Query Filtering**: All queries include `WHERE (user_id = ? OR user_id IS NULL)`
   - This allows backwards compatibility with existing data (where user_id is NULL)
   - Once you migrate old data, you can remove the `OR user_id IS NULL` clause

## Testing Steps

1. **Clear the app and restart**:
   ```bash
   pnpm expo start -c
   ```

2. **The migration will run automatically** on app start
   - Check logs for: "Applying migration 002_add_user_id..."

3. **Create a new task**:
   - It should be assigned your dev user ID automatically
   - Only you can see this task

4. **Verify filtering**:
   - Tasks without a user_id (old data) will still appear
   - Tasks with different user_ids will NOT appear

## Production Considerations

### Current Setup (Development)
```typescript
// Uses hardcoded dev user from .env
getCurrentUserId() => "1cb9c50a-2a41-4fb3-8e90-2e270ca28830"
```

### Future Setup (Production)
When you implement actual authentication (e.g., with Supabase Auth), update `lib/auth.ts`:

```typescript
import { supabase } from './supabase';

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}
```

## Data Migration

If you have existing tasks that need to be assigned to a user:

```sql
-- Assign all NULL user_id tasks to your dev user
UPDATE tasks 
SET user_id = '1cb9c50a-2a41-4fb3-8e90-2e270ca28830' 
WHERE user_id IS NULL;

UPDATE events 
SET user_id = '1cb9c50a-2a41-4fb3-8e90-2e270ca28830' 
WHERE user_id IS NULL;
```

You can run this via the dev screen or create a one-time migration script.

## Troubleshooting

### Not seeing any tasks?
1. Check that `EXPO_PUBLIC_DEV_USER_ID` is set in `.env`
2. Restart Expo with cache clear: `pnpm expo start -c`
3. Check console logs for the user ID being used

### Still seeing old tasks?
- Old tasks (with NULL user_id) will still appear due to backwards compatibility
- Run the data migration SQL above to assign them to your user

### Want to test with multiple users?
- Change `EXPO_PUBLIC_DEV_USER_ID` in `.env` to a different UUID
- Restart the app
- Create tasks - they'll be isolated from the previous user
