import React, { useState } from 'react';
import { RentReceipt, PaymentTransaction, Tenant, Property, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
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
  Calendar as CalendarIcon,
  QrCode,
  Scale,
  Database,
  Building,
} from 'lucide-react';
import { FinanceCalendar } from './FinanceCalendar';
import { generateFinancialReportPdf } from '../utils/exportFinancialPdf';

interface FinancesViewProps {
  receipts: RentReceipt[];
  payments: PaymentTransaction[];
  tenants: Tenant[];
  properties: Property[];
  country: CountryCode;
  onOpenQuittance: (receipt: RentReceipt) => void;
  onOpenNormalizedInvoice: (receipt: RentReceipt) => void;
  onOpenRelance: (tenant: Tenant) => void;
  onOpenPayment: () => void;
  onGenerateQuittance: (propertyId: string, month: string, year: number) => void;
  onOpenTenantDatabase: () => void;
  onOpenRecourse: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  receipts,
  payments,
  tenants,
  properties,
  country,
  onOpenQuittance,
  onOpenNormalizedInvoice,
  onOpenRelance,
  onOpenPayment,
  onGenerateQuittance,
  onOpenTenantDatabase,
  onOpenRecourse,
}) => {
  const [activeTab, setActiveTab] = useState<'calendrier' | 'quittances' | 'impayes' | 'transactions'>('calendrier');
  const [selectedMonth, setSelectedMonth] = useState('Septembre');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const countryConfig = COUNTRIES[country] || COUNTRIES.BJ;
  const isBenin = country === 'BJ';

  const lateTenants = tenants.filter((t) => t.paymentStatus === 'RETARD');

  const handleCreateNewQuittance = () => {
    // Generate for the primary rented property
    const defaultProp = properties[0]?.id || 'prop-bj-1';
    onGenerateQuittance(defaultProp, selectedMonth, selectedYear);
    setToastMessage(`✓ Quittance / Facture normalisée pour ${selectedMonth} ${selectedYear} générée avec succès.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendEmailSimulation = (rcp: RentReceipt) => {
    setToastMessage(`📧 Document fiscal & quittance n°${rcp.receiptNumber} envoyée par email à ${rcp.tenantName}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPDF = () => {
    generateFinancialReportPdf({
      month: selectedMonth,
      year: selectedYear,
      properties,
      tenants,
      receipts,
      payments,
    });
    setToastMessage(`✓ Rapport financier PDF (${selectedMonth} ${selectedYear}) généré et téléchargé.`);
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

      {/* Country Legal & Fiscal Jurisdiction Banner */}
      <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{countryConfig.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{countryConfig.name}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-mono font-semibold">
                {countryConfig.taxIdName} : {isBenin ? 'Code IFU 13 chiffres' : 'SIRET / Numéro fiscal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Régime : {countryConfig.leaseLawName} · Facturation : {isBenin ? 'Système e-MECeF (DGI Bénin)' : 'Quittance certifiée'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={onOpenTenantDatabase}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-colors border border-slate-700"
            title="Gérer la base de données des locataires et sauvegardes"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Base Locataires</span>
          </button>
          <button
            onClick={onOpenRecourse}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-colors border border-slate-700"
            title="Recours en ligne du contrat de bail domestique"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Recours en ligne</span>
          </button>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Finances, Facturation & Quittances
          </h2>
          <p className="text-slate-500">
            Calendrier des échéances, facturation normalisée e-MECeF / IFU, relances d'impayés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 font-medium rounded-xl transition-colors border border-slate-200 shadow-xs text-xs"
            title="Générer le rapport PDF des loyers perçus et impayés via jsPDF"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>Exporter en PDF</span>
          </button>
          <button
            onClick={onOpenPayment}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-xs text-xs"
          >
            <CreditCard className="w-4 h-4" />
            <span>Paiement en ligne</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('calendrier')}
          className={`pb-2.5 px-4 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'calendrier'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          Calendrier & Recouvrement
        </button>
        <button
          onClick={() => setActiveTab('quittances')}
          className={`pb-2.5 px-4 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'quittances'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {isBenin ? 'Factures e-MECeF (IFU)' : 'Quittances de loyer'} ({receipts.length})
        </button>
        <button
          onClick={() => setActiveTab('impayes')}
          className={`pb-2.5 px-4 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
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
          className={`pb-2.5 px-4 font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Transactions & Paiements ({payments.length})
        </button>
      </div>

      {/* SECTION 0: CALENDRIER VISUEL & RECOUVREMENT */}
      {activeTab === 'calendrier' && (
        <FinanceCalendar
          receipts={receipts}
          payments={payments}
          tenants={tenants}
          properties={properties}
          country={country}
          onOpenQuittance={onOpenQuittance}
          onOpenRelance={onOpenRelance}
          onOpenPayment={onOpenPayment}
          onExportPdf={handleExportPDF}
        />
      )}

      {/* SECTION 1: QUITTANCES & FACTURES NORMALISÉES */}
      {activeTab === 'quittances' && (
        <div className="space-y-4">
          {/* Quick Generator Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">
                  {isBenin
                    ? 'Émission de Facture Normalisée e-MECeF (DGI Bénin)'
                    : 'Génération automatique des quittances'}
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                {isBenin
                  ? 'Intégration fiscale obligatoire avec Code IFU Bailleur, Code IFU Locataire, NIM et signature électronique certifiée e-MECeF.'
                  : 'Calcul automatique du loyer net, des provisions pour charges et mention légale d\'acquit.'}
              </p>
            </div>
            <button
              onClick={handleCreateNewQuittance}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Générer facture {selectedMonth}</span>
            </button>
          </div>

          {/* Quittances / Factures List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {receipts.map((rcp) => {
              const itemCountryCode: CountryCode = rcp.country || country;
              const itemCountryConfig = COUNTRIES[itemCountryCode] || countryConfig;
              const isItemBenin = itemCountryCode === 'BJ';

              return (
                <div
                  key={rcp.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        #{rcp.receiptNumber}
                      </span>
                      {isItemBenin && (
                        <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200 font-mono">
                          ✓ e-MECeF IFU : {rcp.tenantIfu || '3201810459201'}
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        Acquitté le {rcp.paymentDate}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{rcp.tenantName}</h4>
                    <p className="text-slate-500 text-[11px]">
                      {rcp.propertyAddress} · Terme : {rcp.periodMonth} {rcp.periodYear}
                    </p>
                    <div className="text-[11px] text-slate-600 font-mono tabular-nums">
                      Loyer : {formatCurrency(rcp.rentAmount, itemCountryConfig)} + Charges : {formatCurrency(rcp.chargesAmount, itemCountryConfig)} ={' '}
                      <strong className="text-slate-900">
                        {formatCurrency(rcp.totalAmount, itemCountryConfig)}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                    <button
                      onClick={() => handleSendEmailSimulation(rcp)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer</span>
                    </button>
                    {isItemBenin && (
                      <button
                        onClick={() => onOpenNormalizedInvoice(rcp)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Facture Normalisée IFU</span>
                      </button>
                    )}
                    <button
                      onClick={() => onOpenQuittance(rcp)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Quittance PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ALERTES & RELANCES D'IMPAYÉS */}
      {activeTab === 'impayes' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Système de relance intelligente et alertes d'impayés ({countryConfig.name})</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Procédure conforme à la législation ({countryConfig.leaseLawName}).
              Déclenchement automatique de relances amiables (SMS / Email), commandement de payer dans les délais légaux impératifs ({countryConfig.evictionNoticeDelay}), ou saisine du recours en ligne en cas de carence prolongée.
            </p>
          </div>

          <div className="space-y-3">
            {lateTenants.map((ten) => {
              const prop = properties.find((p) => p.id === ten.propertyId);
              const tenCountryCode = ten.country || country;
              const tenCountryConfig = COUNTRIES[tenCountryCode] || countryConfig;

              return (
                <div
                  key={ten.id}
                  className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Retard {ten.daysLate || 12} jours
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Échéance du 05/09/2026
                        </span>
                        {ten.ifuNumber && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                            IFU : {ten.ifuNumber}
                          </span>
                        )}
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
                        {formatCurrency(ten.balanceDue, tenCountryConfig)}
                      </span>
                    </div>
                  </div>

                  {/* Relance actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-slate-500 text-[11px]">
                      Dernière notification : SMS transmis le 15/09 (Délai légal : {tenCountryConfig.evictionNoticeDelay})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenRecourse}
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-medium text-xs transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-700" />
                        <span>Recours légal</span>
                      </button>
                      <button
                        onClick={() => onOpenRelance(ten)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Déclencher relance</span>
                      </button>
                    </div>
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
          {payments.map((pay) => {
            const payCountryConfig = pay.currency === 'XOF' ? COUNTRIES.BJ : COUNTRIES.FR;

            return (
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
                    {formatCurrency(pay.amount, payCountryConfig)}
                  </span>
                  <span className="text-[10px] text-slate-400">Paiement sécurisé</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
