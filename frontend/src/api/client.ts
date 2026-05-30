import axios from 'axios';

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === 'true';
const BASE = import.meta.env.BASE_URL || '/';

// Fetch a static JSON file (GitHub Pages mode)
async function staticGet(path: string) {
  const url = `${BASE}mock-data${path.replace(/\/$/, '')}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Static fetch failed: ${url}`);
  const data = await res.json();
  return { data };
}

// No-op for write operations in static mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop = (..._args: any[]) => Promise.resolve({ data: {} as any });

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const candidatesApi = {
  list: () => IS_STATIC ? staticGet('/candidates') : api.get('/candidates/'),
  get: (id: string) => IS_STATIC
    ? staticGet('/candidates').then(r => ({ data: r.data.find((c: any) => c.id === id) }))
    : api.get(`/candidates/${id}`),
  takeAction: noop,
  regenerateAI: noop,
};

export const configApi = {
  get: () => IS_STATIC ? staticGet('/readiness-config') : api.get('/config/'),
};

export const visaApi = {
  list: () => IS_STATIC ? staticGet('/visa-cases') : api.get('/visa/'),
};

export const journeyApi = {
  list: () => IS_STATIC ? staticGet('/journey') : api.get('/journey/'),
};

export default api;
