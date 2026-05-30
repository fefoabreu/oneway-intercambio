import { Plane } from 'lucide-react';
import { useLang } from '../../i18n/LangContext';

interface Chip { label: string; value: string }

export default function PageHero({
  image, titleKey, subtitleKey, route, chips, kicker,
}: {
  image: string;
  titleKey: string;
  subtitleKey: string;
  route?: string;       // e.g. "BRASIL ✈ AUSTRÁLIA"
  chips?: Chip[];
  kicker?: string;      // small eyebrow, defaults to brand
}) {
  const { t } = useLang();
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-ticket mb-6">
      {/* photo */}
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ow-navy/92 via-ow-navy/70 to-ow-teal/25" />
      {/* perforated boarding-pass stub on the right */}
      <div className="absolute top-0 bottom-0 right-0 w-px border-l-2 border-dashed border-white/30 hidden md:block" style={{ right: '128px' }} />

      <div className="relative px-7 py-8 md:py-10">
        <div className="text-[11px] font-bold tracking-[0.22em] text-ow-gold uppercase mb-2 flex items-center gap-2">
          <Plane className="w-3.5 h-3.5" /> {kicker || 'One Way · Intercâmbio'}
        </div>
        <h1 className="font-display font-extrabold text-white text-4xl md:text-5xl leading-[0.95] tracking-wide max-w-2xl">
          {t(titleKey)}
        </h1>
        <p className="text-white/85 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">{t(subtitleKey)}</p>

        {route && (
          <div className="mt-5 inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-bold tracking-wide">
            {route}
          </div>
        )}

        {chips && chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {chips.map((c, i) => (
              <div key={i} className="bg-white/95 rounded-xl px-3.5 py-2 shadow-sm">
                <div className="text-lg font-extrabold text-ow-ink leading-none font-display">{c.value}</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{c.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
