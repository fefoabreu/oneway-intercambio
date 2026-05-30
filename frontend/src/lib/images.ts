// Self-hosted destination & hero photography (verified, under /public/img).
// BASE_URL prefix makes paths work under the GitHub Pages sub-path.
const B = import.meta.env.BASE_URL || '/';
const img = (name: string) => `${B}img/${name}.jpg`;

export const HERO = {
  dashboard: img('hero-dashboard'),
  pipeline: img('hero-pipeline'),
  candidates: img('hero-candidates'),
  visa: img('hero-visa'),
  journey: img('hero-journey'),
};

export const DEST_PHOTO: Record<string, string> = {
  australia: img('australia'),
  ireland: img('ireland'),
  malta: img('malta'),
  spain: img('spain'),
};

export const LOGO = `${B}oneway-logo.svg`;
export const LOGO_WHITE = `${B}oneway-logo-white.svg`;
