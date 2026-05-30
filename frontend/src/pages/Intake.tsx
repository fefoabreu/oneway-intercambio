import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Sparkles, Bot, Wand2, RotateCcw, Plus, Check, Zap, FlaskConical } from 'lucide-react';
import { analyzeApi, configApi } from '../api/client';
import { useLang } from '../i18n/LangContext';
import type { Candidate, ReadinessConfig, IntakeInput, Education, EnglishLevel, Goal, Destination } from '../types';
import PageHero from '../components/layout/PageHero';
import CandidateCard from '../components/shared/CandidateCard';
import { HERO } from '../lib/images';
import { DESTINATION_META } from '../lib/ui';

const GOALS: Goal[] = ['study_work', 'study', 'work_study'];
const GOAL_L: Record<Goal, [string, string]> = {
  study: ['Estudar inglês', 'Study English'],
  study_work: ['Estudar e trabalhar', 'Study + work'],
  work_study: ['Trabalhar e estudar', 'Work + study'],
};
const EDUS: Education[] = ['none', 'high_school', 'technical', 'undergrad_incomplete', 'undergrad', 'postgrad'];
const EDU_L: Record<Education, [string, string]> = {
  none: ['Sem ensino médio', 'No high school'],
  high_school: ['Ensino médio completo', 'High school completed'],
  technical: ['Curso técnico', 'Technical diploma'],
  undergrad_incomplete: ['Superior incompleto', 'Incomplete degree'],
  undergrad: ['Superior completo', "Bachelor's degree"],
  postgrad: ['Pós-graduação', 'Postgraduate'],
};
const ENGS: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const DEFAULTS: IntakeInput = {
  name: '', origin_city: '', goal: 'study_work', education: 'undergrad', english: 'B1',
  funds_brl: 50000, intent_text: '', prior_refusal: false, refusal_note: '', preferred_destination: '',
};

export default function Intake() {
  const { t, tl } = useLang();
  const [form, setForm] = useState<IntakeInput>(DEFAULTS);
  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [result, setResult] = useState<{ candidate: Candidate; live: boolean } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => { configApi.get().then(r => setConfig(r.data)); }, []);

  const set = <K extends keyof IntakeInput>(k: K, v: IntakeInput[K]) => setForm(f => ({ ...f, [k]: v }));

  const analyze = async () => {
    setAnalyzing(true); setAdded(false);
    const started = Date.now();
    const res = await analyzeApi.analyze(form);
    // small floor so the "analysis" reads as real work
    const wait = Math.max(0, 650 - (Date.now() - started));
    setTimeout(() => { setResult(res); setAnalyzing(false); }, wait);
  };

  const reset = () => { setForm(DEFAULTS); setResult(null); setAdded(false); };

  return (
    <div>
      <PageHero image={HERO.candidates} titleKey="intake.title" subtitleKey="intake.subtitle" route="LEAD ✦ ANÁLISE DE IA" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-ow-coral" />
            <h2 className="section-title">{t('intake.form_title')}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('intake.f_name')}>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ana Beatriz..." />
            </Field>
            <Field label={t('intake.f_city')}>
              <input className="input" value={form.origin_city} onChange={e => set('origin_city', e.target.value)} placeholder="Florianópolis, SC" />
            </Field>

            <Field label={t('intake.f_goal')}>
              <select className="input" value={form.goal} onChange={e => set('goal', e.target.value as Goal)}>
                {GOALS.map(g => <option key={g} value={g}>{tl(GOAL_L[g][0], GOAL_L[g][1])}</option>)}
              </select>
            </Field>
            <Field label={t('intake.f_english')}>
              <select className="input" value={form.english} onChange={e => set('english', e.target.value as EnglishLevel)}>
                {ENGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>

            <Field label={t('intake.f_education')} wide>
              <select className="input" value={form.education} onChange={e => set('education', e.target.value as Education)}>
                {EDUS.map(ed => <option key={ed} value={ed}>{tl(EDU_L[ed][0], EDU_L[ed][1])}</option>)}
              </select>
            </Field>

            <Field label={`${t('intake.f_funds')}`} wide>
              <div className="flex items-center gap-3">
                <input type="range" min={10000} max={150000} step={5000} value={form.funds_brl}
                  onChange={e => set('funds_brl', +e.target.value)} className="flex-1 accent-ow-teal" />
                <span className="text-sm font-bold text-ow-ink w-28 text-right">R$ {form.funds_brl.toLocaleString('pt-BR')}</span>
              </div>
            </Field>

            <Field label={t('intake.f_intent')} wide>
              <textarea className="input rounded-2xl" rows={3} value={form.intent_text}
                onChange={e => set('intent_text', e.target.value)} placeholder={t('intake.f_intent_ph')} />
            </Field>

            <Field label={t('intake.f_preferred')}>
              <select className="input" value={form.preferred_destination}
                onChange={e => set('preferred_destination', e.target.value as Destination | '')}>
                <option value="">{t('intake.none')}</option>
                {(['australia', 'ireland', 'malta', 'spain'] as Destination[]).map(d =>
                  <option key={d} value={d}>{DESTINATION_META[d].flag} {DESTINATION_META[d].label}</option>)}
              </select>
            </Field>
            <Field label={t('intake.f_refusal')}>
              <div className="flex gap-2">
                <button type="button" onClick={() => set('prior_refusal', false)}
                  className={clsx('flex-1 rounded-full py-2 text-sm font-semibold border transition', !form.prior_refusal ? 'bg-ow-teal text-white border-ow-teal' : 'bg-white text-slate-500 border-ow-sand-deep')}>
                  {t('intake.no')}
                </button>
                <button type="button" onClick={() => set('prior_refusal', true)}
                  className={clsx('flex-1 rounded-full py-2 text-sm font-semibold border transition', form.prior_refusal ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-500 border-ow-sand-deep')}>
                  {t('intake.yes')}
                </button>
              </div>
            </Field>

            {form.prior_refusal && (
              <Field label={t('intake.f_refusal_note')} wide>
                <input className="input" value={form.refusal_note} onChange={e => set('refusal_note', e.target.value)} placeholder="EUA 2024..." />
              </Field>
            )}
          </div>

          <div className="flex items-center gap-2 mt-5">
            <button onClick={analyze} disabled={analyzing}
              className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {analyzing ? <Bot className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? t('intake.analyzing') : t('intake.analyze')}
            </button>
            <button onClick={reset} className="btn-secondary flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> {t('intake.reset')}
            </button>
          </div>
        </div>

        {/* ── Result ── */}
        <div>
          {!result && !analyzing && (
            <div className="card p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-ow-sand-deep flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-ow-coral" />
              </div>
              <p className="text-sm text-slate-500 max-w-xs">{t('intake.empty')}</p>
            </div>
          )}

          {analyzing && (
            <div className="card p-10 h-full flex flex-col items-center justify-center text-center">
              <Bot className="w-10 h-10 text-ow-teal animate-spin mb-3" />
              <p className="text-sm font-semibold text-ow-ink">{t('intake.analyzing')}</p>
            </div>
          )}

          {result && !analyzing && config && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t('intake.result')}
                </div>
                <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
                  result.live ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
                  {result.live ? <Zap className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />}
                  {result.live ? t('intake.mode_live') : t('intake.mode_demo')}
                </span>
              </div>

              <CandidateCard candidate={result.candidate} config={config} />

              <div className="mt-3 flex items-center justify-between gap-3">
                <button onClick={() => setAdded(true)} disabled={added}
                  className={clsx('flex items-center gap-1.5 text-sm font-semibold transition', added ? 'text-emerald-600' : 'text-ow-blue hover:text-ow-blue-dark')}>
                  {added ? <><Check className="w-4 h-4" /> {t('intake.added')}</> : <><Plus className="w-4 h-4" /> {t('intake.add')}</>}
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-ow-blue/5 border border-ow-blue/15 p-3 flex gap-2">
                <Bot className="w-4 h-4 text-ow-blue flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">{t('intake.demo_note')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={clsx(wide && 'col-span-2')}>
      <label className="label text-xs">{label}</label>
      {children}
    </div>
  );
}
