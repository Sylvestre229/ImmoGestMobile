import React, { useState } from 'react';
import { Property, TechnicalTicket, TicketCategory, TicketPriority } from '../types';
import { Wrench, Camera, AlertCircle, X, Check, Image as ImageIcon } from 'lucide-react';

interface NewInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSubmit: (ticketData: Omit<TechnicalTicket, 'id' | 'reportedDate' | 'updates'>) => void;
}

export const NewInterventionModal: React.FC<NewInterventionModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Plomberie');
  const [priority, setPriority] = useState<TicketPriority>('Normale');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [description, setDescription] = useState('');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);

  const selectedProp = properties.find((p) => p.id === propertyId);

  const samplePhotos = [
    { label: 'Fuite / Robinetterie', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300' },
    { label: 'Radiateur / Chauffage', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300' },
    { label: 'Serrure / Porte', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      category,
      priority,
      status: 'SIGNALÉ',
      propertyId,
      propertyName: selectedProp ? selectedProp.name : 'Bien immobilier',
      tenantId: selectedProp?.tenantId || 'ten-1',
      tenantName: selectedProp?.tenantId === 'ten-1' ? 'Camille de Saint-Sauveur' : 'Thomas Durand',
      description: description.trim(),
      photoUrl: photoSelected || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Déclarer un incident / Demande de réparation
              </h3>
              <p className="text-xs text-slate-500">
                Prise en charge et suivi en temps réel avec notifications
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Property selector */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">Bien concerné</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.address}, {p.city})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">
              Objet de l'intervention (ex: Fuite d'eau sous évier)
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Problème alimentation radiateur séjour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Catégorie technique</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
              >
                <option value="Plomberie">Plomberie</option>
                <option value="Électricité">Électricité</option>
                <option value="Chauffage & Clim">Chauffage & Clim</option>
                <option value="Serrurerie">Serrurerie & Clés</option>
                <option value="Parties Communes">Parties Communes (Copro)</option>
                <option value="Autre">Autre équipement</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Niveau d'urgence</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
              >
                <option value="Urgente">🚨 Urgente (dégât des eaux / coupure)</option>
                <option value="Normale">⚡ Normale (réparation sous 72h)</option>
                <option value="Faible">🌱 Faible (confort / entretien)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">
              Description détaillée des symptômes
            </label>
            <textarea
              required
              rows={3}
              placeholder="Décrivez l'origine de la panne, la pièce concernée, et les éventuelles conséquences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <label className="font-medium text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Photo du constat (facultatif mais recommandé)</span>
              {photoSelected && (
                <button
                  type="button"
                  onClick={() => setPhotoSelected(null)}
                  className="text-rose-600 text-[11px] hover:underline"
                >
                  Supprimer
                </button>
              )}
            </label>

            {photoSelected ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-900">
                <img
                  src={photoSelected}
                  alt="Aperçu dégât"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  Photo jointe au dossier
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50/50">
                  <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <p className="text-[11px] text-slate-500">
                    Ajouter une photo depuis l'appareil photo ou galerie
                  </p>
                </div>
                <div className="flex gap-2">
                  {samplePhotos.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoSelected(p.url)}
                      className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] text-slate-700 border border-slate-200 truncate"
                    >
                      + {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Un SMS et un e-mail de confirmation avec numéro de suivi seront automatiquement envoyés au déclarant.
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Créer & Transmettre le ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
