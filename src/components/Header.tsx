import React from 'react';
import { Droplets, RotateCcw, Bell } from 'lucide-react';
import { VILLAGE_INFO } from '../data/initialData';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onResetDemo: () => void;
  requestCount: number;
  onOpenRequests: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onResetDemo,
  requestCount,
  onOpenRequests,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="bg-gradient-to-r from-sky-800 via-sky-700 to-teal-800 text-white shadow-md sticky top-0 z-30">
      {/* Language Switcher Bar at the very top */}
      <div className="bg-slate-900/60 px-4 py-1.5 flex items-center justify-between border-b border-white/10 text-xs">
        <span className="text-sky-200 font-medium text-[11px]">
          Language / மொழி:
        </span>
        <div className="inline-flex rounded-lg bg-black/30 p-0.5 border border-white/15">
          <button
            type="button"
            onClick={() => onLanguageChange('ta')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              lang === 'ta'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={lang === 'ta'}
          >
            தமிழ்
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              lang === 'en'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={lang === 'en'}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <Droplets className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-xl font-black tracking-tight text-white leading-none">
                  {t.appName}
                </h1>
                <span className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">
                  {t.villageWaterSharing}
                </span>
              </div>
              <p className="text-[12px] font-medium text-sky-100 tracking-wide mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Requests Inbox Button */}
            <button
              onClick={onOpenRequests}
              title={t.requestsInbox}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
              aria-label={t.requestsInbox}
            >
              <Bell className="w-4 h-4 text-sky-100" />
              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {requestCount}
                </span>
              )}
            </button>

            {/* Quick Demo Reset for competition */}
            <button
              onClick={onResetDemo}
              title={t.resetDemoFull}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-100 border border-white/15 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-sky-200" />
              <span className="hidden sm:inline">{t.resetDemo}</span>
            </button>
          </div>
        </div>

        {/* Location Banner */}
        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-sky-100">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.village}: </span>
            <span className="font-bold text-white underline decoration-sky-300/40 underline-offset-2">
              {lang === 'ta' ? 'ராம்பூர் குர்த்' : VILLAGE_INFO.name}
            </span>
          </div>
          <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded font-medium text-sky-200">
            {VILLAGE_INFO.totalBorewells} {t.borewellsCount}
          </span>
        </div>
      </div>
    </header>
  );
};
