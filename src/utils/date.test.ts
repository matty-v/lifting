import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateForStorage,
  formatDateForDisplay,
  formatDateWithYear,
  isSameDay,
  getTodayString,
} from './date';

describe('formatDateForStorage', () => {
  it('formats current date as MM/DD/YY', () => {
    const date = new Date(2024, 11, 25); // Dec 25, 2024
    expect(formatDateForStorage(date)).toBe('12/25/24');
  });

  it('pads single digit months with leading zero', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDateForStorage(date)).toBe('01/15/24');
  });

  it('pads single digit days with leading zero', () => {
    const date = new Date(2024, 11, 5); // Dec 5, 2024
    expect(formatDateForStorage(date)).toBe('12/05/24');
  });

  it('uses today when no date provided', () => {
    const result = formatDateForStorage();
    // Just verify format is correct (MM/DD/YY)
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);
  });

  it('handles dates in different years', () => {
    const date2023 = new Date(2023, 5, 15);
    expect(formatDateForStorage(date2023)).toBe('06/15/23');

    const date2025 = new Date(2025, 2, 10);
    expect(formatDateForStorage(date2025)).toBe('03/10/25');
  });
});

describe('formatDateForDisplay', () => {
  it('formats date string as "Mon DD" format', () => {
    // Note: Date parsing can vary by browser/environment
    const result = formatDateForDisplay('12/25/2024');
    expect(result).toMatch(/Dec\s+25/);
  });

  it('handles ISO date strings', () => {
    // Note: ISO dates without time are parsed as UTC, which may shift the day
    // depending on the local timezone. Use a date with time to be explicit.
    const result = formatDateForDisplay('2024-12-25T12:00:00');
    expect(result).toMatch(/Dec\s+25/);
  });

  it('handles various date formats', () => {
    // Use explicit time to avoid UTC parsing issues
    const result = formatDateForDisplay('2024-01-15T12:00:00');
    expect(result).toMatch(/Jan\s+15/);
  });
});

describe('formatDateWithYear', () => {
  it('formats date with month, day, and year', () => {
    const date = new Date(2024, 11, 25);
    const result = formatDateWithYear(date);
    expect(result).toMatch(/Dec\s+25,?\s+2024/);
  });

  it('formats date in January', () => {
    const date = new Date(2024, 0, 1);
    const result = formatDateWithYear(date);
    expect(result).toMatch(/Jan\s+1,?\s+2024/);
  });

  it('formats date in different year', () => {
    const date = new Date(2023, 6, 4);
    const result = formatDateWithYear(date);
    expect(result).toMatch(/Jul\s+4,?\s+2023/);
  });
});

describe('isSameDay', () => {
  it('returns true for same date objects', () => {
    const date1 = new Date(2024, 11, 25, 10, 30);
    const date2 = new Date(2024, 11, 25, 15, 45);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('returns false for different days', () => {
    const date1 = new Date(2024, 11, 25);
    const date2 = new Date(2024, 11, 26);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('returns false for different months', () => {
    const date1 = new Date(2024, 10, 25);
    const date2 = new Date(2024, 11, 25);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('returns false for different years', () => {
    const date1 = new Date(2023, 11, 25);
    const date2 = new Date(2024, 11, 25);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('handles midnight boundary', () => {
    const date1 = new Date(2024, 11, 25, 0, 0, 0);
    const date2 = new Date(2024, 11, 25, 23, 59, 59);
    expect(isSameDay(date1, date2)).toBe(true);
  });
});

describe('getTodayString', () => {
  it('returns a valid date string', () => {
    const result = getTodayString();
    // toDateString returns format like "Wed Dec 25 2024"
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns consistent value when called multiple times on same day', () => {
    const result1 = getTodayString();
    const result2 = getTodayString();
    expect(result1).toBe(result2);
  });

  it('matches format of Date.toDateString()', () => {
    const result = getTodayString();
    const expected = new Date().toDateString();
    expect(result).toBe(expected);
  });
});
