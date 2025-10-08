import { getDatabase } from '../db';
import { RRule } from 'rrule';
import { log } from '../log';
import { getCurrentUserId } from '../auth';

export interface CalendarEvent {
  id: string;
  title: string;
  notes: string | null;
  start_at: number;
  end_at: number;
  all_day: number;
  repeat_rule: string | null;
  timezone: string | null;
  user_id: string | null;
  created_at: number;
  updated_at: number;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function createEvent(
  data: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<CalendarEvent> {
  const db = await getDatabase();
  const now = Date.now();
  const userId = await getCurrentUserId();
  
  const event: CalendarEvent = {
    ...data,
    id: generateId(),
    user_id: userId,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO events (
      id, title, notes, start_at, end_at, all_day,
      repeat_rule, timezone, user_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.id,
      event.title,
      event.notes,
      event.start_at,
      event.end_at,
      event.all_day,
      event.repeat_rule,
      event.timezone,
      event.user_id,
      event.created_at,
      event.updated_at,
    ]
  );

  log('Event created:', event.id);
  return event;
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();
  
  const fields = Object.keys(data);
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = [...fields.map(f => data[f as keyof typeof data] ?? null), now, id];

  await db.runAsync(
    `UPDATE events SET ${setClause}, updated_at = ? WHERE id = ?`,
    values
  );
  
  log('Event updated:', id);
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM events WHERE id = ?', [id]);
  log('Event deleted:', id);
}

export async function getEvent(id: string): Promise<CalendarEvent | null> {
  const db = await getDatabase();
  const userId = await getCurrentUserId();
  const result = await db.getFirstAsync<CalendarEvent>(
    'SELECT * FROM events WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
    [id, userId]
  );
  return result || null;
}

export async function getEventsBetween(
  start: number,
  end: number
): Promise<CalendarEvent[]> {
  const db = await getDatabase();
  const userId = await getCurrentUserId();
  const events = await db.getAllAsync<CalendarEvent>(
    `SELECT * FROM events 
     WHERE start_at < ? AND end_at > ?
     AND (user_id = ? OR user_id IS NULL)
     ORDER BY start_at ASC`,
    [end, start, userId]
  );
  return events;
}

export async function getEventsForDay(
  dayStart: number,
  dayEnd: number
): Promise<CalendarEvent[]> {
  return getEventsBetween(dayStart, dayEnd);
}

// Expand recurring events for a date range
export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: number,
  rangeEnd: number
): Array<CalendarEvent & { occurrence_start: number; occurrence_end: number }> {
  const expanded: Array<CalendarEvent & { occurrence_start: number; occurrence_end: number }> = [];

  for (const event of events) {
    if (event.repeat_rule) {
      try {
        const rule = RRule.fromString(event.repeat_rule);
        const occurrences = rule.between(new Date(rangeStart), new Date(rangeEnd), true);
        
        const duration = event.end_at - event.start_at;
        
        for (const occurrence of occurrences) {
          const occStart = occurrence.getTime();
          expanded.push({
            ...event,
            occurrence_start: occStart,
            occurrence_end: occStart + duration,
          });
        }
      } catch (error) {
        log('Error expanding recurring event:', error);
      }
    } else {
      // Non-recurring event
      if (event.start_at < rangeEnd && event.end_at > rangeStart) {
        expanded.push({
          ...event,
          occurrence_start: event.start_at,
          occurrence_end: event.end_at,
        });
      }
    }
  }

  return expanded.sort((a, b) => a.occurrence_start - b.occurrence_start);
}
