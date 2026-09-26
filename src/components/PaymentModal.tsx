import React, { useState } from 'react';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, X, Smartphone, ArrowRight } from 'lucide-react';
import { PaymentTransaction } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultTitle?: string;
  onPaymentComplete: (payment: Omit<PaymentTransaction, 'id' | 'date'>) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 2700,
  defaultTitle = 'Loyer mensuel - Septembre 2026',
  onPaymentComplete,
}) => {
  if (!isOpen) return null;

  const [paymentType, setPaymentType] = useState<'Loyer' | 'Charges'>('Loyer');
  const [method, setMethod] = useState<'CB' | 'SEPA' | 'ApplePay'>('CB');
  const [step, setStep] = useState<'FORM' | '3DSECURE' | 'SUCCESS'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [cardNumber, setCardNumber] = useState('4974 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('419');

  const amount = paymentType === 'Loyer' ? defaultAmount : 320;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('3DSECURE');
  };

  const handleValidate3DS = () => {
    setStep('SUCCESS');
    setTimeout(() => {
      onPaymentComplete({
        tenantId: 'ten-1',
        tenantName: 'Camille de Saint-Sauveur',
        propertyId: 'prop-1',
        propertyName: 'Appartement Haussmannien Saint-Honoré',
        amount: amount,
        type: paymentType === 'Loyer' ? 'Loyer mensuel' : 'Charges Copropriété',
        status: 'Validé',
        reference: `PAY-${Date.now().toString().slice(-6)}`,
        method: method === 'CB' ? 'Carte Bancaire' : method === 'SEPA' ? 'Prélèvement SEPA' : 'Carte Bancaire',
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm">Paiement Sécurisé ImmoGest Pay</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'FORM' && (
          <form onSubmit={handleStartPayment} className="p-6 space-y-4 text-xs">
            {/* Amount details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-500 block mb-1">Montant à régler</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                {amount.toLocaleString('fr-FR')} €
              </span>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('Loyer')}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    paymentType === 'Loyer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Loyer & Charges ({defaultAmount} €)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('Charges')}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    paymentType === 'Charges'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Charges Copropriété (320 €)
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="font-medium text-slate-700 mb-1.5 block">
                Moyen de règlement crypté
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('CB')}
                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-all ${
                    method === 'CB'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  Carte Bancaire
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('SEPA')}
                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-all ${
                    method === 'SEPA'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  Prélèvement SEPA
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('ApplePay')}
                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-all ${
                    method === 'ApplePay'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-slate-800" />
                  Apple Pay
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            {method === 'CB' && (
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Numéro de carte</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                    placeholder="4974 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      maxLength={4}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'SEPA' && (
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] text-slate-500 block">IBAN certifié pré-enregistré :</span>
                <span className="font-mono text-xs font-semibold text-slate-800 block">
                  FR76 3000 4008 1234 5678 9018 245
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Mandat de prélèvement B2C agréé Banque de France. Débit sous 24-48h.
                </span>
              </div>
            )}

            {method === 'ApplePay' && (
              <div className="p-3 bg-slate-100 rounded-xl text-center text-slate-700">
                <span>Touchez continuer pour valider avec FaceID ou TouchID.</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chiffrement TLS 1.3 de bout en bout · Conforme DSP2 & PCI-DSS</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <span>Régler {amount.toLocaleString('fr-FR')} €</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === '3DSECURE' && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Authentification Forte 3D-Secure</h4>
              <p className="text-xs text-slate-500 mt-1">
                Une notification de validation a été envoyée sur votre application bancaire (ou saisissez le code SMS reçu au 06 •• •• 56 78).
              </p>
            </div>
            <div className="max-w-xs mx-auto space-y-2">
              <input
                type="text"
                placeholder="Code à 6 chiffres (ex: 849201)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center text-base tracking-widest font-mono py-2.5 border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
              />
              <button
                type="button"
                onClick={handleValidate3DS}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors"
              >
                Confirmer l'opération bancaire
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Protocole Verified by Visa / Mastercard Identity Check.
            </p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Paiement validé avec succès !</h4>
              <p className="text-xs text-slate-500 mt-1">
                Le montant de {amount.toLocaleString('fr-FR')} € a été débité. La quittance officielle correspondante a été générée instantanément.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <span>Réf transaction : PAY-SECURE-99214 · Quittance mise à disposition.</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors"
            >
              Terminer & Consulter mon compte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
