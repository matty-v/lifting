/**
 * Normalize percentage to 0-100 format or 'warmup'
 */
export function normalizePercentage(pct: string | number | null | undefined): number | 'warmup' | null {
  if (pct === null || pct === undefined || pct === '') return null;

  const pctStr = String(pct).toLowerCase().trim();
  if (pctStr === 'warmup' || pctStr.includes('warm')) return 'warmup';

  let num = parseFloat(pctStr.replace('%', ''));
  if (num > 0 && num <= 1) {
    num = num * 100;
  }
  return Math.round(num);
}

/**
 * Format percentage for display
 */
export function formatPercentage(pct: string | number | null | undefined): string {
  const normalized = normalizePercentage(pct);
  if (normalized === 'warmup') return 'Warmup';
  if (normalized === null) return '-';
  return `${normalized}%`;
}

/**
 * Get the column key for a percentage value in the exercises sheet
 */
export function getPercentageColumnKey(pct: string | number | null | undefined): string {
  const normalized = normalizePercentage(pct);
  if (normalized === 'warmup') return 'Warmup';
  if (normalized === null) return '';
  return `${normalized}pct`;
}
