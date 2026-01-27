import type { TabType } from '@/types';

interface Tab {
  id: TabType;
  label: string;
  onClick?: () => void;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div
      className="flex gap-1 mb-6 border-b border-border overflow-x-auto scrollbar-hide -mx-2 px-2"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            onTabChange(tab.id);
            tab.onClick?.();
          }}
          className={`px-3 py-2 font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === tab.id
              ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)] glow-cyan'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
