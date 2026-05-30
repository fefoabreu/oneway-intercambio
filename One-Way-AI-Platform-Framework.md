# One Way Intercâmbio — AI Student Readiness & Journey Platform
### Concept & Framework Document · v1.0

> A productized prototype that embeds AI into One Way Intercâmbio's core decision: **selecting the right candidates and matching them to the right destination** — maximizing visa approval while protecting the student's investment and the agency's reputation.

---

## 1. Business context & the problem worth solving

One Way Intercâmbio (5 years operating, 1,000+ students sent) recruits Brazilians who want to **study, work and live abroad** while learning English — many with a long-term pathway to residency. Destinations: **Australia (flagship)**, **Ireland**, **Malta**, and **Barcelona/Spain** ties.

**The agency business model** (validated against market leaders — CI, EF, Optima, ePlanet, Blue, DCI, Fluencypass):
- Revenue is **commission from partner schools on enrolment** + **service fees** (visa support, translation, insurance, accommodation, airport pickup, TFN/ABN setup).
- The agent's value is **advisory**: choosing the right destination, course and visa route, then supporting the student before, during and after the program.
- ~97% of agents are paid on placement — so a **refused visa is a double loss**: the student's money and dream, and the agency's commission, school relationship and reputation.

**The highest-leverage decision** is therefore *upfront candidate–destination matching*. Applying a candidate without a diploma or sufficient funds to Australia's Genuine Student bar is predictably risky; the same candidate may thrive via Malta or Ireland. Today this judgment lives in the heads of experienced consultants and doesn't scale. **This is what we make systematic, transparent and AI-assisted.**

---

## 2. Market scan — what the best do

| Practice | Industry standard | What we adopt |
|---|---|---|
| Destination/course advisory | Manual consultant expertise | Codified **destination-fit engine** with per-country eligibility logic |
| Quality/ethics | BELTA seal, IALC, Quality English | Explicit **Responsible-AI & anti-profiling charter** |
| Pipeline | Generic CRM (lead → sale) | **Readiness-aware CRM** where AI acts at each stage |
| Post-sale | Airport pickup, bank, TFN/ABN | **Student-lifetime-abroad journey** with AI touchpoints |
| Visa | Per-country checklists | **Visa case management** tied to each candidate |

---

## 3. The Student Readiness Score (0–100)

A weighted composite of **seven merit/visa-relevant dimensions**, each scored 0–10. Weights reflect what immigration authorities and partner schools actually evaluate:

| Dimension | Weight | What it measures |
|---|---|---|
| English proficiency | 22% | Current CEFR level / test band |
| Financial capacity | 20% | Proven funds vs. destination threshold (e.g. AUS ~AUD 29,710/yr + tuition) |
| Academic background | 18% | Highest completed qualification |
| Genuine study intent | 15% | Coherence of the study plan (Australia Genuine Student style) |
| Documentation readiness | 10% | Passport, visa history, supporting docs |
| Immigration risk | 8% | Prior refusals / overstays — a **risk reducer**, never identity-based |
| Program fit | 7% | Alignment of course to profile and goals |

The score is a **decision aid for a human consultant**, not an automated gate.

---

## 4. Destination-fit engine

For each candidate the engine produces a **ranked list of destinations**, each with a **visa-approval propensity band**:

`High` · `Moderate` · `Develop first` · `Not advised`

Per-destination eligibility logic:

- **🇦🇺 Australia (difficulty 5, flagship):** Genuine Student requirement, CoE from a CRICOS provider, strong funds + proven English, OSHC. Weak academics/funds → low propensity.
- **🇮🇪 Ireland (difficulty 3):** ILEP 25-week study+work programs, ~€4,200 funds, private insurance, Letter of Acceptance. Accessible mid-tier.
- **🇲🇹 Malta (difficulty 2):** most accessible study+work entry — the **recommended redirect** when Australia propensity is low.
- **🇪🇸 Spain/Barcelona (difficulty 3):** language + lifestyle pathway; requires Spanish.

The output drives an **AI recommendation status**:
- **Ready to apply** — proceed to visa.
- **Ready with conditions** — proceed once specific gaps close.
- **Develop first** — build English/funds/docs before applying anywhere requirement-gated.
- **Redirect destination** — keep the goal, change the country to protect the investment.

Each recommendation ships with **explicit conditions** and a **plain-language "why."**

---

## 5. Responsible AI & anti-profiling charter *(non-negotiable)*

**Allowed signals** — only lawful, objective, visa-relevant factors: education, English level, proven funds, study-plan coherence, documentation, declared immigration history, course fit.

**Forbidden signals** — never used, displayed as a scored input, or inferred: race, ethnicity, skin colour, gender, age, religion, marital/family status, sexual orientation, disability, or nationality-as-bias.

**Operating principles:**
1. **Human-in-the-loop** — the score advises; a consultant decides.
2. **Transparency** — every dimension and recommendation exposes its rationale ("why").
3. **Protective intent** — the system exists to *prevent* setting a student up for a refusal, not to exclude anyone; "develop first" is a pathway, not a rejection.
4. **Auditability** — recommendations and conditions are logged and reproducible.

Candidate photos in the CRM are operational identifiers only and play **no role** in scoring.

---

## 6. CRM pipeline model

Stages, each with a defined AI role:

| Stage | AI role |
|---|---|
| **Lead** | Qualify & pre-score from submitted data |
| **Attended event** | Update engagement, suggest personalized next step |
| **Quoted / Interested** | Recommend destination & program |
| **AI Analysis** | Generate Readiness Score, visa propensity, recommendation |
| **Visa process** | Monitor checklist, deadlines, document completeness |
| **Enrolled** | Kick off the student journey & post-departure follow-up |

---

## 7. Visa application management

Per-candidate, per-destination case tracker with status per step (done / in progress / pending / blocked): personal docs, English test, Letter of Acceptance / CoE, proof of funds, Genuine Student statement (AUS), health cover (OSHC/insurance), lodgement, decision — plus target intake.

---

## 8. Student lifetime abroad

Best-practice lifecycle with AI touchpoints at each stage:

`Pre-departure → Arrival & setup → Settling in → Study & work → Renewal & extension → Pathway & alumni`

Highlights: airport pickup & accommodation, TFN/ABN (AUS) / PPS (IRL), bank account, visa-hour compliance monitoring, renewal-window anticipation, PR-pathway mapping, and turning alumni into a referral engine.

---

## 9. Productization roadmap

| Layer | Prototype (this build) | Production |
|---|---|---|
| Data | Static mock JSON, 12 personas | Real CRM intake forms + integrations |
| Scoring | Curated illustrative scores | LLM + rules engine over verified inputs |
| AI text | Authored bilingual rationales | Live Claude generation with guardrails |
| Auth/roles | None (demo) | Consultant / manager / admin roles + audit log |
| Channels | Web dashboard | WhatsApp/Instagram lead capture, student portal |

**Prototype stack:** React + Vite + TypeScript + Tailwind, static "mock-data JSON" mode, bilingual (PT-BR / EN), deployed to GitHub Pages — mirroring the proven Delivery Excellence pattern.

---
*Document v1.0 · drives the prototype in `frontend/`. Built to pitch One Way's owners on a scalable, ethical, AI-assisted operating model.*
