import React, { useState } from 'react';
import { CountryCode, DisputeRecourse, RecourseMotif, Property, Tenant } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
import {
  Scale,
  AlertTriangle,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  X,
  FileCheck,
  ChevronRight,
  Gavel,
  BookOpen,
} from 'lucide-react';

interface LeaseRecourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: CountryCode;
  properties: Property[];
  tenants: Tenant[];
  recourses: DisputeRecourse[];
  onAddRecourse: (recourse: Omit<DisputeRecourse, 'id' | 'trackingNumber' | 'filedDate' | 'status' | 'notes'>) => void;
}

export const LeaseRecourseModal: React.FC<LeaseRecourseModalProps> = ({
  isOpen,
  onClose,
  country,
  properties,
  tenants,
  recourses,
  onAddRecourse,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const countryConfig = COUNTRIES[country] || COUNTRIES.BJ;
  const isBenin = country === 'BJ';

  // New Recourse Form State
  const [filedBy, setFiledBy] = useState<'Locataire' | 'Bailleur'>('Locataire');
  const [motif, setMotif] = useState<RecourseMotif>(isBenin ? 'DEPASSEMENT_CAUTION' : 'LOYER_IMPAYE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [claimedAmount, setClaimedAmount] = useState<number>(100000);
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [tenantId, setTenantId] = useState(tenants[0]?.id || '');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const selectedProp = properties.find((p) => p.id === propertyId);
  const selectedTenant = tenants.find((t) => t.id === tenantId);

  const getLegalBasis = (selectedMotif: RecourseMotif) => {
    if (isBenin) {
      switch (selectedMotif) {
        case 'DEPASSEMENT_CAUTION':
          return 'Article 15 de la Loi n° 2018-12 : Le cautionnement ne peut excéder trois (03) mois de loyer en République du Bénin.';
        case 'LOYER_IMPAYE':
          return 'Articles 34 et 35 de la Loi n° 2018-12 : Procédure de mise en demeure préalable sous 15 jours avant résiliation judiciaire.';
        case 'NON_DELIVRANCE_FACTURE_NORMALISEE':
          return 'Code Général des Impôts du Bénin & Loi de Finances : Obligation stricte de délivrance de Facture Normalisée e-MECeF avec Code IFU.';
        case 'CONGE_ABUSIF':
          return 'Article 26 de la Loi n° 2018-12 : Préavis légal impératif de 3 mois pour le bailleur et motifs légitimes de reprise.';
        default:
          return 'Loi n° 2018-12 portant régime du bail à usage d\'habitation domestique en République du Bénin.';
      }
    }
    return `${countryConfig.leaseLawName} - Commission Départementale de Conciliation`;
  };

  const handleCreateRecourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddRecourse({
      country,
      tenantId,
      tenantName: selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : 'Locataire',
      propertyId,
      propertyName: selectedProp ? selectedProp.name : 'Bien immobilier',
      filedBy,
      motif,
      title: title.trim(),
      description: description.trim(),
      claimedAmount: claimedAmount || undefined,
      legalBasis: getLegalBasis(motif),
      authorityName: countryConfig.recourseAuthority,
    });

    setSubmittedNotice(`✓ Votre saisine de recours a été enregistrée avec succès sous le régime légal : ${countryConfig.name}.`);
    setActiveTab('list');
    setTitle('');
    setDescription('');
    setTimeout(() => setSubmittedNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                Recours en Ligne du Contrat de Bail à Usage Domestique
              </h3>
              <p className="text-xs text-slate-300">
                {countryConfig.flag} {countryConfig.name} · {countryConfig.leaseLawName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'list'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Dossiers de Recours & Litiges ({recourses.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'new'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            + Déposer un Recours / Saisine en Ligne
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {submittedNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{submittedNotice}</span>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              {/* Jurisdiction Legal Notice */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-slate-700">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Gavel className="w-4 h-4 text-blue-700" />
                  <span>Cadre Légal & Autorités de Conciliation ({countryConfig.name})</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {isBenin ? (
                    <>
                      Conformément à la <strong>Loi n° 2018-12 du 02 juillet 2018</strong>, tout litige né du contrat de bail à usage d'habitation domestique (loyer impayé, dépassement de la caution légale de 3 mois, non-délivrance de la facture normalisée e-MECeF) est obligatoirement instruit auprès de la <em>Commission Départementale de Conciliation des Loyers</em> avant toute saisine du Tribunal de Première Instance.
                    </>
                  ) : (
                    <>
                      Toute réclamation relative au contrat de bail d'habitation peut être instruite par la <em>Commission Départementale de Conciliation</em> ou la juridiction de proximité.
                    </>
                  )}
                </p>
              </div>

              {/* Recourses List */}
              <div className="space-y-3">
                {recourses.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                            {rec.trackingNumber}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              rec.status === 'RESOLU'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'MISE_EN_DEMEURE_NOTIFIEE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {rec.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{rec.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          Déposé par le <strong>{rec.filedBy}</strong> ({rec.tenantName}) · {rec.propertyName}
                        </p>
                      </div>

                      {rec.claimedAmount && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Montant en litige</span>
                          <span className="font-mono font-bold text-xs text-rose-700">
                            {formatCurrency(rec.claimedAmount, country)}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {rec.description}
                    </p>

                    <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      <div><strong>Fondement juridique :</strong> {rec.legalBasis}</div>
                      <div><strong>Autorité compétente :</strong> {rec.authorityName}</div>
                      {rec.notes.length > 0 && (
                        <div className="bg-slate-100/60 p-2 rounded text-[10px] text-slate-700 font-mono">
                          {rec.notes[rec.notes.length - 1]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <form onSubmit={handleCreateRecourse} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Auteur de la saisine</label>
                  <select
                    value={filedBy}
                    onChange={(e) => setFiledBy(e.target.value as 'Locataire' | 'Bailleur')}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="Locataire">Locataire (Contestation / Réclamation)</option>
                    <option value="Bailleur">Bailleur / Propriétaire (Mise en demeure)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Motif principal du recours</label>
                  <select
                    value={motif}
                    onChange={(e) => setMotif(e.target.value as RecourseMotif)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    {isBenin && (
                      <option value="DEPASSEMENT_CAUTION">
                        ⚠️ Caution &gt; 3 mois (Violation Art. 15 Loi 2018-12)
                      </option>
                    )}
                    {isBenin && (
                      <option value="NON_DELIVRANCE_FACTURE_NORMALISEE">
                        📄 Défaut de délivrance Facture Normalisée IFU (DGI)
                      </option>
                    )}
                    <option value="LOYER_IMPAYE">
                      🛑 Loyer impayé & Mise en demeure préalable
                    </option>
                    <option value="CONGE_ABUSIF">
                      🚪 Congé ou résiliation abusive de bail
                    </option>
                    <option value="VETUSTE_NON_REPAREE">
                      🛠️ Gros travaux à charge bailleur non exécutés
                    </option>
                    <option value="AUGMENTATION_ILLEGALE_LOYER">
                      📈 Augmentation illégale du loyer
                    </option>
                    <option value="AUTRE">Autre motif de litige locatif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">
                  Intitulé du recours (ex: Demande de remboursement du surplus de caution)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Objet formel de la saisine..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Bien concerné</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-medium block mb-1">Montant réclamé ({countryConfig.currencySymbol})</label>
                  <input
                    type="number"
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">
                  Description détaillée des faits et dates clés
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Exposez précisément la chronologie des événements, échanges par écrit et violations constatées du contrat de bail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              {/* Automatic Legal Reference box */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-[11px] space-y-1">
                <span className="font-bold block">Base juridique automatique :</span>
                <p>{getLegalBasis(motif)}</p>
                <span className="text-[10px] text-emerald-800 block pt-0.5">
                  Autorité de notification : {countryConfig.recourseAuthority}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enregistrer & Transmettre le recours</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Plateforme de médiation conforme au droit immobilier international</span>
          <button onClick={onClose} className="text-slate-700 font-medium hover:underline">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
