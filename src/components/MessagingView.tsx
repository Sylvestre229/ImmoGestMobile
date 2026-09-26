import React, { useState } from 'react';
import { Message, Role } from '../types';
import {
  Send,
  Lock,
  Building,
  UserCheck,
  Paperclip,
  ShieldCheck,
  CheckCheck,
  Bell,
  Sparkles,
} from 'lucide-react';

interface MessagingViewProps {
  messages: Message[];
  currentRole: Role;
  onSendMessage: (content: string, channel: 'direct' | 'copro') => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  messages,
  currentRole,
  onSendMessage,
}) => {
  const [activeChannel, setActiveChannel] = useState<'direct' | 'copro'>('direct');
  const [inputText, setInputText] = useState('');

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), activeChannel);
    setInputText('');
  };

  return (
    <div className="space-y-4 pb-8 text-xs flex flex-col h-[calc(100vh-140px)]">
      {/* Header & Channel Switcher */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Messagerie Sécurisée & Syndic
          </h2>
          <p className="text-slate-500">
            Chiffrement de bout en bout AES-256 · Échanges directs et annonces copro
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-[11px] font-medium">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>E2EE Sécurisé</span>
        </div>
      </div>

      {/* Segmented Channel Tabs */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setActiveChannel('direct')}
          className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            activeChannel === 'direct'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Échanges Gestionnaire / Locataire</span>
        </button>
        <button
          onClick={() => setActiveChannel('copro')}
          className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            activeChannel === 'copro'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Canal Syndic & Copropriété</span>
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 overflow-y-auto space-y-3 flex flex-col">
        {/* Security Notice Pill inside chat */}
        <div className="mx-auto my-1 flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Les messages et pièces jointes de cette conversation sont chiffrés de bout en bout.</span>
        </div>

        {filteredMessages.map((msg) => {
          const isMe =
            (currentRole === 'gestionnaire' && msg.senderRole === 'Gestionnaire') ||
            (currentRole === 'locataire' && msg.senderRole === 'Locataire');

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isMe ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-medium mb-0.5 px-1">
                {msg.senderName} · {msg.timestamp}
              </span>

              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : msg.senderRole === 'Syndic'
                    ? 'bg-amber-50 text-slate-900 border border-amber-200 rounded-bl-xs'
                    : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                }`}
              >
                <p>{msg.content}</p>
              </div>

              {isMe && (
                <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 px-1">
                  <span>Distribué</span>
                  <CheckCheck className="w-3 h-3 text-blue-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="shrink-0 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              activeChannel === 'direct'
                ? 'Écrivez un message sécurisé au locataire ou gestionnaire...'
                : 'Publier un communiqué officiel de copropriété...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={() => alert('Sélectionnez une pièce jointe certifiée (devis, photo, constat).')}
          className="p-2.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          title="Joindre un fichier"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </form>
    </div>
  );
};
