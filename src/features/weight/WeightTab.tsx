import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import { WeightChart } from '@/components/charts';

export function WeightTab() {
  const { bodyWeight, setBodyWeight, weightHistory, saveWeight, status } = useApp();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary rounded-lg border border-border">
        <h3 className="font-medium text-foreground mb-3">Log Body Weight</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg bg-secondary text-foreground placeholder:text-muted-foreground"
              placeholder="199.9"
            />
          </div>
          <button
            type="button"
            onClick={saveWeight}
            className="w-full px-4 py-3 btn-primary rounded-lg text-sm"
          >
            Record Weight
          </button>
        </div>
      </div>

      {/* Weight History Chart */}
      {weightHistory.length > 0 && (
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">Weight History</h3>
          <WeightChart data={weightHistory} />
        </div>
      )}

      {weightHistory.length === 0 && (
        <div className="p-4 bg-secondary rounded-lg border border-border text-center">
          <p className="text-muted-foreground text-sm">
            No weight history yet. Record your first weight above!
          </p>
        </div>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
