import { useApp } from '@/context';
import { SERVICE_ACCOUNT_EMAIL } from '@/config';

export function SetupWizard() {
  const {
    setupInputId,
    setSetupInputId,
    setSpreadsheetId,
    initializing,
    initializeSheets,
    fetchExercises,
    fetchRoutines,
    fetchLiftingData,
    fetchWeightHistory,
    setStatus,
  } = useApp();

  const handleConnect = async () => {
    if (!setupInputId) {
      setStatus('⚠️ Please enter a Sheet ID');
      return;
    }
    setSpreadsheetId(setupInputId);
    setSetupInputId('');
    await initializeSheets();
    fetchExercises();
    fetchRoutines();
    fetchLiftingData();
    fetchWeightHistory();
  };

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-sm text-amber-800 font-medium mb-3">⚙️ Setup Required</p>
      <ol className="list-decimal list-inside space-y-2 text-xs text-amber-700">
        <li>Create a new Google Sheet</li>
        <li>
          Share it with:
          <br />
          <code className="block mt-1 p-2 bg-amber-100 rounded text-xs break-all select-all text-amber-800">
            {SERVICE_ACCOUNT_EMAIL}
          </code>
          <span className="text-amber-600">(Editor access)</span>
        </li>
        <li>Copy the Sheet ID from the URL</li>
        <li>Paste below and click "Connect"</li>
      </ol>
      <div className="mt-4">
        <input
          type="text"
          value={setupInputId}
          onChange={(e) => setSetupInputId(e.target.value)}
          placeholder="Paste your Google Sheet ID here"
          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleConnect}
          disabled={!setupInputId || initializing}
          className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initializing ? 'Initializing...' : 'Connect'}
        </button>
      </div>
    </div>
  );
}
