import { useEffect } from 'react';
import { AppProvider, useApp } from '@/context';
import { TabNavigation } from '@/components/ui';
import { Dumbbell } from '@/components/icons';
import { SetupWizard, SettingsTab } from '@/features/settings';
import { ExercisesTab } from '@/features/exercises';
import { RoutinesTab } from '@/features/routines';
import { WeightTab } from '@/features/weight';
import { TrackLiftTab } from '@/features/track';
import type { TabType } from '@/types';

function AppContent() {
  const {
    spreadsheetId,
    activeTab,
    setActiveTab,
    fetchExercises,
    fetchRoutines,
    fetchLiftingData,
    fetchWeightHistory,
    initializeSheets,
  } = useApp();

  // Initialize on mount when spreadsheetId is set
  useEffect(() => {
    const initAndFetch = async () => {
      if (!spreadsheetId) {
        setActiveTab('settings');
        return;
      }

      const result = await initializeSheets();
      if (result.success) {
        if (result.created && result.created.length > 0) {
          setActiveTab('settings');
        }
        fetchExercises();
        fetchRoutines();
        fetchLiftingData();
        fetchWeightHistory();
      } else {
        setActiveTab('settings');
      }
    };
    initAndFetch();
  }, [spreadsheetId]);

  const tabs: { id: TabType; label: string; onClick?: () => void }[] = [
    { id: 'track', label: 'Track', onClick: fetchLiftingData },
    { id: 'exercises', label: 'Exercises', onClick: fetchExercises },
    { id: 'routines', label: 'Routines', onClick: fetchRoutines },
    { id: 'weight', label: 'Weight', onClick: fetchWeightHistory },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Dumbbell size={32} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Lifting Tracker</h1>
          </div>

          {/* Setup Wizard (shown when no spreadsheetId) */}
          {!spreadsheetId && <SetupWizard />}

          {/* Tab Navigation (shown when setup is complete) */}
          {spreadsheetId && (
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          )}

          {/* Tab Content */}
          {spreadsheetId && activeTab === 'track' && <TrackLiftTab />}
          {spreadsheetId && activeTab === 'exercises' && <ExercisesTab />}
          {spreadsheetId && activeTab === 'routines' && <RoutinesTab />}
          {spreadsheetId && activeTab === 'weight' && <WeightTab />}
          {spreadsheetId && activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
