import React, { useState } from 'react';
import { Role, CountryCode, UserSession } from '../types';
import { COUNTRIES } from '../data/countries';
import {
  ShieldCheck,
  Bell,
  Smartphone,
  Monitor,
  UserCheck,
  Globe,
  Database,
  Scale,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenSecurity: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  currentCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onOpenTenantDatabase: () => void;
  onOpenRecourse: () => void;
  session: UserSession | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenSecurity,
  unreadNotificationsCount,
  onOpenNotifications,
  currentCountry,
  onCountryChange,
  onOpenTenantDatabase,
  onOpenRecourse,
  session,
  onLogout,
}) => {
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const activeCountryConfig = COUNTRIES[currentCountry] || COUNTRIES.BJ;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Zone 1: Brand Title & Country Jurisdictions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 shrink-0">
            <span className="text-blue-600">Immo</span>Gest
            <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1 py-0.5 rounded">Pro</span>
          </a>

          {/* Country Jurisdiction Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountryMenu(!showCountryMenu)}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors border border-slate-200"
              title="Changer le pays de juridiction (Bénin, France, etc.)"
            >
              <span className="text-sm">{activeCountryConfig.flag}</span>
              <span className="font-semibold hidden sm:inline">{activeCountryConfig.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">({activeCountryConfig.currencySymbol})</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showCountryMenu && (
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-100">
                  Juridiction & Lois en vigueur
                </div>
                {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                  const c = COUNTRIES[code];
                  const isSelected = currentCountry === code;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        onCountryChange(code);
                        setShowCountryMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-blue-50/70 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.flag}</span>
                        <div>
                          <span className="block font-medium">{c.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {c.taxIdName} · {c.currencySymbol}
                          </span>
                        </div>
                      </div>
                      {isSelected && <span className="text-blue-600 text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Shortcuts & Role Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Legal Recourse Shortcut */}
          <button
            onClick={onOpenRecourse}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            title="Recours en ligne & litiges du bail à usage domestique"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Recours en ligne</span>
          </button>

          {/* Quick Tenant Database Shortcut */}
          <button
            onClick={onOpenTenantDatabase}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            title="Base de données & sauvegarde des locataires"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Base Locataires</span>
          </button>

          {/* Persona Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl text-xs font-medium border border-slate-200">
            <button
              onClick={() => onRoleChange('gestionnaire')}
              className={`px-2 sm:px-3 py-1 rounded-lg transition-all ${
                currentRole === 'gestionnaire'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gestionnaire
            </button>
            <button
              onClick={() => onRoleChange('locataire')}
              className={`px-2 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'locataire'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portail</span> Résident
            </button>
          </div>

          {/* Desktop Frame Toggle (hidden on small screens) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Passer en plein écran' : 'Simuler format smartphone'}
            className="hidden xl:flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
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

        {/* Zone 3: Security, Alerts & User Session actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Security Status Badge */}
          <button
            onClick={onOpenSecurity}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            title="Ouvrir le centre de sécurité et MFA"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden lg:inline">Sécurité 2FA</span>
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

          {/* User profile / Logout */}
          {session ? (
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
              <button
                onClick={onLogout}
                title={`Connecté en tant que ${session.name} (${session.email}) - Cliquez pour vous déconnecter`}
                className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs"
              >
                <LogOut className="w-4 h-4 text-slate-500 hover:text-rose-600" />
                <span className="hidden xl:inline text-[11px] font-medium text-slate-700 max-w-[100px] truncate">
                  {session.name.split(' ')[0]}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

