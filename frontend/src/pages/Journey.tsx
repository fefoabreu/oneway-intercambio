import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Compass, ClipboardCheck, Plane, Home, Briefcase, RefreshCw, GraduationCap, Bot,
  ChevronRight, Users, AlertTriangle, ShieldCheck, CalendarClock, TrendingUp,
  Sparkles, ArrowRight, CheckCircle2, Info, Quote,
} from 'lucide-react';
import { journeyApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import PageHero from '../components/layout/PageHero';
import { HERO } from '../lib/images';
import { DESTINATION_META } from '../lib/ui';
import type { JourneyStage, StudentJourney, AlertSeverity } from '../types';

const ICONS: Record<string, typeof Compass> = {
  ClipboardCheck, Plane, Home, Briefcase, RefreshCw, GraduationCap,
};

const STAGE_ORDER = ['pre_departure', 'arrival', 'settling', 'study_work', 'renewal', 'pathway'];

const SEV: Record<AlertSeverity, { bg: string; text: string; border: string; Icon: typeof Info }> = {
  ok:       { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', Icon: CheckCircle2 },
  info:     { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    Icon: Info },
  warning:  { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200',   Icon: AlertTriangle },
  critical: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     Icon: AlertTriangle },
};

const NOW = new Date('2026-05-30');
const daysUntil = (iso: string) => Math.round((new Date(iso).getTime() - NOW.getTime()) / 86400000);
const fmtDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-GB', { month: 'short', year: 'numeric' });

function Meter({ label, value, max, min, unit, invertRisk }: {
  label: string; value: number; max: number; min?: number; unit?: string; invertRisk?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  // breach logic: work hours over cap = bad; attendance below min = bad
  const over = value > max;
  const belowMin = min !== undefined && value < min;
  const nearMin = min !== undefined && !belowMin && value < min + 5;
  const color = over || belowMin ? 'bg-red-500' : nearMin ? 'bg-amber-500' : 'bg-emerald-500';
  const txt = over || belowMin ? 'text-red-700' : nearMin ? 'text-amber-700' : 'text-emerald-700';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={clsx('text-xs font-bold', txt)}>
          {value}{invertRisk ? '%' : ''}{!invertRisk && unit ? ` / ${max}` : ''}{invertRisk && min !== undefined ? '' : ''}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
        {min !== undefined && (
          <div className="absolute top-0 bottom-0 w-px bg-slate-400" style={{ left: `${(min / max) * 100}%` }} title={`min ${min}`} />
        )}
      </div>
      {unit && <div className="text-[10px] text-slate-400 mt-0.5">{unit}</div>}
    </div>
  );
}

function StudentTracker({ s, stages }: { s: StudentJourney; stages: JourneyStage[] }) {
  const { t, tl, lang } = useLang();
  const dest = DESTINATION_META[s.destination];
  const c = s.compliance;
  const curIdx = STAGE_ORDER.indexOf(s.current_stage);
  const expiryDays = daysUntil(c.visa_expiry);
  const worstAlert = s.alerts.reduce<AlertSeverity>((w, a) => {
    const rank = { ok: 0, info: 1, warning: 2, critical: 3 };
    return rank[a.severity] > rank[w] ? a.severity : w;
  }, 'ok');
  const topBorder = worstAlert === 'critical' || worstAlert === 'warning' ? 'border-t-amber-400'
    : worstAlert === 'info' ? 'border-t-ow-blue' : 'border-t-emerald-500';

  return (
    <div className={clsx('card overflow-hidden border-t-4', topBorder)}>
      {/* header */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow" loading="lazy" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-900 text-sm leading-tight truncate">{s.name}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>{dest.flag}</span> {s.city_abroad} · {s.course}
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
          {tl(s.intake_pt, s.intake_en)}
        </span>
      </div>

      {/* stage progress rail */}
      <div className="px-4 pt-3 pb-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('journey.stage_now')}</div>
        <div className="flex items-center gap-0.5">
          {STAGE_ORDER.map((key, i) => {
            const done = s.stages_done.includes(key);
            const current = key === s.current_stage;
            const stg = stages.find(x => x.key === key);
            const Icon = stg ? (ICONS[stg.icon] || Compass) : Compass;
            return (
              <div key={key} className="flex items-center flex-1 last:flex-none">
                <div
                  title={stg ? tl(stg.label_pt, stg.label_en) : key}
                  className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition',
                    current ? 'bg-ow-coral text-white ring-2 ring-ow-coral/30'
                      : done ? 'bg-ow-teal text-white' : 'bg-slate-100 text-slate-300',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {i < STAGE_ORDER.length - 1 && (
                  <div className={clsx('h-0.5 flex-1 mx-0.5', i < curIdx ? 'bg-ow-teal' : 'bg-slate-100')} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs font-semibold text-ow-coral mt-1.5">
          {(() => { const stg = stages.find(x => x.key === s.current_stage); return stg ? tl(stg.label_pt, stg.label_en) : s.current_stage; })()}
        </div>
      </div>

      {/* AI alerts */}
      <div className="px-4 pb-2 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Bot className="w-3 h-3" /> {t('journey.alerts_label')}
        </div>
        {s.alerts.map((a, i) => {
          const cfg = SEV[a.severity];
          return (
            <div key={i} className={clsx('flex items-start gap-1.5 rounded-lg border px-2.5 py-1.5', cfg.bg, cfg.border)}>
              <cfg.Icon className={clsx('w-3.5 h-3.5 flex-shrink-0 mt-0.5', cfg.text)} />
              <span className={clsx('text-[11px] leading-snug', cfg.text)}>{tl(a.pt, a.en)}</span>
            </div>
          );
        })}
      </div>

      {/* compliance meters */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> {t('journey.compliance')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Meter label={t('journey.attendance')} value={c.attendance_pct} max={100} min={c.attendance_min} invertRisk
            unit={`${t('journey.min')} ${c.attendance_min}%`} />
          <Meter label={t('journey.work_hours')} value={c.work_hours_used} max={c.work_hours_cap}
            unit={tl(c.work_hours_unit_pt, c.work_hours_unit_en)} />
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
          <CalendarClock className="w-3.5 h-3.5" />
          {t('journey.visa_expiry')}: <span className={clsx('font-semibold', expiryDays < 150 ? 'text-amber-700' : 'text-slate-700')}>
            {fmtDate(c.visa_expiry, lang)}
          </span>
          <span className="text-slate-400">({expiryDays}d)</span>
        </div>
      </div>

      {/* renewal */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> {t('journey.renewal')}
          </div>
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full',
            s.renewal.status === 'action_due' ? 'bg-amber-100 text-amber-800'
              : s.renewal.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
            {tl(s.renewal.label_pt, s.renewal.label_en)}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-snug">{tl(s.renewal.next_pt, s.renewal.next_en)}</p>
      </div>

      {/* pathway */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {t('journey.pathway')}
          </div>
          <span className="text-xs font-bold text-ow-teal">{s.pathway.eligibility_pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
          <div className="h-full bg-gradient-to-r from-ow-teal to-emerald-500 rounded-full" style={{ width: `${s.pathway.eligibility_pct}%` }} />
        </div>
        <div className="text-[11px] font-semibold text-slate-700">{tl(s.pathway.route_pt, s.pathway.route_en)}</div>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{tl(s.pathway.note_pt, s.pathway.note_en)}</p>
      </div>

      {/* alumni / referral loop */}
      <div className="px-4 py-3 border-t border-slate-100 bg-ow-sand/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-ow-gold" /> {t('journey.alumni')}
          </div>
          <span className="text-[11px] text-slate-500">
            <span className="font-bold text-ow-ink">{s.alumni.referrals}</span> {t('journey.referrals_made')} ·
            <span className="font-bold text-emerald-700"> {s.alumni.converted_leads}</span> {t('journey.became_lead')}
          </span>
        </div>
        <div className="flex items-start gap-1.5 mb-2">
          <Quote className="w-3.5 h-3.5 text-ow-gold flex-shrink-0 mt-0.5" />
          <p className="text-[11px] italic text-slate-600 leading-snug">{tl(s.alumni.testimonial_pt, s.alumni.testimonial_en)}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {s.alumni.referred.map((r, i) => (
            <span key={i} className={clsx('text-[10px] px-1.5 py-0.5 rounded-full border',
              r.became_lead ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500')}>
              {r.became_lead && '✓ '}{r.name}
            </span>
          ))}
        </div>
        {s.alumni.converted_leads > 0 && (
          <Link to="/pipeline" className="inline-flex items-center gap-1 text-[11px] font-semibold text-ow-blue hover:text-ow-blue-dark mt-2">
            {t('journey.view_in_pipeline')} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Journey() {
  const { t, tl } = useLang();
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [students, setStudents] = useState<StudentJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([journeyApi.list(), journeyApi.students()])
      .then(([j, s]) => { setStages(j.data); setStudents(s.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400">{t('common.loading')}</div>;

  const totalAlerts = students.reduce((n, s) => n + s.alerts.filter(a => a.severity === 'warning' || a.severity === 'critical').length, 0);
  const renewals = students.filter(s => s.renewal.status === 'action_due').length;
  const referralLeads = students.reduce((n, s) => n + s.alumni.converted_leads, 0);

  return (
    <div>
      <PageHero
        image={HERO.journey}
        titleKey="journey.title"
        subtitleKey="journey.subtitle"
        route="EMBARQUE ✈┄┄┄ PATHWAY"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 border-l-4 border-l-ow-teal">
          <div className="flex items-center gap-2 text-slate-500 text-sm"><Users className="w-4 h-4" /> {t('journey.kpi.students')}</div>
          <div className="text-2xl font-bold mt-1 text-slate-900">{students.length}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-slate-500 text-sm"><AlertTriangle className="w-4 h-4" /> {t('journey.kpi.alerts')}</div>
          <div className="text-2xl font-bold mt-1 text-slate-900">{totalAlerts}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-ow-blue">
          <div className="flex items-center gap-2 text-slate-500 text-sm"><RefreshCw className="w-4 h-4" /> {t('journey.kpi.renewals')}</div>
          <div className="text-2xl font-bold mt-1 text-slate-900">{renewals}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-ow-gold">
          <div className="flex items-center gap-2 text-slate-500 text-sm"><Sparkles className="w-4 h-4" /> {t('journey.kpi.referrals')}</div>
          <div className="text-2xl font-bold mt-1 text-slate-900">{referralLeads}</div>
        </div>
      </div>

      {/* Live students */}
      <div className="mb-2">
        <h2 className="section-title flex items-center gap-2"><Users className="w-5 h-5 text-ow-teal" /> {t('journey.live_title')}</h2>
        <p className="text-sm text-slate-500 mt-0.5 max-w-3xl">{t('journey.live_sub')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {students.map(s => <StudentTracker key={s.candidate_id} s={s} stages={stages} />)}
      </div>

      {/* Framework */}
      <div className="mb-4">
        <h2 className="section-title flex items-center gap-2"><Compass className="w-5 h-5 text-ow-blue" /> {t('journey.framework_title')}</h2>
      </div>
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
