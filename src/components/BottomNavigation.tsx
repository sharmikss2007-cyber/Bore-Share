import React from 'react';
import { ScreenId, Language } from '../types';
import { Droplet, PlusCircle, Send } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

interface Props {
  activeScreen: ScreenId;
  lang: Language;
  onChangeScreen: (screen: ScreenId) => void;
}

export const BottomNavigation: React.FC<Props> = ({
  activeScreen,
  lang,
  onChangeScreen,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-xl mx-auto px-2 py-1.5 flex items-stretch justify-around">
        {/* Screen 1: Village Water Status */}
        <button
          onClick={() => onChangeScreen('STATUS')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeScreen === 'STATUS'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Droplet
              className={`w-5 h-5 ${
                activeScreen === 'STATUS' ? 'fill-sky-600 text-sky-700' : 'text-slate-400'
              }`}
            />
          </div>
          <span className="text-[11px] leading-tight mt-1">{t.navVillageStatus}</span>
        </button>

        {/* Screen 2: Report Borewell Status */}
        <button
          onClick={() => onChangeScreen('REPORT')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeScreen === 'REPORT'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <PlusCircle
            className={`w-5 h-5 ${
              activeScreen === 'REPORT' ? 'text-sky-700 stroke-[2.5]' : 'text-slate-400'
            }`}
          />
          <span className="text-[11px] leading-tight mt-1">{t.navReportStatus}</span>
        </button>

        {/* Screen 3: Water Request */}
        <button
          onClick={() => onChangeScreen('REQUEST')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeScreen === 'REQUEST'
              ? 'text-emerald-700 bg-emerald-50 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Send
            className={`w-5 h-5 ${
              activeScreen === 'REQUEST' ? 'text-emerald-700 stroke-[2.5]' : 'text-slate-400'
            }`}
          />
          <span className="text-[11px] leading-tight mt-1">{t.navRequestWater}</span>
        </button>
      </div>
    </nav>
  );
};
