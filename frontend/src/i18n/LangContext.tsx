import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { DICT, type Lang } from './dict';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
  // pick the right side of a bilingual data pair
  tl: (pt: string, en: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = 'oneway.lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved === 'en' ? 'en' : 'pt';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'pt' ? 'en' : 'pt'), [lang, setLang]);

  const t = useCallback((key: string) => {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang];
  }, [lang]);

  const tl = useCallback((pt: string, en: string) => (lang === 'pt' ? pt : en), [lang]);

  return <Ctx.Provider value={{ lang, setLang, toggle, t, tl }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
