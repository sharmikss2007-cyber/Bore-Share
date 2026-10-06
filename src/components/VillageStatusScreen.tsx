import React, { useState } from 'react';
import { Borewell, WaterStatus, Language } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatTimeAgo, formatExactTime } from '../utils/time';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  Droplet, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Search, 
  Sparkles,
  Info
} from 'lucide-react';
import { RequestCommunicationModal } from './RequestCommunicationModal';

interface Props {
  borewells: Borewell[];
  lang: Language;
  onRequestWater: (borewellId: string) => void;
  onSubmitRequest: (request: Omit<import('../types').WaterRequest, 'id' | 'timestamp' | 'status'>) => import('../types').WaterRequest;
  onGoToReport: (borewellId?: string) => void;
}

export const VillageStatusScreen: React.FC<Props> = ({
  borewells,
  lang,
  onRequestWater,
  onSubmitRequest,
  onGoToReport,
}) => {
  const [filter, setFilter] = useState<'ALL' | WaterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalBorewell, setModalBorewell] = useState<Borewell | null>(null);
  const t = TRANSLATIONS[lang];

  // Counts
  const totalCount = borewells.length;
  const availableCount = borewells.filter((b) => b.status === 'AVAILABLE').length;
  const limitedCount = borewells.filter((b) => b.status === 'LIMITED').length;
  const noWaterCount = borewells.filter((b) => b.status === 'NO_WATER').length;

  const filteredBorewells = borewells.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch =
      b.borewellName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Current Village Water Status Summary Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-sky-500 text-sky-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                {t.currentVillageWaterStatus}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'ta' ? 'கிராம போர்வெல் நேரலை நிலவரம்' : 'Live Village Borewell Overview'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {lang === 'ta' ? 'நேரலை' : 'Live'}
          </span>
        </div>

        {/* 4 Metric Summary Cards: Total, Available, Limited, No Water */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1. Total Borewells */}
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-950 shadow-sm ring-2 ring-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💧</span>
              <span className="text-xl font-black">{totalCount}</span>
            </div>
            <span
              className={`text-[11px] font-bold mt-0.5 leading-tight ${
                filter === 'ALL' ? 'text-slate-100' : 'text-slate-700'
              }`}
            >
              {t.totalBorewells}
            </span>
            <span
              className={`text-[9px] mt-0.5 font-medium ${
                filter === 'ALL' ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              {filter === 'ALL' ? (lang === 'ta' ? 'அனைத்தும்' : 'Viewing All') : (lang === 'ta' ? 'பார்க்க கிளிக்' : 'Tap to View')}
            </span>
          </button>

          {/* 2. Available */}
          <button
            type="button"
            onClick={() => setFilter(filter === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              filter === 'AVAILABLE'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs">🟢</span>
              <span className="text-xl font-black">{availableCount}</span>
            </div>
            <span
              className={`text-[11px] font-bold mt-0.5 leading-tight ${
                filter === 'AVAILABLE' ? 'text-emerald-100' : 'text-emerald-800'
              }`}
            >
              {t.available}
            </span>
            <span
              className={`text-[9px] mt-0.5 font-medium ${
                filter === 'AVAILABLE' ? 'text-emerald-200' : 'text-emerald-600'
              }`}
            >
              {filter === 'AVAILABLE' ? (lang === 'ta' ? 'தேர்வு செய்யப்பட்டது' : 'Selected') : (lang === 'ta' ? 'பகிர தயார்' : 'Ready to share')}
            </span>
          </button>

          {/* 3. Limited */}
          <button
            type="button"
            onClick={() => setFilter(filter === 'LIMITED' ? 'ALL' : 'LIMITED')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              filter === 'LIMITED'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100/70'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs">🟡</span>
              <span className="text-xl font-black">{limitedCount}</span>
            </div>
            <span
              className={`text-[11px] font-bold mt-0.5 leading-tight ${
                filter === 'LIMITED' ? 'text-amber-100' : 'text-amber-800'
              }`}
            >
              {t.limited}
            </span>
            <span
              className={`text-[9px] mt-0.5 font-medium ${
                filter === 'LIMITED' ? 'text-amber-200' : 'text-amber-600'
              }`}
            >
              {filter === 'LIMITED' ? (lang === 'ta' ? 'தேர்வு செய்யப்பட்டது' : 'Selected') : (lang === 'ta' ? 'குறைந்த அளவு' : 'Low yield')}
            </span>
          </button>

          {/* 4. No Water */}
          <button
            type="button"
            onClick={() => setFilter(filter === 'NO_WATER' ? 'ALL' : 'NO_WATER')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              filter === 'NO_WATER'
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300'
                : 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100/70'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xs">🔴</span>
              <span className="text-xl font-black">{noWaterCount}</span>
            </div>
            <span
              className={`text-[11px] font-bold mt-0.5 leading-tight ${
                filter === 'NO_WATER' ? 'text-rose-100' : 'text-rose-800'
              }`}
            >
              {t.noWater}
            </span>
            <span
              className={`text-[9px] mt-0.5 font-medium ${
                filter === 'NO_WATER' ? 'text-rose-200' : 'text-rose-600'
              }`}
            >
              {filter === 'NO_WATER' ? (lang === 'ta' ? 'தேர்வு செய்யப்பட்டது' : 'Selected') : (lang === 'ta' ? 'நீர் தேவை' : 'Needs water')}
            </span>
          </button>
        </div>

        {filter !== 'ALL' && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {t.showingFilter}:{' '}
              <strong className="text-slate-900">
                {filter === 'AVAILABLE' ? t.available : filter === 'LIMITED' ? t.limited : t.noWater}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className="text-sky-700 font-bold hover:underline cursor-pointer"
            >
              {t.showAll} ({totalCount})
            </button>
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
          >
            {t.clear}
          </button>
        )}
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.villageBorewells} ({filteredBorewells.length})
        </h2>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {t.realTimeFarmerReports}
        </span>
      </div>

      {/* Borewells List */}
      <div className="space-y-3">
        {filteredBorewells.map((borewell) => {
          const isAvailable = borewell.status === 'AVAILABLE';
          const isLimited = borewell.status === 'LIMITED';
          const isNoWater = borewell.status === 'NO_WATER';

          return (
            <div
              key={borewell.id}
              className={`bg-white rounded-2xl p-4 border transition-shadow shadow-xs hover:shadow-md ${
                isAvailable
                  ? 'border-emerald-200 bg-linear-to-b from-white to-emerald-50/20'
                  : isLimited
                  ? 'border-amber-200 bg-linear-to-b from-white to-amber-50/20'
                  : 'border-slate-200 bg-linear-to-b from-white to-rose-50/10 opacity-90'
              }`}
            >
              {/* Header: Borewell Name & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {borewell.borewellName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{borewell.location}</span>
                  </div>
                </div>
                <StatusBadge status={borewell.status} lang={lang} size="md" />
              </div>

              {/* Farmer Info */}
              <div className="bg-slate-50 rounded-xl p-2.5 my-2.5 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-xs">
                    {borewell.farmerName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 leading-tight">{t.farmerName}</div>
                    <div className="text-sm font-bold text-slate-800 leading-tight">
                      {borewell.farmerName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <a
                    href={`tel:${borewell.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg border border-sky-200 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-sky-600" />
                    <span>{borewell.phone}</span>
                  </a>
                </div>
              </div>

              {/* Farmer Notes if any */}
              {borewell.notes && (
                <div className="text-xs text-slate-600 bg-white/80 border border-slate-100 rounded-lg p-2 mb-2.5 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed italic">"{borewell.notes}"</p>
                </div>
              )}

              {/* Footer: Last Updated & Action Button */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {t.lastUpdated}: <strong>{formatTimeAgo(borewell.lastUpdated, lang)}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">{formatExactTime(borewell.lastUpdated)}</span>
                </div>

                {/* Primary Action Button */}
                {isAvailable && (
                  <button
                    onClick={() => setModalBorewell(borewell)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{t.requestWater}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {isLimited && (
                  <button
                    onClick={() => setModalBorewell(borewell)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{t.requestWater} ({t.limited})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {isNoWater && (
                  <button
                    onClick={() => onGoToReport(borewell.id)}
                    className="text-xs text-slate-500 hover:text-sky-700 font-medium underline underline-offset-2 ml-auto"
                  >
                    {t.areYouOwnerUpdate}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBorewells.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-slate-600 font-medium">{t.noBorewellsFound}</p>
            <button
              onClick={() => {
                setFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-sky-700 underline"
            >
              {t.resetFilters}
            </button>
          </div>
        )}
      </div>

      {/* Helpful farmer callout footer */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">{t.areYouOwnerPrompt}</p>
          <p className="text-sky-800/90 text-[11px] mt-0.5">
            {t.areYouOwnerSub}
          </p>
        </div>
      </div>

      {/* WhatsApp / SMS Communication Modal */}
      <RequestCommunicationModal
        isOpen={modalBorewell !== null}
        onClose={() => setModalBorewell(null)}
        borewell={modalBorewell}
        lang={lang}
        onSubmitRequest={onSubmitRequest}
        onOpenFullForm={(id) => {
          setModalBorewell(null);
          onRequestWater(id);
        }}
      />
    </div>
  );
};
