import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Plane, CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';
import { visaApi, configApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import type { VisaCase, ReadinessConfig, VisaStepStatus } from '../types';
import { DESTINATION_META } from '../lib/ui';

const STEP_ICON: Record<VisaStepStatus, { Icon: typeof Circle; color: string }> = {
  done:        { Icon: CheckCircle2, color: 'text-emerald-500' },
  in_progress: { Icon: Clock,        color: 'text-ow-blue' },
  pending:     { Icon: Circle,       color: 'text-slate-300' },
  blocked:     { Icon: AlertCircle,  color: 'text-red-500' },
};

function VisaCard({ vc, config }: { vc: VisaCase; config: ReadinessConfig }) {
  const { t, tl } = useLang();
  const meta = DESTINATION_META[vc.destination];
  const destDef = config.destinations.find(d => d.key === vc.destination);
  const done = vc.steps.filter(s => s.status === 'done').length;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-ow-navy to-ow-blue text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">{meta.flag}</span>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{vc.candidate_name}</div>
              <div className="text-[11px] text-ow-sky">{vc.visa_type}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-extrabold">{vc.overall_pct}%</div>
            <div className="text-[10px] text-white/70">{done}/{vc.steps.length} {tl('etapas', 'steps')}</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-ow-gold rounded-full" style={{ width: `${vc.overall_pct}%` }} />
        </div>
      </div>

      <div className="p-5">
        <div className="text-[11px] text-slate-500 mb-3">
          <span className="font-semibold">{t('visa.intake')}:</span> {tl(vc.target_intake_pt, vc.target_intake_en)}
          {destDef && <span className="ml-2 text-slate-400">· {tl(destDef.tagline_pt, destDef.tagline_en)}</span>}
        </div>
        <div className="space-y-2.5">
          {vc.steps.map((s, i) => {
            const cfg = STEP_ICON[s.status];
            const Icon = cfg.Icon;
            const last = i === vc.steps.length - 1;
            return (
              <div key={s.key} className="flex items-start gap-2.5 relative">
                {!last && <div className="absolute left-[9px] top-5 bottom-[-10px] w-px bg-slate-200" />}
                <Icon className={clsx('w-[18px] h-[18px] flex-shrink-0 mt-0.5 bg-white relative z-10', cfg.color)} />
                <span className={clsx('text-sm', s.status === 'done' ? 'text-slate-700' : s.status === 'in_progress' ? 'text-slate-900 font-medium' : 'text-slate-400')}>
                  {tl(s.label_pt, s.label_en)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Visa() {
  const { t } = useLang();
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([visaApi.list(), configApi.get()])
      .then(([v, cfg]) => { setCases(v.data); setConfig(cfg.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !config) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2"><Plane className="w-7 h-7 text-ow-blue" /> {t('visa.title')}</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">{t('visa.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {cases.map(vc => <VisaCard key={vc.candidate_id} vc={vc} config={config} />)}
      </div>
    </div>
  );
}
