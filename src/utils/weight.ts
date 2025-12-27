import type { Exercise, SetRecord, RoutineItem } from '@/types';
import { normalizePercentage, getPercentageColumnKey } from './percentage';
import { isSameDay } from './date';

export interface WeightRecommendation {
  current: number | null;
  recommended: number | null;
}

/**
 * Get weight recommendation for an exercise at a given percentage
 */
export function getWeightRecommendation(
  exercise: Exercise | undefined,
  percentage: string | number | null | undefined
): WeightRecommendation {
  if (!exercise || !percentage) {
    return { current: null, recommended: null };
  }

  const columnKey = getPercentageColumnKey(percentage);
  if (!columnKey) {
    return { current: null, recommended: null };
  }

  const currentWeight = parseFloat(String(exercise[columnKey as keyof Exercise] || 0));

  if (isNaN(currentWeight) || currentWeight === 0) {
    return { current: null, recommended: null };
  }

  return {
    current: currentWeight,
    recommended: currentWeight + 5,
  };
}

/**
 * Find matching set for a routine item (returns the set data or null)
 */
export function findMatchingSet(
  routineItem: RoutineItem,
  liftingData: SetRecord[],
  selectedRoutine: string
): SetRecord | null {
  const today = new Date();
  const routinePct = normalizePercentage(routineItem.Percentage);

  return liftingData.find(set => {
    if (set.Routine !== selectedRoutine) return false;
    if (set.Exercise !== routineItem.Exercise) return false;

    const setDate = new Date(set.Date);
    if (!isSameDay(setDate, today)) return false;

    const setPct = normalizePercentage(set.Percentage);
    return routinePct === setPct;
  }) || null;
}

/**
 * Check if a routine item is completed (has matching set for today)
 */
export function isRoutineItemComplete(
  routineItem: RoutineItem,
  liftingData: SetRecord[],
  selectedRoutine: string
): boolean {
  return findMatchingSet(routineItem, liftingData, selectedRoutine) !== null;
}

export interface LastCompletedRoutineInfo {
  routine: string;
  date: Date;
  totalWeight: number;
}

/**
 * Get the most recent completed routine from sets data
 */
export function getLastCompletedRoutine(
  liftingData: SetRecord[]
): LastCompletedRoutineInfo | null {
  if (!liftingData || liftingData.length === 0) return null;

  const setsWithRoutine = liftingData
    .filter(set => set.Routine)
    .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

  if (setsWithRoutine.length === 0) return null;

  const lastSet = setsWithRoutine[0];
  const lastDate = new Date(lastSet.Date);
  const lastDateStr = lastDate.toDateString();

  const totalWeight = liftingData
    .filter(set => {
      if (set.Routine !== lastSet.Routine) return false;
      const setDate = new Date(set.Date);
      return setDate.toDateString() === lastDateStr;
    })
    .reduce((sum, set) => sum + (parseFloat(String(set.TotalWeight)) || 0), 0);

  return {
    routine: lastSet.Routine!,
    date: lastDate,
    totalWeight,
  };
}
