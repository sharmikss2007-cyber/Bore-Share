import React, { useState, useEffect } from 'react';
import { Borewell, WaterRequest, Language } from '../types';
import { StatusBadge } from './StatusBadge';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  Send, 
  CheckCircle2, 
  Clock,
  MessageSquare,
  ExternalLink,
  Phone
} from 'lucide-react';
import { formatExactTime } from '../utils/time';
import { 
  buildWaterRequestMessage, 
  buildWhatsAppUrl, 
  buildSmsUrl 
} from '../utils/messaging';

interface Props {
  borewells: Borewell[];
  lang: Language;
  preselectedBorewellId?: string;
  onSubmitRequest: (request: Omit<WaterRequest, 'id' | 'timestamp' | 'status'>) => WaterRequest;
  onGoToVillageStatus: () => void;
}

export const WaterRequestScreen: React.FC<Props> = ({
  borewells,
  lang,
  preselectedBorewellId,
  onSubmitRequest,
  onGoToVillageStatus,
}) => {
  const t = TRANSLATIONS[lang];

  // Prefer available borewells
  const availableBorewells = borewells.filter((b) => b.status === 'AVAILABLE');
  const limitedBorewells = borewells.filter((b) => b.status === 'LIMITED');
  const shareableBorewells = [...availableBorewells, ...limitedBorewells];

  const defaultBorewellId = preselectedBorewellId || shareableBorewells[0]?.id || borewells[0]?.id || '';

  const [selectedBorewellId, setSelectedBorewellId] = useState<string>(defaultBorewellId);
  const [requesterName, setRequesterName] = useState<string>('Sharmi');
  const [requesterPhone, setRequesterPhone] = useState<string>('');
  const [message, setMessage] = useState<string>(
    lang === 'ta'
      ? 'தண்ணீர் பகிர முடியுமா என்று தெரியப்படுத்தவும்.'
      : 'Please let me know if water can be shared.'
  );
  const [submittedReceipt, setSubmittedReceipt] = useState<WaterRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (preselectedBorewellId) {
      setSelectedBorewellId(preselectedBorewellId);
    }
  }, [preselectedBorewellId]);

  const targetBorewell = borewells.find((b) => b.id === selectedBorewellId);

  const validateForm = (): boolean => {
    setErrorMessage('');
    if (!selectedBorewellId) {
      setErrorMessage(t.pleaseSelectBorewell);
      return false;
    }
    if (!requesterName.trim()) {
      setErrorMessage(t.pleaseEnterRequester);
      return false;
    }
    if (!message.trim()) {
      setErrorMessage(t.pleaseEnterMessage);
      return false;
    }
    return true;
  };

  const handleInAppSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const borewell = borewells.find((b) => b.id === selectedBorewellId);
    if (!borewell) {
      setErrorMessage('Selected borewell not found.');
      return;
    }

    const created = onSubmitRequest({
      borewellId: borewell.id,
      borewellName: borewell.borewellName,
      ownerName: borewell.farmerName,
      requesterName: requesterName.trim(),
      requesterPhone: requesterPhone.trim() || undefined,
      message: message.trim(),
    });

    setSubmittedReceipt(created);
  };

  const handleSendViaWhatsAppDirect = () => {
    if (!validateForm() || !targetBorewell) return;

    // 1. Record request in database
    const created = onSubmitRequest({
      borewellId: targetBorewell.id,
      borewellName: targetBorewell.borewellName,
      ownerName: targetBorewell.farmerName,
      requesterName: requesterName.trim(),
      requesterPhone: requesterPhone.trim() || undefined,
      message: message.trim(),
    });
    setSubmittedReceipt(created);

    // 2. Build pre-filled message according to official prompt specification
    const formattedMsg = buildWaterRequestMessage({
      borewellName: targetBorewell.borewellName,
      ownerName: targetBorewell.farmerName,
      requesterName: requesterName.trim(),
      requestMessage: message.trim(),
      lang,
    });

    // 3. Open WhatsApp using wa.me URL format
    const phoneToUse = targetBorewell.ownerWhatsApp || targetBorewell.phone;
    const waUrl = buildWhatsAppUrl(phoneToUse, formattedMsg);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendViaSmsDirect = () => {
    if (!validateForm() || !targetBorewell) return;

    // 1. Record request in database
    const created = onSubmitRequest({
      borewellId: targetBorewell.id,
      borewellName: targetBorewell.borewellName,
      ownerName: targetBorewell.farmerName,
      requesterName: requesterName.trim(),
      requesterPhone: requesterPhone.trim() || undefined,
      message: message.trim(),
    });
    setSubmittedReceipt(created);

    // 2. Build pre-filled message
    const formattedMsg = buildWaterRequestMessage({
      borewellName: targetBorewell.borewellName,
      ownerName: targetBorewell.farmerName,
      requesterName: requesterName.trim(),
      requestMessage: message.trim(),
      lang,
    });

    // 3. Open phone SMS app
    const phoneToUse = targetBorewell.ownerWhatsApp || targetBorewell.phone;
    const smsUrl = buildSmsUrl(phoneToUse, formattedMsg);
    window.location.href = smsUrl;
  };

  const handleQuickTemplate = (text: string) => {
    setMessage(text);
  };

  // 3. AFTER SUBMISSION VIEW: SHOW "Send via WhatsApp" and "Send via SMS"
  if (submittedReceipt) {
    const activeBorewell = borewells.find((b) => b.id === submittedReceipt.borewellId) || targetBorewell;
    const phoneToUse = activeBorewell?.ownerWhatsApp || activeBorewell?.phone || '';
    
    const formattedMsg = activeBorewell
      ? buildWaterRequestMessage({
          borewellName: submittedReceipt.borewellName,
          ownerName: submittedReceipt.ownerName,
          requesterName: submittedReceipt.requesterName,
          requestMessage: submittedReceipt.message,
          lang,
        })
      : '';

    const waUrl = phoneToUse ? buildWhatsAppUrl(phoneToUse, formattedMsg) : '';
    const smsUrl = phoneToUse ? buildSmsUrl(phoneToUse, formattedMsg) : '';

    return (
      <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-3xl p-6 text-center border-2 border-emerald-500 shadow-md">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {lang === 'ta' ? 'அனுப்பப்பட்டது' : 'Delivered'}
          </span>

          <h2 className="text-xl font-black text-slate-900 mt-2">
            {t.requestSentSuccessfully}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            {t.requestDeliveredNotice}
          </p>

          {/* Receipt / Details Card */}
          <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
            <div className="flex justify-between items-start border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {t.targetBorewell}
                </span>
                <p className="text-sm font-bold text-slate-900">{submittedReceipt.borewellName}</p>
                <p className="text-xs text-slate-600">
                  {t.owner}: {submittedReceipt.ownerName}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t.activeRequest}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {t.requesterName}
                </span>
                <p className="text-sm font-bold text-slate-800">{submittedReceipt.requesterName}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {t.contact}
                </span>
                <p className="text-xs font-semibold text-slate-700">
                  {submittedReceipt.requesterPhone || (lang === 'ta' ? 'நேரில் / கிராமம்' : 'In person / village')}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {t.requestMessage}
              </span>
              <p className="text-xs font-medium text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 mt-1 italic">
                "{submittedReceipt.message}"
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatExactTime(submittedReceipt.timestamp)}
              </span>
              <span className="text-emerald-700 font-bold">{t.statusPendingOwner}</span>
            </div>
          </div>

          {/* REQUIRED PROMINENT BUTTONS AFTER SUBMIT: "Send via WhatsApp" & "Send via SMS" */}
          <div className="p-4 bg-sky-50/70 border-2 border-sky-200 rounded-2xl mb-4 space-y-2.5 text-left shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                {lang === 'ta' ? 'நேரடியாக அனுப்பவும்:' : 'Send directly to farmer:'}
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                WhatsApp / SMS
              </span>
            </div>

            <div className="space-y-2">
              {/* BUTTON 1: Send via WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Fallback window.open for desktop and Android
                  if (!waUrl) e.preventDefault();
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9 7.42 8.72 7.73C8.44 8.04 7.65 8.78 7.65 10.27C7.65 11.75 8.73 13.19 8.88 13.39C9.03 13.59 11 16.63 13.97 17.92C14.67 18.23 15.23 18.41 15.65 18.55C16.36 18.77 17.01 18.74 17.52 18.66C18.09 18.57 19.28 17.94 19.53 17.24C19.78 16.55 19.78 15.96 19.7 15.83C19.63 15.71 19.43 15.65 19.13 15.5C18.83 15.35 17.35 14.62 17.08 14.52C16.8 14.42 16.6 14.37 16.4 14.67C16.2 14.97 15.63 15.65 15.45 15.85C15.28 16.05 15.1 16.07 14.8 15.92C14.5 15.77 13.55 15.46 12.42 14.45C11.54 13.67 10.95 12.7 10.8 12.45C10.65 12.2 10.78 12.07 10.93 11.92C11.07 11.79 11.23 11.57 11.38 11.4C11.53 11.22 11.58 11.1 11.68 10.9C11.78 10.7 11.73 10.52 11.65 10.37C11.58 10.22 10.98 8.74 10.73 8.14C10.48 7.56 10.23 7.64 10.05 7.63C9.88 7.62 9.68 7.35 9.53 7.35Z"/>
                </svg>
                <span>{t.sendViaWhatsApp}</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>

              {/* BUTTON 2: Send via SMS */}
              <a
                href={smsUrl}
                className="w-full py-3.5 px-4 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>{t.sendViaSms}</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>
            </div>

            <p className="text-[10px] text-center text-slate-500 pt-1">
              {lang === 'ta'
                ? 'செய்தி தானாக அனுப்பப்படாது. WhatsApp அல்லது SMS ஆப் திறந்ததும் நீங்கள் Send அழுத்த வேண்டும்.'
                : 'Messages will not send automatically. You press Send in WhatsApp or SMS app.'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={onGoToVillageStatus}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold rounded-xl shadow-md transition-colors text-sm cursor-pointer"
            >
              {t.returnToVillageStatus}
            </button>
            <button
              onClick={() => {
                setSubmittedReceipt(null);
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-xs cursor-pointer"
            >
              {t.sendAnotherRequest}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. EXISTING WATER REQUEST FORM
  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>{t.requestWater}</span>
          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {lang === 'ta' ? 'திரை 3' : 'Screen 3'}
          </span>
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {t.screen3Desc}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleInAppSubmit} className="space-y-4">
        {/* Step 1: Select Borewell */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step1ChooseBorewell}
          </label>

          <select
            value={selectedBorewellId}
            onChange={(e) => setSelectedBorewellId(e.target.value)}
            className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          >
            <optgroup label={`🟢 ${t.available} (${t.villageBorewells})`}>
              {availableBorewells.map((b) => (
                <option key={b.id} value={b.id}>
                  🟢 {b.borewellName} — {b.farmerName}
                </option>
              ))}
            </optgroup>
            {limitedBorewells.length > 0 && (
              <optgroup label={`🟡 ${t.limited}`}>
                {limitedBorewells.map((b) => (
                  <option key={b.id} value={b.id}>
                    🟡 {b.borewellName} — {b.farmerName} ({t.limited})
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Selected Borewell Card Preview */}
          {targetBorewell && (
            <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-900 font-bold">
                    {t.owner}: {targetBorewell.farmerName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {targetBorewell.location}
                  </div>
                </div>
                <StatusBadge status={targetBorewell.status} lang={lang} size="sm" />
              </div>
              {targetBorewell.notes && (
                <p className="text-[11px] text-emerald-900 mt-1.5 italic bg-white/70 p-1.5 rounded border border-emerald-100">
                  {lang === 'ta' ? 'குறிப்பு: ' : 'Note: '}"{targetBorewell.notes}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Requester Details */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step2YourInfo}
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.yourNameRequired} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              placeholder="Sharmi"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:border-sky-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.yourMobileOptional}
            </label>
            <input
              type="tel"
              value={requesterPhone}
              onChange={(e) => setRequesterPhone(e.target.value)}
              placeholder="98930 11244"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:border-sky-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Step 3: Short Message / Reason */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step3ShortMessage} <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === 'ta' ? 'தண்ணீர் பகிர முடியுமா என்று தெரியப்படுத்தவும்.' : 'Please let me know if water can be shared.'}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:border-sky-600 focus:outline-hidden resize-none"
          />

          {/* Quick presets for mobile farmers */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'ta' ? 'விரைவு செய்தி டெம்ப்ளேட்டுகள்:' : 'Quick 1-tap message templates:'}
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                lang === 'ta' ? 'தண்ணீர் பகிர முடியுமா என்று தெரியப்படுத்தவும்.' : 'Please let me know if water can be shared.',
                t.template1,
                t.template2,
                t.template3,
              ].map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => handleQuickTemplate(template)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors text-left cursor-pointer"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Action Buttons: Instant WhatsApp & SMS + Submit */}
        <div className="space-y-2.5 pt-1">
          {/* Main Primary Button: Submit and Proceed to WhatsApp / Confirmation */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-5 h-5 text-sky-400" />
            <span>{t.sendRequest}</span>
          </button>

          {/* Direct 1-Tap WhatsApp and SMS shortcuts directly from form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSendViaWhatsAppDirect}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9 7.42 8.72 7.73C8.44 8.04 7.65 8.78 7.65 10.27C7.65 11.75 8.73 13.19 8.88 13.39C9.03 13.59 11 16.63 13.97 17.92C14.67 18.23 15.23 18.41 15.65 18.55C16.36 18.77 17.01 18.74 17.52 18.66C18.09 18.57 19.28 17.94 19.53 17.24C19.78 16.55 19.78 15.96 19.7 15.83C19.63 15.71 19.43 15.65 19.13 15.5C18.83 15.35 17.35 14.62 17.08 14.52C16.8 14.42 16.6 14.37 16.4 14.67C16.2 14.97 15.63 15.65 15.45 15.85C15.28 16.05 15.1 16.07 14.8 15.92C14.5 15.77 13.55 15.46 12.42 14.45C11.54 13.67 10.95 12.7 10.8 12.45C10.65 12.2 10.78 12.07 10.93 11.92C11.07 11.79 11.23 11.57 11.38 11.4C11.53 11.22 11.58 11.1 11.68 10.9C11.78 10.7 11.73 10.52 11.65 10.37C11.58 10.22 10.98 8.74 10.73 8.14C10.48 7.56 10.23 7.64 10.05 7.63C9.88 7.62 9.68 7.35 9.53 7.35Z"/>
              </svg>
              <span>{t.sendViaWhatsApp}</span>
            </button>

            <button
              type="button"
              onClick={handleSendViaSmsDirect}
              className="py-3 px-3 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>{t.sendViaSms}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            {lang === 'ta'
              ? 'கோரிக்கையை பதிவு செய்ய அல்லது நேரடியாக அனுப்ப மேலே உள்ள வழிகளை பயன்படுத்தவும்.'
              : 'Submit to log in village records or tap to message the owner directly.'}
          </p>
        </div>
      </form>
    </div>
  );
};
