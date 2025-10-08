/* eslint-disable no-undef */
import { parseQuickAdd } from '../lib/quickParse';
import dayjs from 'dayjs';

describe('parseQuickAdd', () => {
  it('should parse a simple task with no extras', () => {
    const result = parseQuickAdd('Buy milk');
    expect(result.title).toBe('Buy milk');
    expect(result.dueAt).toBeNull();
    expect(result.priority).toBe(0);
    expect(result.tags).toEqual([]);
  });

  it('should extract priority', () => {
    const result = parseQuickAdd('Important task !high');
    expect(result.title).toBe('Important task');
    expect(result.priority).toBe(3);
  });

  it('should extract tags', () => {
    const result = parseQuickAdd('Task with #work and #urgent tags');
    expect(result.title).toBe('Task with and tags');
    expect(result.tags).toEqual(['work', 'urgent']);
  });

  it('should parse "today"', () => {
    const result = parseQuickAdd('Task for today');
    expect(result.title).toBe('Task for');
    expect(result.dueAt).not.toBeNull();
    const dueDate = dayjs(result.dueAt);
    expect(dueDate.format('YYYY-MM-DD')).toBe(dayjs().format('YYYY-MM-DD'));
  });

  it('should parse "tomorrow"', () => {
    const result = parseQuickAdd('Task for tomorrow');
    expect(result.title).toBe('Task for');
    expect(result.dueAt).not.toBeNull();
    const dueDate = dayjs(result.dueAt);
    expect(dueDate.format('YYYY-MM-DD')).toBe(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  });

  it('should parse time with date', () => {
    const result = parseQuickAdd('Meeting tomorrow 3pm');
    expect(result.title).toBe('Meeting');
    expect(result.dueAt).not.toBeNull();
    if (result.dueAt) {
      const dueDate = dayjs(result.dueAt);
      expect(dueDate.hour()).toBe(15);
      expect(dueDate.minute()).toBe(0);
    }
  });

  it('should parse complex task', () => {
    const result = parseQuickAdd('Pay water bill tomorrow 9am #home !high');
    expect(result.title).toBe('Pay water bill');
    expect(result.priority).toBe(3);
    expect(result.tags).toEqual(['home']);
    expect(result.dueAt).not.toBeNull();
  });

  it('should parse "in X days"', () => {
    const result = parseQuickAdd('Task in 3 days');
    expect(result.title).toBe('Task');
    expect(result.dueAt).not.toBeNull();
    if (result.dueAt) {
      const dueDate = dayjs(result.dueAt);
      const expected = dayjs().add(3, 'day');
      expect(dueDate.format('YYYY-MM-DD')).toBe(expected.format('YYYY-MM-DD'));
    }
  });

  it('should parse "in X hours"', () => {
    const result = parseQuickAdd('Quick task in 2 hours');
    expect(result.title).toBe('Quick task');
    expect(result.dueAt).not.toBeNull();
  });

  it('should parse "tonight"', () => {
    const result = parseQuickAdd('Check emails tonight');
    expect(result.title).toBe('Check emails');
    expect(result.dueAt).not.toBeNull();
    if (result.dueAt) {
      const dueDate = dayjs(result.dueAt);
      expect(dueDate.hour()).toBe(20);
    }
  });

  it('should parse low priority', () => {
    const result = parseQuickAdd('Optional task !low');
    expect(result.priority).toBe(1);
  });

  it('should parse medium priority', () => {
    const result = parseQuickAdd('Medium task !med');
    expect(result.priority).toBe(2);
  });
});
