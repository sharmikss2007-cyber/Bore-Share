import React from 'react';
import { WaterRequest, Language } from '../types';
import { X, Clock, User, MessageSquare, Droplets } from 'lucide-react';
import { formatTimeAgo } from '../utils/time';
import { TRANSLATIONS } from '../utils/i18n';

interface Props {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  requests: WaterRequest[];
  onUpdateRequestStatus: (requestId: string, status: 'PENDING' | 'ACCEPTED' | 'COMPLETED') => void;
}

export const RequestsListModal: React.FC<Props> = ({
  isOpen,
  lang,
  onClose,
  requests,
  onUpdateRequestStatus,
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>{t.villageWaterRequestsTitle}</span>
              <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t.requestsSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Requests List */}
        <div className="overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">{t.noRequestsYet}</p>
              <p className="text-xs text-slate-400 mt-1">
                {t.noRequestsSub}
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="pt-3 first:pt-0">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.toOwner}: {req.ownerName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {req.borewellName}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        req.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : req.status === 'COMPLETED'
                          ? 'bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {req.status === 'ACCEPTED'
                        ? t.markAccepted
                        : req.status === 'COMPLETED'
                        ? t.completed
                        : lang === 'ta'
                        ? 'நிலுவையில்'
                        : 'PENDING'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                    "{req.message}"
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.from}: {req.requesterName}</span>
                      {req.requesterPhone && (
                        <span className="text-slate-500 font-normal">({req.requesterPhone})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(req.timestamp, lang)}</span>
                    </div>
                  </div>

                  {/* Quick status toggle for demo */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">{t.demoStatusControl}</span>
                    <div className="flex items-center gap-1">
                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'ACCEPTED')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                        >
                          {t.markAccepted}
                        </button>
                      )}
                      {req.status === 'ACCEPTED' && (
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'COMPLETED')}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg transition-colors"
                        >
                          {t.markCompleted}
                        </button>
                      )}
                      {req.status === 'COMPLETED' && (
                        <span className="text-[11px] text-slate-500 font-medium">{t.completed}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
