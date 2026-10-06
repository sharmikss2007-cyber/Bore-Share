import React, { useState } from 'react';
import { Borewell, Language, WaterRequest } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  buildWaterRequestMessage, 
  buildWhatsAppUrl, 
  buildSmsUrl 
} from '../utils/messaging';
import { 
  X, 
  MessageSquare, 
  Check, 
  MapPin, 
  Phone, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  borewell: Borewell | null;
  lang: Language;
  onSubmitRequest: (request: Omit<WaterRequest, 'id' | 'timestamp' | 'status'>) => WaterRequest;
  onOpenFullForm: (borewellId: string) => void;
}

export const RequestCommunicationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  borewell,
  lang,
  onSubmitRequest,
  onOpenFullForm,
}) => {
  const t = TRANSLATIONS[lang];

  const [requesterName, setRequesterName] = useState('Balram Singh');
  const [requestMessage, setRequestMessage] = useState(
    lang === 'ta'
      ? 'பயிர்களுக்கு அவசரமாக 2 மணி நேரம் தண்ணீர் தேவை.'
      : 'Urgent need for 2 hours of water for crops.'
  );
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  if (!isOpen || !borewell) return null;

  const fullMessage = buildWaterRequestMessage({
    borewellName: borewell.borewellName,
    ownerName: borewell.farmerName,
    requesterName: requesterName.trim() || 'Farmer',
    requestMessage: requestMessage.trim(),
    lang,
  });

  const waUrl = buildWhatsAppUrl(borewell.phone, fullMessage);
  const smsUrl = buildSmsUrl(borewell.phone, fullMessage);

  const handleSendWhatsApp = () => {
    // Record in BoreShare database
    onSubmitRequest({
      borewellId: borewell.id,
      borewellName: borewell.borewellName,
      ownerName: borewell.farmerName,
      requesterName: requesterName.trim() || 'Farmer',
      requesterPhone: undefined,
      message: requestMessage.trim(),
    });

    setSentNotice(
      lang === 'ta'
        ? 'வாட்ஸ்அப் திறக்கப்படுகிறது... அனுப்ப Send பொத்தானை அழுத்தவும்.'
        : 'Opening WhatsApp... Press Send inside WhatsApp.'
    );

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendSms = () => {
    // Record in BoreShare database
    onSubmitRequest({
      borewellId: borewell.id,
      borewellName: borewell.borewellName,
      ownerName: borewell.farmerName,
      requesterName: requesterName.trim() || 'Farmer',
      requesterPhone: undefined,
      message: requestMessage.trim(),
    });

    setSentNotice(
      lang === 'ta'
        ? 'எஸ்எம்எஸ் திறக்கப்படுகிறது... அனுப்ப Send பொத்தானை அழுத்தவும்.'
        : 'Opening SMS... Press Send in your messaging app.'
    );

    // Trigger SMS URI
    window.location.href = smsUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {t.requestWater}
            </span>
            <h3 className="font-black text-slate-900 text-base leading-tight mt-1">
              {borewell.borewellName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>{t.owner}: <strong>{borewell.farmerName}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-700 font-semibold">{borewell.phone}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-3.5">
          {sentNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sentNotice}</span>
            </div>
          )}

          {/* Requester Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.yourNameRequired}
            </label>
            <input
              type="text"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              placeholder={t.yourNamePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-sky-600 focus:outline-hidden"
            />
          </div>

          {/* Short Request Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.step3ShortMessage}
            </label>
            <textarea
              rows={2}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-sky-600 focus:outline-hidden resize-none"
            />

            {/* Quick 1-tap template chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[
                t.template1,
                t.template2,
                t.template3,
              ].map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => setRequestMessage(tmpl)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md transition-colors text-left"
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Preview of text to be sent */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
            <span className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
              {lang === 'ta' ? 'அனுப்பப்படும் செய்தி மாதிரி:' : 'Message Preview:'}
            </span>
            <p className="whitespace-pre-line italic text-slate-800 line-clamp-3">
              "{fullMessage}"
            </p>
          </div>

          {/* THE TWO REQUIRED COMMUNICATION BUTTONS */}
          <div className="space-y-2 pt-1">
            {/* 1. WhatsApp Button */}
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9 7.42 8.72 7.73C8.44 8.04 7.65 8.78 7.65 10.27C7.65 11.75 8.73 13.19 8.88 13.39C9.03 13.59 11 16.63 13.97 17.92C14.67 18.23 15.23 18.41 15.65 18.55C16.36 18.77 17.01 18.74 17.52 18.66C18.09 18.57 19.28 17.94 19.53 17.24C19.78 16.55 19.78 15.96 19.7 15.83C19.63 15.71 19.43 15.65 19.13 15.5C18.83 15.35 17.35 14.62 17.08 14.52C16.8 14.42 16.6 14.37 16.4 14.67C16.2 14.97 15.63 15.65 15.45 15.85C15.28 16.05 15.1 16.07 14.8 15.92C14.5 15.77 13.55 15.46 12.42 14.45C11.54 13.67 10.95 12.7 10.8 12.45C10.65 12.2 10.78 12.07 10.93 11.92C11.07 11.79 11.23 11.57 11.38 11.4C11.53 11.22 11.58 11.1 11.68 10.9C11.78 10.7 11.73 10.52 11.65 10.37C11.58 10.22 10.98 8.74 10.73 8.14C10.48 7.56 10.23 7.64 10.05 7.63C9.88 7.62 9.68 7.35 9.53 7.35Z"/>
              </svg>
              <span>{t.sendViaWhatsApp}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </button>

            {/* 2. SMS Button */}
            <button
              type="button"
              onClick={handleSendSms}
              className="w-full py-3.5 px-4 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.sendViaSms}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500">
            {lang === 'ta'
              ? 'செய்தி தானாக அனுப்பப்படாது. ஆப் திறந்ததும் நீங்கள் "Send" அழுத்த வேண்டும்.'
              : 'Messages will not send automatically. You press "Send" in the app.'}
          </p>

          {/* Full form link */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullForm(borewell.id);
              }}
              className="text-xs font-semibold text-sky-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'ta' ? 'முழு படிவத்தை திறக்கவும் (Screen 3)' : 'Open Full Request Form (Screen 3)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
