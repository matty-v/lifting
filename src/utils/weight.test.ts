import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getWeightRecommendation,
  findMatchingSet,
  isRoutineItemComplete,
  getLastCompletedRoutine,
} from './weight';
import type { Exercise, RoutineItem, SetRecord } from '@/types';

// Mock data factories
function createExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: '1',
    Exercise: 'Bench Press',
    '100pct': 225,
    '90pct': 205,
    '80pct': 180,
    '70pct': 160,
    '60pct': 135,
    Warmup: 95,
    ...overrides,
  };
}

function createRoutineItem(overrides: Partial<RoutineItem> = {}): RoutineItem {
  return {
    id: '1',
    Routine: 'Test Workout',
    Exercise: 'Bench Press',
    Percentage: 80,
    Reps: 5,
    ...overrides,
  };
}

function createSetRecord(overrides: Partial<SetRecord> = {}): SetRecord {
  return {
    id: '1',
    Date: new Date().toISOString(),
    Routine: 'Test Workout',
    Exercise: 'Bench Press',
    Percentage: 80,
    Weight: 180,
    Reps: 5,
    TotalWeight: 900,
    ...overrides,
  };
}

describe('getWeightRecommendation', () => {
  it('returns null values when exercise is undefined', () => {
    const result = getWeightRecommendation(undefined, 80);
    expect(result).toEqual({ current: null, recommended: null });
  });

  it('returns null values when percentage is null', () => {
    const exercise = createExercise();
    const result = getWeightRecommendation(exercise, null);
    expect(result).toEqual({ current: null, recommended: null });
  });

  it('returns null values when percentage is undefined', () => {
    const exercise = createExercise();
    const result = getWeightRecommendation(exercise, undefined);
    expect(result).toEqual({ current: null, recommended: null });
  });

  it('returns current weight and recommended (+5) for valid input', () => {
    const exercise = createExercise({ '80pct': 180 });
    const result = getWeightRecommendation(exercise, 80);
    expect(result).toEqual({ current: 180, recommended: 185 });
  });

  it('handles different percentages correctly', () => {
    const exercise = createExercise();

    expect(getWeightRecommendation(exercise, 100)).toEqual({ current: 225, recommended: 230 });
    expect(getWeightRecommendation(exercise, 90)).toEqual({ current: 205, recommended: 210 });
    expect(getWeightRecommendation(exercise, 70)).toEqual({ current: 160, recommended: 165 });
  });

  it('handles warmup percentage', () => {
    const exercise = createExercise({ Warmup: 95 });
    const result = getWeightRecommendation(exercise, 'warmup');
    expect(result).toEqual({ current: 95, recommended: 100 });
  });

  it('returns null values when weight is 0', () => {
    const exercise = createExercise({ '80pct': 0 });
    const result = getWeightRecommendation(exercise, 80);
    expect(result).toEqual({ current: null, recommended: null });
  });

  it('returns null values when weight is empty string', () => {
    const exercise = createExercise({ '80pct': '' as unknown as number });
    const result = getWeightRecommendation(exercise, 80);
    expect(result).toEqual({ current: null, recommended: null });
  });

  it('handles string weights correctly', () => {
    const exercise = createExercise({ '80pct': '180' as unknown as number });
    const result = getWeightRecommendation(exercise, 80);
    expect(result).toEqual({ current: 180, recommended: 185 });
  });
});

describe('findMatchingSet', () => {
  const today = new Date();
  const todayISO = today.toISOString();

  it('finds matching set for today', () => {
    const routineItem = createRoutineItem();
    const liftingData = [createSetRecord({ Date: todayISO })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).not.toBeNull();
    expect(result?.Exercise).toBe('Bench Press');
  });

  it('returns null when no matching routine', () => {
    const routineItem = createRoutineItem();
    const liftingData = [createSetRecord({ Date: todayISO, Routine: 'Other Workout' })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).toBeNull();
  });

  it('returns null when no matching exercise', () => {
    const routineItem = createRoutineItem({ Exercise: 'Squat' });
    const liftingData = [createSetRecord({ Date: todayISO, Exercise: 'Bench Press' })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).toBeNull();
  });

  it('returns null when set is from different day', () => {
    const routineItem = createRoutineItem();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const liftingData = [createSetRecord({ Date: yesterday.toISOString() })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).toBeNull();
  });

  it('returns null when percentage does not match', () => {
    const routineItem = createRoutineItem({ Percentage: 80 });
    const liftingData = [createSetRecord({ Date: todayISO, Percentage: 90 })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).toBeNull();
  });

  it('matches normalized percentages', () => {
    const routineItem = createRoutineItem({ Percentage: '80' });
    const liftingData = [createSetRecord({ Date: todayISO, Percentage: 80 })];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result).not.toBeNull();
  });

  it('returns first matching set when multiple exist', () => {
    const routineItem = createRoutineItem();
    const liftingData = [
      createSetRecord({ id: '1', Date: todayISO }),
      createSetRecord({ id: '2', Date: todayISO }),
    ];

    const result = findMatchingSet(routineItem, liftingData, 'Test Workout');
    expect(result?.id).toBe('1');
  });
});

describe('isRoutineItemComplete', () => {
  const today = new Date();
  const todayISO = today.toISOString();

  it('returns true when matching set exists for today', () => {
    const routineItem = createRoutineItem();
    const liftingData = [createSetRecord({ Date: todayISO })];

    const result = isRoutineItemComplete(routineItem, liftingData, 'Test Workout');
    expect(result).toBe(true);
  });

  it('returns false when no matching set exists', () => {
    const routineItem = createRoutineItem();
    const liftingData: SetRecord[] = [];

    const result = isRoutineItemComplete(routineItem, liftingData, 'Test Workout');
    expect(result).toBe(false);
  });

  it('returns false when set is from different routine', () => {
    const routineItem = createRoutineItem();
    const liftingData = [createSetRecord({ Date: todayISO, Routine: 'Other' })];

    const result = isRoutineItemComplete(routineItem, liftingData, 'Test Workout');
    expect(result).toBe(false);
  });
});

describe('getLastCompletedRoutine', () => {
  it('returns null for empty data', () => {
    expect(getLastCompletedRoutine([])).toBeNull();
  });

  it('returns null when no sets have a routine', () => {
    const liftingData = [
      createSetRecord({ Routine: undefined }),
      createSetRecord({ Routine: '' }),
    ];
    expect(getLastCompletedRoutine(liftingData)).toBeNull();
  });

  it('returns most recent routine with total weight', () => {
    const today = new Date();
    const liftingData = [
      createSetRecord({ Date: today.toISOString(), Routine: 'Test', TotalWeight: 500 }),
      createSetRecord({ Date: today.toISOString(), Routine: 'Test', TotalWeight: 400 }),
    ];

    const result = getLastCompletedRoutine(liftingData);
    expect(result).not.toBeNull();
    expect(result?.routine).toBe('Test');
    expect(result?.totalWeight).toBe(900);
  });

  it('returns most recent date when multiple routines exist', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const liftingData = [
      createSetRecord({ Date: yesterday.toISOString(), Routine: 'Old Workout', TotalWeight: 1000 }),
      createSetRecord({ Date: today.toISOString(), Routine: 'New Workout', TotalWeight: 500 }),
    ];

    const result = getLastCompletedRoutine(liftingData);
    expect(result?.routine).toBe('New Workout');
  });

  it('sums total weight only for sets from same routine and date', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const liftingData = [
      createSetRecord({ Date: today.toISOString(), Routine: 'Workout A', TotalWeight: 100 }),
      createSetRecord({ Date: today.toISOString(), Routine: 'Workout A', TotalWeight: 200 }),
      createSetRecord({ Date: today.toISOString(), Routine: 'Workout B', TotalWeight: 500 }),
      createSetRecord({ Date: yesterday.toISOString(), Routine: 'Workout A', TotalWeight: 1000 }),
    ];

    const result = getLastCompletedRoutine(liftingData);
    // Should return Workout A (most recent) with only today's sets
    expect(result?.routine).toBe('Workout A');
    expect(result?.totalWeight).toBe(300);
  });

  it('handles string TotalWeight values', () => {
    const today = new Date();
    const liftingData = [
      createSetRecord({ Date: today.toISOString(), TotalWeight: '500' as unknown as number }),
      createSetRecord({ Date: today.toISOString(), TotalWeight: '300' as unknown as number }),
    ];

    const result = getLastCompletedRoutine(liftingData);
    expect(result?.totalWeight).toBe(800);
  });
});
