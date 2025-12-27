import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import { PERCENTAGE_OPTIONS } from '@/config';
import { formatPercentage } from '@/utils';
import type { RoutineItem } from '@/types';

export function RoutinesTab() {
  const {
    exercises,
    routines,
    editingRoutineItem,
    setEditingRoutineItem,
    routineForm,
    setRoutineForm,
    isAddingRoutineItem,
    setIsAddingRoutineItem,
    showRoutineSuggestions,
    setShowRoutineSuggestions,
    saveRoutineItem,
    deleteRoutineItem,
    getUniqueRoutines,
    status,
  } = useApp();

  const uniqueRoutines = getUniqueRoutines();

  const handleEditRoutineItem = (item: RoutineItem) => {
    setEditingRoutineItem(item);
    setRoutineForm({
      routine: item.Routine,
      exercise: item.Exercise,
      percentage: String(item.Percentage || ''),
      reps: String(item.Reps || ''),
    });
    setIsAddingRoutineItem(false);
  };

  const handleCancel = () => {
    setEditingRoutineItem(null);
    setIsAddingRoutineItem(false);
    setRoutineForm({
      routine: '',
      exercise: '',
      percentage: '',
      reps: '',
    });
  };

  const filteredRoutines = routineForm.routine
    ? routines.filter((r) => r.Routine === routineForm.routine)
    : [];

  return (
    <div className="space-y-4">
      {/* Add/Edit Form */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">
          {editingRoutineItem ? 'Edit Routine Item' : 'Add to Routine'}
        </h3>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Routine name"
              value={routineForm.routine}
              onChange={(e) => {
                setRoutineForm({ ...routineForm, routine: e.target.value });
                setShowRoutineSuggestions(true);
              }}
              onFocus={() => setShowRoutineSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRoutineSuggestions(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            {showRoutineSuggestions && uniqueRoutines.length > 0 && routineForm.routine && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                {uniqueRoutines
                  .filter((r) => r.toLowerCase().includes(routineForm.routine.toLowerCase()))
                  .map((routine) => (
                    <button
                      key={routine}
                      type="button"
                      onClick={() => {
                        setRoutineForm({ ...routineForm, routine });
                        setShowRoutineSuggestions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {routine}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <select
            value={routineForm.exercise}
            onChange={(e) => setRoutineForm({ ...routineForm, exercise: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">Select Exercise</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.Exercise}>
                {ex.Exercise}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={routineForm.percentage}
              onChange={(e) => setRoutineForm({ ...routineForm, percentage: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">Percentage</option>
              {PERCENTAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Reps"
              value={routineForm.reps}
              onChange={(e) => setRoutineForm({ ...routineForm, reps: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2">
            {(isAddingRoutineItem || editingRoutineItem) && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={saveRoutineItem}
              className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
            >
              {editingRoutineItem ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Current Routine Exercises */}
      {routineForm.routine && filteredRoutines.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">
            Exercises in "{routineForm.routine}"
          </h4>
          <div className="space-y-2">
            {filteredRoutines.map((item) => {
              const actualIndex = routines.findIndex((r) => r.id === item.id);
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div>
                    <span className="text-sm font-medium">{item.Exercise}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatPercentage(item.Percentage)} × {item.Reps || '?'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditRoutineItem(item)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRoutineItem(item, actualIndex)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
