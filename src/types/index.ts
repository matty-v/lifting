export interface Exercise {
  id: string;
  Exercise: string;
  '100pct': number | string;
  '90pct': number | string;
  '80pct': number | string;
  '70pct': number | string;
  '60pct': number | string;
  Warmup: number | string;
  LastUpdated?: string;
}

export interface RoutineItem {
  id: string;
  Routine: string;
  Exercise: string;
  Percentage: string | number;
  Reps: number | string;
}

export interface SetRecord {
  id: string;
  Date: string;
  Routine?: string;
  Exercise: string;
  Percentage: string | number;
  Weight: number;
  Reps: number;
  Notes?: string;
  TotalWeight: number;
}

export interface WeightRecord {
  id: string;
  Date: string;
  Weight: number;
}

export interface SheetInfo {
  title: string;
  index: number;
}

export interface ExerciseFormData {
  name: string;
  pct100: string;
  pct90: string;
  pct80: string;
  pct70: string;
  pct60: string;
  warmup: string;
}

export interface RoutineFormData {
  routine: string;
  exercise: string;
  percentage: string;
  reps: string;
}

export interface SetFormData {
  exercise: string;
  weight: string;
  percentage: string;
  reps: string;
  notes: string;
}

export type TabType = 'track' | 'exercises' | 'routines' | 'weight' | 'settings';
