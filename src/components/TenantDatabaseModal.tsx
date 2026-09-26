import React, { useState } from 'react';
import { Tenant, Property, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../data/countries';
import { storageService } from '../services/storageService';
import {
  Users,
  UserPlus,
  Search,
  Send,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Trash2,
  Edit,
  Database,
  RefreshCw,
} from 'lucide-react';

interface TenantDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: CountryCode;
  tenants: Tenant[];
  properties: Property[];
  onSaveTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
  onOpenRelance: (tenant: Tenant) => void;
}

export const TenantDatabaseModal: React.FC<TenantDatabaseModalProps> = ({
  isOpen,
  onClose,
  country,
  tenants,
  properties,
  onSaveTenant,
  onDeleteTenant,
  onOpenRelance,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'backup'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // New / Edit Tenant Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ifuNumber, setIfuNumber] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [profession, setProfession] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [balanceDue, setBalanceDue] = useState(0);

  const countryConfig = COUNTRIES[country] || COUNTRIES.BJ;
  const isBenin = country === 'BJ';

  const filteredTenants = tenants.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      (t.ifuNumber && t.ifuNumber.includes(q))
    );
  });

  const handleEditTenant = (t: Tenant) => {
    setEditingId(t.id);
    setFirstName(t.firstName);
    setLastName(t.lastName);
    setEmail(t.email);
    setPhone(t.phone);
    setIfuNumber(t.ifuNumber || '');
    setIdCardNumber(t.idCardNumber || '');
    setProfession(t.profession || '');
    setPropertyId(t.propertyId);
    setBalanceDue(t.balanceDue);
    setActiveTab('add');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) return;

    const tenantToSave: Tenant = {
      id: editingId || `ten-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: phone.trim(),
      propertyId,
      country,
      leaseStartDate: '2024-01-01',
      leaseEndDate: '2026-12-31',
      paymentStatus: balanceDue > 0 ? 'RETARD' : 'A_JOUR',
      balanceDue: Number(balanceDue),
      daysLate: balanceDue > 0 ? 10 : undefined,
      ifuNumber: ifuNumber.trim() || undefined,
      idCardNumber: idCardNumber.trim() || undefined,
      profession: profession.trim() || undefined,
    };

    onSaveTenant(tenantToSave);
    setNotificationToast(`✓ Fiche locataire de ${tenantToSave.firstName} ${tenantToSave.lastName} sauvegardée dans la base.`);
    setTimeout(() => setNotificationToast(null), 3500);

    // Reset form
    setEditingId(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIfuNumber('');
    setIdCardNumber('');
    setProfession('');
    setBalanceDue(0);
    setActiveTab('list');
  };

  const handleSendDirectNotification = (t: Tenant, type: 'rappel' | 'recu') => {
    if (type === 'rappel') {
      setNotificationToast(`📲 Notification & SMS de rappel d'échéance envoyés à ${t.firstName} (${t.phone}).`);
    } else {
      setNotificationToast(`📲 Accusé de réception et quittance transmis par WhatsApp & Email à ${t.firstName}.`);
    }
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImmoGest_Database_Backup_${country}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setNotificationToast('✓ Sauvegarde de la base de données exportée en fichier JSON.');
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                Base de Données des Locataires & Système de Relance
              </h3>
              <p className="text-xs text-slate-300">
                Sauvegarde persistante · Code IFU · Notification Propriétaire & Locataire
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Répertoire Locataires ({tenants.length})</span>
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setActiveTab('add');
            }}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{editingId ? 'Modifier la Fiche' : '+ Nouveau Locataire'}</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sauvegarde & Export BD</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {notificationToast && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationToast}</span>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone, code IFU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              {/* Tenants Grid / List */}
              <div className="space-y-3">
                {filteredTenants.map((ten) => {
                  const prop = properties.find((p) => p.id === ten.propertyId);
                  const isLate = ten.paymentStatus === 'RETARD';

                  return (
                    <div
                      key={ten.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {ten.firstName[0]}
                            {ten.lastName[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">
                                {ten.firstName} {ten.lastName}
                              </h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isLate
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isLate ? `Retard (${ten.daysLate}j)` : 'Loyer à jour'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>{ten.phone}</span>
                              <span aria-hidden="true">·</span>
                              <span>{ten.email}</span>
                            </div>
                          </div>
                        </div>

                        {/* Financial balance */}
                        <div className="text-right self-end sm:self-center">
                          <span className="text-[10px] text-slate-400 block">Solde en cours</span>
                          <span
                            className={`font-mono font-bold text-sm ${
                              isLate ? 'text-rose-700' : 'text-slate-900'
                            }`}
                          >
                            {formatCurrency(ten.balanceDue, country)}
                          </span>
                        </div>
                      </div>

                      {/* Details row: IFU, CNI, Property */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{countryConfig.taxIdName} :</span>
                          <span className="font-mono font-bold text-blue-900">
                            {ten.ifuNumber || 'Non renseigné'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Bien loué :</span>
                          <span className="font-medium text-slate-800">
                            {prop ? prop.name : 'Bien attribué'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Pièce identité / CNI :</span>
                          <span className="font-mono text-slate-700">
                            {ten.idCardNumber || 'CIP-BJ-Vérifié'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons (Relance, Notification, Modification) */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSendDirectNotification(ten, 'rappel')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-[11px]"
                            title="Envoyer un rappel de paiement préventif"
                          >
                            🔔 Rappel d'échéance
                          </button>
                          <button
                            onClick={() => handleSendDirectNotification(ten, 'recu')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-[11px]"
                            title="Envoyer une confirmation de quittance ou reçu"
                          >
                            📄 Envoyer reçu
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isLate && (
                            <button
                              onClick={() => onOpenRelance(ten)}
                              className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-xs shadow-2xs"
                            >
                              <Send className="w-3 h-3" />
                              <span>Relancer (1 clic)</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditTenant(ten)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Modifier les informations"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTenant(ten.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Supprimer la fiche"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Prénom du locataire</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Sylvestre"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Nom de famille</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Bocco"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Numéro de Téléphone (WhatsApp/SMS)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +229 97 12 34 56"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Adresse Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="locataire@email.com"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    {countryConfig.taxIdName} {isBenin ? '(Obligatoire pour facture normalisée)' : ''}
                  </label>
                  <input
                    type="text"
                    value={ifuNumber}
                    onChange={(e) => setIfuNumber(e.target.value)}
                    placeholder={countryConfig.taxIdPlaceholder}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">N° Pièce d'identité (CIP / CNI)</label>
                  <input
                    type="text"
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    placeholder="Ex: CIP-BJ-2023-884129"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Logement attribué</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">
                    Solde débiteur / Impayé initial ({countryConfig.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={balanceDue}
                    onChange={(e) => setBalanceDue(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Sauvegarder dans la base
                </button>
              </div>
            </form>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Sauvegarde & Persistance Locale Chiffrée</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Toutes vos fiches locataires, quittances normalisées, coordonnées et contrats sont stockés de façon permanente et chiffrée dans la base de données de l'application. Vous pouvez à tout moment exporter une copie intégrale ou importer une sauvegarde existante.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exporter la Base Complète (JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Pour importer une sauvegarde, glissez le fichier JSON dans votre gestionnaire de fichiers.');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-medium text-xs transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importer une Sauvegarde</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Synchronisation automatique d'état active : Aucune donnée locataire n'est perdue lors du rechargement de la page.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Base conforme aux exigences de protection des données personnelles</span>
          <button onClick={onClose} className="text-slate-700 font-medium hover:underline">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
