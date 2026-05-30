import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Users, Gauge, CheckCircle, GraduationCap, ArrowRight, Target } from 'lucide-react';
import { candidatesApi, configApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import PageHero from '../components/layout/PageHero';
import { HERO } from '../lib/images';
import type { Candidate, ReadinessConfig, Destination, Propensity } from '../types';
import { DESTINATION_META, PROPENSITY, STAGE_META } from '../lib/ui';

function KpiCard({ icon: Icon, color, label, value, sub }: { icon: typeof Users; color: string; label: string; value: string; sub: string }) {
  return (
    <div className={clsx('card p-4 border-l-4', color)}>
      <div className="flex items-center gap-2 text-slate-500 text-sm"><Icon className="w-4 h-4" /> {label}</div>
      <div className="text-2xl font-bold mt-1 text-slate-900">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { t, tl, lang } = useLang();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([candidatesApi.list(), configApi.get()])
      .then(([c, cfg]) => { setCandidates(c.data); setConfig(cfg.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !config) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  const total = candidates.length;
  const avg = total ? Math.round(candidates.reduce((s, c) => s + c.profile.readiness_score, 0) / total) : 0;
  const ready = candidates.filter(c => c.profile.ai_status === 'READY' || c.profile.ai_status === 'READY_WITH_CONDITIONS').length;
  const enrolled = candidates.filter(c => c.stage === 'enrolled').length;

  const byStage = config.stages.map(s => ({ stage: s, count: candidates.filter(c => c.stage === s.key).length }));
  const maxStage = Math.max(...byStage.map(b => b.count), 1);

  const destCounts = (['australia', 'ireland', 'malta', 'spain'] as Destination[])
    .map(d => ({ d, count: candidates.filter(c => c.profile.recommended_destination === d).length }))
    .filter(x => x.count > 0);

  const propCounts = (['high', 'moderate', 'develop', 'not_recommended'] as Propensity[])
    .map(pr => ({ pr, count: candidates.filter(c => c.profile.destination_fit[0].propensity === pr).length }))
    .filter(x => x.count > 0);

  return (
    <div>
      <PageHero
        image={HERO.dashboard}
        titleKey="dash.title"
        subtitleKey="dash.subtitle"
        route="🇧🇷 BRASIL ✈ 🌏 O MUNDO"
        chips={[
          { label: tl('No funil', 'In pipeline'), value: `${total - enrolled}` },
          { label: tl('Prontidão média', 'Avg readiness'), value: `${avg}` },
          { label: tl('Matriculados', 'Enrolled'), value: `${enrolled}` },
        ]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={Users} color="border-l-ow-blue" label={t('dash.kpi.active')} value={`${total - enrolled}`} sub={t('dash.kpi.active_sub')} />
        <KpiCard icon={Gauge} color="border-l-amber-500" label={t('dash.kpi.avg')} value={`${avg}/100`} sub={t('dash.kpi.avg_sub')} />
        <KpiCard icon={CheckCircle} color="border-l-emerald-500" label={t('dash.kpi.ready')} value={`${ready}`} sub={t('dash.kpi.ready_sub')} />
        <KpiCard icon={GraduationCap} color="border-l-ow-teal" label={t('dash.kpi.enrolled')} value={`${enrolled}`} sub={t('dash.kpi.enrolled_sub')} />
      </div>

      {/* Objective */}
      <div className="card p-5 mb-6 bg-gradient-to-r from-ow-navy to-ow-blue text-white">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ow-sky mb-1">
          <Target className="w-3.5 h-3.5" /> {t('dash.objective')}
        </div>
        <p className="text-base font-semibold leading-snug max-w-4xl">{tl(config.objective_pt, config.objective_en)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* By stage */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="section-title mb-4">{t('dash.by_stage')}</h2>
          <div className="space-y-3">
            {byStage.map(({ stage, count }) => (
              <div key={stage.key} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 w-36 flex-shrink-0">{tl(stage.label_pt, stage.label_en)}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
                  <div className={clsx('h-full rounded-md flex items-center justify-end px-2', STAGE_META[stage.key].bar)}
                    style={{ width: `${Math.max((count / maxStage) * 100, count ? 12 : 0)}%` }}>
                    {count > 0 && <span className="text-[11px] font-bold text-white">{count}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/pipeline" className="inline-flex items-center gap-1 text-xs font-semibold text-ow-blue hover:text-ow-blue-dark mt-4">
            {t('nav.pipeline')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Destination + propensity */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="section-title mb-3 text-base">{t('dash.by_dest')}</h2>
            <div className="space-y-2">
              {destCounts.map(({ d, count }) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="text-base w-6">{DESTINATION_META[d].flag}</span>
                  <span className="text-xs font-medium text-slate-700 flex-1">{DESTINATION_META[d].label}</span>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="section-title mb-3 text-base">{t('dash.propensity')}</h2>
            <div className="space-y-2">
              {propCounts.map(({ pr, count }) => (
                <div key={pr} className="flex items-center gap-2">
                  <span className={clsx('w-2.5 h-2.5 rounded-full', PROPENSITY[pr].dot)} />
                  <span className="text-xs font-medium text-slate-700 flex-1">{lang === 'pt' ? PROPENSITY[pr].pt : PROPENSITY[pr].en}</span>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
