import { useApp } from '@/context';
import { StatusMessage } from '@/components/ui';
import { SERVICE_ACCOUNT_EMAIL } from '@/config';

export function SettingsTab() {
  const {
    spreadsheetId,
    setSpreadsheetId,
    editingSettings,
    setEditingSettings,
    tempSpreadsheetId,
    setTempSpreadsheetId,
    initializing,
    status,
    setStatus,
    initializeSheets,
    fetchExercises,
    fetchRoutines,
    fetchLiftingData,
    fetchWeightHistory,
  } = useApp();

  const handleSaveAndInitialize = async () => {
    if (!tempSpreadsheetId) {
      setStatus('⚠️ Please enter a Sheet ID');
      return;
    }
    setSpreadsheetId(tempSpreadsheetId);
    setEditingSettings(false);
    setTempSpreadsheetId('');
    await initializeSheets();
    fetchExercises();
    fetchRoutines();
    fetchLiftingData();
    fetchWeightHistory();
  };

  return (
    <div className="space-y-6">
      {editingSettings ? (
        <>
          <p className="text-sm text-gray-800 font-medium">Change Spreadsheet</p>
          <p className="text-xs text-gray-500">
            Make sure to share the new spreadsheet with:
            <br />
            <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all select-all">
              {SERVICE_ACCOUNT_EMAIL}
            </code>
          </p>
          <div>
            <input
              type="text"
              value={tempSpreadsheetId}
              onChange={(e) => setTempSpreadsheetId(e.target.value)}
              placeholder="Paste your Google Sheet ID here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingSettings(false);
                setTempSpreadsheetId('');
              }}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndInitialize}
              disabled={initializing || !tempSpreadsheetId}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initializing ? 'Initializing...' : 'Save & Initialize'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">✓ Connected</p>
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 hover:text-green-900 underline break-all"
            >
              Open Spreadsheet
            </a>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempSpreadsheetId(spreadsheetId);
              setEditingSettings(true);
            }}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Change Spreadsheet
          </button>
        </>
      )}

      <StatusMessage status={status} />
    </div>
  );
}
