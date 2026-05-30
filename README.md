# One Way Intercâmbio — AI Student Readiness & Journey Platform

A productized prototype that embeds AI into One Way Intercâmbio's core decision:
**selecting the right candidates and matching them to the right destination** —
maximizing visa approval while protecting the student's investment and the agency's
reputation.

**Live demo:** https://fefoabreu.me/oneway-intercambio/

## Modules
- **Painel / Dashboard** — KPIs, pipeline mix, destination & visa-propensity overview.
- **Funil / Pipeline** — CRM kanban: Lead → Event → Quoted → AI Analysis → Visa → Enrolled.
- **Prontidão / Readiness** — flippable "baseball cards": readiness score, destination fit, visa propensity, AI recommendation + per-dimension "why".
- **Novo Candidato · IA / New Candidate · AI** — enter a new lead and get a **live readiness analysis** rendered as a flip card (see below).
- **Vistos / Visa** — per-destination visa-application tracker.
- **Jornada / Journey** — student-lifetime-abroad journey with AI touchpoints.

Bilingual (PT-BR default, EN toggle). Anti-profiling by design: the score uses only
lawful, visa-relevant signals — never protected attributes.

## The "Analyze a New Candidate" feature — demo vs. live AI

The intake page has **two modes**, switched automatically:

| Mode | When | What runs |
|---|---|---|
| **Simulated AI (demo)** | The deployed GitHub Pages site (no backend, no API key) | A transparent local rules engine, `frontend/src/lib/analyze.ts`, using the same rubric as the live model. |
| **Live AI · Claude** | Running locally with the backend up + an API key | `POST /api/analyze` → Claude (Opus 4.8) with structured outputs + prompt caching, `backend/main.py`. |

A badge on the result card shows which mode produced it.

> Keys can't live on a public static site, so the published demo always uses the
> simulated engine. Run locally for the real "live AI" experience.

## Run locally (with live AI)

```bash
# 1. Backend (live Claude analysis)
cd backend
cp .env.example .env          # add your ANTHROPIC_API_KEY
./run.sh                      # starts FastAPI on :8000

# 2. Frontend (in another terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173  (proxies /api → :8000)
```

Open the **New Candidate · AI** page, fill in a profile, and click **Analyze with AI** —
the same button calls Claude when the backend is reachable, and falls back to the local
engine otherwise.

## Stack
- **Frontend:** React + Vite + TypeScript + Tailwind. Static "mock-data JSON" mode for
  GitHub Pages (`frontend/public/mock-data/`).
- **Backend (optional, local):** FastAPI + Anthropic Python SDK.
- **Deploy:** GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).

See `One-Way-AI-Platform-Framework.md` for the full concept, scoring rubric, and the
Responsible-AI charter.
