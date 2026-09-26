import {
  Property,
  Tenant,
  TechnicalTicket,
  RentReceipt,
  PaymentTransaction,
  PropertyDocument,
  Message,
  SecurityAudit,
  DisputeRecourse,
  UserSession,
  CountryCode,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_TENANTS,
  INITIAL_TICKETS,
  INITIAL_RECEIPTS,
  INITIAL_PAYMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_RECOURSES,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER_SESSION: 'immogest_user_session',
  COUNTRY: 'immogest_selected_country',
  PROPERTIES: 'immogest_properties_db',
  TENANTS: 'immogest_tenants_db',
  TICKETS: 'immogest_tickets_db',
  RECEIPTS: 'immogest_receipts_db',
  PAYMENTS: 'immogest_payments_db',
  DOCUMENTS: 'immogest_documents_db',
  MESSAGES: 'immogest_messages_db',
  AUDIT_LOGS: 'immogest_audit_db',
  RECOURSES: 'immogest_recourses_db',
};

export const storageService = {
  // Session
  getSession(): UserSession {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
    // Default active session: Propriétaire/Gestionnaire Bénin (Sylvestre Bocco context)
    return {
      id: 'usr-bj-01',
      name: 'Sylvestre Bocco (Bailleur & Gestionnaire)',
      email: 'boccosylvestre5@gmail.com',
      role: 'gestionnaire',
      country: 'BJ',
      phone: '+229 97 12 34 56',
      ifuOrSiret: '3201810459201',
      isLoggedIn: true,
    };
  },

  setSession(session: UserSession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    }
  },

  // Active Country
  getCountry(): CountryCode {
    const c = localStorage.getItem(STORAGE_KEYS.COUNTRY);
    return (c as CountryCode) || 'BJ'; // Default to Bénin
  },

  setCountry(country: CountryCode): void {
    localStorage.setItem(STORAGE_KEYS.COUNTRY, country);
  },

  // Database collections with fallback to mock data
  getProperties(): Property[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_PROPERTIES;
  },

  saveProperties(props: Property[]): void {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
  },

  getTenants(): Tenant[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TENANTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_TENANTS;
  },

  saveTenants(tenants: Tenant[]): void {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  },

  getTickets(): TechnicalTicket[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_TICKETS;
  },

  saveTickets(tickets: TechnicalTicket[]): void {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  getReceipts(): RentReceipt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_RECEIPTS;
  },

  saveReceipts(receipts: RentReceipt[]): void {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  },

  getPayments(): PaymentTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_PAYMENTS;
  },

  savePayments(payments: PaymentTransaction[]): void {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getDocuments(): PropertyDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  },

  saveDocuments(docs: PropertyDocument[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getRecourses(): DisputeRecourse[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECOURSES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_RECOURSES;
  },

  saveRecourses(recourses: DisputeRecourse[]): void {
    localStorage.setItem(STORAGE_KEYS.RECOURSES, JSON.stringify(recourses));
  },

  getMessages(): Message[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_MESSAGES;
  },

  saveMessages(messages: Message[]): void {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  getAuditLogs(): SecurityAudit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  },

  saveAuditLogs(logs: SecurityAudit[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  // Backup & Restore Database
  exportFullDatabase(): string {
    const data = {
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      country: this.getCountry(),
      properties: this.getProperties(),
      tenants: this.getTenants(),
      receipts: this.getReceipts(),
      payments: this.getPayments(),
      tickets: this.getTickets(),
      documents: this.getDocuments(),
      recourses: this.getRecourses(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.properties) this.saveProperties(parsed.properties);
      if (parsed.tenants) this.saveTenants(parsed.tenants);
      if (parsed.receipts) this.saveReceipts(parsed.receipts);
      if (parsed.payments) this.savePayments(parsed.payments);
      if (parsed.tickets) this.saveTickets(parsed.tickets);
      if (parsed.documents) this.saveDocuments(parsed.documents);
      if (parsed.recourses) this.saveRecourses(parsed.recourses);
      if (parsed.country) this.setCountry(parsed.country);
      return true;
    } catch (e) {
      console.error('Failed to parse database backup', e);
      return false;
    }
  },

  resetToDefaults(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
