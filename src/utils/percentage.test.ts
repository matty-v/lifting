import { describe, it, expect } from 'vitest';
import { normalizePercentage, formatPercentage, getPercentageColumnKey } from './percentage';

describe('normalizePercentage', () => {
  describe('null/undefined/empty handling', () => {
    it('returns null for null input', () => {
      expect(normalizePercentage(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
      expect(normalizePercentage(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(normalizePercentage('')).toBeNull();
    });
  });

  describe('warmup handling', () => {
    it('returns "warmup" for "warmup" string', () => {
      expect(normalizePercentage('warmup')).toBe('warmup');
    });

    it('returns "warmup" for "Warmup" string (case insensitive)', () => {
      expect(normalizePercentage('Warmup')).toBe('warmup');
    });

    it('returns "warmup" for "WARMUP" string', () => {
      expect(normalizePercentage('WARMUP')).toBe('warmup');
    });

    it('returns "warmup" for strings containing "warm"', () => {
      expect(normalizePercentage('warm-up')).toBe('warmup');
      expect(normalizePercentage('warming')).toBe('warmup');
    });
  });

  describe('percentage number handling', () => {
    it('returns integer for whole number percentage', () => {
      expect(normalizePercentage(80)).toBe(80);
      expect(normalizePercentage(100)).toBe(100);
      expect(normalizePercentage(70)).toBe(70);
    });

    it('returns integer for string percentage', () => {
      expect(normalizePercentage('80')).toBe(80);
      expect(normalizePercentage('100')).toBe(100);
    });

    it('handles percentage strings with % symbol', () => {
      expect(normalizePercentage('80%')).toBe(80);
      expect(normalizePercentage('%90')).toBe(90);
    });

    it('converts decimal format (0-1) to percentage (0-100)', () => {
      expect(normalizePercentage(0.8)).toBe(80);
      expect(normalizePercentage(0.9)).toBe(90);
      expect(normalizePercentage(1)).toBe(100);
      expect(normalizePercentage(0.6)).toBe(60);
    });

    it('converts decimal string format to percentage', () => {
      expect(normalizePercentage('0.8')).toBe(80);
      expect(normalizePercentage('0.9')).toBe(90);
    });

    it('rounds to nearest integer', () => {
      expect(normalizePercentage(79.5)).toBe(80);
      expect(normalizePercentage(79.4)).toBe(79);
    });

    it('handles whitespace in strings', () => {
      expect(normalizePercentage('  80  ')).toBe(80);
      expect(normalizePercentage(' warmup ')).toBe('warmup');
    });
  });
});

describe('formatPercentage', () => {
  it('formats regular percentages with % symbol', () => {
    expect(formatPercentage(80)).toBe('80%');
    expect(formatPercentage(100)).toBe('100%');
    expect(formatPercentage('90')).toBe('90%');
  });

  it('returns "Warmup" for warmup values', () => {
    expect(formatPercentage('warmup')).toBe('Warmup');
    expect(formatPercentage('Warmup')).toBe('Warmup');
  });

  it('returns "-" for null/undefined/empty', () => {
    expect(formatPercentage(null)).toBe('-');
    expect(formatPercentage(undefined)).toBe('-');
    expect(formatPercentage('')).toBe('-');
  });

  it('handles decimal format input', () => {
    expect(formatPercentage(0.8)).toBe('80%');
    expect(formatPercentage('0.9')).toBe('90%');
  });
});

describe('getPercentageColumnKey', () => {
  it('returns correct column key for valid percentages', () => {
    expect(getPercentageColumnKey(100)).toBe('100pct');
    expect(getPercentageColumnKey(90)).toBe('90pct');
    expect(getPercentageColumnKey(80)).toBe('80pct');
    expect(getPercentageColumnKey(70)).toBe('70pct');
    expect(getPercentageColumnKey(60)).toBe('60pct');
  });

  it('returns "Warmup" for warmup values', () => {
    expect(getPercentageColumnKey('warmup')).toBe('Warmup');
    expect(getPercentageColumnKey('Warmup')).toBe('Warmup');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(getPercentageColumnKey(null)).toBe('');
    expect(getPercentageColumnKey(undefined)).toBe('');
    expect(getPercentageColumnKey('')).toBe('');
  });

  it('handles string percentage inputs', () => {
    expect(getPercentageColumnKey('80')).toBe('80pct');
    expect(getPercentageColumnKey('80%')).toBe('80pct');
  });

  it('handles decimal format input', () => {
    expect(getPercentageColumnKey(0.8)).toBe('80pct');
    expect(getPercentageColumnKey('0.9')).toBe('90pct');
  });
});
