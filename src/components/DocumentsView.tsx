import React, { useState } from 'react';
import { PropertyDocument, DocumentCategory, Property } from '../types';
import {
  FolderLock,
  FileText,
  ShieldCheck,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  X,
  FileCheck,
} from 'lucide-react';

interface DocumentsViewProps {
  documents: PropertyDocument[];
  properties: Property[];
  onUploadDocument: (doc: Omit<PropertyDocument, 'id' | 'uploadDate'>) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  properties,
  onUploadDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PropertyDocument | null>(null);

  // New doc form
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<DocumentCategory>('Contrat de Bail');
  const [newPropId, setNewPropId] = useState(properties[0]?.id || '');

  const categories: DocumentCategory[] = [
    'Contrat de Bail',
    'État des Lieux',
    'Attestation Assurance',
    'Diagnostic DPE',
    'Règlement Copropriété',
    'Quittance',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesProp = selectedPropertyId === 'all' || doc.propertyId === selectedPropertyId;
    return matchesCat && matchesProp;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const prop = properties.find((p) => p.id === newPropId);

    onUploadDocument({
      title: newTitle,
      category: newCat,
      propertyId: newPropId,
      propertyName: prop ? prop.name : 'Bien immobilier',
      fileSize: '1.8 Mo',
      fileFormat: 'PDF',
      isValidated: true,
      tenantName: prop?.tenantId === 'ten-1' ? 'Camille de Saint-Sauveur' : undefined,
    });

    setIsUploadOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-4 pb-8 text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Gestion Électronique des Documents (GED)
          </h2>
          <p className="text-slate-500">
            Contrats numérisés, états des lieux certifiés et diagnostics légaux
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Déposer un document</span>
        </button>
      </div>

      {/* Security notice */}
      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Coffre-fort numérique chiffré AES-256 · Horodatage conforme loi ALUR & eIDAS
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-700">100% Intégrité garantie</span>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tous les documents ({documents.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{doc.title}</h4>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                    <span>{doc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.propertyName}</span>
                  </div>
                  {doc.tenantName && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Locataire associé : {doc.tenantName}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {doc.fileFormat}
              </span>
            </div>

            {/* Document metadata & actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certifié conforme ({doc.fileSize})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center gap-1 px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Consulter
                </button>
                <button
                  onClick={() => alert(`Téléchargement de "${doc.title}.${doc.fileFormat}" lancé.`)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  title="Télécharger le fichier original"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Numériser & Déposer un Document
              </h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Intitulé du document
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Attestation assurance locative 2026-2027"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Catégorie juridique
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as DocumentCategory)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Bien immobilier rattaché
                </label>
                <select
                  value={newPropId}
                  onChange={(e) => setNewPropId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/50">
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <span className="text-[11px] text-slate-600 font-medium block">
                  Glissez-déposez votre scan PDF ou image
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Taille max : 25 Mo · Format PDF, JPG, PNG
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Valider l'archivage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-sm truncate max-w-xs">{previewDoc.title}</span>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Document Mock Viewer */}
              <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center space-y-3">
                <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{previewDoc.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Document officiel numérisé et conservé au coffre-fort ImmoGest
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Empreinte numérique SHA-256 certifiée
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-slate-100/70 p-3 rounded-xl space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Catégorie :</span>
                  <span className="font-semibold text-slate-800">{previewDoc.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bien rattaché :</span>
                  <span className="text-slate-800">{previewDoc.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date d'archivage :</span>
                  <span className="font-mono">{previewDoc.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Poids du fichier :</span>
                  <span className="font-mono">{previewDoc.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  alert(`Téléchargement certifié eIDAS de "${previewDoc.title}" initié.`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger le PDF original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
