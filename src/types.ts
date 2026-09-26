export type Role = 'gestionnaire' | 'locataire';

export type CountryCode = 'BJ' | 'FR' | 'CI' | 'SN';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  taxIdName: string; // e.g. "Code IFU"
  taxIdPlaceholder: string;
  invoiceStandardName: string; // e.g. "Facture Normalisée e-MECeF"
  leaseLawName: string; // e.g. "Loi n° 2018-12 portant régime du bail à usage d'habitation domestique en République du Bénin"
  recourseAuthority: string; // e.g. "Commission de conciliation / Tribunal de Première Instance"
  depositMaxMonths: number;
  depositLimitMonths?: number;
  evictionNoticeDelay?: string;
}

export type PropertyType = 'Appartement' | 'Maison' | 'Studio' | 'Loft' | 'Immeuble' | 'Villa';

export type PropertyStatus = 'Loué' | 'Vacant' | 'En rénovation';

export type DPERating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: CountryCode;
  type: PropertyType;
  surface: number; // m²
  rooms: number;
  floor?: string;
  rentExclCharges: number;
  charges: number;
  deposit: number;
  dpe: DPERating;
  status: PropertyStatus;
  imageUrl: string;
  buildingName?: string;
  tenantId?: string;
  leaseHistory?: LeaseHistoryEntry[];
}

export interface LeaseHistoryEntry {
  year: number;
  date: string;
  rentAmount: number;
  chargesAmount: number;
  tenantName: string;
  adjustmentType: 'Bail initial' | 'Révision triennale' | 'Indexation IRL' | 'Réévaluation marché';
  increasePct?: number;
}

export interface LocalMarketBenchmark {
  city: string;
  district: string;
  propertyType: PropertyType;
  avgRentPerSqm: number;
  minRentPerSqm: number;
  maxRentPerSqm: number;
  annualTrendPct: number;
  demandLevel: 'Très forte' | 'Forte' | 'Équilibrée';
  legalCeilingPerSqm?: number;
  insights: string;
}


export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  country: CountryCode;
  leaseStartDate: string;
  leaseEndDate: string;
  paymentStatus: 'A_JOUR' | 'EN_ATTENTE' | 'RETARD';
  balanceDue: number;
  daysLate?: number;
  avatarUrl?: string;
  // Specific country identification & tax data
  ifuNumber?: string; // Bénin (Identifiant Fiscal Unique à 13 chiffres)
  idCardNumber?: string; // N° CIP ou CNI
  profession?: string;
  address?: string;
  emergencyContact?: string;
}

export type TicketCategory =
  | 'Plomberie'
  | 'Électricité'
  | 'Chauffage & Clim'
  | 'Serrurerie'
  | 'Parties Communes'
  | 'Autre';

export type TicketPriority = 'Urgente' | 'Normale' | 'Faible';

export type TicketStatus =
  | 'SIGNALÉ'
  | 'PRIS_EN_CHARGE'
  | 'ARTISAN_ASSIGNÉ'
  | 'EN_COURS'
  | 'TERMINÉ'
  | 'VALIDÉ';

export interface TicketUpdate {
  timestamp: string;
  step: string;
  note: string;
  notifiedVia: ('SMS' | 'Email' | 'Push')[];
}

export interface TechnicalTicket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  propertyId: string;
  propertyName: string;
  tenantId: string;
  tenantName: string;
  reportedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  description: string;
  artisanName?: string;
  artisanPhone?: string;
  estimatedCost?: number;
  photoUrl?: string;
  updates: TicketUpdate[];
}

export interface RentReceipt {
  id: string;
  receiptNumber: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  periodMonth: string; // e.g., "Septembre"
  periodYear: number;
  rentAmount: number;
  chargesAmount: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: 'Virement SEPA' | 'Prélèvement' | 'Carte Bancaire' | 'Chèque' | 'Mobile Money (MTN/Moov)' | 'Virement';
  issuedDate: string;
  managerName: string;
  country: CountryCode;
  currency?: string;
  // Tax & Legal compliance
  managerSiret?: string; // France
  managerIfu?: string; // Bénin (IFU du bailleur / mandataire)
  tenantIfu?: string; // Bénin (IFU du locataire)
  mecefNim?: string; // Machine e-MECeF DGI Bénin
  mecefCounters?: string; // Ex: 412/1089 MC
  mecefSecurityCode?: string; // Code de sécurité DGI
  mecefQrCodeData?: string;
  lawReference?: string;
}

export interface PaymentTransaction {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  currency?: string;
  type: 'Loyer mensuel' | 'Charges Copropriété' | 'Régularisation charges' | 'Dépôt de garantie';
  date: string;
  status: 'Validé' | 'En attente' | 'En retard' | 'Relancé';
  reference: string;
  method: 'Carte Bancaire' | 'Prélèvement SEPA' | 'Virement' | 'Virement SEPA' | 'Mobile Money (MTN/Moov)';
}

export type DocumentCategory =
  | 'Contrat de Bail'
  | 'État des Lieux'
  | 'Attestation Assurance'
  | 'Diagnostic DPE'
  | 'Règlement Copropriété'
  | 'Quittance';

export interface PropertyDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  propertyId: string;
  propertyName: string;
  tenantName?: string;
  uploadDate: string;
  fileSize: string;
  fileFormat: 'PDF' | 'JPG' | 'PNG';
  isValidated: boolean;
  expiryDate?: string;
  country?: CountryCode;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Gestionnaire' | 'Locataire' | 'Syndic';
  channel: 'direct' | 'copro';
  content: string;
  timestamp: string;
  isRead: boolean;
  isEncrypted: boolean;
}

export interface SecurityAudit {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'Succès' | 'Avertissement' | 'MFA Requis';
  details: string;
}

export type RecourseMotif =
  | 'DEPASSEMENT_CAUTION'
  | 'LOYER_IMPAYE'
  | 'NON_DELIVRANCE_FACTURE_NORMALISEE'
  | 'CONGE_ABUSIF'
  | 'VETUSTE_NON_REPAREE'
  | 'AUGMENTATION_ILLEGALE_LOYER'
  | 'AUTRE';

export interface DisputeRecourse {
  id: string;
  trackingNumber: string;
  country: CountryCode;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  filedBy: 'Locataire' | 'Bailleur';
  motif: RecourseMotif;
  title: string;
  description: string;
  claimedAmount?: number;
  filedDate: string;
  legalBasis: string;
  authorityName: string;
  status: 'DEPOSE' | 'EN_CONCILIATION' | 'MISE_EN_DEMEURE_NOTIFIEE' | 'RESOLU' | 'AUDIENCE_PROGRAMMEE' | 'TRANSMIS';
  notes: string[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  country: CountryCode;
  phone: string;
  ifuOrSiret?: string;
  isLoggedIn: boolean;
}

