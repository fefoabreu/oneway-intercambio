import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GitBranch, IdCard, Plane, Compass, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useLang } from '../../i18n/LangContext';
import { LOGO_WHITE } from '../../lib/images';

const nav = [
  { key: 'nav.dashboard', to: '/', icon: LayoutDashboard, end: true, code: '01' },
  { type: 'divider', key: 'nav.section.crm' },
  { key: 'nav.pipeline', to: '/pipeline', icon: GitBranch, code: '02' },
  { type: 'divider', key: 'nav.section.ai' },
  { key: 'nav.candidates', to: '/candidates', icon: IdCard, code: '03' },
  { key: 'nav.intake', to: '/intake', icon: Sparkles, code: 'AI' },
  { type: 'divider', key: 'nav.section.ops' },
  { key: 'nav.visa', to: '/visa', icon: Plane, code: '04' },
  { key: 'nav.journey', to: '/journey', icon: Compass, code: '05' },
] as const;

export default function Sidebar() {
  const { t, lang, setLang } = useLang();

  return (
    <aside className="w-64 flex-shrink-0 relative">
      {/* boarding-pass body with perforated right edge */}
      <div className="w-64 bg-gradient-to-b from-sidebar to-[#0b4150] text-white flex flex-col h-screen sticky top-0 perf-right">
        {/* header */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="text-[10px] font-bold tracking-[0.25em] text-ow-gold/90 mb-2">BOARDING PASS</div>
          <div className="flex items-center gap-2.5">
            <img src={LOGO_WHITE} alt="One Way" className="w-9 h-9" />
            <div>
              <div className="font-display font-extrabold text-2xl leading-none tracking-wide">ONE WAY</div>
              <div className="text-ow-sky text-[10px] leading-tight font-semibold tracking-wider uppercase">{t('brand.tagline')}</div>
            </div>
          </div>
          {/* mini route */}
          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold">
            <span className="text-white/90">BRA</span>
            <div className="flex-1 relative h-3 flex items-center text-white/30">
              <div className="route-dash h-[2px] w-full" />
              <Plane className="w-3.5 h-3.5 text-ow-gold absolute right-0 animate-taxi" />
            </div>
            <span className="text-ow-gold">AUS</span>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {nav.map((item, i) => {
            if ('type' in item) {
              return (
                <div key={i} className="px-3 pt-4 pb-1">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-white/35 uppercase">{t(item.key)}</span>
                </div>
              );
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-ow-coral text-white font-semibold shadow-lg shadow-ow-coral/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{t(item.key)}</span>
                    <span className={clsx('text-[10px] font-mono tracking-widest', isActive ? 'text-white/80' : 'text-white/25')}>
                      {item.code}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* language toggle */}
        <div className="px-4 pb-3 pt-2">
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 mb-3">
            {(['pt', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={clsx(
                  'flex-1 text-xs font-bold py-1.5 rounded-full transition-colors',
                  lang === l ? 'bg-ow-gold text-ow-ink' : 'text-white/60 hover:text-white',
                )}
              >
                {l === 'pt' ? '🇧🇷 PT' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
          {/* barcode footer */}
          <div className="barcode text-white/30 h-7 rounded" />
          <div className="flex items-center justify-between mt-2 text-[9px] text-white/40 font-mono tracking-wider">
            <span>OW · INTERCÂMBIO</span>
            <span>SEAT 1A</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
