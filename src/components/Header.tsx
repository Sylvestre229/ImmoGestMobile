import React from 'react';
import { Role } from '../types';
import { ShieldCheck, Bell, Smartphone, Monitor, UserCheck, KeyRound } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenSecurity: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenSecurity,
  unreadNotificationsCount,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-3">
          <a href="#" className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            <span className="text-blue-600">Immo</span>Gest
            <span className="text-xs font-mono font-medium text-slate-400">Mobile</span>
          </a>
        </div>

        {/* Zone 2: Role Switcher & Device view toggle */}
        <div className="flex items-center gap-2">
          {/* Persona Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
            <button
              onClick={() => onRoleChange('gestionnaire')}
              className={`px-3 py-1 rounded-lg transition-all ${
                currentRole === 'gestionnaire'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gestionnaire / Syndic
            </button>
            <button
              onClick={() => onRoleChange('locataire')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'locataire'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Portail Résident
            </button>
          </div>

          {/* Desktop Frame Toggle (hidden on small screens) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Passer en plein écran' : 'Simuler format smartphone'}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Plein écran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Cadre mobile</span>
              </>
            )}
          </button>
        </div>

        {/* Zone 3: Security & Alerts actions */}
        <div className="flex items-center gap-2">
          {/* Security Status Badge */}
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            title="Ouvrir le centre de sécurité et MFA"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Sécurité 2FA</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
