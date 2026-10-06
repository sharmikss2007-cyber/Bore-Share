import React, { useState, useEffect } from 'react';
import { Borewell, WaterStatus, Language } from '../types';
import { StatusBadge } from './StatusBadge';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  CheckCircle2, 
  Clock, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface Props {
  borewells: Borewell[];
  lang: Language;
  initialBorewellId?: string;
  onUpdateStatus: (borewellId: string, status: WaterStatus, notes?: string) => void;
  onGoToVillageStatus: () => void;
}

export const ReportStatusScreen: React.FC<Props> = ({
  borewells,
  lang,
  initialBorewellId,
  onUpdateStatus,
  onGoToVillageStatus,
}) => {
  const t = TRANSLATIONS[lang];

  const [selectedBorewellId, setSelectedBorewellId] = useState<string>(
    initialBorewellId || (borewells[0]?.id ?? '')
  );
  const [selectedStatus, setSelectedStatus] = useState<WaterStatus>('AVAILABLE');
  const [notes, setNotes] = useState<string>('');
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);
  const [lastUpdatedBorewell, setLastUpdatedBorewell] = useState<Borewell | null>(null);

  useEffect(() => {
    if (initialBorewellId) {
      setSelectedBorewellId(initialBorewellId);
    }
  }, [initialBorewellId]);

  // Sync current status of selected borewell when changed
  useEffect(() => {
    const current = borewells.find((b) => b.id === selectedBorewellId);
    if (current) {
      setSelectedStatus(current.status);
      setNotes(current.notes || '');
    }
  }, [selectedBorewellId, borewells]);

  const selectedBorewell = borewells.find((b) => b.id === selectedBorewellId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorewellId) return;

    onUpdateStatus(selectedBorewellId, selectedStatus, notes.trim());
    const updated = borewells.find((b) => b.id === selectedBorewellId);
    if (updated) {
      setLastUpdatedBorewell({
        ...updated,
        status: selectedStatus,
        notes: notes.trim(),
        lastUpdated: new Date().toISOString(),
      });
    }
    setJustSubmitted(true);
  };

  const handleQuickNote = (phrase: string) => {
    setNotes(phrase);
  };

  if (justSubmitted && lastUpdatedBorewell) {
    return (
      <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-4">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 text-center border-2 border-emerald-400 shadow-md">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            {t.statusUpdatedTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {t.statusUpdatedDesc}
          </p>

          <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">{t.borewellName}</span>
              <p className="text-sm font-bold text-slate-800">{lastUpdatedBorewell.borewellName}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">{t.farmerName}</span>
              <p className="text-sm font-semibold text-slate-700">{lastUpdatedBorewell.farmerName}</p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {lang === 'ta' ? 'புதிய நிலை' : 'New Status'}
                </span>
                <div className="mt-0.5">
                  <StatusBadge status={lastUpdatedBorewell.status} lang={lang} size="md" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{t.lastUpdated}</span>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {t.justNow}
                </p>
              </div>
            </div>
            {lastUpdatedBorewell.notes && (
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">
                  {lang === 'ta' ? 'குறிப்பு: ' : 'Note: '}
                </span>
                {lastUpdatedBorewell.notes}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onGoToVillageStatus}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>{t.viewOnVillageBoard}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setJustSubmitted(false)}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-xs"
            >
              {t.updateAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>{t.reportStatus}</span>
          <span className="text-[11px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
            {lang === 'ta' ? 'திரை 2' : 'Screen 2'}
          </span>
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          {lang === 'ta'
            ? 'நீங்கள் கிராம விவசாயியா? உங்கள் போர்வெல் நீர் நிலையை பதிவு செய்யுங்கள்.'
            : 'Are you a farmer in the village? Update your water availability so neighbors know if water can be shared.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Select Borewell */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step1SelectBorewell}
          </label>
          <select
            value={selectedBorewellId}
            onChange={(e) => setSelectedBorewellId(e.target.value)}
            className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-hidden"
          >
            {borewells.map((b) => (
              <option key={b.id} value={b.id}>
                {b.farmerName} — {b.borewellName} ({b.location})
              </option>
            ))}
          </select>

          {selectedBorewell && (
            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{t.currentStatus}:</span>
              <StatusBadge status={selectedBorewell.status} lang={lang} size="sm" />
            </div>
          )}
        </div>

        {/* Step 2: Select Status (Large Touch-Friendly Cards) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step2SelectStatus}
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {/* AVAILABLE Option */}
            <button
              type="button"
              onClick={() => setSelectedStatus('AVAILABLE')}
              className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                selectedStatus === 'AVAILABLE'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟢</span>
                <div>
                  <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>{t.available}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ta'
                      ? 'போர்வெல்லில் போதுமான தண்ணீர் உள்ளது; மற்றவர்களுடன் பகிரலாம்.'
                      : 'Borewell has sufficient water and can be shared with other farmers.'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                  selectedStatus === 'AVAILABLE'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedStatus === 'AVAILABLE' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>

            {/* LIMITED Option */}
            <button
              type="button"
              onClick={() => setSelectedStatus('LIMITED')}
              className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                selectedStatus === 'LIMITED'
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🟡</span>
                <div>
                  <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>{t.limited}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ta'
                      ? 'குறைந்த அளவு தண்ணீர் மட்டுமே வருகிறது அல்லது சில மணி நேரங்கள் மட்டுமே இயக்க முடியும்.'
                      : 'Low yield or runs for few hours. Small emergency share only.'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                  selectedStatus === 'LIMITED'
                    ? 'border-amber-500 bg-amber-500 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedStatus === 'LIMITED' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>

            {/* NO WATER Option */}
            <button
              type="button"
              onClick={() => setSelectedStatus('NO_WATER')}
              className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                selectedStatus === 'NO_WATER'
                  ? 'border-rose-600 bg-rose-50/70 shadow-sm ring-2 ring-rose-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <div>
                  <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>{t.noWater}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ta'
                      ? 'தண்ணீர் முற்றிலும் இல்லை அல்லது மோட்டார் இயக்க முடியவில்லை.'
                      : 'Completely dry or motor stopped due to low water level.'}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                  selectedStatus === 'NO_WATER'
                    ? 'border-rose-600 bg-rose-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedStatus === 'NO_WATER' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Optional Note / Details */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {t.step3OptionalNotes}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:bg-white focus:border-sky-600 focus:outline-hidden"
          />

          {/* Quick presets for mobile farmers */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 font-medium">{t.quickTap}</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                t.presetAvailable,
                t.presetHours,
                t.presetPower,
                t.presetLow,
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickNote(preset)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.updateStatus}</span>
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            {t.instantBroadcastNote}
          </p>
        </div>
      </form>
    </div>
  );
};
