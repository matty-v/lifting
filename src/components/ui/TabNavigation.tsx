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
      className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-2 px-2"
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
          className={`px-3 py-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === tab.id
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
