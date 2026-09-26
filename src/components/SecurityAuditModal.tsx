import React, { useState } from 'react';
import { SecurityAudit } from '../types';
import { ShieldCheck, Lock, Key, FileText, CheckCircle2, AlertTriangle, X, RefreshCw, Smartphone } from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: SecurityAudit[];
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'mfa' | 'audit' | 'cahier'>('mfa');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [encryptionStatus] = useState('Chiffrement AES-256 actif (Bout en bout)');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Centre de Sécurité & Conformité</h3>
              <p className="text-xs text-slate-400">
                Chiffrement de bout en bout · Authentification MFA · Audits réguliers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('mfa')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'mfa'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Authentification 2FA / MFA
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Journal d'Audit ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('cahier')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'cahier'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Cahier des Charges Sécurité
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'mfa' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Authentification Multifacteur Robuste (MFA)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Protège les comptes gestionnaires, locataires et syndic contre le vol d'identifiants.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    mfaEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {mfaEnabled ? '✓ Activé & Obligatoire' : 'Désactivé'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Application TOTP</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Google Authenticator, Microsoft Authenticator ou YubiKey physique FIDO2.
                  </p>
                  <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    Statut : Configuré & Actif
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>SMS de secours sécurisé</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Code à usage unique 6 chiffres transmis sur numéro certifié (+33 6 •• •• 56 78).
                  </p>
                  <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    Statut : Opérationnel
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 space-y-1.5">
                <div className="flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Chiffrement des Données & Quittances</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tous les documents administratifs, baux, quittances et données bancaires sont chiffrés au repos via l'algorithme <strong>AES-256-GCM</strong>. Les échanges de messages sont protégés de bout en bout avec clés de session éphémères.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-slate-900">
                  Journal des événements d'accès récents
                </span>
                <span className="text-[11px] text-slate-500">
                  Horodatage certifié UTC+2
                </span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 text-xs bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.status === 'Succès'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-800">{log.action}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {log.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Utilisateur: {log.user}</span>
                      <span className="font-mono">{log.ip}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded">
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cahier' && (
            <div className="space-y-3 text-slate-700 leading-relaxed text-xs">
              <h4 className="font-bold text-slate-900 text-sm">
                Cahier des Charges — Sécurité & Gestion Centralisée des Accès
              </h4>
              <p>
                Ce système répond aux exigences des entreprises et gestionnaires immobiliers institutionnels nécessitant un contrôle strict de leurs parcs locatifs :
              </p>

              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">1. Matrice des Rôles & Accès (RBAC) :</strong>
                    <p className="text-[11px] text-slate-600">
                      Cloisonnement strict entre les espaces Bailleur/Gestionnaire, Syndic de copropriété, Résidents locataires et Artisans partenaires.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">2. Audits de Sécurité & Tests d'Intrusion :</strong>
                    <p className="text-[11px] text-slate-600">
                      Audits automatisés trimestriels, détection préventive des attaques par force brute (Rate-Limiting) et contrôle de conformité OWASP Top 10.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">3. Souveraineté & Chiffrement des Données :</strong>
                    <p className="text-[11px] text-slate-600">
                      Hébergement sécurisé au sein de l'Union Européenne en conformité totale avec le RGPD et la directive européenne DSP2 pour les flux de paiement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">4. Traçabilité Légale des Quittances & Contrats :</strong>
                    <p className="text-[11px] text-slate-600">
                      Signature numérique certifiée eIDAS et horodatage immuable des notifications d'impayés et des quittances de loyer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Certificat de conformité : ISO/IEC 27001 & RGPD 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
