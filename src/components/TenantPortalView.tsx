import React from 'react';
import {
  Property,
  Tenant,
  TechnicalTicket,
  RentReceipt,
  PropertyDocument,
} from '../types';
import {
  Home,
  CreditCard,
  FileText,
  Wrench,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Phone,
} from 'lucide-react';

interface TenantPortalViewProps {
  tenant: Tenant;
  property: Property;
  tickets: TechnicalTicket[];
  receipts: RentReceipt[];
  documents: PropertyDocument[];
  onOpenPayment: () => void;
  onOpenQuittance: (rcp: RentReceipt) => void;
  onOpenNewTicket: () => void;
  onNavigateTab: (tab: 'interventions' | 'messages' | 'documents') => void;
}

export const TenantPortalView: React.FC<TenantPortalViewProps> = ({
  tenant,
  property,
  tickets,
  receipts,
  documents,
  onOpenPayment,
  onOpenQuittance,
  onOpenNewTicket,
  onNavigateTab,
}) => {
  const myTickets = tickets.filter((t) => t.tenantId === tenant.id || t.propertyId === property.id);
  const myReceipts = receipts.filter((r) => r.tenantId === tenant.id || r.propertyId === property.id);
  const myDocs = documents.filter((d) => d.propertyId === property.id);
  const latestReceipt = myReceipts[0];
  const activeTicket = myTickets.find((t) => t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ');

  return (
    <div className="space-y-4 pb-12 text-xs max-w-xl mx-auto">
      {/* Resident Welcome Card */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Espace Résident Sécurisé
          </span>
          <span className="text-[11px] font-mono">Bail n° 2024-03-DSS</span>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Bonjour, {tenant.firstName}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {property.address}, {property.postalCode} {property.city}
          </p>
        </div>

        {/* Status of rent */}
        <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-between border border-white/10">
          <div>
            <span className="text-[10px] text-slate-300 block">Loyer Septembre 2026</span>
            <span className="text-lg font-bold font-mono tabular-nums text-white">
              {(property.rentExclCharges + property.charges).toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Loyer Réglé</span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenPayment}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-xs"
          >
            <CreditCard className="w-4 h-4" />
            <span>Payer des charges</span>
          </button>
          {latestReceipt && (
            <button
              onClick={() => onOpenQuittance(latestReceipt)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/15 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span>Quittance Septembre</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK REPORT A REPAIR ISSUE (Big touch target for non-tech users) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Un problème ou une panne ?
            </h3>
            <p className="text-xs text-slate-500">
              Signalez une fuite, un problème d'électricité ou de chauffage en 1 minute.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs whitespace-nowrap transition-transform active:scale-95 shadow-sm"
        >
          Déclarer
        </button>
      </div>

      {/* ACTIVE INTERVENTION TRACKER (Transparent real-time steps) */}
      {activeTicket && (
        <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Suivi de votre demande en cours
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">
                {activeTicket.title}
              </h4>
              <p className="text-[11px] text-slate-500">
                Catégorie : {activeTicket.category} · Déclaré le {activeTicket.reportedDate.slice(0, 10)}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('interventions')}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center"
            >
              Détails
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Étape actuelle :</span>
              <span className="font-bold text-blue-800">
                {activeTicket.status.replace('_', ' ')}
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width:
                    activeTicket.status === 'SIGNALÉ'
                      ? '20%'
                      : activeTicket.status === 'PRIS_EN_CHARGE'
                      ? '40%'
                      : activeTicket.status === 'ARTISAN_ASSIGNÉ'
                      ? '60%'
                      : activeTicket.status === 'EN_COURS'
                      ? '80%'
                      : '100%',
                }}
              />
            </div>

            {activeTicket.artisanName && (
              <div className="pt-1 text-[11px] text-slate-700 flex items-center justify-between">
                <span>Artisan missionné : <strong>{activeTicket.artisanName}</strong></span>
                {activeTicket.scheduledDate && (
                  <span className="text-blue-700 font-medium">
                    📅 {activeTicket.scheduledDate.replace('T', ' à ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MY DOCUMENTS & CONTRACTS */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Mes Documents Contractuels Numérisés
          </h3>
          <button
            onClick={() => onNavigateTab('documents')}
            className="text-xs text-blue-600 font-medium hover:underline flex items-center"
          >
            Tous mes documents
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {myDocs.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-medium text-slate-900 block">{doc.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {doc.category} · {doc.fileSize}
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert(`Téléchargement de "${doc.title}" en cours...`)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DIRECT CONTACT GESTIONNAIRE & SYNDIC */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-white">
              <img
                src="/src/assets/images/avatar_manager_sophie_1790426170072.jpg"
                alt="Sophie Vernier"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Sophie Vernier</h4>
              <p className="text-[11px] text-slate-500">Votre gestionnaire ImmoGest dédiée</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('messages')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Écrire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
