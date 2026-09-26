export type Role = 'gestionnaire' | 'locataire';

export type PropertyType = 'Appartement' | 'Maison' | 'Studio' | 'Loft' | 'Immeuble';

export type PropertyStatus = 'Loué' | 'Vacant' | 'En rénovation';

export type DPERating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
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
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  paymentStatus: 'A_JOUR' | 'EN_ATTENTE' | 'RETARD';
  balanceDue: number;
  daysLate?: number;
  avatarUrl?: string;
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
  paymentMethod: 'Virement SEPA' | 'Prélèvement' | 'Carte Bancaire' | 'Chèque';
  issuedDate: string;
  managerName: string;
  managerSiret?: string;
}

export interface PaymentTransaction {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  type: 'Loyer mensuel' | 'Charges Copropriété' | 'Régularisation charges' | 'Dépôt de garantie';
  date: string;
  status: 'Validé' | 'En attente' | 'En retard' | 'Relancé';
  reference: string;
  method: 'Carte Bancaire' | 'Prélèvement SEPA' | 'Virement' | 'Virement SEPA';
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
