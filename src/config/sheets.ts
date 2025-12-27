export interface SheetConfig {
  columns: string[];
}

export const REQUIRED_SHEETS: Record<string, SheetConfig> = {
  exercises: {
    columns: ['id', 'Exercise', '100pct', '90pct', '80pct', '70pct', '60pct', 'Warmup', 'LastUpdated']
  },
  routines: {
    columns: ['id', 'Routine', 'Exercise', 'Percentage', 'Reps']
  },
  sets: {
    columns: ['id', 'Date', 'Routine', 'Exercise', 'Percentage', 'Weight', 'Reps', 'Notes', 'TotalWeight']
  },
  weight: {
    columns: ['id', 'Date', 'Weight']
  }
};
