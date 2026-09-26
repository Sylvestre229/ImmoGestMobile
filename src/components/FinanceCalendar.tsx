import React, { useState } from 'react';
import { RentReceipt, PaymentTransaction, Tenant, Property, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  CreditCard,
  FileText,
  DollarSign,
  PieChart,
  Download,
  Filter,
  BarChart3,
  CalendarCheck,
} from 'lucide-react';

interface FinanceCalendarProps {
  receipts: RentReceipt[];
  payments: PaymentTransaction[];
  tenants: Tenant[];
  properties: Property[];
  country?: CountryCode;
  onOpenQuittance: (receipt: RentReceipt) => void;
  onOpenRelance: (tenant: Tenant) => void;
  onOpenPayment: () => void;
  onExportPdf?: () => void;
}

interface MonthlyStat {
  month: string;
  expected: number;
  collected: number;
  rate: number;
  lateAmount: number;
  status: 'complet' | 'en_cours' | 'a_venir';
}

export const FinanceCalendar: React.FC<FinanceCalendarProps> = ({
  receipts,
  payments,
  tenants,
  properties,
  country = 'BJ',
  onOpenQuittance,
  onOpenRelance,
  onOpenPayment,
  onExportPdf,
}) => {
  // Current view month & year (defaulting to September 2026 as per app context)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 = Septembre (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(5); // default selected on due date 5
  const [filterType, setFilterType] = useState<'all' | 'due' | 'paid' | 'late'>('all');

  const countryConfig = COUNTRIES[country] || COUNTRIES.BJ;
  const isBenin = country === 'BJ';

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Dynamic portfolio calculation based on selected country
  const countryProperties = properties.filter((p) => !p.country || p.country === country);
  const activeProperties = countryProperties.length > 0 ? countryProperties : properties;

  const totalMonthlyExpected = activeProperties.reduce(
    (sum, p) => sum + (p.rentExclCharges || 0) + (p.charges || 0),
    0
  ) || (isBenin ? 580000 : 5840);

  // Late tenants calculation
  const lateTenants = tenants.filter(
    (t) => t.paymentStatus === 'RETARD' && (!t.country || t.country === country)
  );
  const lateAmountTotal = lateTenants.reduce((sum, t) => sum + (t.balanceDue || 0), 0) ||
    (isBenin ? 200000 : 1850);

  const collectedTotal = Math.max(0, totalMonthlyExpected - lateAmountTotal);
  const currentRecoveryRate = totalMonthlyExpected > 0
    ? Math.round((collectedTotal / totalMonthlyExpected) * 1000) / 10
    : 75;

  // Collection rates history adapted to country currency
  const monthlyStats: MonthlyStat[] = [
    {
      month: 'Avril',
      expected: totalMonthlyExpected,
      collected: totalMonthlyExpected,
      rate: 100,
      lateAmount: 0,
      status: 'complet',
    },
    {
      month: 'Mai',
      expected: totalMonthlyExpected,
      collected: totalMonthlyExpected,
      rate: 100,
      lateAmount: 0,
      status: 'complet',
    },
    {
      month: 'Juin',
      expected: totalMonthlyExpected,
      collected: totalMonthlyExpected,
      rate: 100,
      lateAmount: 0,
      status: 'complet',
    },
    {
      month: 'Juillet',
      expected: totalMonthlyExpected,
      collected: Math.round(totalMonthlyExpected * 0.96),
      rate: 96,
      lateAmount: Math.round(totalMonthlyExpected * 0.04),
      status: 'complet',
    },
    {
      month: 'Août',
      expected: totalMonthlyExpected,
      collected: totalMonthlyExpected,
      rate: 100,
      lateAmount: 0,
      status: 'complet',
    },
    {
      month: 'Septembre',
      expected: totalMonthlyExpected,
      collected: collectedTotal,
      rate: currentRecoveryRate,
      lateAmount: lateAmountTotal,
      status: 'en_cours',
    },
  ];

  const currentMonthStat =
    monthlyStats.find((s) => s.month === monthNames[currentMonthIndex]) ||
    monthlyStats[5];

  // September 2026 calendar logic:
  // Sept 1, 2026 is a Tuesday -> offset in Monday-based week is 1 (0=Monday, 1=Tuesday).
  // Days in Sept: 30
  const daysInMonth = 30;
  const startDayOffset = 1; // Tuesday is 1 in Mon-Sun week

  // Key payment events in the month tailored to context
  interface CalendarEvent {
    day: number;
    type: 'due_date' | 'payment_received' | 'late_alert' | 'today';
    title: string;
    amount?: number;
    tenantName?: string;
    property?: string;
    details: string;
    status: 'payé' | 'retard' | 'échéance' | 'info';
    tenant?: Tenant;
    receipt?: RentReceipt;
  }

  const primaryReceipt = receipts.find((r) => !r.country || r.country === country) || receipts[0];
  const primaryLateTenant = lateTenants[0] || tenants.find((t) => t.paymentStatus === 'RETARD') || tenants[0];

  const events: CalendarEvent[] = [
    {
      day: 2,
      type: 'payment_received',
      title: isBenin
        ? 'Paiement reçu & Facture e-MECeF émise (Koffi Mensah)'
        : 'Paiement loyer reçu (Camille de Saint-Sauveur)',
      amount: isBenin ? 380000 : 2700,
      tenantName: isBenin ? 'Koffi Mensah' : 'Camille de Saint-Sauveur',
      property: isBenin ? 'Villa Haie Vive (Cotonou)' : 'Haussmannien Saint-Honoré',
      details: isBenin
        ? 'Encaissement validé avec génération de la facture normalisée e-MECeF avec Code IFU.'
        : 'Virement SEPA régulier reçu et validé. Quittance officielle générée.',
      status: 'payé',
      receipt: primaryReceipt,
    },
    {
      day: 4,
      type: 'payment_received',
      title: isBenin
        ? 'Paiement partiel encaissé (Amina Bello)'
        : 'Paiement loyer reçu (Nadia Benali)',
      amount: isBenin ? 200000 : 1290,
      tenantName: isBenin ? 'Amina Bello' : 'Nadia Benali',
      property: isBenin ? 'Appartement Akpakpa' : 'Résidence Calanques du Prado',
      details: 'Paiement reçu et affecté aux loyers courants du mois.',
      status: 'payé',
      receipt: receipts[1] || primaryReceipt,
    },
    {
      day: 5,
      type: 'due_date',
      title: 'Date limite contractuelle de paiement des loyers',
      amount: totalMonthlyExpected,
      details: `Échéance légale et contractuelle fixée au 5 de chaque mois selon ${countryConfig.leaseLawName}.`,
      status: 'échéance',
    },
    {
      day: 5,
      type: 'late_alert',
      title: `Impayé constaté (${primaryLateTenant ? `${primaryLateTenant.firstName} ${primaryLateTenant.lastName}` : 'Locataire en retard'})`,
      amount: lateAmountTotal,
      tenantName: primaryLateTenant ? `${primaryLateTenant.firstName} ${primaryLateTenant.lastName}` : undefined,
      property: activeProperties[1]?.name || 'Bien locatif',
      details: 'Loyer échu le 05/09 non régularisé. Alerte de relance générée.',
      status: 'retard',
      tenant: primaryLateTenant,
    },
    {
      day: 15,
      type: 'late_alert',
      title: 'Relance automatique amiable transmise',
      amount: lateAmountTotal,
      tenantName: primaryLateTenant ? `${primaryLateTenant.firstName} ${primaryLateTenant.lastName}` : undefined,
      details: 'Notification de rappel (WhatsApp & SMS) transmise avec lien de télépaiement.',
      status: 'retard',
      tenant: primaryLateTenant,
    },
    {
      day: 26,
      type: 'today',
      title: 'Aujourd\'hui (26 Septembre 2026)',
      details: `Point de clôture intermédiaire : ${currentRecoveryRate}% de recouvrement atteint.`,
      status: 'info',
    },
  ];

  // Get events for a specific day with optional filter
  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      if (e.day !== day) return false;
      if (filterType === 'due') return e.type === 'due_date';
      if (filterType === 'paid') return e.type === 'payment_received';
      if (filterType === 'late') return e.type === 'late_alert';
      return true;
    });
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-5 text-xs">
      {/* SECTION A: GRAPHIC RECOVERY RATE BAR CHART */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Taux de Recouvrement Mensuel & Encaissements
              </h3>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Historique des loyers perçus vs loyers attendus sur les 6 derniers mois
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block">Taux Septembre</span>
              <span className="font-bold font-mono text-sm text-amber-600">
                {currentMonthStat.rate}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 block">Perçus / Attendus</span>
              <span className="font-mono text-xs font-semibold text-slate-800">
                {formatCurrency(currentMonthStat.collected, countryConfig)} / {formatCurrency(currentMonthStat.expected, countryConfig)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-2">
          <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-40 pt-4 px-2 border-b border-slate-100 pb-2">
            {monthlyStats.map((stat, idx) => {
              const isSelected = stat.month === monthNames[currentMonthIndex];
              const barHeightPct = Math.max(stat.rate, 4); // minimum visible bar

              let barColor = 'bg-emerald-500';
              if (stat.status === 'a_venir') barColor = 'bg-slate-200';
              else if (stat.rate < 80) barColor = 'bg-amber-500';
              else if (stat.rate < 98) barColor = 'bg-blue-500';

              return (
                <div
                  key={stat.month}
                  onClick={() => {
                    const foundIdx = monthNames.indexOf(stat.month);
                    if (foundIdx !== -1) setCurrentMonthIndex(foundIdx);
                  }}
                  className={`flex flex-col items-center justify-end h-full group cursor-pointer transition-all ${
                    isSelected ? 'scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Tooltip rate */}
                  <span
                    className={`font-mono text-[10px] font-bold mb-1 transition-colors ${
                      isSelected ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {stat.status === 'a_venir' ? '—' : `${stat.rate}%`}
                  </span>

                  {/* The Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-28 flex items-end p-0.5 overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${barColor} ${
                        isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`text-[11px] mt-2 font-medium ${
                      isSelected ? 'text-blue-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {stat.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend & Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 block">Encaissé à ce jour</span>
                <span className="font-bold font-mono text-sm text-emerald-900">
                  {formatCurrency(currentMonthStat.collected, countryConfig)}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Loyer(s) réglé(s)
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-800 block">Reste à recouvrer (Impayé)</span>
                <span className="font-bold font-mono text-sm text-rose-900">
                  {formatCurrency(currentMonthStat.lateAmount, countryConfig)}
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                {lateTenants.length > 0 ? `${lateTenants.length} retard(s)` : 'À jour'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Délai moyen règlement</span>
                <span className="font-bold font-mono text-sm text-slate-800">
                  3.2 jours
                </span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">
                Échéance légale : 5 du mois
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: VISUAL INTERACTIVE DUE DATES CALENDAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Calendar Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Calendrier des Échéances & Dates Limites
              </h3>
              <p className="text-[11px] text-slate-500">
                Visualisez les dates limites de paiement, encaissements et retards ({countryConfig.name})
              </p>
            </div>
          </div>

          {/* Month selector and export action */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-2xs font-medium text-xs transition-colors"
                title="Exporter le rapport PDF"
              >
                <Download className="w-3.5 h-3.5 text-rose-600" />
                <span>Rapport PDF</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                title="Mois précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold text-xs text-slate-800 min-w-[95px] text-center">
                {monthNames[currentMonthIndex]} {currentYear}
              </span>
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors"
                title="Mois suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter buttons & Legend pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1">
          {/* Quick filter buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({events.length})
            </button>
            <button
              onClick={() => setFilterType('due')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'due'
                  ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dates limites (Le 5)
            </button>
            <button
              onClick={() => setFilterType('paid')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'paid'
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paiements reçus
            </button>
            <button
              onClick={() => setFilterType('late')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'late'
                  ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Impayés & Relances
            </button>
          </div>

          {/* Legend badges */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Date Limite (Le 5)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Reçu
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-medium border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Retard
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Aujourd'hui (26/09)
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center py-2 bg-slate-100 border-b border-slate-200 font-semibold text-[11px] text-slate-600">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span className="text-slate-400">Sam</span>
            <span className="text-slate-400">Dim</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {/* Blank leading days for offset */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`blank-${i}`} className="bg-slate-50/60 min-h-[52px] sm:min-h-[64px]" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDay === day;
              const isDueDate = day === 5;
              const isToday = day === 26;
              const hasPayment = dayEvents.some((e) => e.type === 'payment_received');
              const hasLateAlert = dayEvents.some((e) => e.type === 'late_alert');

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`bg-white min-h-[52px] sm:min-h-[64px] p-1 sm:p-1.5 transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'ring-2 ring-blue-600 z-10 bg-blue-50/30'
                      : 'hover:bg-slate-50'
                  } ${isDueDate ? 'bg-amber-50/40' : ''}`}
                >
                  {/* Top row: day number + indicators */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-medium rounded-full w-5 h-5 flex items-center justify-center ${
                        isToday
                          ? 'bg-blue-600 text-white font-bold'
                          : isDueDate
                          ? 'bg-amber-500 text-white font-bold'
                          : isSelected
                          ? 'text-blue-700 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Due date tag badge */}
                    {isDueDate && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold hidden sm:inline">
                        Échéance
                      </span>
                    )}
                  </div>

                  {/* Event Dots & Previews inside the cell */}
                  <div className="mt-1 space-y-0.5">
                    {hasPayment && (
                      <div className="flex items-center gap-1 text-[9px] text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded truncate font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate hidden sm:inline">Reçu</span>
                      </div>
                    )}
                    {hasLateAlert && day === 5 && (
                      <div className="flex items-center gap-1 text-[9px] text-rose-800 bg-rose-50 px-1 py-0.5 rounded truncate font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="truncate hidden sm:inline">Impayé</span>
                      </div>
                    )}
                    {day === 15 && (
                      <div className="flex items-center gap-1 text-[9px] text-amber-800 bg-amber-50 px-1 py-0.5 rounded truncate font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate hidden sm:inline">Relance</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              Détail des échéances & opérations pour le {selectedDay} {monthNames[currentMonthIndex]} {currentYear}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedDayEvents.length} événement(s)
            </span>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDayEvents.map((evt, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                    evt.status === 'payé'
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                      : evt.status === 'retard'
                      ? 'bg-rose-50/70 border-rose-200 text-slate-900'
                      : evt.status === 'échéance'
                      ? 'bg-amber-50/70 border-amber-200 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{evt.title}</span>
                      {evt.amount && (
                        <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                          {formatCurrency(evt.amount, countryConfig)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {evt.details}
                    </p>
                    {evt.property && (
                      <span className="text-[10px] text-slate-400 block">
                        Bien rattaché : {evt.property}
                      </span>
                    )}
                  </div>

                  {/* Actions according to event */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {evt.receipt && (
                      <button
                        onClick={() => onOpenQuittance(evt.receipt!)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isBenin ? 'Facture e-MECeF' : 'Voir quittance'}</span>
                      </button>
                    )}
                    {evt.tenant && evt.status === 'retard' && (
                      <button
                        onClick={() => onOpenRelance(evt.tenant!)}
                        className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Relancer</span>
                      </button>
                    )}
                    {evt.type === 'due_date' && (
                      <button
                        onClick={onOpenPayment}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Enregistrer paiement</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 text-[11px]">
              <span>Aucune échéance contractuelle ou encaissement programmé à cette date.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
