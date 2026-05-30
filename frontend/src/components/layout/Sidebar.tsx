import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, IdCard, Plane, Compass, Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import { useLang } from '../../i18n/LangContext';

const nav = [
  { key: 'nav.dashboard', to: '/', icon: LayoutDashboard, end: true },
  { type: 'divider', key: 'nav.section.crm' },
  { key: 'nav.pipeline', to: '/pipeline', icon: GitBranch },
  { type: 'divider', key: 'nav.section.ai' },
  { key: 'nav.candidates', to: '/candidates', icon: IdCard },
  { type: 'divider', key: 'nav.section.ops' },
  { key: 'nav.visa', to: '/visa', icon: Plane },
  { key: 'nav.journey', to: '/journey', icon: Compass },
] as const;

export default function Sidebar() {
  const { t, lang, setLang } = useLang();

  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-ow-coral to-ow-gold rounded-lg flex items-center justify-center shadow-lg">
            <Plane className="w-5 h-5 text-white -rotate-12" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm leading-tight tracking-tight">ONE WAY</div>
            <div className="text-ow-sky text-[11px] leading-tight font-medium">{t('brand.tagline')}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map((item, i) => {
          if ('type' in item) {
            return (
              <div key={i} className="px-3 pt-5 pb-1">
                <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">{t(item.key)}</span>
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
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive ? 'bg-ow-blue text-white font-medium' : 'text-slate-400 hover:bg-sidebar-hover hover:text-white',
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Language toggle */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 mb-3">
          {(['pt', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={clsx(
                'flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors',
                lang === l ? 'bg-ow-blue text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              {l === 'pt' ? '🇧🇷 PT' : '🇬🇧 EN'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Sparkles className="w-3 h-3 text-ow-gold" />
          {t('shell.footer_org')}
        </div>
        <div className="text-[11px] text-slate-600">{t('shell.footer_ver')}</div>
      </div>
    </aside>
  );
}
