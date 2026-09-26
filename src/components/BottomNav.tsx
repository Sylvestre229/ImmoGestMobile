import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Receipt,
  FolderLock,
  MessageSquare,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'properties'
  | 'interventions'
  | 'finances'
  | 'documents'
  | 'messages';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  activeInterventionsCount: number;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  activeInterventionsCount,
  unreadMessagesCount,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Accueil', icon: LayoutDashboard },
    { id: 'properties' as TabType, label: 'Biens', icon: Building2 },
    {
      id: 'interventions' as TabType,
      label: 'Travaux',
      icon: Wrench,
      badge: activeInterventionsCount > 0 ? activeInterventionsCount : undefined,
    },
    { id: 'finances' as TabType, label: 'Finances', icon: Receipt },
    { id: 'documents' as TabType, label: 'GED Docs', icon: FolderLock },
    {
      id: 'messages' as TabType,
      label: 'Messagerie',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
