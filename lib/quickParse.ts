import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

export interface ParsedTask {
  title: string;
  dueAt: number | null;
  priority: number;
  tags: string[];
}

const PRIORITY_MAP: Record<string, number> = {
  '!high': 3,
  '!med': 2,
  '!medium': 2,
  '!low': 1,
};

export function parseQuickAdd(input: string, userTimezone?: string): ParsedTask {
  let title = input.trim();
  let dueAt: number | null = null;
  let priority = 0;
  const tags: string[] = [];

  // Extract priority
  const priorityMatch = title.match(/\s(!high|!med|!medium|!low)\b/i);
  if (priorityMatch) {
    priority = PRIORITY_MAP[priorityMatch[1].toLowerCase()] || 0;
    title = title.replace(priorityMatch[0], '');
  }

  // Extract tags
  const tagMatches = title.matchAll(/#(\w+)/g);
  for (const match of tagMatches) {
    tags.push(match[1]);
    title = title.replace(match[0], '');
  }

  // Extract date/time patterns
  const now = dayjs().tz(userTimezone);
  
  // "today" or "tonight"
  if (/\btoday\b/i.test(title)) {
    dueAt = now.hour(12).minute(0).second(0).millisecond(0).valueOf();
    title = title.replace(/\btoday\b/i, '').trim();
  } else if (/\btonight\b/i.test(title)) {
    dueAt = now.hour(20).minute(0).second(0).millisecond(0).valueOf();
    title = title.replace(/\btonight\b/i, '').trim();
  }
  
  // "tomorrow"
  else if (/\btomorrow\b/i.test(title)) {
    dueAt = now.add(1, 'day').hour(12).minute(0).second(0).millisecond(0).valueOf();
    title = title.replace(/\btomorrow\b/i, '').trim();
  }
  
  // "next monday", "next tue", etc.
  else if (/\bnext\s+(mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday)\b/i.test(title)) {
    const match = title.match(/\bnext\s+(mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday)\b/i);
    if (match) {
      const dayName = match[1];
      const targetDay = parseDayOfWeek(dayName);
      let nextDate = now.day(targetDay);
      
      // If target day is today or earlier this week, go to next week
      if (nextDate.isBefore(now) || nextDate.isSame(now, 'day')) {
        nextDate = nextDate.add(1, 'week');
      }
      
      dueAt = nextDate.hour(12).minute(0).second(0).millisecond(0).valueOf();
      title = title.replace(match[0], '').trim();
    }
  }
  
  // "in X minutes/hours/days"
  else if (/\bin\s+(\d+)\s*(min|mins|minutes|h|hour|hours|d|day|days)\b/i.test(title)) {
    const match = title.match(/\bin\s+(\d+)\s*(min|mins|minutes|h|hour|hours|d|day|days)\b/i);
    if (match) {
      const amount = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      
      let target = now;
      if (unit.startsWith('min')) {
        target = now.add(amount, 'minute');
      } else if (unit.startsWith('h')) {
        target = now.add(amount, 'hour');
      } else if (unit.startsWith('d')) {
        target = now.add(amount, 'day');
      }
      
      dueAt = target.valueOf();
      title = title.replace(match[0], '').trim();
    }
  }

  // Time pattern: "3pm", "3:30pm", "15:00"
  const timeMatch = title.match(/\b(\d{1,2})(?::(\d{2}))?\s?(am|pm)?\b/i);
  if (timeMatch && dueAt) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();
    
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    
    dueAt = dayjs(dueAt).hour(hour).minute(minute).second(0).millisecond(0).valueOf();
    title = title.replace(timeMatch[0], '').trim();
  } else if (timeMatch && !dueAt) {
    // Time without date = today
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();
    
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    
    dueAt = now.hour(hour).minute(minute).second(0).millisecond(0).valueOf();
    title = title.replace(timeMatch[0], '').trim();
  }

  // Clean up extra whitespace
  title = title.replace(/\s+/g, ' ').trim();

  return {
    title,
    dueAt,
    priority,
    tags,
  };
}

function parseDayOfWeek(day: string): number {
  const dayMap: Record<string, number> = {
    sun: 0, sunday: 0,
    mon: 1, monday: 1,
    tue: 2, tuesday: 2,
    wed: 3, wednesday: 3,
    thu: 4, thursday: 4,
    fri: 5, friday: 5,
    sat: 6, saturday: 6,
  };
  return dayMap[day.toLowerCase()] || 0;
}

// Quick date chips helpers
export function getChipDates(userTimezone?: string) {
  const now = dayjs().tz(userTimezone);
  
  return {
    today: now.hour(12).minute(0).second(0).millisecond(0).valueOf(),
    tonight: now.hour(20).minute(0).second(0).millisecond(0).valueOf(),
    tomorrow: now.add(1, 'day').hour(12).minute(0).second(0).millisecond(0).valueOf(),
    nextWeek: now.add(7, 'day').hour(12).minute(0).second(0).millisecond(0).valueOf(),
  };
}
