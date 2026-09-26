import React, { useState } from 'react';
import { RentReceipt, PaymentTransaction, Tenant, Property } from '../types';
import {
  Receipt,
  FileText,
  AlertTriangle,
  Send,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface FinancesViewProps {
  receipts: RentReceipt[];
  payments: PaymentTransaction[];
  tenants: Tenant[];
  properties: Property[];
  onOpenQuittance: (receipt: RentReceipt) => void;
  onOpenRelance: (tenant: Tenant) => void;
  onOpenPayment: () => void;
  onGenerateQuittance: (propertyId: string, month: string, year: number) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  receipts,
  payments,
  tenants,
  properties,
  onOpenQuittance,
  onOpenRelance,
  onOpenPayment,
  onGenerateQuittance,
}) => {
  const [activeTab, setActiveTab] = useState<'quittances' | 'impayes' | 'transactions'>('quittances');
  const [selectedMonth, setSelectedMonth] = useState('Septembre');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lateTenants = tenants.filter((t) => t.paymentStatus === 'RETARD');

  const handleCreateNewQuittance = () => {
    // Generate for the primary rented property
    onGenerateQuittance('prop-1', selectedMonth, selectedYear);
    setToastMessage(`✓ Quittance officielle pour ${selectedMonth} ${selectedYear} générée avec succès.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendEmailSimulation = (rcp: RentReceipt) => {
    setToastMessage(`📧 Quittance n°${rcp.receiptNumber} envoyée par email à ${rcp.tenantName}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-4 pb-8 text-xs">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px]">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Finances & Quittances de Loyer
          </h2>
          <p className="text-slate-500">
            Génération automatique, alertes d'impayés et encaissements sécurisés
          </p>
        </div>
        <button
          onClick={onOpenPayment}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-xs"
        >
          <CreditCard className="w-4 h-4" />
          <span>Paiement en ligne</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('quittances')}
          className={`pb-2.5 px-4 font-medium border-b-2 transition-colors ${
            activeTab === 'quittances'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Quittances automatiques ({receipts.length})
        </button>
        <button
          onClick={() => setActiveTab('impayes')}
          className={`pb-2.5 px-4 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'impayes'
              ? 'border-amber-600 text-amber-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Alertes d'impayés
          {lateTenants.length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
              {lateTenants.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-2.5 px-4 font-medium border-b-2 transition-colors ${
            activeTab === 'transactions'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Transactions & Paiements ({payments.length})
        </button>
      </div>

      {/* SECTION 1: QUITTANCES DE LOYER */}
      {activeTab === 'quittances' && (
        <div className="space-y-4">
          {/* Quick Generator Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Génération automatique des quittances</h3>
              </div>
              <p className="text-xs text-slate-300">
                Calcul automatique du loyer net, des provisions pour charges et mention légale d'acquit.
              </p>
            </div>
            <button
              onClick={handleCreateNewQuittance}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Générer quittance {selectedMonth}</span>
            </button>
          </div>

          {/* Quittances List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {receipts.map((rcp) => (
              <div
                key={rcp.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {rcp.receiptNumber}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                      Acquitté le {rcp.paymentDate}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{rcp.tenantName}</h4>
                  <p className="text-slate-500 text-[11px]">
                    {rcp.propertyAddress} · Terme : {rcp.periodMonth} {rcp.periodYear}
                  </p>
                  <div className="text-[11px] text-slate-600 font-mono tabular-nums">
                    Loyer : {rcp.rentAmount} € + Charges : {rcp.chargesAmount} € ={' '}
                    <strong className="text-slate-900">{rcp.totalAmount} €</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleSendEmailSimulation(rcp)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer email</span>
                  </button>
                  <button
                    onClick={() => onOpenQuittance(rcp)}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Ouvrir / Imprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ALERTES & RELANCES D'IMPAYÉS */}
      {activeTab === 'impayes' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Système de relance intelligente des impayés locatifs</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Détection automatique des retards dès le 5 du mois. Permet de déclencher en un clic une relance amiable par SMS et e-mail, un deuxième avertissement avec délai de 48h, ou une mise en demeure formelle avant clause résolutoire.
            </p>
          </div>

          <div className="space-y-3">
            {lateTenants.map((ten) => {
              const prop = properties.find((p) => p.id === ten.propertyId);

              return (
                <div
                  key={ten.id}
                  className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Retard {ten.daysLate} jours
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Échéance du 05/09/2026
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {ten.firstName} {ten.lastName}
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        {prop?.name} ({prop?.city}) · {ten.phone} · {ten.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Montant en souffrance</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-rose-700">
                        {ten.balanceDue.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </div>

                  {/* Relance actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">
                      Dernière notification : SMS transmis le 15/09
                    </span>
                    <button
                      onClick={() => onOpenRelance(ten)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Déclencher une relance (1 clic)</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {lateTenants.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Tous les loyers sont à jour !</h4>
                <p className="text-slate-500 text-xs">
                  Aucun impayé constaté sur l'ensemble de votre parc locatif.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: TRANSACTIONS & PAIEMENTS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {payments.map((pay) => (
            <div
              key={pay.id}
              className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{pay.type}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      pay.status === 'Validé'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {pay.status}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {pay.tenantName} · {pay.propertyName} · {pay.method}
                </p>
                <span className="font-mono text-[10px] text-slate-400">
                  Réf : {pay.reference} · Date : {pay.date}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold font-mono tabular-nums text-sm text-slate-900 block">
                  {pay.amount.toLocaleString('fr-FR')} €
                </span>
                <span className="text-[10px] text-slate-400">Paiement sécurisé</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
