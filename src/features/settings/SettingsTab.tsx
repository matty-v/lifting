import { useApp } from '@/context';
import { SERVICE_ACCOUNT_EMAIL } from '@/config';
import { SheetsSettingsPanel } from '@/components/sheets';

/**
 * App-specific settings tab that wraps the generic SheetsSettingsPanel
 * and connects it to the Lifting Tracker's AppContext.
 */
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
    <SheetsSettingsPanel
      serviceAccountEmail={SERVICE_ACCOUNT_EMAIL}
      spreadsheetId={spreadsheetId}
      isEditing={editingSettings}
      onEditingChange={setEditingSettings}
      tempInputValue={tempSpreadsheetId}
      onTempInputChange={setTempSpreadsheetId}
      onSave={handleSaveAndInitialize}
      isSaving={initializing}
      status={status}
    />
  );
}
