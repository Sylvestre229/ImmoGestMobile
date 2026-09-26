import React, { useState } from 'react';
import { Property, Tenant } from '../types';
import {
  Building2,
  MapPin,
  Maximize2,
  User,
  Plus,
  Search,
  ExternalLink,
  Zap,
  Home,
  FileText,
  X,
  Check,
} from 'lucide-react';

interface PropertiesViewProps {
  properties: Property[];
  tenants: Tenant[];
  onAddProperty: (newProp: Omit<Property, 'id'>) => void;
  onSelectPropertyDocuments?: (propId: string) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  tenants,
  onAddProperty,
  onSelectPropertyDocuments,
}) => {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New property form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Paris');
  const [newPostalCode, setNewPostalCode] = useState('75001');
  const [newSurface, setNewSurface] = useState(65);
  const [newRooms, setNewRooms] = useState(3);
  const [newRent, setNewRent] = useState(1400);
  const [newCharges, setNewCharges] = useState(120);

  const filteredProperties = properties.filter((p) => {
    const matchesCity = filterCity === 'all' || p.city.toLowerCase() === filterCity.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;

    onAddProperty({
      name: newName,
      address: newAddress,
      city: newCity,
      postalCode: newPostalCode,
      type: 'Appartement',
      surface: Number(newSurface),
      rooms: Number(newRooms),
      rentExclCharges: Number(newRent),
      charges: Number(newCharges),
      deposit: Number(newRent) * 2,
      dpe: 'B',
      status: 'Vacant',
      imageUrl: '/src/assets/images/property_modern_loft_lyon_1790426147079.jpg',
    });

    setIsModalOpen(false);
    setNewName('');
    setNewAddress('');
  };

  const getDpeColor = (dpe: string) => {
    switch (dpe) {
      case 'A':
        return 'bg-emerald-600 text-white';
      case 'B':
        return 'bg-emerald-500 text-white';
      case 'C':
        return 'bg-lime-500 text-white';
      case 'D':
        return 'bg-amber-400 text-slate-900';
      case 'E':
        return 'bg-amber-600 text-white';
      case 'F':
      case 'G':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="space-y-4 pb-8 text-xs">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Biens Immobiliers & Baux
          </h2>
          <p className="text-slate-500">
            {properties.length} lots gérés · Suivi locatif et diagnostics
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un bien</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par adresse, ville, nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {['all', 'Paris', 'Lyon', 'Marseille', 'Bordeaux'].map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCity === city
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {city === 'all' ? 'Toutes les villes' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProperties.map((prop) => {
          const tenant = tenants.find((t) => t.propertyId === prop.id);
          const totalRent = prop.rentExclCharges + prop.charges;

          return (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={prop.imageUrl}
                  alt={prop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Status indicator on top right */}
                <span
                  className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                    prop.status === 'Loué'
                      ? 'bg-emerald-600 text-white'
                      : prop.status === 'Vacant'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-600 text-white'
                  }`}
                >
                  {prop.status}
                </span>

                {/* Energy rating DPE */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-xs ${getDpeColor(
                      prop.dpe
                    )}`}
                  >
                    DPE {prop.dpe}
                  </span>
                  <span className="text-white text-xs font-medium drop-shadow-sm">
                    {prop.surface} m² · {prop.rooms} pièces
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{prop.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {prop.address}, {prop.postalCode} {prop.city}
                    </span>
                  </div>
                  {prop.floor && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {prop.floor}
                    </span>
                  )}
                </div>

                {/* Rent & Charges Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Loyer mensuel charges comprises</span>
                    <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                      {totalRent.toLocaleString('fr-FR')} € <span className="text-[10px] text-slate-500 font-normal">/mois</span>
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>Loyer net : {prop.rentExclCharges} €</div>
                    <div>Charges : {prop.charges} €</div>
                  </div>
                </div>

                {/* Tenant Info & Lease Status */}
                {tenant ? (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {tenant.firstName[0]}
                        {tenant.lastName[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {tenant.firstName} {tenant.lastName}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          Bail jusqu'au {tenant.leaseEndDate}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-semibold text-[10px] ${
                        tenant.paymentStatus === 'A_JOUR'
                          ? 'text-emerald-700'
                          : 'text-rose-700 font-bold'
                      }`}
                    >
                      {tenant.paymentStatus === 'A_JOUR' ? 'Loyer à jour' : 'Retard impayé'}
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 italic">
                    <span>Aucun locataire assigné</span>
                    <span className="text-blue-600 font-medium not-italic cursor-pointer hover:underline">
                      Publier l'annonce →
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Ajouter un nouveau lot immobilier
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="p-6 space-y-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Nom du bien / Résidence
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: T3 Lumineux Faubourg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Adresse</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 14 Rue de la Paix"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Code postal</label>
                  <input
                    type="text"
                    required
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Surface (m²)</label>
                  <input
                    type="number"
                    value={newSurface}
                    onChange={(e) => setNewSurface(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pièces</label>
                  <input
                    type="number"
                    value={newRooms}
                    onChange={(e) => setNewRooms(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Loyer hors charges (€)</label>
                  <input
                    type="number"
                    value={newRent}
                    onChange={(e) => setNewRent(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Charges (€)</label>
                  <input
                    type="number"
                    value={newCharges}
                    onChange={(e) => setNewCharges(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Enregistrer le bien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
