import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import type { Exercise } from '@/types';

export function ExercisesTab() {
  const {
    exercises,
    editingExercise,
    setEditingExercise,
    exerciseForm,
    setExerciseForm,
    isAddingExercise,
    setIsAddingExercise,
    saveExercise,
    deleteExercise,
    status,
  } = useApp();

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.Exercise,
      pct100: String(exercise['100pct'] || ''),
      pct90: String(exercise['90pct'] || ''),
      pct80: String(exercise['80pct'] || ''),
      pct70: String(exercise['70pct'] || ''),
      pct60: String(exercise['60pct'] || ''),
      warmup: String(exercise.Warmup || ''),
    });
    setIsAddingExercise(false);
  };

  const handleCancel = () => {
    setEditingExercise(null);
    setIsAddingExercise(false);
    setExerciseForm({
      name: '',
      pct100: '',
      pct90: '',
      pct80: '',
      pct70: '',
      pct60: '',
      warmup: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Add/Edit Form */}
      {(isAddingExercise || editingExercise) && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">
            {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Exercise name"
              value={exerciseForm.name}
              onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">100%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct100}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct100: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">90%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct90}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct90: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">80%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct80}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct80: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">70%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct70}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct70: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">60%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct60}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct60: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Warmup</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.warmup}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, warmup: e.target.value })}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveExercise}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAddingExercise && !editingExercise && (
        <button
          type="button"
          onClick={() => setIsAddingExercise(true)}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          + Add Exercise
        </button>
      )}

      {/* Exercise List */}
      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800">{exercise.Exercise}</p>
              <p className="text-xs text-gray-500">
                100%: {exercise['100pct'] || '-'} | 90%: {exercise['90pct'] || '-'} | 80%:{' '}
                {exercise['80pct'] || '-'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEditExercise(exercise)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteExercise(exercise, index)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && !isAddingExercise && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">No exercises yet. Add your first exercise above!</p>
        </div>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
