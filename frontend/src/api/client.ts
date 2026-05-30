import axios from 'axios';
import type { Candidate, IntakeInput } from '../types';
import { analyzeLocal } from '../lib/analyze';

const BASE = import.meta.env.BASE_URL || '/';

// All demo data lives as static JSON under /public/mock-data and is the single
// source of truth in every environment (there is no backend serving it). Only
// the optional live-AI analysis (below) talks to a backend.
async function staticGet(path: string) {
  const url = `${BASE}mock-data${path.replace(/\/$/, '')}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Static fetch failed: ${url}`);
  const data = await res.json();
  return { data };
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const candidatesApi = {
  list: () => staticGet('/candidates'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (id: string) => staticGet('/candidates').then(r => ({ data: r.data.find((c: any) => c.id === id) })),
};

export const configApi = {
  get: () => staticGet('/readiness-config'),
};

export const visaApi = {
  list: () => staticGet('/visa-cases'),
};

export const journeyApi = {
  list: () => staticGet('/journey'),
  students: () => staticGet('/student-journeys'),
};

// Lead analysis: live Claude when the FastAPI backend is reachable (local dev),
// deterministic rules engine otherwise (the static GitHub Pages demo). We only
// attempt the backend in dev so the published site doesn't make a doomed request.
export const analyzeApi = {
  analyze: async (input: IntakeInput): Promise<{ candidate: Candidate; live: boolean }> => {
    if (import.meta.env.DEV) {
      try {
        const r = await api.post('/analyze', input, { timeout: 30000 });
        return { candidate: r.data as Candidate, live: true };
      } catch {
        // backend not running — fall back to the local engine
      }
    }
    return { candidate: analyzeLocal(input), live: false };
  },
};

export default api;
