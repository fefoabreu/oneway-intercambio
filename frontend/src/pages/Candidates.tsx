import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Search, IdCard, ShieldCheck, Bot, RefreshCw, X, RotateCw, Info, MapPin,
} from 'lucide-react';
import { candidatesApi, configApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import type { Candidate, ReadinessConfig, ScoreDimension } from '../types';
import { ReadinessDonut, ScoreBar, AIStatusBadge } from '../components/shared/Bits';
import { DESTINATION_META, PROPENSITY, STAGE_META, scoreBgClass } from '../lib/ui';

// ── Explainability modal (the "why" behind a dimension) ───────────────────────
function ExplainModal({ candidate, dim, onClose }: { candidate: Candidate; dim: ScoreDimension; onClose: () => void }) {
  const { t, tl } = useLang();
  const score = candidate.profile.score_breakdown[dim.key];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('common.why')}</div>
            <h3 className="text-lg font-bold text-slate-900">{tl(dim.label_pt, dim.label_en)}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-extrabold text-ow-blue">{score?.toFixed(1)}<span className="text-base text-slate-400">/10</span></div>
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-ow-blue rounded-full" style={{ width: `${(score / 10) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-500">{dim.weight}% {tl('do peso', 'of weight')}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">{tl(dim.desc_pt, dim.desc_en)}</p>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">{t('cand.ethics')}</p>
        </div>
      </div>
    </div>
  );
}

// ── Flippable candidate card ──────────────────────────────────────────────────
function CandidateCard({ candidate, config }: { candidate: Candidate; config: ReadinessConfig }) {
  const { t, tl, lang } = useLang();
  const [flipped, setFlipped] = useState(false);
  const [explain, setExplain] = useState<ScoreDimension | null>(null);
  const p = candidate.profile;
  const rec = DESTINATION_META[p.recommended_destination];
  const topFit = p.destination_fit[0];
  const stage = STAGE_META[candidate.stage];
  const stageLabel = config.stages.find(s => s.key === candidate.stage);
  const dimByKey = (k: string) => config.dimensions.find(d => d.key === k)!;

  return (
    <>
      <div className="perspective h-[560px]">
        <div className={clsx('flip-inner w-full h-full', flipped && 'flipped')}>
          {/* ── FRONT ── */}
          <div className={clsx('flip-face card overflow-hidden h-full flex flex-col border-t-4', stage.accent)}>
            {/* photo banner */}
            <div className="relative h-40 bg-gradient-to-br from-ow-navy to-ow-blue flex-shrink-0">
              <img src={candidate.photo} alt={candidate.name}
                className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ow-navy/80 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full', stage.chip)}>
                  {stageLabel ? tl(stageLabel.label_pt, stageLabel.label_en) : candidate.stage}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">{candidate.name}</h3>
                <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                  <MapPin className="w-3 h-3" /> {candidate.origin_city}
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="text-xs text-slate-500 mb-3">{tl(candidate.goal_pt, candidate.goal_en)}</div>

              {/* readiness + best fit */}
              <div className={clsx('rounded-xl border p-3 mb-3 flex items-center gap-3', scoreBgClass(p.readiness_score))}>
                <ReadinessDonut score={p.readiness_score} size={58} />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('cand.readiness_score')}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t('cand.best_fit')}:</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-base">{rec.flag}</span>
                    <span className="font-bold text-slate-900 text-sm">{rec.label}</span>
                    <span className={clsx('text-[11px] font-semibold px-1.5 py-0.5 rounded-full border', PROPENSITY[topFit.propensity].bg, PROPENSITY[topFit.propensity].text)}>
                      {lang === 'pt' ? PROPENSITY[topFit.propensity].pt : PROPENSITY[topFit.propensity].en}
                    </span>
                  </div>
                </div>
              </div>

              {/* facts mini-grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Fact label={tl('Inglês', 'English')} value={candidate.current_english} />
                <Fact label={tl('Formação', 'Education')} value={tl(candidate.highest_education_pt, candidate.highest_education_en)} small />
              </div>

              <div className="mt-auto flex items-center justify-between">
                <AIStatusBadge status={p.ai_status} />
                <button onClick={() => setFlipped(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ow-blue hover:text-ow-blue-dark transition-colors">
                  <RotateCw className="w-3.5 h-3.5" /> {t('common.flip_hint')}
                </button>
              </div>
            </div>
          </div>

          {/* ── BACK ── */}
          <div className="flip-face flip-back card overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-ow-navy text-white flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img src={candidate.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="font-bold text-sm truncate">{candidate.name}</span>
              </div>
              <button onClick={() => setFlipped(false)} className="flex items-center gap-1 text-xs text-white/80 hover:text-white">
                <RotateCw className="w-3.5 h-3.5" /> {t('common.flip_back')}
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {/* dimensions */}
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                {t('cand.dimensions')} <Info className="w-3 h-3" />
              </div>
              <div className="mb-3">
                {Object.entries(p.score_breakdown).map(([key, score]) => {
                  const dim = dimByKey(key);
                  return <ScoreBar key={key} label={tl(dim.label_pt, dim.label_en)} score={score} onClick={() => setExplain(dim)} />;
                })}
              </div>

              {/* destination ranking */}
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('cand.fit_ranking')}</div>
              <div className="space-y-1.5 mb-3">
                {p.destination_fit.map(f => {
                  const meta = DESTINATION_META[f.destination];
                  const pr = PROPENSITY[f.propensity];
                  return (
                    <div key={f.destination} className="flex items-center gap-2">
                      <span className="text-sm w-5">{meta.flag}</span>
                      <span className="text-xs font-medium text-slate-700 w-16 flex-shrink-0">{meta.label}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={clsx('h-full rounded-full', pr.dot)} style={{ width: `${f.score}%` }} />
                      </div>
                      <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded-full border w-20 text-center', pr.bg, pr.text)}>
                        {lang === 'pt' ? pr.pt : pr.en}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* AI recommendation */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Bot className="w-4 h-4 text-ow-blue" />
                  <span className="text-xs font-bold text-slate-700">{t('common.recommendation')}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{tl(p.ai_text_pt, p.ai_text_en)}</p>
                {(lang === 'pt' ? p.ai_conditions_pt : p.ai_conditions_en).length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('common.conditions')}</div>
                    {(lang === 'pt' ? p.ai_conditions_pt : p.ai_conditions_en).map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <span className="text-amber-500 mt-0.5">▸</span> {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {explain && <ExplainModal candidate={candidate} dim={explain} onClose={() => setExplain(null)} />}
    </>
  );
}

function Fact({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
      <div className="text-[10px] text-slate-400 font-medium">{label}</div>
      <div className={clsx('font-semibold text-slate-800', small ? 'text-[11px] leading-tight' : 'text-sm')}>{value}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Candidates() {
  const { t, lang } = useLang();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [destFilter, setDestFilter] = useState('');

  useEffect(() => {
    Promise.all([candidatesApi.list(), configApi.get()])
      .then(([c, cfg]) => { setCandidates(c.data); setConfig(cfg.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => candidates.filter(c => {
    if (destFilter && c.profile.recommended_destination !== destFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.origin_city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [candidates, search, destFilter]);

  if (loading || !config) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2"><IdCard className="w-7 h-7 text-ow-blue" /> {t('cand.title')}</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">{t('cand.subtitle')}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-emerald-800 font-medium">{t('cand.ethics')}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input className="input pl-9 text-sm" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto text-sm py-2" value={destFilter} onChange={e => setDestFilter(e.target.value)}>
          <option value="">{t('common.all_destinations')}</option>
          {config.destinations.map(d => <option key={d.key} value={d.key}>{d.flag} {d.label}</option>)}
        </select>
        <span className="text-sm text-slate-400 ml-auto flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> {filtered.length} {filtered.length === 1 ? t('common.candidate') : t('common.candidates')}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-400">{t('common.none_match')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => <CandidateCard key={c.id} candidate={c} config={config} />)}
        </div>
      )}
    </div>
  );
}
