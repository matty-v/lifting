import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import { ProgressChart } from '@/components/charts';
import { Send } from '@/components/icons';
import { PERCENTAGE_OPTIONS } from '@/config';
import { formatPercentage, normalizePercentage, getWeightRecommendation, isRoutineItemComplete, getLastCompletedRoutine, formatDateWithYear } from '@/utils';
import type { SetRecord } from '@/types';

export function TrackLiftTab() {
  const {
    exercises,
    liftingData,
    selectedRoutine,
    setSelectedRoutine,
    formData,
    setFormData,
    progressView,
    setProgressView,
    submitSet,
    getUniqueRoutines,
    getRoutineExercises,
    status,
    loading,
    fetchLiftingData,
  } = useApp();

  const uniqueRoutines = getUniqueRoutines();
  const routineExercises = getRoutineExercises();
  const selectedExercise = exercises.find((e) => e.Exercise === formData.exercise);
  const weightRec = getWeightRecommendation(selectedExercise, formData.percentage);

  // Get filtered data for chart
  const getFilteredData = (): SetRecord[] => {
    if (!formData.exercise) return [];
    let filtered = liftingData.filter((d) => d.Exercise === formData.exercise);
    if (formData.percentage) {
      const normalizedFormPct = normalizePercentage(formData.percentage);
      filtered = filtered.filter((d) => normalizePercentage(d.Percentage) === normalizedFormPct);
    }
    return filtered;
  };

  const filteredData = getFilteredData();
  const lastCompletedRoutine = getLastCompletedRoutine(liftingData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSet();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Routine</label>
          <select
            value={selectedRoutine}
            onChange={(e) => setSelectedRoutine(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground"
          >
            <option value="">No Routine</option>
            {uniqueRoutines.map((routine) => (
              <option key={routine} value={routine}>
                {routine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Exercise *</label>
          <select
            value={formData.exercise}
            onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground"
          >
            <option value="">Select Exercise</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.Exercise}>
                {ex.Exercise}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">% *</label>
            <select
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground"
            >
              <option value="">%</option>
              {PERCENTAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Weight *</label>
            <input
              type="number"
              step="0.5"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground placeholder:text-muted-foreground"
              placeholder="135"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Reps *</label>
            <input
              type="number"
              value={formData.reps}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground placeholder:text-muted-foreground"
              placeholder="5"
            />
          </div>
        </div>

        {weightRec.current && (
          <div className="p-3 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded-lg">
            <p className="text-sm text-[var(--accent-cyan)]">
              <span className="font-medium">Current:</span> {weightRec.current} lbs
              <span className="mx-2">|</span>
              <span className="font-medium">Try:</span> {weightRec.recommended} lbs
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
            placeholder="Optional notes..."
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-4 btn-primary rounded-xl flex items-center justify-center gap-2 text-lg"
        >
          <Send size={20} />
          Log Set
        </button>
      </form>

      <StatusMessage status={status} />

      {/* Progress Section */}
      {formData.exercise && filteredData.length > 0 && (
        <div className="p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">{formData.exercise} Progress</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setProgressView('chart')}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  progressView === 'chart' ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20' : 'bg-secondary text-muted-foreground'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setProgressView('table')}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  progressView === 'table' ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20' : 'bg-secondary text-muted-foreground'
                }`}
              >
                Table
              </button>
              <button
                onClick={fetchLiftingData}
                disabled={loading}
                className="px-3 py-1 bg-secondary text-muted-foreground rounded text-xs hover:text-foreground transition-colors"
              >
                {loading ? '...' : 'Refresh'}
              </button>
            </div>
          </div>
          {progressView === 'chart' ? (
            <ProgressChart data={filteredData} exercise={formData.exercise} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Date</th>
                    <th className="text-left py-2 text-muted-foreground">Weight</th>
                    <th className="text-left py-2 text-muted-foreground">%</th>
                    <th className="text-left py-2 text-muted-foreground">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(-10).reverse().map((record) => (
                    <tr key={record.id} className="border-b border-border">
                      <td className="py-2">{record.Date}</td>
                      <td className="py-2">{record.Weight}</td>
                      <td className="py-2">{formatPercentage(record.Percentage)}</td>
                      <td className="py-2">{record.Reps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Last Completed Routine */}
      {lastCompletedRoutine && (
        <div className="p-4 bg-secondary rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            Last: <span className="font-medium text-foreground">{lastCompletedRoutine.routine}</span>
            <span className="mx-2">•</span>
            {formatDateWithYear(lastCompletedRoutine.date)}
            <span className="mx-2">•</span>
            {lastCompletedRoutine.totalWeight.toLocaleString()} lbs total
          </p>
        </div>
      )}

      {/* Routine Checklist */}
      {selectedRoutine && routineExercises.length > 0 && (
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">{selectedRoutine} Checklist</h3>
          <div className="space-y-2">
            {routineExercises.map((item) => {
              const isComplete = isRoutineItemComplete(item, liftingData, selectedRoutine);
              const exercise = exercises.find((e) => e.Exercise === item.Exercise);
              const rec = getWeightRecommendation(exercise, item.Percentage);
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg flex justify-between items-center ${
                    isComplete ? 'bg-[#00ff88]/10 border border-[#00ff88]/20' : 'bg-secondary'
                  }`}
                >
                  <div>
                    <span className={`text-sm ${isComplete ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                      {item.Exercise}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatPercentage(item.Percentage)} × {item.Reps}
                    </span>
                  </div>
                  {!isComplete && rec.current && (
                    <span className="text-xs text-[var(--accent-cyan)] font-medium">
                      {rec.current} lbs
                    </span>
                  )}
                  {isComplete && <span className="text-[#00ff88]">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
