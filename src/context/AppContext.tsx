import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SheetsDbClient, SheetsDbError } from '@/services/sheetsdb';
import { API_BASE_URL, LOCAL_STORAGE_KEYS, REQUIRED_SHEETS } from '@/config';
import type {
  Exercise,
  RoutineItem,
  SetRecord,
  WeightRecord,
  TabType,
  ExerciseFormData,
  RoutineFormData,
  SetFormData,
} from '@/types';
import { formatDateForStorage } from '@/utils';
import { normalizePercentage } from '@/utils/percentage';

interface AppContextValue {
  // Connection state
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;

  // Data
  exercises: Exercise[];
  routines: RoutineItem[];
  liftingData: SetRecord[];
  weightHistory: WeightRecord[];

  // UI state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  loading: boolean;
  status: string;
  setStatus: (status: string) => void;
  initializing: boolean;

  // Track tab state
  selectedRoutine: string;
  setSelectedRoutine: (routine: string) => void;
  formData: SetFormData;
  setFormData: (data: SetFormData) => void;
  progressView: 'chart' | 'table';
  setProgressView: (view: 'chart' | 'table') => void;

  // Exercise tab state
  editingExercise: Exercise | null;
  setEditingExercise: (exercise: Exercise | null) => void;
  exerciseForm: ExerciseFormData;
  setExerciseForm: (form: ExerciseFormData) => void;
  isAddingExercise: boolean;
  setIsAddingExercise: (adding: boolean) => void;

  // Routine tab state
  editingRoutineItem: RoutineItem | null;
  setEditingRoutineItem: (item: RoutineItem | null) => void;
  routineForm: RoutineFormData;
  setRoutineForm: (form: RoutineFormData) => void;
  isAddingRoutineItem: boolean;
  setIsAddingRoutineItem: (adding: boolean) => void;
  showRoutineSuggestions: boolean;
  setShowRoutineSuggestions: (show: boolean) => void;

  // Weight tab state
  bodyWeight: string;
  setBodyWeight: (weight: string) => void;

  // Settings tab state
  editingSettings: boolean;
  setEditingSettings: (editing: boolean) => void;
  tempSpreadsheetId: string;
  setTempSpreadsheetId: (id: string) => void;
  setupInputId: string;
  setSetupInputId: (id: string) => void;

  // Data operations
  fetchExercises: () => Promise<void>;
  fetchRoutines: () => Promise<void>;
  fetchLiftingData: () => Promise<void>;
  fetchWeightHistory: () => Promise<void>;
  initializeSheets: () => Promise<{ success: boolean; created: string[] }>;

  // CRUD operations
  saveExercise: () => Promise<void>;
  deleteExercise: (exercise: Exercise, index: number) => Promise<void>;
  saveRoutineItem: () => Promise<void>;
  deleteRoutineItem: (item: RoutineItem, index: number) => Promise<void>;
  submitSet: () => Promise<void>;
  saveWeight: () => Promise<void>;

  // Helpers
  createClient: () => SheetsDbClient | null;
  getUniqueRoutines: () => string[];
  getRoutineExercises: () => RoutineItem[];
}

const defaultExerciseForm: ExerciseFormData = {
  name: '',
  pct100: '',
  pct90: '',
  pct80: '',
  pct70: '',
  pct60: '',
  warmup: '',
};

const defaultRoutineForm: RoutineFormData = {
  routine: '',
  exercise: '',
  percentage: '',
  reps: '',
};

const defaultSetForm: SetFormData = {
  exercise: '',
  weight: '',
  percentage: '',
  reps: '',
  notes: '',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Connection state
  const [spreadsheetId, setSpreadsheetIdState] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.SPREADSHEET_ID) || ''
  );

  // Data state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [liftingData, setLiftingData] = useState<SetRecord[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>(spreadsheetId ? 'track' : 'settings');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [initializing, setInitializing] = useState(false);

  // Track tab state
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [formData, setFormData] = useState<SetFormData>(defaultSetForm);
  const [progressView, setProgressView] = useState<'chart' | 'table'>('chart');

  // Exercise tab state
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState<ExerciseFormData>(defaultExerciseForm);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  // Routine tab state
  const [editingRoutineItem, setEditingRoutineItem] = useState<RoutineItem | null>(null);
  const [routineForm, setRoutineForm] = useState<RoutineFormData>(defaultRoutineForm);
  const [isAddingRoutineItem, setIsAddingRoutineItem] = useState(false);
  const [showRoutineSuggestions, setShowRoutineSuggestions] = useState(false);

  // Weight tab state
  const [bodyWeight, setBodyWeight] = useState('');

  // Settings tab state
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSpreadsheetId, setTempSpreadsheetId] = useState('');
  const [setupInputId, setSetupInputId] = useState('');

  const setSpreadsheetId = useCallback((id: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SPREADSHEET_ID, id);
    setSpreadsheetIdState(id);
  }, []);

  const createClient = useCallback(() => {
    if (!spreadsheetId) return null;
    return new SheetsDbClient({ baseUrl: API_BASE_URL, spreadsheetId });
  }, [spreadsheetId]);

  const fetchExercises = useCallback(async () => {
    const client = createClient();
    if (!client) return;

    try {
      const rows = await client.getRows<Exercise>('exercises');
      setExercises(rows);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  }, [createClient]);

  const fetchRoutines = useCallback(async () => {
    const client = createClient();
    if (!client) return;

    try {
      const rows = await client.getRows<RoutineItem>('routines');
      setRoutines(rows);
    } catch (error) {
      console.error('Error fetching routines:', error);
    }
  }, [createClient]);

  const fetchLiftingData = useCallback(async () => {
    const client = createClient();
    if (!client) return;

    setLoading(true);
    try {
      const rows = await client.getRows<SetRecord>('sets');
      setLiftingData(rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, [createClient]);

  const fetchWeightHistory = useCallback(async () => {
    const client = createClient();
    if (!client) return;

    try {
      const rows = await client.getRows<WeightRecord>('weight');
      const sorted = [...rows].sort(
        (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
      );
      setWeightHistory(sorted);
    } catch (error) {
      console.error('Error fetching weight history:', error);
      setWeightHistory([]);
    }
  }, [createClient]);

  const initializeSheets = useCallback(async () => {
    const client = createClient();
    if (!client) return { success: false, created: [] };

    setInitializing(true);
    try {
      const existingSheets = await client.listSheets();
      const existingNames = existingSheets.map(s => s.title);

      const missingSheets = Object.keys(REQUIRED_SHEETS).filter(
        name => !existingNames.includes(name)
      );

      if (missingSheets.length === 0) {
        setInitializing(false);
        return { success: true, created: [] };
      }

      setStatus(`📝 Creating ${missingSheets.length} missing sheet(s)...`);

      for (const sheetName of missingSheets) {
        await client.createSheet(sheetName);
        const placeholderRow: Record<string, string> = {};
        REQUIRED_SHEETS[sheetName].columns.forEach(col => {
          placeholderRow[col] = col === 'id' ? 'placeholder' : '';
        });
        await client.createRow(sheetName, placeholderRow);
        await client.deleteRow(sheetName, 2);
      }

      setStatus(`✓ Created sheets: ${missingSheets.join(', ')}`);
      setTimeout(() => setStatus(''), 3000);
      setInitializing(false);
      return { success: true, created: missingSheets };
    } catch (error) {
      console.error('Error initializing sheets:', error);
      const message = error instanceof SheetsDbError ? error.message : 'Unknown error';
      setStatus(`❌ Error creating sheets: ${message}`);
      setInitializing(false);
      return { success: false, created: [] };
    }
  }, [createClient]);

  const saveExercise = useCallback(async () => {
    const client = createClient();
    if (!client) {
      setStatus('⚠️ Please configure your API settings first');
      return;
    }

    if (!exerciseForm.name) {
      setStatus('⚠️ Please enter an exercise name');
      return;
    }

    setStatus('📤 Saving...');
    try {
      const exerciseData = {
        id: editingExercise?.id || crypto.randomUUID(),
        Exercise: exerciseForm.name,
        '100pct': exerciseForm.pct100 ? parseFloat(exerciseForm.pct100) : '',
        '90pct': exerciseForm.pct90 ? parseFloat(exerciseForm.pct90) : '',
        '80pct': exerciseForm.pct80 ? parseFloat(exerciseForm.pct80) : '',
        '70pct': exerciseForm.pct70 ? parseFloat(exerciseForm.pct70) : '',
        '60pct': exerciseForm.pct60 ? parseFloat(exerciseForm.pct60) : '',
        Warmup: exerciseForm.warmup ? parseFloat(exerciseForm.warmup) : '',
        LastUpdated: new Date().toISOString(),
      };

      if (editingExercise) {
        const index = exercises.findIndex(e => e.id === editingExercise.id);
        if (index !== -1) {
          await client.updateRow('exercises', index + 2, exerciseData);
        }
      } else {
        await client.createRow('exercises', exerciseData);
      }

      setStatus('✓ Exercise saved!');
      setExerciseForm(defaultExerciseForm);
      setEditingExercise(null);
      setIsAddingExercise(false);
      await fetchExercises();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error saving exercise';
      setStatus(`❌ ${message}`);
      console.error('Save exercise error:', error);
    }
  }, [createClient, exerciseForm, editingExercise, exercises, fetchExercises]);

  const deleteExercise = useCallback(async (exercise: Exercise, index: number) => {
    const client = createClient();
    if (!client) return;

    if (!confirm(`Delete ${exercise.Exercise}?`)) return;

    setStatus('🗑️ Deleting...');
    try {
      await client.deleteRow('exercises', index + 2);
      setStatus('✓ Exercise deleted!');
      await fetchExercises();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error deleting exercise';
      setStatus(`❌ ${message}`);
      console.error('Delete exercise error:', error);
    }
  }, [createClient, fetchExercises]);

  const saveRoutineItem = useCallback(async () => {
    const client = createClient();
    if (!client) {
      setStatus('⚠️ Please configure your API settings first');
      return;
    }

    if (!routineForm.routine || !routineForm.exercise) {
      setStatus('⚠️ Please fill in all required fields');
      return;
    }

    setStatus('📤 Saving...');
    try {
      const routineData = {
        id: editingRoutineItem?.id || crypto.randomUUID(),
        Routine: routineForm.routine,
        Exercise: routineForm.exercise,
        Percentage: routineForm.percentage || '',
        Reps: routineForm.reps ? parseInt(routineForm.reps) : '',
      };

      if (editingRoutineItem) {
        const index = routines.findIndex(r => r.id === editingRoutineItem.id);
        if (index !== -1) {
          await client.updateRow('routines', index + 2, routineData);
        }
      } else {
        await client.createRow('routines', routineData);
      }

      setStatus('✓ Routine item saved!');
      const savedRoutineName = routineForm.routine;
      setRoutineForm({ ...defaultRoutineForm, routine: savedRoutineName });
      setEditingRoutineItem(null);
      await fetchRoutines();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error saving routine';
      setStatus(`❌ ${message}`);
      console.error('Save routine error:', error);
    }
  }, [createClient, routineForm, editingRoutineItem, routines, fetchRoutines]);

  const deleteRoutineItem = useCallback(async (item: RoutineItem, index: number) => {
    const client = createClient();
    if (!client) return;

    if (!confirm(`Delete ${item.Exercise} from ${item.Routine}?`)) return;

    setStatus('🗑️ Deleting...');
    try {
      await client.deleteRow('routines', index + 2);
      setStatus('✓ Routine item deleted!');
      await fetchRoutines();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error deleting routine';
      setStatus(`❌ ${message}`);
      console.error('Delete routine error:', error);
    }
  }, [createClient, fetchRoutines]);

  const submitSet = useCallback(async () => {
    const client = createClient();
    if (!client) {
      setStatus('⚠️ Please configure your API settings first');
      return;
    }

    if (!formData.exercise || !formData.weight || !formData.percentage || !formData.reps) {
      setStatus('⚠️ Please fill in all required fields');
      return;
    }

    setStatus('📤 Saving...');
    try {
      const weight = parseFloat(formData.weight);
      const reps = parseInt(formData.reps);
      const totalWeight = weight * reps;

      const setData = {
        id: crypto.randomUUID(),
        Date: formatDateForStorage(),
        Routine: selectedRoutine || '',
        Exercise: formData.exercise,
        Percentage: formData.percentage,
        Weight: weight,
        Reps: reps,
        Notes: formData.notes,
        TotalWeight: totalWeight,
      };

      await client.createRow('sets', setData);

      // Check if this is a new max for the percentage
      const exercise = exercises.find(e => e.Exercise === formData.exercise);
      if (exercise) {
        const normalizedPct = normalizePercentage(formData.percentage);
        if (normalizedPct !== null && normalizedPct !== 'warmup') {
          const columnKey = `${normalizedPct}pct` as keyof Exercise;
          const currentMax = parseFloat(String(exercise[columnKey] || 0));
          if (weight > currentMax) {
            const updatedExercise = {
              ...exercise,
              [columnKey]: weight,
              LastUpdated: new Date().toISOString(),
            };
            const exerciseIndex = exercises.findIndex(e => e.id === exercise.id);
            if (exerciseIndex !== -1) {
              await client.updateRow('exercises', exerciseIndex + 2, updatedExercise);
              await fetchExercises();
            }
          }
        }
      }

      setStatus('✓ Set logged!');
      const savedExercise = formData.exercise;
      setFormData({ ...defaultSetForm, exercise: savedExercise });
      await fetchLiftingData();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error saving set';
      setStatus(`❌ ${message}`);
      console.error('Submit set error:', error);
    }
  }, [createClient, formData, selectedRoutine, exercises, fetchExercises, fetchLiftingData]);

  const saveWeight = useCallback(async () => {
    const client = createClient();
    if (!client) {
      setStatus('⚠️ Please configure your API settings first');
      return;
    }

    if (!bodyWeight) {
      setStatus('⚠️ Please enter a weight');
      return;
    }

    setStatus('📤 Saving...');
    try {
      const weightData = {
        id: crypto.randomUUID(),
        Date: formatDateForStorage(),
        Weight: parseFloat(bodyWeight),
      };

      await client.createRow('weight', weightData);
      setStatus('✓ Weight recorded!');
      setBodyWeight('');
      await fetchWeightHistory();
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      const message = error instanceof SheetsDbError ? error.message : 'Error saving weight';
      setStatus(`❌ ${message}`);
      console.error('Save weight error:', error);
    }
  }, [createClient, bodyWeight, fetchWeightHistory]);

  const getUniqueRoutines = useCallback(() => {
    const unique = [...new Set(routines.map(r => r.Routine))];
    return unique.sort();
  }, [routines]);

  const getRoutineExercises = useCallback(() => {
    if (!selectedRoutine) return [];
    return routines.filter(r => r.Routine === selectedRoutine);
  }, [routines, selectedRoutine]);

  const value: AppContextValue = {
    spreadsheetId,
    setSpreadsheetId,
    exercises,
    routines,
    liftingData,
    weightHistory,
    activeTab,
    setActiveTab,
    loading,
    status,
    setStatus,
    initializing,
    selectedRoutine,
    setSelectedRoutine,
    formData,
    setFormData,
    progressView,
    setProgressView,
    editingExercise,
    setEditingExercise,
    exerciseForm,
    setExerciseForm,
    isAddingExercise,
    setIsAddingExercise,
    editingRoutineItem,
    setEditingRoutineItem,
    routineForm,
    setRoutineForm,
    isAddingRoutineItem,
    setIsAddingRoutineItem,
    showRoutineSuggestions,
    setShowRoutineSuggestions,
    bodyWeight,
    setBodyWeight,
    editingSettings,
    setEditingSettings,
    tempSpreadsheetId,
    setTempSpreadsheetId,
    setupInputId,
    setSetupInputId,
    fetchExercises,
    fetchRoutines,
    fetchLiftingData,
    fetchWeightHistory,
    initializeSheets,
    saveExercise,
    deleteExercise,
    saveRoutineItem,
    deleteRoutineItem,
    submitSet,
    saveWeight,
    createClient,
    getUniqueRoutines,
    getRoutineExercises,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
