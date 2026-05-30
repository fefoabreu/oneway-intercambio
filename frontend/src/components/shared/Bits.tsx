import clsx from 'clsx';
import { CheckCircle, AlertTriangle, TrendingUp, Compass } from 'lucide-react';
import type { AIStatus } from '../../types';
import { scoreHex, scoreColorClass, barColorClass, AI_STATUS } from '../../lib/ui';
import { useLang } from '../../i18n/LangContext';

// ── Readiness donut ───────────────────────────────────────────────────────────
export function ReadinessDonut({ score, size = 56 }: { score: number; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3.2" />
        <circle
          cx="18" cy="18" r="15.5" fill="none"
          stroke={scoreHex(score)} strokeWidth="3.2"
          strokeDasharray={`${score} 100`} strokeLinecap="round"
        />
      </svg>
      <span className={clsx('absolute inset-0 flex items-center justify-center font-extrabold', scoreColorClass(score))}
        style={{ fontSize: size * 0.28 }}>
        {Math.round(score)}
      </span>
    </div>
  );
}

// ── Dimension score bar (0–10) ────────────────────────────────────────────────
export function ScoreBar({ label, score, onClick }: { label: string; score: number; onClick?: () => void }) {
  const pct = (score / 10) * 100;
  return (
    <div className={clsx('group', onClick && 'cursor-pointer')} onClick={onClick}>
      <div className={clsx('flex items-center gap-3 py-1 rounded transition-colors', onClick && 'hover:bg-blue-50/60 px-1 -mx-1')}>
        <div className="w-40 flex items-center gap-1.5 flex-shrink-0">
          <span className={clsx('text-xs font-medium truncate', onClick ? 'text-ow-blue' : 'text-slate-600')}>{label}</span>
        </div>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all', barColorClass(score))} style={{ width: `${pct}%` }} />
        </div>
        <div className="w-9 text-right">
          <span className={clsx('text-xs font-bold',
            score >= 8.5 ? 'text-emerald-700' : score >= 7 ? 'text-blue-700' : score >= 5.5 ? 'text-amber-700' : 'text-red-700')}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── AI status badge ───────────────────────────────────────────────────────────
const AI_ICON = { CheckCircle, AlertTriangle, TrendingUp, Compass } as const;

export function AIStatusBadge({ status }: { status: AIStatus }) {
  const { lang } = useLang();
  const cfg = AI_STATUS[status];
  const Icon = AI_ICON[cfg.icon as keyof typeof AI_ICON];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', cfg.bg, cfg.text, cfg.border)}>
      <Icon className="w-3.5 h-3.5" />
      {lang === 'pt' ? cfg.pt : cfg.en}
    </span>
  );
}
