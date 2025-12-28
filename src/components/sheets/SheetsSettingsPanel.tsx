import type { SheetsSettingsPanelProps } from './types';

/**
 * Generic settings panel component for managing Google Sheet connection.
 *
 * This component provides:
 * - Display of current connection status
 * - Link to open the connected spreadsheet
 * - Ability to change the connected spreadsheet
 *
 * @example
 * ```tsx
 * <SheetsSettingsPanel
 *   serviceAccountEmail="your-service@project.iam.gserviceaccount.com"
 *   spreadsheetId={sheetId}
 *   isEditing={editing}
 *   onEditingChange={setEditing}
 *   tempInputValue={tempId}
 *   onTempInputChange={setTempId}
 *   onSave={handleSave}
 *   isSaving={loading}
 *   status={statusMessage}
 * />
 * ```
 */
export function SheetsSettingsPanel({
  serviceAccountEmail,
  spreadsheetId,
  isEditing,
  onEditingChange,
  tempInputValue,
  onTempInputChange,
  onSave,
  isSaving = false,
  saveButtonText = 'Save & Initialize',
  savingButtonText = 'Initializing...',
  inputPlaceholder = 'Paste your Google Sheet ID here',
  connectedText = 'Connected',
  changeButtonText = 'Change Spreadsheet',
  status,
}: SheetsSettingsPanelProps) {
  const handleSave = async () => {
    await onSave();
  };

  const handleCancel = () => {
    onEditingChange(false);
    onTempInputChange('');
  };

  const handleStartEditing = () => {
    onTempInputChange(spreadsheetId);
    onEditingChange(true);
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <>
          <p className="text-sm text-gray-800 font-medium">Change Spreadsheet</p>
          <p className="text-xs text-gray-500">
            Make sure to share the new spreadsheet with:
            <br />
            <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all select-all">
              {serviceAccountEmail}
            </code>
          </p>
          <div>
            <input
              type="text"
              value={tempInputValue}
              onChange={(e) => onTempInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !tempInputValue}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? savingButtonText : saveButtonText}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">✓ {connectedText}</p>
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
            onClick={handleStartEditing}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {changeButtonText}
          </button>
        </>
      )}

      {status && <StatusMessage status={status} />}
    </div>
  );
}

/**
 * Simple status message component for displaying success/error/warning messages.
 */
function StatusMessage({ status }: { status: string }) {
  if (!status) return null;

  const isError = status.includes('⚠️') || status.includes('❌') || status.toLowerCase().includes('error');
  const isSuccess = status.includes('✓') || status.includes('✔');

  const bgColor = isError
    ? 'bg-red-50 text-red-800'
    : isSuccess
      ? 'bg-green-50 text-green-800'
      : 'bg-blue-50 text-blue-800';

  return (
    <div className={`p-3 rounded-lg text-sm font-medium ${bgColor}`}>
      {status}
    </div>
  );
}
