import React from 'react';
import { WaterStatus, Language } from '../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

interface Props {
  status: WaterStatus;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<Props> = ({
  status,
  lang = 'en',
  size = 'md',
  showIcon = true,
}) => {
  const t = TRANSLATIONS[lang];

  const config = {
    AVAILABLE: {
      text: t.available,
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      emoji: '🟢',
    },
    LIMITED: {
      text: t.limited,
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      emoji: '🟡',
    },
    NO_WATER: {
      text: t.noWater,
      dot: 'bg-rose-500',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      emoji: '🔴',
    },
  }[status];

  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span>{config.text}</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold border shadow-xs ${config.badgeBg}`}>
        {showIcon && <Icon className="w-5 h-5 shrink-0" />}
        <div className="flex flex-col text-left">
          <span className="text-sm tracking-wide leading-tight">
            {config.emoji} {config.text}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs ${config.badgeBg}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.emoji} {config.text}</span>
    </span>
  );
};
