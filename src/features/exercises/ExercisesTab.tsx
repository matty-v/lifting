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
        <div className="p-4 bg-secondary rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">
            {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Exercise name"
              value={exerciseForm.name}
              onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">100%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct100}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct100: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">90%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct90}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct90: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">80%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct80}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct80: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">70%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct70}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct70: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">60%</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.pct60}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, pct60: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Warmup</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.warmup}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, warmup: e.target.value })}
                  className="w-full px-2 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 btn-secondary rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveExercise}
                className="flex-1 px-3 py-2 btn-primary rounded-lg text-sm"
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
          className="w-full px-4 py-3 btn-primary rounded-lg text-sm"
        >
          + Add Exercise
        </button>
      )}

      {/* Exercise List */}
      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="p-3 bg-card rounded-lg border border-border flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-foreground">{exercise.Exercise}</p>
              <p className="text-xs text-muted-foreground">
                100%: {exercise['100pct'] || '-'} | 90%: {exercise['90pct'] || '-'} | 80%:{' '}
                {exercise['80pct'] || '-'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEditExercise(exercise)}
                className="px-3 py-1 bg-secondary text-foreground rounded text-xs hover:bg-[var(--accent-purple)]/20 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteExercise(exercise, index)}
                className="px-3 py-1 bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] rounded text-xs hover:bg-[var(--accent-pink)]/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && !isAddingExercise && (
        <div className="p-4 bg-secondary rounded-lg border border-border text-center">
          <p className="text-muted-foreground text-sm">No exercises yet. Add your first exercise above!</p>
        </div>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
