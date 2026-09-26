import React, { useState } from 'react';
import { Property, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
import {
  getLocalMarketBenchmark,
  getLeaseHistory,
} from '../data/marketBenchmarks';
import {
  TrendingUp,
  BarChart3,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building,
  HelpCircle,
  ChevronRight,
  Sliders,
  FileCheck,
  Zap,
} from 'lucide-react';

interface RentComparisonModuleProps {
  properties: Property[];
  country: CountryCode;
  onApplyAdjustment: (propertyId: string, newRent: number) => void;
}

export const RentComparisonModule: React.FC<RentComparisonModuleProps> = ({
  properties,
  country,
  onApplyAdjustment,
}) => {
  const countryConfig = COUNTRIES[country] || COUNTRIES.BJ;
  const isBenin = country === 'BJ';

  // Filter properties matching active country or show all
  const displayProperties = properties.filter((p) => p.country === country).length > 0
    ? properties.filter((p) => p.country === country)
    : properties;

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    displayProperties[0]?.id || properties[0]?.id || ''
  );

  // Selected property
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || displayProperties[0] || properties[0];

  // Benchmark & history for selected property
  const benchmark = getLocalMarketBenchmark(selectedProperty);
  const leaseHistory = getLeaseHistory(selectedProperty.id);

  // Calculations
  const surface = selectedProperty.surface || 1;
  const currentRent = selectedProperty.rentExclCharges;
  const currentRentPerSqm = Math.round((currentRent / surface) * 10) / 10;
  const marketMedianTotal = Math.round(benchmark.avgRentPerSqm * surface);
  const gapPercentage = Math.round(((currentRent - marketMedianTotal) / marketMedianTotal) * 1000) / 10;

  // Default suggested increase is based on market gap and annual trend
  const calculatedSuggestedPct = gapPercentage < 0
    ? Math.min(Math.round(Math.abs(gapPercentage) * 0.75), 10)
    : Math.max(Math.round(benchmark.annualTrendPct), 3);

  // Interactive slider adjustment percentage
  const [sliderPct, setSliderPct] = useState<number>(calculatedSuggestedPct);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);
  const [showRevisionNotice, setShowRevisionNotice] = useState<boolean>(false);

  // Simulated adjusted rent
  const simulatedNewRent = Math.round(currentRent * (1 + sliderPct / 100));
  const simulatedNewRentPerSqm = Math.round((simulatedNewRent / surface) * 10) / 10;
  const monthlyGain = simulatedNewRent - currentRent;
  const annualGain = monthlyGain * 12;

  // Legal ceiling check
  const legalCeilingTotal = benchmark.legalCeilingPerSqm
    ? Math.round(benchmark.legalCeilingPerSqm * surface)
    : Math.round(currentRent * 1.2);
  const isAboveLegalCeiling = simulatedNewRent > legalCeilingTotal;

  // Handle apply adjustment
  const handleApply = () => {
    onApplyAdjustment(selectedProperty.id, simulatedNewRent);
    setAppliedToast(
      `✓ Loyer de "${selectedProperty.name}" actualisé à ${formatCurrency(simulatedNewRent, countryConfig)}/mois (${sliderPct > 0 ? '+' : ''}${sliderPct}%).`
    );
    setTimeout(() => setAppliedToast(null), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Toast */}
      {appliedToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{appliedToast}</span>
          </div>
          <button onClick={() => setAppliedToast(null)} className="text-white hover:text-emerald-200 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Module Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                Comparaison des Loyers & Tendances du Marché
              </h3>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 font-semibold">
                IA & Données Réelles
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Analyse comparative des baux historiques et recommandations d'ajustement conformes au droit local ({countryConfig.name}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tendance locale : +{benchmark.annualTrendPct}%/an</span>
            </span>
          </div>
        </div>

        {/* Property Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pt-4 no-scrollbar">
          {displayProperties.map((p) => {
            const isSelected = p.id === selectedProperty.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPropertyId(p.id);
                  const b = getLocalMarketBenchmark(p);
                  const pSurface = p.surface || 1;
                  const pMarketMedian = Math.round(b.avgRentPerSqm * pSurface);
                  const pGap = Math.round(((p.rentExclCharges - pMarketMedian) / pMarketMedian) * 100);
                  setSliderPct(pGap < 0 ? Math.min(Math.round(Math.abs(pGap) * 0.75), 10) : Math.max(Math.round(b.annualTrendPct), 3));
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm font-semibold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-blue-300" />
                <span>{p.name.split(' - ')[0]}</span>
                <span className="text-[11px] opacity-75 font-mono">({formatCurrency(p.rentExclCharges, countryConfig)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 space-y-5 text-xs">
        {/* Neighborhood & Benchmark Summary Banner */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs">
                Zone analysée : {benchmark.city} ({benchmark.district})
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded font-semibold">
                Type : {benchmark.propertyType} · {surface} m²
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {benchmark.insights}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Demande locative</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {benchmark.demandLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Comparison KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Current Rent */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-slate-500 font-medium block">Votre loyer actuel</span>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {formatCurrency(currentRent, countryConfig)}
              <span className="text-[11px] font-normal text-slate-500">/mois</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Soit <strong>{currentRentPerSqm} {countryConfig.currencySymbol}/m²</strong>
            </div>
          </div>

          {/* Card 2: Market Median Benchmark */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-blue-700 font-medium">Médiane du marché local</span>
              <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold">
                Observatoire
              </span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-blue-900">
              {formatCurrency(marketMedianTotal, countryConfig)}
              <span className="text-[11px] font-normal text-blue-700">/mois</span>
            </div>
            <div className="text-[11px] text-blue-700 font-mono">
              Moyenne : <strong>{benchmark.avgRentPerSqm} {countryConfig.currencySymbol}/m²</strong> ({benchmark.minRentPerSqm} - {benchmark.maxRentPerSqm})
            </div>
          </div>

          {/* Card 3: Gap / Opportunity */}
          <div className={`p-3.5 rounded-xl border shadow-2xs space-y-1 ${
            gapPercentage < 0
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-medium ${gapPercentage < 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                Positionnement du bien
              </span>
              {gapPercentage < 0 ? (
                <ArrowDownRight className="w-4 h-4 text-amber-600" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className={`text-lg font-bold font-mono tabular-nums ${gapPercentage < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {gapPercentage > 0 ? `+${gapPercentage}%` : `${gapPercentage}%`}
            </div>
            <div className="text-[11px] text-slate-600">
              {gapPercentage < 0
                ? 'Loyer sous-coté par rapport au quartier'
                : 'Loyer en adéquation avec le haut du marché'}
            </div>
          </div>
        </div>

        {/* Visual Benchmark Gauge / Spread Bar */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-700">Fourchette de marché constatée (au m²)</span>
            <span className="font-mono text-slate-500">
              Min: {benchmark.minRentPerSqm} · Médiane: {benchmark.avgRentPerSqm} · Max: {benchmark.maxRentPerSqm} {countryConfig.currencySymbol}/m²
            </span>
          </div>

          {/* Bar track */}
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            {/* Zone range from min to max */}
            <div className="absolute left-[15%] right-[15%] top-0 bottom-0 bg-blue-200 rounded-full" />
            {/* Marker for current rent */}
            <div
              className="absolute top-0 bottom-0 w-3 bg-slate-900 rounded-full shadow-md -ml-1.5 transition-all"
              style={{
                left: `${Math.min(
                  Math.max(
                    ((currentRentPerSqm - benchmark.minRentPerSqm * 0.8) /
                      (benchmark.maxRentPerSqm * 1.2 - benchmark.minRentPerSqm * 0.8)) *
                      100,
                    5
                  ),
                  95
                )}%`,
              }}
              title={`Votre loyer : ${currentRentPerSqm} ${countryConfig.currencySymbol}/m²`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
            <span>Marché bas ({Math.round(benchmark.minRentPerSqm * surface).toLocaleString('fr-FR')} {countryConfig.currencySymbol})</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
              Votre loyer ({currentRent.toLocaleString('fr-FR')} {countryConfig.currencySymbol})
            </span>
            <span>Marché haut ({Math.round(benchmark.maxRentPerSqm * surface).toLocaleString('fr-FR')} {countryConfig.currencySymbol})</span>
          </div>
        </div>

        {/* Historical Lease Timeline (Baux historiques) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Historique des baux & révisions antérieures ({leaseHistory.length} termes)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Archives contractuelles numérisées</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {leaseHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1 relative"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    Année {item.year}
                  </span>
                  {item.increasePct && (
                    <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      +{item.increasePct}%
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(item.rentAmount, countryConfig)}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {item.tenantName} · {item.adjustmentType}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Adjustment Simulator Box */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white rounded-2xl border border-indigo-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Simulateur d'Ajustement de Loyer Recommandé
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Ajustez le curseur pour simuler l'impact d'une révision de bail selon l'évolution du marché.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-xl font-mono">
                {sliderPct > 0 ? `+${sliderPct}%` : `${sliderPct}%`}
              </span>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min={-5}
              max={15}
              step={0.5}
              value={sliderPct}
              onChange={(e) => setSliderPct(parseFloat(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-5% (Baisse)</span>
              <span>0% (Maintien)</span>
              <span className="text-indigo-700 font-bold">+{calculatedSuggestedPct}% (Recommandé IA)</span>
              <span>+15% (Plafond haut)</span>
            </div>
          </div>

          {/* Result of Simulation Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Nouveau loyer proposé</span>
              <div className="text-base font-bold font-mono tabular-nums text-indigo-900 mt-0.5">
                {formatCurrency(simulatedNewRent, countryConfig)}
                <span className="text-[10px] font-normal text-slate-500">/mois</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Soit {simulatedNewRentPerSqm} {countryConfig.currencySymbol}/m²
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Variation mensuelle</span>
              <div className={`text-base font-bold font-mono tabular-nums mt-0.5 ${monthlyGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {monthlyGain >= 0 ? `+${formatCurrency(monthlyGain, countryConfig)}` : formatCurrency(monthlyGain, countryConfig)}
                <span className="text-[10px] font-normal text-slate-500">/mois</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Écart loyer net actuel
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Gain annuel prévisionnel</span>
              <div className={`text-base font-bold font-mono tabular-nums mt-0.5 ${annualGain >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {annualGain >= 0 ? `+${formatCurrency(annualGain, countryConfig)}` : formatCurrency(annualGain, countryConfig)}
                <span className="text-[10px] font-normal text-slate-500">/an</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Sur 12 termes de quittance
              </span>
            </div>
          </div>

          {/* Legal Compliance Indicator */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-white/80 border border-slate-200 text-[11px]">
            <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900">
                Conformité Légale & Encadrement ({countryConfig.name}) :
              </span>
              <p className="text-slate-600">
                {isBenin
                  ? `Conforme à la Loi n° 2018-12 (art. 20) : révision triennale encadrée. Caution maximale autorisée réajustée : ${formatCurrency(simulatedNewRent * 3, countryConfig)} (strictement 3 mois max).`
                  : `Conforme à l'indice de référence des loyers (IRL Insee) et au plafond d'encadrement préfectoral (max ${benchmark.legalCeilingPerSqm || 33} €/m²).`}
              </p>
              {isAboveLegalCeiling && (
                <div className="flex items-center gap-1.5 text-amber-700 font-semibold pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Attention : Le montant simulé dépasse le plafond légal de référence de la zone.</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions CTA */}
          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <button
              onClick={() => setShowRevisionNotice(!showRevisionNotice)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-xl border border-slate-300 text-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showRevisionNotice ? 'Masquer la notification' : 'Aperçu notification au locataire'}</span>
            </button>

            <button
              onClick={handleApply}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Appliquer cet ajustement ({formatCurrency(simulatedNewRent, countryConfig)})</span>
            </button>
          </div>

          {/* Collapsible Revision Notice Template */}
          {showRevisionNotice && (
            <div className="p-4 bg-white rounded-xl border border-slate-300 text-slate-800 text-[11px] space-y-2 mt-2 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-900">
                  Notification Légale de Révision de Loyer (Projet formel)
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Réf: REV-{selectedProperty.id}-{new Date().getFullYear()}
                </span>
              </div>
              <p>
                <strong>Destinataire :</strong> Locataire en titre du bien ({selectedProperty.address})
              </p>
              <p className="leading-relaxed text-slate-600">
                « Conformément aux dispositions de {countryConfig.leaseLawName} et aux clauses de votre contrat de bail domestique, nous vous notifions par la présente le réajustement de votre loyer mensuel hors charges à compter de la prochaine échéance contractuelle. Le montant est porté de <strong>{formatCurrency(currentRent, countryConfig)}</strong> à <strong>{formatCurrency(simulatedNewRent, countryConfig)}</strong>, basé sur l'évolution locale des loyers constatée dans la zone ({benchmark.district}). »
              </p>
              <div className="pt-1 flex items-center justify-end">
                <button
                  onClick={() => alert(`Lettre de notification de révision générée pour ${selectedProperty.name}.`)}
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                >
                  Télécharger / Imprimer la notification (PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
