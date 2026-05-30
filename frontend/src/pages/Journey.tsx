import { useEffect, useState } from 'react';
import {
  Compass, ClipboardCheck, Plane, Home, Briefcase, RefreshCw, GraduationCap, Bot, ChevronRight,
} from 'lucide-react';
import { journeyApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import type { JourneyStage } from '../types';

const ICONS: Record<string, typeof Compass> = {
  ClipboardCheck, Plane, Home, Briefcase, RefreshCw, GraduationCap,
};

export default function Journey() {
  const { t, tl } = useLang();
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journeyApi.list().then(r => setStages(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2"><Compass className="w-7 h-7 text-ow-blue" /> {t('journey.title')}</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">{t('journey.subtitle')}</p>
      </div>

      {/* stage rail */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {stages.map((s, i) => {
          const Icon = ICONS[s.icon] || Compass;
          return (
            <div key={s.key} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5 w-24">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-ow-blue to-ow-teal text-white flex items-center justify-center shadow">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{tl(s.label_pt, s.label_en)}</span>
              </div>
              {i < stages.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 -mt-4" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {stages.map((s, i) => {
          const Icon = ICONS[s.icon] || Compass;
          return (
            <div key={s.key} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-ow-blue/10 text-ow-blue flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tl('Etapa', 'Stage')} {i + 1}</div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">{tl(s.label_pt, s.label_en)}</h2>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{tl(s.summary_pt, s.summary_en)}</p>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('journey.actions')}</div>
              <div className="space-y-1 mb-3">
                {(tl(s.actions_pt.join('||'), s.actions_en.join('||'))).split('||').map((a, j) => (
                  <div key={j} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="text-ow-teal mt-0.5">▸</span> {a}
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-ow-blue/5 border border-ow-blue/15 p-3 flex gap-2">
                <Bot className="w-4 h-4 text-ow-blue flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-ow-blue uppercase tracking-wide mb-0.5">{t('journey.ai_touch')}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tl(s.ai_touch_pt, s.ai_touch_en)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
