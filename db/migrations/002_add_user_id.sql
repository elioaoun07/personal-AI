-- Add user_id column to tasks table
ALTER TABLE tasks ADD COLUMN user_id TEXT NULL;

-- Add user_id column to events table
ALTER TABLE events ADD COLUMN user_id TEXT NULL;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
