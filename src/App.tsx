import { useEffect } from 'react';
import { AppProvider, useApp, ThemeProvider } from '@/context';
import { TabNavigation, ThemeToggle } from '@/components/ui';
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
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Background effects */}
      <div className="gradient-backdrop" />
      <div className="grid-overlay" />
      <div className="corner-accent top-left" />
      <div className="corner-accent bottom-right" />

      <div className="max-w-md mx-auto px-4 py-8 relative z-10">
        <div className="tech-card rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded-xl">
              <Dumbbell size={32} className="text-[var(--accent-cyan)]" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground flex-1 tracking-tight">
              <span className="glow-cyan">Lifting</span> <span className="text-muted-foreground">Tracker</span>
            </h1>
            <ThemeToggle />
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
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
