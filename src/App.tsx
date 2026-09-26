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
  CountryCode,
  DisputeRecourse,
  UserSession,
} from './types';
import { LoginPage } from './components/LoginPage';
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
import { NormalizedInvoiceModal } from './components/NormalizedInvoiceModal';
import { TenantDatabaseModal } from './components/TenantDatabaseModal';
import { LeaseRecourseModal } from './components/LeaseRecourseModal';
import { RelanceModal } from './components/RelanceModal';
import { PaymentModal } from './components/PaymentModal';
import { NewInterventionModal } from './components/NewInterventionModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { NotificationsDropdown, AppNotification } from './components/NotificationsDropdown';
import { storageService } from './services/storageService';
import { COUNTRIES, formatCurrency } from './data/countries';

export default function App() {
  // User Session & Country
  const [session, setSession] = useState<UserSession | null>(() => storageService.getSession());
  const [currentCountry, setCurrentCountry] = useState<CountryCode>(() => storageService.getCountry());

  // App view modes
  const [currentRole, setCurrentRole] = useState<Role>(() => session?.role || 'gestionnaire');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Core Data States (persistent in localStorage with fallback to mock data)
  const [properties, setProperties] = useState<Property[]>(() => storageService.getProperties());
  const [tenants, setTenants] = useState<Tenant[]>(() => storageService.getTenants());
  const [tickets, setTickets] = useState<TechnicalTicket[]>(() => storageService.getTickets());
  const [receipts, setReceipts] = useState<RentReceipt[]>(() => storageService.getReceipts());
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => storageService.getPayments());
  const [documents, setDocuments] = useState<PropertyDocument[]>(() => storageService.getDocuments());
  const [messages, setMessages] = useState<Message[]>(() => storageService.getMessages());
  const [auditLogs, setAuditLogs] = useState<SecurityAudit[]>(() => storageService.getAuditLogs());
  const [recourses, setRecourses] = useState<DisputeRecourse[]>(() => storageService.getRecourses());

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Intervention planifiée',
      message: 'Technicien Froid & Clim confirmé pour samedi à 15h00 (Haie Vive).',
      timestamp: 'Il y a 2h',
      type: 'intervention',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Alerte impayé & relance légale',
      message: 'Koffi Mensah présente 11 jours de retard de loyer (200 000 FCFA). Code IFU vérifié.',
      timestamp: 'Ce matin',
      type: 'impaye',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Facture Normalisée e-MECeF émise',
      message: 'Facture FN-BJ-2026-09-0012 validée DGI Bénin pour Sylvestre Bocco (380 000 FCFA).',
      timestamp: 'Hier',
      type: 'quittance',
      read: true,
    },
  ]);

  // Modals state
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<RentReceipt | null>(null);
  const [selectedReceiptForInvoice, setSelectedReceiptForInvoice] = useState<RentReceipt | null>(null);
  const [selectedTenantForRelance, setSelectedTenantForRelance] = useState<Tenant | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isTenantDatabaseOpen, setIsTenantDatabaseOpen] = useState<boolean>(false);
  const [isRecourseModalOpen, setIsRecourseModalOpen] = useState<boolean>(false);

  // Authentication Handlers
  const handleLoginSuccess = (newSession: UserSession) => {
    storageService.setSession(newSession);
    storageService.setCountry(newSession.country);
    setSession(newSession);
    setCurrentCountry(newSession.country);
    setCurrentRole(newSession.role);

    // Add audit log
    const auditEntry: SecurityAudit = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: `Connexion sécurisée 2FA (${newSession.role})`,
      user: newSession.email,
      ip: newSession.country === 'BJ' ? '154.68.22.10 (Cotonou, BJ)' : '82.127.14.92 (Paris, FR)',
      status: 'Succès',
      details: `Authentification multifacteur validée. Juridiction active : ${newSession.country}.`,
    };
    const updatedAudit = [auditEntry, ...auditLogs];
    setAuditLogs(updatedAudit);
    storageService.saveAuditLogs(updatedAudit);
  };

  const handleLogout = () => {
    storageService.setSession(null);
    setSession(null);
  };

  const handleCountryChange = (country: CountryCode) => {
    setCurrentCountry(country);
    storageService.setCountry(country);
    if (session) {
      const updated = { ...session, country };
      setSession(updated);
      storageService.setSession(updated);
    }
  };

  // Status & Progress update handler
  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    note: string,
    artisanName?: string,
    scheduledDate?: string
  ) => {
    const updatedTickets = tickets.map((t) => {
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
              notifiedVia: ['SMS', 'Email', 'Push'] as ('SMS' | 'Email' | 'Push')[],
            },
          ],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    storageService.saveTickets(updatedTickets);

    // Create notification
    const tkt = tickets.find((t) => t.id === ticketId);
    if (tkt) {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Mise à jour réparation : ${tkt.title}`,
        message: `Statut passé à "${newStatus.replace('_', ' ')}". Notification SMS et email transmise à ${tkt.tenantName}.`,
        timestamp: 'À l\'instant',
        type: 'intervention',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Add audit log
      const updatedAudit = [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          action: `Mise à jour ticket ${ticketId} -> ${newStatus}`,
          user: session?.email || 'admin@immogest.com',
          ip: currentCountry === 'BJ' ? '154.68.22.10 (Cotonou, BJ)' : '82.127.14.92 (Paris, FR)',
          status: 'Succès' as const,
          details: `Envoi automatique SMS et Email de notification conforme à la transparence locative.`,
        },
        ...auditLogs,
      ];
      setAuditLogs(updatedAudit);
      storageService.saveAuditLogs(updatedAudit);
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
          notifiedVia: ['Push', 'Email'] as ('SMS' | 'Email' | 'Push')[],
        },
      ],
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    storageService.saveTickets(updated);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Nouvelle intervention : ${ticketData.title}`,
        message: `Signalé pour ${ticketData.propertyName}. Prise en charge immédiate.`,
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
    const updated = [...properties, { ...newProp, id, country: currentCountry }];
    setProperties(updated);
    storageService.saveProperties(updated);
  };

  // Add Document
  const handleUploadDocument = (doc: Omit<PropertyDocument, 'id' | 'uploadDate'>) => {
    const newDoc: PropertyDocument = {
      ...doc,
      id: `doc-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().slice(0, 10),
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    storageService.saveDocuments(updated);
  };

  // Send message
  const handleSendMessage = (content: string, channel: 'direct' | 'copro') => {
    const isGest = currentRole === 'gestionnaire';
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: isGest ? 'manager' : 'ten-1',
      senderName: session?.name || (isGest ? 'Sylvestre Bocco (Bailleur)' : 'Camille / Locataire'),
      senderRole: isGest ? 'Gestionnaire' : 'Locataire',
      channel,
      content,
      timestamp: 'À l\'instant',
      isRead: true,
      isEncrypted: true,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    storageService.saveMessages(updated);

    // Simulated responsive reply if sent by tenant
    if (!isGest && channel === 'direct') {
      setTimeout(() => {
        const autoReply: Message = {
          id: `msg-reply-${Date.now()}`,
          senderId: 'manager',
          senderName: 'Sylvestre Bocco (Bailleur & Gestionnaire)',
          senderRole: 'Gestionnaire',
          channel: 'direct',
          content: 'Bien reçu votre message, nous prenons en charge votre demande dans les meilleurs délais conformément aux dispositions de votre bail.',
          timestamp: 'À l\'instant',
          isRead: false,
          isEncrypted: true,
        };
        setMessages((prev) => {
          const next = [...prev, autoReply];
          storageService.saveMessages(next);
          return next;
        });
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
    const updatedAudit = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        action: `Déclenchement Relance Niveau ${level} (${channel})`,
        user: session?.email || 'boccosylvestre5@gmail.com',
        ip: currentCountry === 'BJ' ? '154.68.22.10 (Cotonou, BJ)' : '82.127.14.92 (Paris, FR)',
        status: 'Succès' as const,
        details: `Notification légale d'impayé transmise à ${ten.firstName} ${ten.lastName} (${ten.phone} / ${ten.email}). IFU: ${ten.ifuNumber || 'N/A'}.`,
      },
      ...auditLogs,
    ];
    setAuditLogs(updatedAudit);
    storageService.saveAuditLogs(updatedAudit);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Relance impayé Niveau ${level} transmise`,
        message: `Envoyée par ${channel} à ${ten.firstName} ${ten.lastName} avec accusé de réception certifié.`,
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
    const countryCfg = COUNTRIES[currentCountry] || COUNTRIES.BJ;
    const isBenin = currentCountry === 'BJ';

    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      date: today,
      currency: countryCfg.currencyCode,
    };
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    storageService.savePayments(updatedPayments);

    // If it's rent, auto-generate official rent receipt / normalized invoice
    if (paymentData.type === 'Loyer mensuel') {
      const newReceipt: RentReceipt = {
        id: `rcp-${Date.now()}`,
        receiptNumber: isBenin
          ? `FN-BJ-${new Date().getFullYear()}-09-${Date.now().toString().slice(-4)}`
          : `QUIT-${new Date().getFullYear()}-09-${Date.now().toString().slice(-3)}`,
        propertyId: paymentData.propertyId,
        tenantId: paymentData.tenantId,
        tenantName: paymentData.tenantName,
        propertyAddress: isBenin
          ? 'Lot 142 Rue des Palmiers, Quartier Haie Vive, Cotonou'
          : '42 Rue du Faubourg Saint-Honoré, 75008 Paris',
        periodMonth: 'Septembre',
        periodYear: 2026,
        rentAmount: isBenin ? 350000 : 2450,
        chargesAmount: isBenin ? 30000 : 250,
        totalAmount: paymentData.amount,
        paymentDate: today,
        paymentMethod: paymentData.method as any,
        issuedDate: today,
        country: currentCountry,
        managerName: isBenin ? 'Sylvestre Bocco - Gestion Immobilière' : 'ImmoGest Patrimoine SARL',
        managerSiret: isBenin ? '3201810459201' : '849 203 112 00019',
        tenantIfu: isBenin ? '0202114892015' : undefined,
        mecefCounters: isBenin ? `10/42 FV ${Date.now().toString().slice(-4)}` : undefined,
        mecefSecurityCode: isBenin ? 'A9D2-88EF-771B-9430' : undefined,
        lawReference: countryCfg.leaseLawName,
      };

      const updatedReceipts = [newReceipt, ...receipts];
      setReceipts(updatedReceipts);
      storageService.saveReceipts(updatedReceipts);

      // Add to GED documents
      const updatedDocs = [
        {
          id: `doc-${Date.now()}`,
          title: isBenin ? `Facture Normalisée e-MECeF - Septembre 2026` : `Quittance de Loyer - Septembre 2026`,
          category: 'Quittance' as const,
          propertyId: paymentData.propertyId,
          propertyName: paymentData.propertyName,
          tenantName: paymentData.tenantName,
          uploadDate: today,
          fileSize: '480 Ko',
          fileFormat: 'PDF' as const,
          isValidated: true,
        },
        ...documents,
      ];
      setDocuments(updatedDocs);
      storageService.saveDocuments(updatedDocs);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Paiement sécurisé validé',
        message: `Règlement de ${paymentData.amount.toLocaleString('fr-FR')} ${countryCfg.currencySymbol} encaissé. Facture normalisée disponible.`,
        timestamp: 'À l\'instant',
        type: 'quittance',
        read: false,
      },
      ...prev,
    ]);
  };

  // Generate Quittance / Normalized Invoice
  const handleGenerateQuittance = (propertyId: string, month: string, year: number) => {
    const prop = properties.find((p) => p.id === propertyId);
    const ten = tenants.find((t) => t.propertyId === propertyId) || tenants[0];
    const today = new Date().toISOString().slice(0, 10);
    const isBenin = currentCountry === 'BJ';
    const countryCfg = COUNTRIES[currentCountry] || COUNTRIES.BJ;

    const newReceipt: RentReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNumber: isBenin
        ? `FN-BJ-${year}-09-${Date.now().toString().slice(-4)}`
        : `QUIT-${year}-09-${Date.now().toString().slice(-3)}`,
      propertyId,
      tenantId: ten?.id || 'ten-bj-1',
      tenantName: ten ? `${ten.firstName} ${ten.lastName}` : 'Sylvestre Bocco',
      propertyAddress: prop ? `${prop.address}, ${prop.postalCode} ${prop.city}` : 'Quartier Haie Vive, Cotonou',
      periodMonth: month,
      periodYear: year,
      rentAmount: prop ? prop.rentExclCharges : (isBenin ? 350000 : 2450),
      chargesAmount: prop ? prop.charges : (isBenin ? 30000 : 250),
      totalAmount: prop ? prop.rentExclCharges + prop.charges : (isBenin ? 380000 : 2700),
      paymentDate: today,
      paymentMethod: 'Virement SEPA',
      issuedDate: today,
      country: currentCountry,
      managerName: isBenin ? 'Sylvestre Bocco - Gestion Immobilière' : 'ImmoGest Patrimoine SARL',
      managerSiret: isBenin ? '3201810459201' : '849 203 112 00019',
      tenantIfu: ten?.ifuNumber || (isBenin ? '0202114892015' : undefined),
      mecefCounters: isBenin ? `12/50 FV ${Date.now().toString().slice(-4)}` : undefined,
      mecefSecurityCode: isBenin ? 'B7C1-44E2-9901-FA88' : undefined,
      lawReference: countryCfg.leaseLawName,
    };

    const updated = [newReceipt, ...receipts];
    setReceipts(updated);
    storageService.saveReceipts(updated);
  };

  // Add / Edit Tenant in Database
  const handleSaveTenant = (savedTenant: Tenant) => {
    const exists = tenants.some((t) => t.id === savedTenant.id);
    let updated: Tenant[];
    if (exists) {
      updated = tenants.map((t) => (t.id === savedTenant.id ? savedTenant : t));
    } else {
      updated = [savedTenant, ...tenants];
    }
    setTenants(updated);
    storageService.saveTenants(updated);

    // Audit log
    const updatedAudit = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        action: exists ? `Modification locataire ${savedTenant.id}` : `Création locataire ${savedTenant.id}`,
        user: session?.email || 'admin@immogest.com',
        ip: currentCountry === 'BJ' ? '154.68.22.10 (Cotonou, BJ)' : '82.127.14.92 (Paris, FR)',
        status: 'Succès' as const,
        details: `Sauvegarde en base de données : ${savedTenant.firstName} ${savedTenant.lastName} (IFU: ${savedTenant.ifuNumber || 'N/A'}).`,
      },
      ...auditLogs,
    ];
    setAuditLogs(updatedAudit);
    storageService.saveAuditLogs(updatedAudit);
  };

  const handleDeleteTenant = (tenantId: string) => {
    const updated = tenants.filter((t) => t.id !== tenantId);
    setTenants(updated);
    storageService.saveTenants(updated);
  };

  // Add Legal Recourse
  const handleAddRecourse = (recourseData: Omit<DisputeRecourse, 'id' | 'trackingNumber' | 'filedDate' | 'status' | 'notes'>) => {
    const countryCfg = COUNTRIES[currentCountry] || COUNTRIES.BJ;
    const newRecourse: DisputeRecourse = {
      ...recourseData,
      id: `rec-${Date.now()}`,
      trackingNumber: `REC-${currentCountry}-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      filedDate: new Date().toISOString().slice(0, 10),
      status: 'TRANSMIS',
      notes: [`Dossier de recours en ligne déposé sous le régime légal : ${countryCfg.leaseLawName}.`],
    };

    const updated = [newRecourse, ...recourses];
    setRecourses(updated);
    storageService.saveRecourses(updated);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Recours en ligne déposé : ${newRecourse.trackingNumber}`,
        message: `Saisine pour "${newRecourse.title}" transmise à ${newRecourse.authorityName}.`,
        timestamp: 'À l\'instant',
        type: 'impaye',
        read: false,
      },
      ...prev,
    ]);
  };

  // Apply Rent Adjustment based on market comparison & lease history
  const handleApplyRentAdjustment = (propertyId: string, newRent: number) => {
    const updatedProps = properties.map((p) =>
      p.id === propertyId ? { ...p, rentExclCharges: newRent } : p
    );
    setProperties(updatedProps);
    storageService.saveProperties(updatedProps);

    const prop = properties.find((p) => p.id === propertyId);
    const countryCfg = COUNTRIES[currentCountry] || COUNTRIES.BJ;

    // Add security audit entry
    const auditEntry: SecurityAudit = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action: `Ajustement de loyer de marché (${prop?.name || propertyId})`,
      user: session?.email || 'admin@immogest.com',
      ip: currentCountry === 'BJ' ? '154.68.22.10 (Cotonou, BJ)' : '82.127.14.92 (Paris, FR)',
      status: 'Succès',
      details: `Loyer actualisé à ${formatCurrency(newRent, countryCfg)}/mois conformément aux tendances du marché local et baux antérieurs.`,
    };
    const updatedAudit = [auditEntry, ...auditLogs];
    setAuditLogs(updatedAudit);
    storageService.saveAuditLogs(updatedAudit);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Loyer réajusté : ${prop?.name}`,
        message: `Porté à ${formatCurrency(newRent, countryCfg)}/mois après analyse de l'observatoire local des baux.`,
        timestamp: 'À l\'instant',
        type: 'quittance',
        read: false,
      },
      ...prev,
    ]);
  };

  // IF NOT LOGGED IN -> Show Authentication Page
  if (!session || !session.isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        defaultCountry={currentCountry}
      />
    );
  }

  // Active counts for badges
  const activeTicketsCount = tickets.filter(
    (t) => t.status !== 'TERMINÉ' && t.status !== 'VALIDÉ'
  ).length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Select appropriate active tenant for the resident portal
  const activeTenant = tenants.find((t) => t.email === session.email) ||
    tenants.find((t) => t.country === currentCountry) ||
    tenants[0];
  const activeProperty = properties.find((p) => p.id === activeTenant.propertyId) || properties[0];

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
        currentCountry={currentCountry}
        onCountryChange={handleCountryChange}
        onOpenTenantDatabase={() => setIsTenantDatabaseOpen(true)}
        onOpenRecourse={() => setIsRecourseModalOpen(true)}
        session={session}
        onLogout={handleLogout}
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
              tenant={activeTenant}
              property={activeProperty}
              tickets={tickets}
              receipts={receipts}
              documents={documents}
              country={currentCountry}
              onOpenPayment={() => setIsPaymentModalOpen(true)}
              onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
              onOpenNormalizedInvoice={(rcp) => setSelectedReceiptForInvoice(rcp)}
              onOpenRecourse={() => setIsRecourseModalOpen(true)}
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
                  country={currentCountry}
                  onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
                  onOpenRelance={(ten) => setSelectedTenantForRelance(ten)}
                  onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
                  onOpenNormalizedInvoice={(rcp) => setSelectedReceiptForInvoice(rcp)}
                  onOpenPayment={() => setIsPaymentModalOpen(true)}
                  onOpenTenantDatabase={() => setIsTenantDatabaseOpen(true)}
                  onOpenRecourse={() => setIsRecourseModalOpen(true)}
                  onApplyRentAdjustment={handleApplyRentAdjustment}
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
                  country={currentCountry}
                  onOpenQuittance={(rcp) => setSelectedReceiptForModal(rcp)}
                  onOpenNormalizedInvoice={(rcp) => setSelectedReceiptForInvoice(rcp)}
                  onOpenRelance={(ten) => setSelectedTenantForRelance(ten)}
                  onOpenPayment={() => setIsPaymentModalOpen(true)}
                  onGenerateQuittance={handleGenerateQuittance}
                  onOpenTenantDatabase={() => setIsTenantDatabaseOpen(true)}
                  onOpenRecourse={() => setIsRecourseModalOpen(true)}
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

      <NormalizedInvoiceModal
        receipt={selectedReceiptForInvoice}
        onClose={() => setSelectedReceiptForInvoice(null)}
        onSendEmail={(rcp) => {
          alert(`Facture normalisée e-MECeF n°${rcp.receiptNumber} transmise par e-mail avec Code IFU à ${rcp.tenantName}.`);
          setSelectedReceiptForInvoice(null);
        }}
      />

      <TenantDatabaseModal
        isOpen={isTenantDatabaseOpen}
        onClose={() => setIsTenantDatabaseOpen(false)}
        country={currentCountry}
        tenants={tenants}
        properties={properties}
        onSaveTenant={handleSaveTenant}
        onDeleteTenant={handleDeleteTenant}
        onOpenRelance={(ten) => {
          setSelectedTenantForRelance(ten);
          setIsTenantDatabaseOpen(false);
        }}
      />

      <LeaseRecourseModal
        isOpen={isRecourseModalOpen}
        onClose={() => setIsRecourseModalOpen(false)}
        country={currentCountry}
        properties={properties}
        tenants={tenants}
        recourses={recourses}
        onAddRecourse={handleAddRecourse}
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
        defaultAmount={currentCountry === 'BJ' ? 380000 : 2700}
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

