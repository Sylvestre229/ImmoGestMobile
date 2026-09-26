import React from 'react';
import { Bell, Check, X, Wrench, AlertTriangle, FileText, MessageSquare } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'intervention' | 'impaye' | 'quittance' | 'message' | 'copro';
  read: boolean;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'intervention':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'impaye':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'quittance':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end sm:px-8 sm:pt-14 bg-black/20 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full mt-4 sm:mt-2 mx-3 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-xs">
              Centre de Notifications & Alertes ({notifications.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-blue-600 hover:underline"
            >
              Tout lire
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-xs">{notif.title}</h4>
                  <span className="font-mono text-[10px] text-slate-400">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{notif.message}</p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[10px] text-slate-500">
            Notifications push, SMS et e-mail synchronisées
          </span>
        </div>
      </div>
    </div>
  );
};
