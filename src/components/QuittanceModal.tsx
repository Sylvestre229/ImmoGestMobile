import React from 'react';
import { RentReceipt } from '../types';
import { Printer, Download, Mail, CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface QuittanceModalProps {
  receipt: RentReceipt | null;
  onClose: () => void;
  onSendEmail?: (receipt: RentReceipt) => void;
}

export const QuittanceModal: React.FC<QuittanceModalProps> = ({
  receipt,
  onClose,
  onSendEmail,
}) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 text-base">
              Quittance de Loyer Officielle
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

        {/* Printable Legal Document Content */}
        <div id="printable-quittance" className="p-8 space-y-6 text-slate-800 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
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
              <p className="text-slate-500">SIRET : {receipt.managerSiret}</p>
              <p className="text-slate-500">Garantie Financière SOCAF</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl text-xs">
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">
                Bailleur / Mandataire
              </p>
              <p className="font-semibold text-slate-900">{receipt.managerName}</p>
              <p className="text-slate-600">12 Place de la Madeleine</p>
              <p className="text-slate-600">75008 Paris</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider mb-1">
                Locataire
              </p>
              <p className="font-semibold text-slate-900">{receipt.tenantName}</p>
              <p className="text-slate-600">{receipt.propertyAddress}</p>
            </div>
          </div>

          {/* Statement */}
          <div className="space-y-2">
            <p className="text-xs text-slate-700 leading-relaxed">
              Je soussigné, mandataire du bailleur du logement situé au{' '}
              <strong>{receipt.propertyAddress}</strong>, certifie avoir reçu de{' '}
              <strong>{receipt.tenantName}</strong> la somme de{' '}
              <strong className="text-slate-900">{receipt.totalAmount.toLocaleString('fr-FR')} €</strong> au titre du loyer et des provisions pour charges pour la période de location suivante :
            </p>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-center">
              <span className="text-sm font-semibold text-blue-950">
                Période : Mois de {receipt.periodMonth} {receipt.periodYear}
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-left font-medium">Désignation</th>
                  <th className="py-2.5 px-4 text-right font-medium">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 text-slate-700">Loyer principal mensuel (hors charges)</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                    {receipt.rentAmount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-700">Provision pour charges locatives récupérables</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                    {receipt.chargesAmount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
                <tr className="bg-slate-50 font-semibold text-slate-900">
                  <td className="py-3 px-4">TOTAL REÇU ET ACQUITTÉ</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-base text-blue-700">
                    {receipt.totalAmount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Info & Legal Notice */}
          <div className="text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span>Date de règlement : {receipt.paymentDate}</span>
              <span>Mode de paiement : {receipt.paymentMethod}</span>
              <span>Date d'émission : {receipt.issuedDate}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal italic">
              Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte versé sur le présent terme. Elle est délivrée sous réserve de tous droits et de tous règlements ultérieurs.
            </p>
          </div>

          {/* Stamp and Digital Signature */}
          <div className="pt-4 flex justify-between items-end">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Signature numérique certifiée eIDAS / SHA-256</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Pour le bailleur & le gestionnaire</p>
              <div className="inline-block p-3 border border-slate-200 rounded-lg bg-slate-50/50 text-center">
                <span className="font-serif italic font-bold text-slate-700 text-sm block">
                  ImmoGest Patrimoine
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Cachet Électronique Sécurisé
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger / Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};
