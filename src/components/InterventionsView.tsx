import React, { useState } from 'react';
import { TechnicalTicket, TicketStatus, TicketUpdate } from '../types';
import {
  Wrench,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Phone,
  User,
  Plus,
  Send,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  BellRing,
} from 'lucide-react';

interface InterventionsViewProps {
  tickets: TechnicalTicket[];
  onOpenNewTicket: () => void;
  onUpdateTicketStatus: (
    ticketId: string,
    newStatus: TicketStatus,
    note: string,
    artisanName?: string,
    scheduledDate?: string
  ) => void;
}

export const InterventionsView: React.FC<InterventionsViewProps> = ({
  tickets,
  onOpenNewTicket,
  onUpdateTicketStatus,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(tickets[0]?.id || null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Status progression order
  const STEPS: { status: TicketStatus; label: string; desc: string }[] = [
    { status: 'SIGNALÉ', label: '1. Signalé', desc: 'Déclaration transmise' },
    { status: 'PRIS_EN_CHARGE', label: '2. Pris en charge', desc: 'Dossier qualifié' },
    { status: 'ARTISAN_ASSIGNÉ', label: '3. Artisan assigné', desc: 'Rendez-vous fixé' },
    { status: 'EN_COURS', label: '4. En cours', desc: 'Travaux sur site' },
    { status: 'TERMINÉ', label: '5. Terminé', desc: 'Réparation validée' },
    { status: 'VALIDÉ', label: '6. Clôturé', desc: 'Conforme locataire' },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'active') return t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ';
    if (activeFilter === 'completed') return t.status === 'TERMINÉ' || t.status === 'VALIDÉ';
    return true;
  });

  const getStepIndex = (status: TicketStatus) => {
    return STEPS.findIndex((s) => s.status === status);
  };

  const handleAdvanceStatus = (ticket: TechnicalTicket) => {
    const currentIndex = getStepIndex(ticket.status);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      const customNote = `Passage à l'étape : ${nextStep.label}. Notification automatique SMS & Email transmise au locataire.`;

      onUpdateTicketStatus(ticket.id, nextStep.status, customNote);

      setNotificationToast(
        `📲 Notification SMS & Email envoyée à ${ticket.tenantName} : "${nextStep.label} - ${ticket.title}"`
      );
      setTimeout(() => {
        setNotificationToast(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-4 pb-8 text-xs">
      {/* Toast Notification Simulation */}
      {notificationToast && (
        <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-96 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
          <BellRing className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-[11px] leading-tight flex-1">
            <span className="font-semibold block text-emerald-300">Notification en direct</span>
            <span>{notificationToast}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Suivi des Interventions Techniques
          </h2>
          <p className="text-slate-500">
            Planification, suivi temps réel et notifications automatiques SMS/Email
          </p>
        </div>
        <button
          onClick={onOpenNewTicket}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle intervention</span>
        </button>
      </div>

      {/* Segmented Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'active'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          En cours ({tickets.filter((t) => t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ').length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'completed'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Terminées ({tickets.filter((t) => t.status === 'TERMINÉ' || t.status === 'VALIDÉ').length})
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Toutes ({tickets.length})
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((tkt) => {
          const currentStepIdx = getStepIndex(tkt.status);
          const isExpanded = expandedDetailsId === tkt.id;

          return (
            <div
              key={tkt.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all p-4 space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      #{tkt.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tkt.priority === 'Urgente'
                          ? 'bg-rose-100 text-rose-800'
                          : tkt.priority === 'Normale'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tkt.priority}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {tkt.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{tkt.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    {tkt.propertyName} · Déclaré par {tkt.tenantName}
                  </p>
                </div>

                {/* Quick Advance Button for Managers */}
                {tkt.status !== 'VALIDÉ' && (
                  <button
                    onClick={() => handleAdvanceStatus(tkt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors shrink-0 shadow-xs"
                    title="Valider l'étape suivante et notifier le locataire"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Étape suivante</span>
                  </button>
                )}
              </div>

              {/* Progress Steps Timeline */}
              <div className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                  <span className="text-slate-500">Statut d'avancement transparent :</span>
                  <span className="text-blue-700 font-bold">
                    {STEPS[currentStepIdx]?.label}
                  </span>
                </div>

                {/* Mobile Stepper Bar */}
                <div className="grid grid-cols-6 gap-1">
                  {STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.status} className="space-y-1 text-center">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isDone ? 'bg-blue-600' : 'bg-slate-200'
                          } ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                        />
                        <span
                          className={`text-[9px] block truncate ${
                            isDone ? 'text-slate-900 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {step.status === 'ARTISAN_ASSIGNÉ' ? 'Artisan' : step.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scheduled Date & Artisan Info */}
              {(tkt.artisanName || tkt.scheduledDate) && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">
                        {tkt.artisanName || 'Artisan en cours d\'attribution'}
                      </span>
                      {tkt.artisanPhone && (
                        <span className="text-slate-500 block">
                          Tél : {tkt.artisanPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  {tkt.scheduledDate && (
                    <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rendez-vous : {tkt.scheduledDate.replace('T', ' à ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-slate-600 text-xs leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                {tkt.description}
              </p>

              {/* Collapsible Detailed History & Notifications Audit */}
              <div>
                <button
                  onClick={() =>
                    setExpandedDetailsId(isExpanded ? null : tkt.id)
                  }
                  className="flex items-center justify-between w-full text-slate-500 hover:text-slate-800 text-[11px] font-medium pt-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Historique détaillé des étapes ({tkt.updates.length} événements)
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    {tkt.updates.map((up, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 text-[11px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">
                            {up.step.replace('_', ' ')}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {up.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-normal">{up.note}</p>
                        <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-700">
                          <span className="flex items-center gap-1">
                            <Send className="w-3 h-3 text-emerald-600" />
                            Canaux notifiés : {up.notifiedVia.join(' + ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
