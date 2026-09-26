import React, { useState } from 'react';
import { Tenant, Property } from '../types';
import { AlertTriangle, Send, Mail, MessageSquare, Check, X, ShieldAlert } from 'lucide-react';

interface RelanceModalProps {
  tenant: Tenant | null;
  property: Property | undefined;
  onClose: () => void;
  onSendRelance: (tenantId: string, level: number, channel: 'SMS' | 'Email' | 'Both', customNote: string) => void;
}

export const RelanceModal: React.FC<RelanceModalProps> = ({
  tenant,
  property,
  onClose,
  onSendRelance,
}) => {
  if (!tenant) return null;

  const [level, setLevel] = useState<1 | 2 | 3>(tenant.daysLate && tenant.daysLate > 15 ? 2 : 1);
  const [channel, setChannel] = useState<'Both' | 'Email' | 'SMS'>('Both');
  const [sentSuccess, setSentSuccess] = useState(false);

  const amount = tenant.balanceDue || (property ? property.rentExclCharges + property.charges : 1850);
  const days = tenant.daysLate || 12;

  const getTemplateText = () => {
    switch (level) {
      case 1:
        return {
          title: 'Niveau 1 — Relance amiable & rappel de courtoisie',
          subject: `Rappel de paiement de loyer — ${property?.name || 'Logement'}`,
          sms: `Bonjour ${tenant.firstName}, sauf erreur de notre part, votre loyer de ${amount} € pour le logement du ${property?.address || ''} n'a pas été reçu (retard : ${days} jours). Merci de procéder au règlement en ligne ou de nous contacter. Cordialement, ImmoGest.`,
          email: `Madame, Monsieur,\n\nSauf erreur ou retard d'acheminement bancaire de notre part, nous constatons que le loyer et les charges pour le mois en cours (${amount.toLocaleString('fr-FR')} €) concernant votre logement situé au ${property?.address || ''} n'ont pas encore été crédités sur notre compte.\n\nNous vous remercions de bien vouloir régulariser cette situation via votre espace locataire ImmoGest ou par virement bancaire.\n\nSi votre règlement a déjà été effectué entre-temps, veuillez ne pas tenir compte de cette relance.\n\nBien cordialement,\nLe service Gestion Locative ImmoGest.`,
        };
      case 2:
        return {
          title: 'Niveau 2 — 2ème Relance formelle (Avertissement)',
          subject: `URGENT : Deuxième rappel d'impayé de loyer (${days} jours de retard)`,
          sms: `URGENT : M. ${tenant.lastName}, malgré notre précédent rappel, votre loyer de ${amount} € reste impayé. Merci de régulariser sous 48h sur votre espace sécurisé pour éviter l'ouverture d'un dossier de contentieux.`,
          email: `Madame, Monsieur,\n\nMalgré notre première relance amiable, nous constatons à ce jour que votre compte locataire présente toujours un solde débiteur de ${amount.toLocaleString('fr-FR')} € (échéance échue depuis ${days} jours).\n\nNous vous mettons en demeure de régulariser cette somme sous un délai impératif de 48 heures ouvrées.\n\nÀ défaut de règlement ou de prise de contact pour établir un échéancier, nous serons contraints de transmettre ce dossier à notre service juridique pour engagement de la clause résolutoire du bail.\n\nRestant à votre disposition,\nLe service Recouvrement ImmoGest.`,
        };
      case 3:
        return {
          title: 'Niveau 3 — Mise en demeure préalable à procédure',
          subject: `MISE EN DEMEURE DE PAYER — Clause résolutoire de bail`,
          sms: `MISE EN DEMEURE : M. ${tenant.lastName}, le loyer de ${amount} € est en souffrance. Une lettre recommandée avec accusé de réception vous a été notifiée. Régularisation immédiate requise.`,
          email: `LETTRE RECOMMANDÉE ÉLECTRONIQUE AVEC ACCUSÉ DE RÉCEPTION\n\nMadame, Monsieur,\n\nPar la présente, nous vous mettons formellement EN DEMEURE de nous régler dans un délai de 8 jours à compter de la présente la somme de ${amount.toLocaleString('fr-FR')} € au titre des loyers et charges impayés pour votre logement du ${property?.address || ''}.\n\nÀ défaut de paiement intégral dans ce délai, il sera fait application immédiate de la clause résolutoire insérée dans votre contrat de bail d'habitation, et délivrance d'un commandement de payer par voie de commissaire de justice (huissier).\n\nLa présente notification vaut mise en demeure au sens de l'article 1344 du Code Civil.\n\nLa Direction Juridique ImmoGest.`,
        };
    }
  };

  const template = getTemplateText();

  const handleSend = () => {
    onSendRelance(tenant.id, level, channel, template.sms);
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Relance d'impayé de loyer
              </h3>
              <p className="text-xs text-slate-500">
                {tenant.firstName} {tenant.lastName} · {days} jours de retard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Summary Box */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-500 block">Montant en souffrance</span>
              <span className="text-lg font-bold font-mono tabular-nums text-rose-700">
                {amount.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Contact locataire</span>
              <span className="text-slate-800 font-medium block">{tenant.phone}</span>
              <span className="text-slate-500 text-[11px] block">{tenant.email}</span>
            </div>
          </div>

          {/* Level Selector */}
          <div>
            <label className="font-medium text-slate-700 mb-1.5 block">
              Gradation de la relance
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLevel(1)}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  level === 1
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-medium shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                1. Amiable
                <span className="block text-[10px] text-slate-500 mt-0.5">Rappel courtois</span>
              </button>
              <button
                type="button"
                onClick={() => setLevel(2)}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  level === 2
                    ? 'border-amber-600 bg-amber-50/80 text-amber-900 font-medium shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                2. Avertissement
                <span className="block text-[10px] text-slate-500 mt-0.5">Délai 48h</span>
              </button>
              <button
                type="button"
                onClick={() => setLevel(3)}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  level === 3
                    ? 'border-rose-600 bg-rose-50/80 text-rose-900 font-medium shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                3. Mise en demeure
                <span className="block text-[10px] text-slate-500 mt-0.5">LRAR contentieux</span>
              </button>
            </div>
          </div>

          {/* Channels */}
          <div>
            <label className="font-medium text-slate-700 mb-1.5 block">
              Canaux d'envoi automatique
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChannel('Both')}
                className={`flex-1 py-1.5 px-3 rounded-lg border text-center transition-colors ${
                  channel === 'Both'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                SMS & Email (Recommandé)
              </button>
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`py-1.5 px-3 rounded-lg border text-center transition-colors ${
                  channel === 'SMS'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                SMS seul
              </button>
              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`py-1.5 px-3 rounded-lg border text-center transition-colors ${
                  channel === 'Email'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Email seul
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="space-y-2">
            <span className="font-medium text-slate-700 block">
              Aperçu du message transmis ({template.title})
            </span>
            <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 space-y-2 text-slate-700">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium pb-1 border-b border-slate-200">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Format SMS & Push :</span>
              </div>
              <p className="text-[11px] leading-relaxed italic text-slate-800">
                "{template.sms}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg text-blue-800 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              L'historique de cette relance sera horodaté et conservé au dossier du locataire avec accusé de réception technique.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
          >
            Annuler
          </button>
          <button
            disabled={sentSuccess}
            onClick={handleSend}
            className={`flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white rounded-lg transition-all shadow-sm ${
              sentSuccess
                ? 'bg-emerald-600'
                : level === 3
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {sentSuccess ? (
              <>
                <Check className="w-4 h-4" /> Relance envoyée avec succès !
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Déclencher la relance {level === 3 ? 'formelle' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
