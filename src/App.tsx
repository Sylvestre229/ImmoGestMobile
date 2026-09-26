/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Property,
  Tenant,
  TechnicalTicket,
  RentReceipt,
  PaymentTransaction,
  PropertyDocument,
  Message,
  SecurityAudit,
  Role,
  TicketStatus,
} from './types';
import {
  INITIAL_PROPERTIES,
  INITIAL_TENANTS,
  INITIAL_TICKETS,
  INITIAL_RECEIPTS,
  INITIAL_PAYMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { InterventionsView } from './components/InterventionsView';
import { FinancesView } from './components/FinancesView';
import { DocumentsView } from './components/DocumentsView';
import { MessagingView } from './components/MessagingView';
import { TenantPortalView } from './components/TenantPortalView';
import { QuittanceModal } from './components/QuittanceModal';
import { RelanceModal } from './components/RelanceModal';
import { PaymentModal } from './components/PaymentModal';
import { NewInterventionModal } from './components/NewInterventionModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { NotificationsDropdown, AppNotification } from './components/NotificationsDropdown';

export default function App() {
  // App view modes
  const [currentRole, setCurrentRole] = useState<Role>('gestionnaire');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Core Data States
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [tickets, setTickets] = useState<TechnicalTicket[]>(INITIAL_TICKETS);
  const [receipts, setReceipts] = useState<RentReceipt[]>(INITIAL_RECEIPTS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [documents, setDocuments] = useState<PropertyDocument[]>(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<SecurityAudit[]>(INITIAL_AUDIT_LOGS);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Intervention planifiée',
      message: 'Plombier Patrick Leroy confirmé pour le 27/09 à 14h00 (Saint-Honoré).',
      timestamp: 'Il y a 2h',
      type: 'intervention',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Alerte impayé',
      message: 'Thomas Durand présente 12 jours de retard de loyer (1 850 €).',
      timestamp: 'Ce matin',
      type: 'impaye',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Quittance émise',
      message: 'Quittance Septembre 2026 générée pour Camille de Saint-Sauveur.',
      timestamp: 'Hier',
      type: 'quittance',
      read: true,
    },
  ]);

  // Modals state
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<RentReceipt | null>(null);
  const [selectedTenantForRelance, setSelectedTenantForRelance] = useState<Tenant | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Status & Progress update handler
  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    note: string,
    artisanName?: string,
    scheduledDate?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const nowStr = new Date().toLocaleString('fr-FR', {
            dateStyle: 'short',
            timeStyle: 'short',
          });
          return {
            ...t,
            status: newStatus,
            artisanName: artisanName || t.artisanName,
            scheduledDate: scheduledDate || t.scheduledDate,
            updates: [
              ...t.updates,
              {
                timestamp: nowStr,
                step: newStatus,
                note,
                notifiedVia: ['SMS', 'Email', 'Push'],
              },
            ],
          };
        }
        return t;
      })
    );

    // Create notification
    const tkt = tickets.find((t) => t.id === ticketId);
    if (tkt) {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Mise à jour réparation : ${tkt.title}`,
        message: `Statut passé à "${newStatus.replace('_', ' ')}". Notification SMS transmise à ${tkt.tenantName}.`,
        timestamp: 'À l\'instant',
        type: 'intervention',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Add audit log
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          action: `Mise à jour ticket ${ticketId} -> ${newStatus}`,
          user: currentRole === 'gestionnaire' ? 'sophie.vernier@immogest.fr' : 'Portail Résident',
          ip: '82.127.14.92 (Paris, FR)',
          status: 'Succès',
          details: `Envoi automatique SMS et Email de notification.`,
        },
        ...prev,
      ]);
    }
  };

  // Add new ticket
  const handleAddTicket = (ticketData: Omit<TechnicalTicket, 'id' | 'reportedDate' | 'updates'>) => {
    const newId = `tkt-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const newTicket: TechnicalTicket = {
      ...ticketData,
      id: newId,
      reportedDate: nowStr,
      updates: [
        {
          timestamp: formattedDate,
          step: 'SIGNALÉ',
          note: 'Incident déclaré via l\'application ImmoGest Mobile.',
          notifiedVia: ['Push', 'Email'],
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Nouvelle intervention : ${ticketData.title}`,
        message: `Signalé pour ${ticketData.propertyName}. Prise en charge en cours.`,
        timestamp: 'À l\'instant',
        type: 'intervention',
        read: false,
      },
      ...prev,
    ]);
  };

  // Add Property
  const handleAddProperty = (newProp: Omit<Property, 'id'>) => {
    const id = `prop-${Date.now().toString().slice(-4)}`;
    setProperties((prev) => [...prev, { ...newProp, id }]);
  };

  // Add Document
  const handleUploadDocument = (doc: Omit<PropertyDocument, 'id' | 'uploadDate'>) => {
    const newDoc: PropertyDocument = {
      ...doc,
      id: `doc-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().slice(0, 10),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Send message
  const handleSendMessage = (content: string, channel: 'direct' | 'copro') => {
    const isGest = currentRole === 'gestionnaire';
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: isGest ? 'manager' : 'ten-1',
      senderName: isGest ? 'Sophie Vernier (Gestionnaire)' : 'Camille de Saint-Sauveur',
      senderRole: isGest ? 'Gestionnaire' : 'Locataire',
      channel,
      content,
      timestamp: 'À l\'instant',
      isRead: true,
      isEncrypted: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated responsive reply if sent by tenant
    if (!isGest && channel === 'direct') {
      setTimeout(() => {
        const autoReply: Message = {
          id: `msg-reply-${Date.now()}`,
          senderId: 'manager',
          senderName: 'Sophie Vernier (Gestionnaire)',
          senderRole: 'Gestionnaire',
          channel: 'direct',
          content: 'Bien reçu Camille, nous prenons en charge votre demande immédiatement.',
          timestamp: 'À l\'instant',
          isRead: false,
          isEncrypted: true,
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 1500);
    }
  };

  // Handle Relance
  const handleSendRelance = (
    tenantId: string,
    level: number,
    channel: 'SMS' | 'Email' | 'Both',
    note: string
  ) => {
    const ten = tenants.find((t) => t.id === tenantId);
    if (!ten) return;

    // Log in audit
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        action: `Déclenchement Relance Niveau ${level} (${channel})`,
        user: 'sophie.vernier@immogest.fr',
        ip: '82.127.14.92 (Paris, FR)',
        status: 'Succès',
        details: `Notification transmise à ${ten.firstName} ${ten.lastName} (${ten.phone} / ${ten.email}).`,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Relance impayé Niveau ${level} envoyée`,
        message: `Transmise par ${channel} à ${ten.firstName} ${ten.lastName}.`,
        timestamp: 'À l\'instant',
        type: 'impaye',
        read: false,
      },
      ...prev,
    ]);
  };

  // Payment completed
  const handlePaymentComplete = (paymentData: Omit<PaymentTransaction, 'id' | 'date'>) => {
    const today = new Date().toISOString().slice(0, 10);
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      date: today,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // If it's rent, auto-generate official rent receipt
    if (paymentData.type === 'Loyer mensuel') {
      const newReceipt: RentReceipt = {
        id: `rcp-${Date.now()}`,
        receiptNumber: `QUIT-${new Date().getFullYear()}-09-${Date.now().toString().slice(-3)}`,
        propertyId: paymentData.propertyId,
        tenantId: paymentData.tenantId,
        tenantName: paymentData.tenantName,
        propertyAddress: '42 Rue du Faubourg Saint-Honoré, 75008 Paris',
        periodMonth: 'Septembre',
        periodYear: 2026,
        rentAmount: 2450,
        chargesAmount: 250,
        totalAmount: paymentData.amount,
        paymentDate: today,
        paymentMethod: paymentData.method as any,
        issuedDate: today,
        managerName: 'ImmoGest Patrimoine SARL',
        managerSiret: '849 203 112 00019',
      };
      setReceipts((prev) => [newReceipt, ...prev]);

      // Add to GED documents
      setDocuments((prev) => [
        {
          id: `doc-${Date.now()}`,
          title: `Quittance de Loyer - Septembre 2026`,
          category: 'Quittance',
          propertyId: paymentData.propertyId,
          propertyName: paymentData.propertyName,
          tenantName: paymentData.tenantName,
          uploadDate: today,
          fileSize: '420 Ko',
          fileFormat: 'PDF',
          isValidated: true,
        },
        ...prev,
      ]);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Paiement confirmé',
        message: `Règlement de ${paymentData.amount.toLocaleString('fr-FR')} € validé. Quittance disponible.`,
        timestamp: 'À l\'instant',
        type: 'quittance',
        read: false,
      },
      ...prev,
    ]);
  };

  // Generate Quittance
  const handleGenerateQuittance = (propertyId: string, month: string, year: number) => {
    const prop = properties.find((p) => p.id === propertyId);
    const ten = tenants.find((t) => t.propertyId === propertyId);
    const today = new Date().toISOString().slice(0, 10);

    const newReceipt: RentReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNumber: `QUIT-${year}-09-${Date.now().toString().slice(-3)}`,
      propertyId,
      tenantId: ten?.id || 'ten-1',
      tenantName: ten ? `${ten.firstName} ${ten.lastName}` : 'Camille de Saint-Sauveur',
      propertyAddress: prop ? `${prop.address}, ${prop.postalCode} ${prop.city}` : '42 Rue du Faubourg Saint-Honoré, 75008 Paris',
      periodMonth: month,
      periodYear: year,
      rentAmount: prop ? prop.rentExclCharges : 2450,
      chargesAmount: prop ? prop.charges : 250,
      totalAmount: prop ? prop.rentExclCharges + prop.charges : 2700,
      paymentDate: today,
      paymentMethod: 'Virement SEPA',
      issuedDate: today,
      managerName: 'ImmoGest Patrimoine SARL',
      managerSiret: '849 203 112 00019',
    };

    setReceipts((prev) => [newReceipt, ...prev]);
  };

  // Active counts for badges
  const activeTicketsCount = tickets.filter(
    (t) => t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ'
  ).length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Container (responsive or phone frame) */}
      <main className="flex-1 flex justify-center py-4 px-2 sm:px-4">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[420px] bg-slate-50 min-h-[820px] rounded-[42px] border-[10px] border-slate-900 shadow-2xl p-4 overflow-hidden relative'
              : 'max-w-4xl bg-slate-50 rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6'
          }`}
        >
          {/* Dynamic Island on mobile frame mode */}
          {isMobileFrame && (
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3" />
          )}

          {/* Persona Switch: If Locataire, render dedicated Tenant Portal, otherwise standard Management Suite */}
          {currentRole === 'locataire' ? (
            <TenantPortalView
              tenant={tenants[0]}
              property={properties[0]}
              tickets={tickets}
              receipts={receipts}
              documents={documents}
              onOpenPayment={() => setIsPaymentModalOpen(true)}
              onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
              onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
              onNavigateTab={(tab) => {
                setActiveTab(tab as TabType);
                setCurrentRole('gestionnaire');
              }}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  properties={properties}
                  tenants={tenants}
                  tickets={tickets}
                  receipts={receipts}
                  payments={payments}
                  onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
                  onOpenRelance={(ten) => setSelectedTenantForRelance(ten)}
                  onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
                  onOpenPayment={() => setIsPaymentModalOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'properties' && (
                <PropertiesView
                  properties={properties}
                  tenants={tenants}
                  onAddProperty={handleAddProperty}
                />
              )}

              {activeTab === 'interventions' && (
                <InterventionsView
                  tickets={tickets}
                  onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
                  onUpdateTicketStatus={handleUpdateTicketStatus}
                />
              )}

              {activeTab === 'finances' && (
                <FinancesView
                  receipts={receipts}
                  payments={payments}
                  tenants={tenants}
                  properties={properties}
                  onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
                  onOpenRelance={(ten) => setSelectedTenantForRelance(ten)}
                  onOpenPayment={() => setIsPaymentModalOpen(true)}
                  onGenerateQuittance={handleGenerateQuittance}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsView
                  documents={documents}
                  properties={properties}
                  onUploadDocument={handleUploadDocument}
                />
              )}

              {activeTab === 'messages' && (
                <MessagingView
                  messages={messages}
                  currentRole={currentRole}
                  onSendMessage={handleSendMessage}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Thumb-friendly Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (currentRole === 'locataire') {
            setCurrentRole('gestionnaire');
          }
        }}
        activeInterventionsCount={activeTicketsCount}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* MODALS */}
      <QuittanceModal
        receipt={selectedReceiptForModal}
        onClose={() => setSelectedReceiptForModal(null)}
        onSendEmail={(rcp) => {
          alert(`Quittance n°${rcp.receiptNumber} transmise par email certifié à ${rcp.tenantName}.`);
          setSelectedReceiptForModal(null);
        }}
      />

      <RelanceModal
        tenant={selectedTenantForRelance}
        property={properties.find((p) => p.id === selectedTenantForRelance?.propertyId)}
        onClose={() => setSelectedTenantForRelance(null)}
        onSendRelance={handleSendRelance}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultAmount={2700}
        onPaymentComplete={handlePaymentComplete}
      />

      <NewInterventionModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        properties={properties}
        onSubmit={handleAddTicket}
      />

      <SecurityAuditModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        auditLogs={auditLogs}
      />

      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          );
          if (notif.type === 'intervention') setActiveTab('interventions');
          else if (notif.type === 'impaye' || notif.type === 'quittance') setActiveTab('finances');
          else setActiveTab('messages');
          setIsNotificationsOpen(false);
        }}
      />
    </div>
  );
}
