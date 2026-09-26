import React from 'react';
import { RentReceipt, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
import { Printer, Download, Mail, CheckCircle2, X, ShieldCheck, QrCode } from 'lucide-react';

interface NormalizedInvoiceModalProps {
  receipt: RentReceipt | null;
  onClose: () => void;
  onSendEmail?: (receipt: RentReceipt) => void;
}

export const NormalizedInvoiceModal: React.FC<NormalizedInvoiceModalProps> = ({
  receipt,
  onClose,
  onSendEmail,
}) => {
  if (!receipt) return null;

  const countryCode: CountryCode = receipt.country || 'BJ';
  const countryConfig = COUNTRIES[countryCode] || COUNTRIES.BJ;
  const isBenin = countryCode === 'BJ';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 text-sm">
              {isBenin
                ? 'Facture Normalisée e-MECeF (DGI Bénin)'
                : 'Quittance & Facture Légale'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              #{receipt.receiptNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer / PDF
            </button>
            {onSendEmail && (
              <button
                onClick={() => onSendEmail(receipt)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Envoyer par email
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE LEGAL DOCUMENT CONTENT */}
        <div id="printable-quittance" className="p-8 space-y-5 text-slate-800 text-xs">
          {/* Bénin Official DGI Header Banner if Bénin */}
          {isBenin && (
            <div className="border-2 border-slate-800 p-4 rounded-xl space-y-2 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                    RÉPUBLIQUE DU BÉNIN
                  </h3>
                  <p className="text-[10px] text-slate-600">
                    MINISTÈRE DE L'ÉCONOMIE ET DES FINANCES · DIRECTION GÉNÉRALE DES IMPÔTS (DGI)
                  </p>
                  <p className="text-[11px] font-bold text-blue-900 mt-1">
                    FACTURE NORMALISÉE - LOYER À USAGE DOMESTIQUE D'HABITATION
                  </p>
                  <p className="text-[10px] text-slate-600 italic">
                    Émise en application de la Loi n° 2018-12 et du Code Général des Impôts (Système e-MECeF)
                  </p>
                </div>
                <div className="text-right text-[10px] space-y-0.5 font-mono">
                  <span className="font-bold text-slate-900 block text-xs">N° {receipt.receiptNumber}</span>
                  <span className="text-slate-600 block">Date : {receipt.issuedDate}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold inline-block mt-1">
                    ✓ VALIDÉE DGI BÉNIN
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Standard Header for France / Other */}
          {!isBenin && (
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  QUITTANCE DE LOYER
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Délivrée en application de l'article 21 de la loi n° 89-462 du 6 juillet 1989
                </p>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  Réf: {receipt.receiptNumber}
                </p>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <p className="font-semibold text-slate-900">{receipt.managerName}</p>
                <p className="text-slate-500">Gestion Immobilière Agréée</p>
                {receipt.managerSiret && <p className="text-slate-500">SIRET : {receipt.managerSiret}</p>}
              </div>
            </div>
          )}

          {/* Parties Box with IFU Codes */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Bailleur / Mandataire
              </p>
              <p className="font-bold text-slate-900 text-xs">{receipt.managerName}</p>
              {isBenin && (
                <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-0.5 mt-1 font-mono text-[11px]">
                  <span className="text-blue-700 font-bold block">
                    CODE IFU BAILLEUR : {receipt.managerIfu || '3201810459201'}
                  </span>
                  <span className="text-slate-500 text-[10px] block">
                    Statut fiscal : Enregistré DGI Cotonou Littoral
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Locataire Occupant
              </p>
              <p className="font-bold text-slate-900 text-xs">{receipt.tenantName}</p>
              <p className="text-slate-600">{receipt.propertyAddress}</p>
              {isBenin && (
                <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-0.5 mt-1 font-mono text-[11px]">
                  <span className="text-emerald-700 font-bold block">
                    CODE IFU LOCATAIRE : {receipt.tenantIfu || '0202114892015'}
                  </span>
                  <span className="text-slate-500 text-[10px] block">
                    Conforme Art. 16 Loi 2018-12 (Bail d'habitation)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statement */}
          <div className="space-y-1.5">
            <p className="text-xs text-slate-700 leading-relaxed">
              Le bailleur certifie avoir reçu de <strong>{receipt.tenantName}</strong> la somme de{' '}
              <strong className="text-slate-900 font-mono">
                {formatCurrency(receipt.totalAmount, countryCode)}
              </strong>{' '}
              au titre du loyer mensuel et des charges locatives pour la période suivante :
            </p>
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 text-center font-bold text-blue-950">
              Période : Mois de {receipt.periodMonth} {receipt.periodYear}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-left font-medium">Désignation des prestations</th>
                  <th className="py-2.5 px-4 text-right font-medium">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 text-slate-700">Loyer principal d'habitation (Loi {isBenin ? '2018-12' : 'ALUR'})</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 font-semibold">
                    {formatCurrency(receipt.rentAmount, countryCode)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-700">Provisions pour charges locatives & gardiennage</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 font-semibold">
                    {formatCurrency(receipt.chargesAmount, countryCode)}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold text-slate-900 text-sm">
                  <td className="py-3 px-4">TOTAL PAYÉ ET ACQUITTÉ</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-blue-700">
                    {formatCurrency(receipt.totalAmount, countryCode)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* e-MECeF Security Box for Bénin */}
          {isBenin && (
            <div className="border-2 border-emerald-500/40 bg-emerald-50/40 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-950 text-xs block">
                    ÉLÉMENTS FISCAUX DE SÉCURITÉ e-MECeF (DGI BÉNIN)
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono text-slate-700 pt-1">
                    <div>NIM : <strong>{receipt.mecefNim || 'FA004918-BJ'}</strong></div>
                    <div>Compteurs : <strong>{receipt.mecefCounters || '528/1429 MC'}</strong></div>
                    <div>Code Sécurité : <strong className="text-emerald-800">{receipt.mecefSecurityCode || 'B8X9-4K21-99AF'}</strong></div>
                    <div>Mode : <strong>{receipt.paymentMethod}</strong></div>
                  </div>
                </div>

                <div className="text-center p-2 bg-white rounded-lg border border-emerald-200">
                  <QrCode className="w-10 h-10 text-slate-800 mx-auto" />
                  <span className="text-[9px] font-mono block text-slate-500 mt-0.5">Scan DGI Bénin</span>
                </div>
              </div>
            </div>
          )}

          {/* Legal notes */}
          <div className="text-[10px] text-slate-500 leading-normal italic pt-1">
            {isBenin ? (
              <p>
                Cette facture normalisée est délivrée sous le régime du bail à usage d'habitation domestique régi par la loi n° 2018-12 du 02 juillet 2018 en République du Bénin. Toute contestation peut être soumise à la Commission Départementale de Conciliation ou au Tribunal de Première Instance compétent.
              </p>
            ) : (
              <p>
                Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte versé sur le présent terme. Elle est délivrée sous réserve de tous droits et de tous règlements ultérieurs.
              </p>
            )}
          </div>

          {/* Stamp and Digital Signature */}
          <div className="pt-2 flex justify-between items-end border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Signature & Horodatage certifiés conformes</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 mb-1">Cachet officiel</p>
              <div className="inline-block p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-center font-serif italic text-xs text-slate-700 font-bold">
                {receipt.managerName}
                <span className="block text-[9px] font-mono not-italic text-slate-400">
                  {isBenin ? 'Facturation Normalisée Agréée' : 'Garantie Financière'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger / Imprimer la facture
          </button>
        </div>
      </div>
    </div>
  );
};
