import * as SQLite from 'expo-sqlite';
import { log } from './log';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('tasks.db');
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase) {
  try {
    // Create migrations tracking table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        applied_at INTEGER NOT NULL
      );
    `);

    // Check which migrations have been applied
    const applied = await database.getAllAsync<{ name: string }>(
      'SELECT name FROM _migrations'
    );
    const appliedNames = new Set(applied.map(m => m.name));

    // Migration 001: Initial schema
    if (!appliedNames.has('001_init')) {
      log('Applying migration 001_init...');
      
      await database.execAsync(`
        -- Tasks table
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          notes TEXT,
          status TEXT CHECK(status IN ('todo', 'done')) NOT NULL DEFAULT 'todo',
          priority INTEGER DEFAULT 0,
          due_at INTEGER NULL,
          start_at INTEGER NULL,
          all_day INTEGER DEFAULT 0,
          list_id TEXT NULL,
          repeat_rule TEXT NULL,
          timezone TEXT NULL,
          remind_at INTEGER NULL,
          snooze_until INTEGER NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          completed_at INTEGER NULL
        );

        -- Subtasks table
        CREATE TABLE IF NOT EXISTS subtasks (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          title TEXT NOT NULL,
          done INTEGER DEFAULT 0,
          position INTEGER DEFAULT 0,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        );

        -- Events table
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          notes TEXT,
          start_at INTEGER NOT NULL,
          end_at INTEGER NOT NULL,
          all_day INTEGER DEFAULT 0,
          repeat_rule TEXT NULL,
          timezone TEXT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        -- Tags table
        CREATE TABLE IF NOT EXISTS tags (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL
        );

        -- Task-Tags junction table
        CREATE TABLE IF NOT EXISTS task_tags (
          task_id TEXT NOT NULL,
          tag_id TEXT NOT NULL,
          PRIMARY KEY (task_id, tag_id),
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(due_at);
        CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_at);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id, position);
        CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
        CREATE INDEX IF NOT EXISTS idx_task_tags_task ON task_tags(task_id);
        CREATE INDEX IF NOT EXISTS idx_task_tags_tag ON task_tags(tag_id);
      `);

      await database.runAsync(
        'INSERT INTO _migrations (name, applied_at) VALUES (?, ?)',
        ['001_init', Date.now()]
      );
      
      log('Migration 001_init applied successfully');
    }

    // Migration 002: Add user_id to tasks
    if (!appliedNames.has('002_add_user_id')) {
      log('Applying migration 002_add_user_id...');
      
      await database.execAsync(`
        -- Add user_id column to tasks table
        ALTER TABLE tasks ADD COLUMN user_id TEXT NULL;

        -- Add user_id column to events table
        ALTER TABLE events ADD COLUMN user_id TEXT NULL;

        -- Create index for user_id lookups
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
        CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
      `);

      await database.runAsync(
        'INSERT INTO _migrations (name, applied_at) VALUES (?, ?)',
        ['002_add_user_id', Date.now()]
      );
      
      log('Migration 002_add_user_id applied successfully');
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

export async function clearDatabase() {
  const database = await getDatabase();
  await database.execAsync(`
    DROP TABLE IF EXISTS task_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS subtasks;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS _migrations;
  `);
  db = null;
  await getDatabase(); // Re-run migrations
}
