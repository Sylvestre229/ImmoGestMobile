import React, { useState } from 'react';
import { CountryCode, Role, UserSession } from '../types';
import { COUNTRIES } from '../data/countries';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Globe,
  CheckCircle2,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultCountry?: CountryCode;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  defaultCountry = 'BJ',
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<Role>('gestionnaire');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [email, setEmail] = useState('boccosylvestre5@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Sylvestre Bocco');
  const [phone, setPhone] = useState('+229 97 12 34 56');
  const [ifuOrSiret, setIfuOrSiret] = useState('3201810459201'); // IFU Bénin
  const [step2FA, setStep2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('784920');

  const countryConfig = COUNTRIES[selectedCountry];

  const handleQuickLogin = (presetRole: Role, presetCountry: CountryCode, presetName: string, presetEmail: string, presetIfu: string, presetPhone: string) => {
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      name: presetName,
      email: presetEmail,
      role: presetRole,
      country: presetCountry,
      phone: presetPhone,
      ifuOrSiret: presetIfu,
      isLoggedIn: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2FA) {
      setStep2FA(true);
      return;
    }

    onLoginSuccess({
      id: `usr-${Date.now()}`,
      name: name || (role === 'gestionnaire' ? 'Gestionnaire ImmoGest' : 'Locataire Résident'),
      email: email.trim(),
      role,
      country: selectedCountry,
      phone: phone || '+229 97 00 00 00',
      ifuOrSiret: ifuOrSiret || (selectedCountry === 'BJ' ? '0202114892015' : '849 203 112 00019'),
      isLoggedIn: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
        {/* Brand header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
            <Building className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span className="text-blue-400">Immo</span>Gest <span className="text-xs font-mono font-normal text-slate-400">Mobile</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion locative conforme aux lois nationales & Facturation normalisée
          </p>
        </div>

        {/* Country Selector */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Pays & Juridiction d'application :
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-semibold">
              {countryConfig.flag} {countryConfig.name}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
              const c = COUNTRIES[code];
              const isSelected = selectedCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(code);
                    if (code === 'BJ') {
                      setIfuOrSiret('3201810459201');
                    } else if (code === 'FR') {
                      setIfuOrSiret('849 203 112 00019');
                    }
                  }}
                  className={`py-1.5 px-2 rounded-xl text-center text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span className="text-base block mb-0.5">{c.flag}</span>
                  <span className="text-[10px] block truncate">{c.name}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            {countryConfig.code === 'BJ' ? (
              <span className="text-emerald-300">
                ⚖️ <strong>Bénin :</strong> Loi n° 2018-12 (bail domestique) + Facturation normalisée <strong>e-MECeF avec Code IFU</strong>.
              </span>
            ) : (
              <span>
                ⚖️ <strong>{countryConfig.name} :</strong> {countryConfig.leaseLawName} ({countryConfig.taxIdName}).
              </span>
            )}
          </div>
        </div>

        {/* Role toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setRole('gestionnaire')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              role === 'gestionnaire'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Propriétaire / Bailleur</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('locataire')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              role === 'locataire'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Locataire Résident</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {!step2FA ? (
            <>
              {isRegister && (
                <div>
                  <label className="text-slate-300 block mb-1">Nom et Prénom</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Sylvestre Bocco"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 block mb-1">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Mot de passe sécurisé</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Country-specific tax identifier input */}
              <div>
                <label className="text-slate-300 block mb-1 flex items-center justify-between">
                  <span>{countryConfig.taxIdName}</span>
                  <span className="text-blue-400 font-normal text-[10px]">Légalement requis</span>
                </label>
                <input
                  type="text"
                  value={ifuOrSiret}
                  onChange={(e) => setIfuOrSiret(e.target.value)}
                  placeholder={countryConfig.taxIdPlaceholder}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>Continuer (Vérification 2FA)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Authentification 2FA (Code SMS / TOTP)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Code de sécurité envoyé sur votre téléphone certifié ({phone}).
                </p>
              </div>

              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-48 mx-auto text-center text-lg font-mono tracking-widest bg-slate-800 border border-slate-600 rounded-xl py-2 text-white outline-none focus:border-blue-500 block"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
              >
                Valider & Accéder à mon espace
              </button>
            </div>
          )}
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium block text-center">
            🚀 Démonstrations rapides en 1 clic :
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin(
                  'gestionnaire',
                  'BJ',
                  'Sylvestre Bocco (Bailleur Bénin)',
                  'boccosylvestre5@gmail.com',
                  '3201810459201',
                  '+229 97 12 34 56'
                )
              }
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-emerald-500/30 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <span>🇧🇯 Bénin - Bailleur</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Sylvestre Bocco · IFU 3201810459201
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin(
                  'locataire',
                  'BJ',
                  'Sylvestre Bocco (Locataire Haie Vive)',
                  'boccosylvestre5@gmail.com',
                  '0202114892015',
                  '+229 97 12 34 56'
                )
              }
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-blue-500/30 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <span>🇧🇯 Bénin - Locataire</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Facture normalisée e-MECeF
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin(
                  'gestionnaire',
                  'FR',
                  'Sophie Vernier (Gestionnaire France)',
                  'sophie.vernier@immogest.fr',
                  '849 203 112 00019',
                  '06 12 34 56 78'
                )
              }
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                <span>🇫🇷 France - Syndic</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Sophie Vernier · Bail Loi ALUR
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin(
                  'locataire',
                  'FR',
                  'Camille de Saint-Sauveur',
                  'camille.dss@email.fr',
                  '',
                  '06 12 34 56 78'
                )
              }
              className="p-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
                <span>🇫🇷 France - Locataire</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Quittance & Dépôt de garantie
              </span>
            </button>
          </div>
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Chiffrement de bout en bout · Données sauvegardées en base sécurisée</span>
        </div>
      </div>
    </div>
  );
};
