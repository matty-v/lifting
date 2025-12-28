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
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-sm text-amber-800 font-medium mb-3">⚙️ {title}</p>
      <ol className="list-decimal list-inside space-y-2 text-xs text-amber-700">
        <li>Create a new Google Sheet</li>
        <li>
          Share it with:
          <br />
          <code className="block mt-1 p-2 bg-amber-100 rounded text-xs break-all select-all text-amber-800">
            {serviceAccountEmail}
          </code>
          <span className="text-amber-600">(Editor access)</span>
        </li>
        <li>Copy the Sheet ID from the URL</li>
        <li>Paste below and click "{connectButtonText}"</li>
      </ol>
      {additionalInstructions && (
        <div className="mt-3 text-xs text-amber-700">
          {additionalInstructions}
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleConnect}
          disabled={!inputValue || isConnecting}
          className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? connectingButtonText : connectButtonText}
        </button>
      </div>
    </div>
  );
}
