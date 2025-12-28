import { useApp } from '@/context';
import { SERVICE_ACCOUNT_EMAIL } from '@/config';
import { SheetsSetupWizard } from '@/components/sheets';

/**
 * App-specific setup wizard that wraps the generic SheetsSetupWizard
 * and connects it to the Lifting Tracker's AppContext.
 */
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
    <SheetsSetupWizard
      serviceAccountEmail={SERVICE_ACCOUNT_EMAIL}
      inputValue={setupInputId}
      onInputChange={setSetupInputId}
      onConnect={handleConnect}
      isConnecting={initializing}
    />
  );
}
