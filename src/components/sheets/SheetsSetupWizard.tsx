import type { SheetsSetupWizardProps } from './types';

/**
 * Generic setup wizard component for connecting to a Google Sheet backend.
 *
 * This component provides a user-friendly interface for:
 * - Displaying instructions on how to create and share a Google Sheet
 * - Accepting a Sheet ID from the user
 * - Triggering a connection callback
 *
 * @example
 * ```tsx
 * <SheetsSetupWizard
 *   serviceAccountEmail="your-service@project.iam.gserviceaccount.com"
 *   inputValue={sheetId}
 *   onInputChange={setSheetId}
 *   onConnect={handleConnect}
 *   isConnecting={loading}
 * />
 * ```
 */
export function SheetsSetupWizard({
  serviceAccountEmail,
  inputValue,
  onInputChange,
  onConnect,
  isConnecting = false,
  title = 'Setup Required',
  connectButtonText = 'Connect',
  connectingButtonText = 'Initializing...',
  inputPlaceholder = 'Paste your Google Sheet ID here',
  additionalInstructions,
}: SheetsSetupWizardProps) {
  const handleConnect = async () => {
    await onConnect();
  };

  return (
    <div className="mb-6 p-4 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 rounded-lg">
      <p className="text-sm text-[var(--accent-purple)] font-medium mb-3">⚙️ {title}</p>
      <ol className="list-decimal list-inside space-y-2 text-xs text-muted-foreground">
        <li>Create a new Google Sheet</li>
        <li>
          Share it with:
          <br />
          <code className="block mt-1 p-2 bg-secondary rounded text-xs break-all select-all text-[var(--accent-cyan)]">
            {serviceAccountEmail}
          </code>
          <span className="text-muted-foreground">(Editor access)</span>
        </li>
        <li>Copy the Sheet ID from the URL</li>
        <li>Paste below and click "{connectButtonText}"</li>
      </ol>
      {additionalInstructions && (
        <div className="mt-3 text-xs text-muted-foreground">
          {additionalInstructions}
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-secondary text-foreground focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={handleConnect}
          disabled={!inputValue || isConnecting}
          className="w-full mt-2 px-3 py-2 btn-primary rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? connectingButtonText : connectButtonText}
        </button>
      </div>
    </div>
  );
}
