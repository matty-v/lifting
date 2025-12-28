export interface SheetsSetupWizardProps {
  /** The service account email to display for sharing instructions */
  serviceAccountEmail: string;
  /** Current value of the sheet ID input */
  inputValue: string;
  /** Callback when input value changes */
  onInputChange: (value: string) => void;
  /** Callback when connect button is clicked */
  onConnect: () => void | Promise<void>;
  /** Whether the connection/initialization is in progress */
  isConnecting?: boolean;
  /** Custom title for the setup wizard (default: "Setup Required") */
  title?: string;
  /** Custom connect button text (default: "Connect") */
  connectButtonText?: string;
  /** Custom connecting button text (default: "Initializing...") */
  connectingButtonText?: string;
  /** Custom placeholder for the input (default: "Paste your Google Sheet ID here") */
  inputPlaceholder?: string;
  /** Additional instructions to display (optional) */
  additionalInstructions?: React.ReactNode;
}

export interface SheetsSettingsPanelProps {
  /** The service account email to display for sharing instructions */
  serviceAccountEmail: string;
  /** Current connected spreadsheet ID */
  spreadsheetId: string;
  /** Whether currently editing settings */
  isEditing: boolean;
  /** Callback to toggle editing mode */
  onEditingChange: (editing: boolean) => void;
  /** Current value of the temp sheet ID input when editing */
  tempInputValue: string;
  /** Callback when temp input value changes */
  onTempInputChange: (value: string) => void;
  /** Callback when save button is clicked */
  onSave: () => void | Promise<void>;
  /** Whether save/initialization is in progress */
  isSaving?: boolean;
  /** Custom save button text (default: "Save & Initialize") */
  saveButtonText?: string;
  /** Custom saving button text (default: "Initializing...") */
  savingButtonText?: string;
  /** Custom placeholder for the input (default: "Paste your Google Sheet ID here") */
  inputPlaceholder?: string;
  /** Custom connected status text (default: "Connected") */
  connectedText?: string;
  /** Custom change button text (default: "Change Spreadsheet") */
  changeButtonText?: string;
  /** Status message to display (optional) */
  status?: string;
}
