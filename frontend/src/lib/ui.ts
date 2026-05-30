import type { AIStatus, Destination, Propensity, Stage } from '../types';

// Overall readiness (0–100) → color
export const scoreColorClass = (s: number) =>
  s >= 80 ? 'text-emerald-700' : s >= 65 ? 'text-blue-700' : s >= 50 ? 'text-amber-700' : 'text-red-700';

export const scoreHex = (s: number) =>
  s >= 80 ? '#10b981' : s >= 65 ? '#1E6FD9' : s >= 50 ? '#f59e0b' : '#ef4444';

export const scoreBgClass = (s: number) =>
  s >= 80 ? 'bg-emerald-50 border-emerald-200'
    : s >= 65 ? 'bg-blue-50 border-blue-200'
    : s >= 50 ? 'bg-amber-50 border-amber-200'
    : 'bg-red-50 border-red-200';

// Dimension bar (0–10) → fill color
export const barColorClass = (s: number) =>
  s >= 8.5 ? 'bg-emerald-500' : s >= 7 ? 'bg-ow-blue' : s >= 5.5 ? 'bg-amber-500' : 'bg-red-500';

export const PROPENSITY: Record<Propensity, { pt: string; en: string; bg: string; text: string; dot: string }> = {
  high:            { pt: 'Alta',           en: 'High',          bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  moderate:        { pt: 'Moderada',       en: 'Moderate',      bg: 'bg-blue-50 border-blue-200',       text: 'text-blue-700',    dot: 'bg-ow-blue' },
  develop:         { pt: 'Desenvolver',    en: 'Develop first', bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-700',   dot: 'bg-amber-500' },
  not_recommended: { pt: 'Não indicado',   en: 'Not advised',   bg: 'bg-red-50 border-red-200',         text: 'text-red-700',     dot: 'bg-red-500' },
};

export const AI_STATUS: Record<AIStatus, { pt: string; en: string; bg: string; text: string; border: string; icon: string }> = {
  READY:                { pt: 'Pronto para aplicar', en: 'Ready to apply',     bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'CheckCircle' },
  READY_WITH_CONDITIONS:{ pt: 'Pronto com condições', en: 'Ready w/ conditions', bg: 'bg-blue-50',   text: 'text-blue-700',    border: 'border-blue-200',    icon: 'AlertTriangle' },
  DEVELOP_FIRST:        { pt: 'Desenvolver primeiro', en: 'Develop first',      bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: 'TrendingUp' },
  REDIRECT:             { pt: 'Redirecionar destino', en: 'Redirect destination', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200',   icon: 'Compass' },
};

export const DESTINATION_META: Record<Destination, { label: string; flag: string; accent: string; ring: string }> = {
  australia: { label: 'Austrália', flag: '🇦🇺', accent: 'bg-ow-blue',   ring: 'ring-blue-200' },
  ireland:   { label: 'Irlanda',   flag: '🇮🇪', accent: 'bg-emerald-600', ring: 'ring-emerald-200' },
  malta:     { label: 'Malta',     flag: '🇲🇹', accent: 'bg-ow-coral',  ring: 'ring-orange-200' },
  spain:     { label: 'Espanha',   flag: '🇪🇸', accent: 'bg-ow-gold',   ring: 'ring-amber-200' },
};

export const STAGE_META: Record<Stage, { accent: string; bar: string; chip: string }> = {
  lead:     { accent: 'border-t-slate-400',   bar: 'bg-slate-400',   chip: 'bg-slate-100 text-slate-700' },
  event:    { accent: 'border-t-ow-sky',      bar: 'bg-ow-sky',      chip: 'bg-sky-100 text-sky-700' },
  quoted:   { accent: 'border-t-ow-teal',     bar: 'bg-ow-teal',     chip: 'bg-teal-100 text-teal-700' },
  analysis: { accent: 'border-t-ow-blue',     bar: 'bg-ow-blue',     chip: 'bg-blue-100 text-blue-700' },
  visa:     { accent: 'border-t-ow-gold',     bar: 'bg-ow-gold',     chip: 'bg-amber-100 text-amber-800' },
  enrolled: { accent: 'border-t-emerald-500', bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-700' },
};
