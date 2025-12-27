import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import { WeightChart } from '@/components/charts';

export function WeightTab() {
  const { bodyWeight, setBodyWeight, weightHistory, saveWeight, status } = useApp();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">Log Body Weight</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              placeholder="199.9"
            />
          </div>
          <button
            type="button"
            onClick={saveWeight}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Record Weight
          </button>
        </div>
      </div>

      {/* Weight History Chart */}
      {weightHistory.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Weight History</h3>
          <WeightChart data={weightHistory} />
        </div>
      )}

      {weightHistory.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            No weight history yet. Record your first weight above!
          </p>
        </div>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
