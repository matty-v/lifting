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
          <p className="text-sm text-foreground font-medium">Change Spreadsheet</p>
          <p className="text-xs text-muted-foreground">
            Make sure to share the new spreadsheet with:
            <br />
            <code className="block mt-1 p-2 bg-secondary rounded text-xs break-all select-all text-[var(--accent-cyan)]">
              {serviceAccountEmail}
            </code>
          </p>
          <div>
            <input
              type="text"
              value={tempInputValue}
              onChange={(e) => onTempInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 btn-secondary rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !tempInputValue}
              className="flex-1 px-4 py-3 btn-primary rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? savingButtonText : saveButtonText}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg">
            <p className="text-sm text-[#00ff88] font-medium mb-2">✓ {connectedText}</p>
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]/80 underline break-all"
            >
              Open Spreadsheet
            </a>
          </div>
          <button
            type="button"
            onClick={handleStartEditing}
            className="w-full px-4 py-3 btn-secondary rounded-lg text-sm"
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
    ? 'bg-[var(--accent-pink)]/10 text-[var(--accent-pink)]'
    : isSuccess
      ? 'bg-[#00ff88]/10 text-[#00ff88]'
      : 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]';

  return (
    <div className={`p-3 rounded-lg text-sm font-medium ${bgColor}`}>
      {status}
    </div>
  );
}
