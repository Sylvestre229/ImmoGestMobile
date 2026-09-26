import React from 'react';
import {
  Property,
  Tenant,
  TechnicalTicket,
  RentReceipt,
  PaymentTransaction,
} from '../types';
import {
  TrendingUp,
  AlertTriangle,
  Wrench,
  Building,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  Send,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  properties: Property[];
  tenants: Tenant[];
  tickets: TechnicalTicket[];
  receipts: RentReceipt[];
  payments: PaymentTransaction[];
  onOpenNewTicket: () => void;
  onOpenRelance: (tenant: Tenant) => void;
  onOpenQuittance: (receipt: RentReceipt) => void;
  onOpenPayment: () => void;
  onNavigateTab: (tab: 'properties' | 'interventions' | 'finances' | 'documents' | 'messages') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  tenants,
  tickets,
  receipts,
  payments,
  onOpenNewTicket,
  onOpenRelance,
  onOpenQuittance,
  onOpenPayment,
  onNavigateTab,
}) => {
  // Financial calculations
  const totalRents = properties.reduce(
    (acc, p) => (p.status === 'Loué' ? acc + p.rentExclCharges + p.charges : acc),
    0
  );
  const collectedPayments = payments
    .filter((p) => p.status === 'Validé' && p.type === 'Loyer mensuel')
    .reduce((acc, p) => acc + p.amount, 0);

  const lateTenants = tenants.filter((t) => t.paymentStatus === 'RETARD');
  const lateAmount = lateTenants.reduce((acc, t) => acc + t.balanceDue, 0);

  const activeTickets = tickets.filter(
    (t) => t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ'
  );

  const occupiedCount = properties.filter((p) => p.status === 'Loué').length;
  const occupancyRate = Math.round((occupiedCount / properties.length) * 100);

  return (
    <div className="space-y-5 pb-8">
      {/* Top Welcome Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Système de gestion locative actif
            </span>
            <span className="font-mono">Septembre 2026</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Tableau de Bord Immobilier
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            4 biens gérés · {occupiedCount} loués · 1 alerte impayé · {activeTickets.length} interventions
          </p>

          {/* Quick action buttons row */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onOpenNewTicket}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              Signaler un incident
            </button>
            <button
              onClick={() => onNavigateTab('finances')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5" />
              Générer quittance
            </button>
            <button
              onClick={onOpenPayment}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Payer en ligne
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid (High density, tabular numerals) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Collected Rent */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Loyers perçus</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {collectedPayments.toLocaleString('fr-FR')} €
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Objectif : {totalRents.toLocaleString('fr-FR')} €</span>
            <span className="font-semibold text-emerald-700">
              {Math.round((collectedPayments / totalRents) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 2: Occupancy Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Taux d'occupation</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{occupiedCount} logements loués sur 4</span>
          </div>
        </div>

        {/* Metric 3: Late Payments Alert */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
            <span className="font-medium">Impayés & Retards</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-700">
            {lateAmount.toLocaleString('fr-FR')} €
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>1 locataire en retard</span>
          </div>
        </div>

        {/* Metric 4: Active Technical Tickets */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Interventions actives</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {activeTickets.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>1 en cours · 1 planifiée</span>
          </div>
        </div>
      </div>

      {/* URGENT LATE PAYMENT ALERT & ACTION BOX */}
      {lateTenants.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-slate-900">
                  Alerte Impayé : Thomas Durand ({lateTenants[0].balanceDue.toLocaleString('fr-FR')} €)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Loyer de Septembre échu depuis {lateTenants[0].daysLate} jours pour le Loft Roosevelt (Lyon 6e).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-700 font-bold bg-white px-2 py-0.5 rounded border border-rose-200">
              J+{lateTenants[0].daysLate}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
            <span className="text-slate-600 text-[11px]">
              Dernière notification : il y a 5 jours
            </span>
            <button
              onClick={() => onOpenRelance(lateTenants[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Relancer (SMS & Email)
            </button>
          </div>
        </div>
      )}

      {/* REAL-TIME TECHNICAL INTERVENTIONS TRACKER PREVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Suivi des Réparations en Direct
            </h3>
            <p className="text-xs text-slate-500">
              Mises à jour transparentes par e-mail et SMS aux résidents
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('interventions')}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            Voir tout
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {tickets.slice(0, 2).map((tkt) => (
            <div
              key={tkt.id}
              onClick={() => onNavigateTab('interventions')}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-xs text-slate-900">{tkt.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{tkt.propertyName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-700">{tkt.category}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    tkt.priority === 'Urgente'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tkt.priority}
                </span>
              </div>

              {/* Progress step indicator */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Étape actuelle :</span>
                  <span className="font-semibold text-blue-800">
                    {tkt.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        tkt.status === 'SIGNALÉ'
                          ? '20%'
                          : tkt.status === 'PRIS_EN_CHARGE'
                          ? '40%'
                          : tkt.status === 'ARTISAN_ASSIGNÉ'
                          ? '60%'
                          : tkt.status === 'EN_COURS'
                          ? '80%'
                          : '100%',
                    }}
                  />
                </div>
              </div>

              {/* Last update note */}
              {tkt.updates.length > 0 && (
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/50">
                  <span className="truncate max-w-[200px]">
                    "{tkt.updates[tkt.updates.length - 1].note}"
                  </span>
                  <span className="shrink-0 font-mono">
                    Notifié {tkt.updates[tkt.updates.length - 1].notifiedVia.join(' / ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* QUICK RENT RECEIPTS PREVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Quittances de Loyer Disponibles
            </h3>
            <p className="text-xs text-slate-500">
              Générées automatiquement après acquittement
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('finances')}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            Toutes les quittances
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {receipts.slice(0, 2).map((rcp) => (
            <div
              key={rcp.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-medium text-slate-900">{rcp.tenantName}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  <span>{rcp.periodMonth} {rcp.periodYear}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{rcp.totalAmount} €</span>
                </div>
              </div>
              <button
                onClick={() => onOpenQuittance(rcp)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                <FileText className="w-3 h-3 text-blue-600" />
                Voir / PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COPROPRIÉTÉ & SYNDIC BULLETIN */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Informations Copropriété & Syndic Direct</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Entretien trimestriel de la colonne d'eau et contrôle de l'ascenseur programmés ce mardi entre 8h et 12h. L'ensemble des copropriétaires et résidents ont reçu la notification push.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>Syndic de copropriété Nexity Paris</span>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-blue-700 font-medium hover:underline"
          >
            Ouvrir la messagerie syndic →
          </button>
        </div>
      </div>
    </div>
  );
};
