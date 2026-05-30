import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { GitBranch, Bot } from 'lucide-react';
import { candidatesApi, configApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import PageHero from '../components/layout/PageHero';
import { HERO } from '../lib/images';
import type { Candidate, ReadinessConfig, StageDef } from '../types';
import { DESTINATION_META, STAGE_META, scoreColorClass } from '../lib/ui';
import { AIStatusBadge } from '../components/shared/Bits';

function MiniCard({ candidate }: { candidate: Candidate }) {
  const p = candidate.profile;
  const rec = DESTINATION_META[p.recommended_destination];
  return (
    <div className="card p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-2">
        <img src={candidate.photo} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" loading="lazy" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900 truncate leading-tight">{candidate.name}</div>
          <div className="text-[11px] text-slate-400 truncate">{candidate.origin_city}</div>
        </div>
        <div className={clsx('text-base font-extrabold flex-shrink-0', scoreColorClass(p.readiness_score))}>{p.readiness_score}</div>
      </div>
      <div className="flex items-center justify-between gap-1">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
          {rec.flag} {rec.label}
        </span>
        <span className="text-[11px] text-slate-400">{candidate.current_english}</span>
      </div>
      <div className="mt-2"><AIStatusBadge status={p.ai_status} /></div>
    </div>
  );
}

function Column({ stage, candidates }: { stage: StageDef; candidates: Candidate[] }) {
  const { tl, t } = useLang();
  const meta = STAGE_META[stage.key];
  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      <div className={clsx('rounded-t-lg px-3 py-2.5 border-t-4 bg-white border border-b-0 border-slate-200', meta.accent)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">{tl(stage.label_pt, stage.label_en)}</span>
          <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', meta.chip)}>{candidates.length}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{tl(stage.desc_pt, stage.desc_en)}</p>
      </div>
      <div className="bg-slate-100/70 border border-t-0 border-slate-200 rounded-b-lg p-2 flex-1 space-y-2 min-h-[120px]">
        {/* AI role banner */}
        <div className="flex items-start gap-1.5 rounded-md bg-ow-blue/5 border border-ow-blue/15 px-2 py-1.5">
          <Bot className="w-3.5 h-3.5 text-ow-blue flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[9px] font-bold text-ow-blue uppercase tracking-wide">{t('pipe.ai_role')}</div>
            <div className="text-[11px] text-slate-600 leading-tight">{tl(stage.ai_role_pt, stage.ai_role_en)}</div>
          </div>
        </div>
        {candidates.map(c => <MiniCard key={c.id} candidate={c} />)}
      </div>
    </div>
  );
}

export default function Pipeline() {
  const { t } = useLang();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([candidatesApi.list(), configApi.get()])
      .then(([c, cfg]) => { setCandidates(c.data); setConfig(cfg.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !config) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div>
      <PageHero
        image={HERO.pipeline}
        titleKey="pipe.title"
        subtitleKey="pipe.subtitle"
        route="LEAD ✈┄┄┄┄┄ MATRÍCULA"
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {config.stages.map(stage => (
          <Column key={stage.key} stage={stage} candidates={candidates.filter(c => c.stage === stage.key)} />
        ))}
      </div>
    </div>
  );
}
