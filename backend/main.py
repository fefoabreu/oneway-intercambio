"""
One Way Intercâmbio — live AI readiness analysis backend.

A single endpoint, POST /api/analyze, that turns a study-abroad lead profile
into a structured readiness analysis using Claude (Opus 4.8) with structured
outputs and prompt caching. The deployed GitHub Pages demo does NOT use this —
it runs a local rules engine (frontend/src/lib/analyze.ts). Run this locally
with an ANTHROPIC_API_KEY to get the real "live AI" experience.

Run:
    cd backend
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env   # add your key
    uvicorn main:app --reload --port 8000
"""
import json
import os

from anthropic import Anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

MODEL = "claude-opus-4-8"
client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

app = FastAPI(title="One Way · Readiness AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo only; tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request shape (mirrors frontend IntakeInput) ──────────────────────────────
class IntakeInput(BaseModel):
    name: str = ""
    origin_city: str = ""
    goal: str = "study_work"
    education: str = "undergrad"
    english: str = "B1"
    funds_brl: float = 0
    intent_text: str = ""
    prior_refusal: bool = False
    refusal_note: str = ""
    preferred_destination: str = ""

# ── The rubric — stable, cached as the system prompt ──────────────────────────
SYSTEM = """You are the readiness-analysis engine for One Way Intercâmbio, a Brazilian
study-abroad agency. Given a prospective student's profile, produce a Student Readiness
analysis that helps a human consultant match the right destination and protect the
student's investment.

RESPONSIBLE AI / ANTI-PROFILING — NON-NEGOTIABLE:
- Use ONLY lawful, objective, visa-relevant signals: academic background, English level,
  proven funds, study intent, documentation, immigration history, program fit.
- NEVER use or infer protected attributes: race, ethnicity, gender, age, religion,
  marital/family status, sexual orientation, disability, or nationality-as-bias.
- The score advises a human; it never auto-rejects. "Develop first" is a pathway, not a
  rejection. Frame redirections as protecting the student's investment.

SCORE DIMENSIONS (each 0-10) and WEIGHTS (sum 100):
- english 22, financial 20, academic 18, intent 15, documentation 10,
  immigration_risk 8, program_fit 7.
readiness_score (0-100) = sum(dimension/10 * weight), rounded.

DIMENSION GUIDANCE:
- academic: none~2, high_school~5, technical~6.5, incomplete degree~5.5, bachelor~8.5, postgrad~9.5
- english (CEFR): A1~2, A2~3.5, B1~6, B2~7.5, C1~9, C2~10
- financial: judge proven funds (BRL) vs destination thresholds (Australia needs the most,
  ~AUD 29,710/yr living + tuition; Ireland ~EUR 4,200 + tuition; Malta lower; Spain mid).
  <R$25k very weak, R$40-60k moderate, R$80k+ strong, R$110k+ very strong.
- intent: coherence/clarity of the study plan (Genuine Student style).
- documentation: passport/docs readiness; a prior refusal lowers this.
- immigration_risk: high score = LOW risk. Prior refusal/overstay sharply lowers it.
- program_fit: alignment of chosen course with background and goals.

DESTINATIONS (visa-approval propensity, 0-100, with bands):
- australia (hardest, flagship): Genuine Student, CoE from CRICOS provider, strong funds +
  proven English (B2+), OSHC. Weak academics/funds/English -> low propensity.
- ireland (mid, ILEP): 25-week study+work; needs ~B1+ and moderate funds.
- malta (most accessible): study+work, lower barrier; the recommended redirect when
  Australia/Ireland propensity is low.
- spain (Barcelona): language + lifestyle pathway; requires Spanish; treat slightly below Ireland.
Bands: >=75 "high", 60-74 "moderate", 45-59 "develop", <45 "not_recommended".

recommended_destination = the destination with the highest propensity (respect a stated
preferred destination only if its propensity is at least "moderate").

ai_status:
- "DEVELOP_FIRST" if English is A1/A2 or readiness < 45 (build skills/funds before applying anywhere gated).
- "REDIRECT" if the student wanted a harder destination but the best realistic option is a more
  accessible one (e.g. redirect to Malta/Ireland).
- "READY" if the recommended destination propensity >= 75 with no major gaps.
- "READY_WITH_CONDITIONS" otherwise when the recommended propensity is 60-74 or small gaps remain.

Write ai_text and conditions in BOTH Portuguese (pt) and English (en), concise (2-3 sentences),
specific to this profile, naming the strongest factor and the main gap. Conditions are concrete
next steps (e.g. "Elevar inglês para B2+"). Output ONLY the structured JSON object."""

DEST_ENUM = ["australia", "ireland", "malta", "spain"]
DIM_KEYS = ["academic", "english", "financial", "intent", "documentation", "immigration_risk", "program_fit"]

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "readiness_score": {"type": "integer"},
        "score_breakdown": {
            "type": "object",
            "additionalProperties": False,
            "properties": {k: {"type": "number"} for k in DIM_KEYS},
            "required": DIM_KEYS,
        },
        "recommended_destination": {"type": "string", "enum": DEST_ENUM},
        "destination_fit": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "destination": {"type": "string", "enum": DEST_ENUM},
                    "score": {"type": "integer"},
                    "propensity": {"type": "string", "enum": ["high", "moderate", "develop", "not_recommended"]},
                    "rationale_pt": {"type": "string"},
                    "rationale_en": {"type": "string"},
                },
                "required": ["destination", "score", "propensity", "rationale_pt", "rationale_en"],
            },
        },
        "ai_status": {"type": "string", "enum": ["READY", "READY_WITH_CONDITIONS", "DEVELOP_FIRST", "REDIRECT"]},
        "ai_text_pt": {"type": "string"},
        "ai_text_en": {"type": "string"},
        "ai_conditions_pt": {"type": "array", "items": {"type": "string"}},
        "ai_conditions_en": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "readiness_score", "score_breakdown", "recommended_destination", "destination_fit",
        "ai_status", "ai_text_pt", "ai_text_en", "ai_conditions_pt", "ai_conditions_en",
    ],
}

# ── Label maps (mirror frontend) ──────────────────────────────────────────────
EDU_LABEL = {
    "none": ("Sem ensino médio", "No high school"),
    "high_school": ("Ensino médio completo", "High school completed"),
    "technical": ("Curso técnico", "Technical diploma"),
    "undergrad_incomplete": ("Ensino superior incompleto", "Incomplete degree"),
    "undergrad": ("Ensino superior completo", "Bachelor's degree"),
    "postgrad": ("Pós-graduação", "Postgraduate"),
}
GOAL_LABEL = {
    "study": ("Estudar inglês", "Study English"),
    "study_work": ("Estudar e trabalhar", "Study + work"),
    "work_study": ("Trabalhar e estudar", "Work + study"),
}


@app.get("/api/health")
def health():
    return {"ok": True, "model": MODEL}


@app.post("/api/analyze")
def analyze(inp: IntakeInput):
    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(503, "ANTHROPIC_API_KEY not set — running without live AI.")

    user_text = (
        "Analyze this prospective student's profile and return the structured JSON.\n\n"
        f"- Name: {inp.name or '(not given)'}\n"
        f"- Origin city: {inp.origin_city or '(not given)'}\n"
        f"- Goal: {inp.goal}\n"
        f"- Highest education: {inp.education}\n"
        f"- Current English (CEFR): {inp.english}\n"
        f"- Proven funds (BRL): {int(inp.funds_brl)}\n"
        f"- Study plan / intent: {inp.intent_text or '(not given)'}\n"
        f"- Prior visa refusal: {'yes — ' + (inp.refusal_note or 'no detail') if inp.prior_refusal else 'no'}\n"
        f"- Preferred destination: {inp.preferred_destination or '(none)'}\n"
    )

    try:
        resp = client.messages.create(
            model=MODEL,
            max_tokens=2000,
            system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": user_text}],
            output_config={"format": {"type": "json_schema", "schema": SCHEMA}},
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(502, f"AI request failed: {e}")

    text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text")
    try:
        core = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(502, "AI returned unparseable output.")

    # defensive: rank destinations best-first
    core["destination_fit"].sort(key=lambda d: d.get("score", 0), reverse=True)

    edu = EDU_LABEL.get(inp.education, EDU_LABEL["undergrad"])
    goal = GOAL_LABEL.get(inp.goal, GOAL_LABEL["study_work"])
    name = inp.name or "Novo Lead"

    candidate = {
        "id": f"intake-live-{os.urandom(4).hex()}",
        "name": name,
        "photo": f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=0D7291&color=fff&size=256&bold=true",
        "origin_city": inp.origin_city or "—",
        "goal_pt": goal[0], "goal_en": goal[1],
        "current_english": inp.english,
        "highest_education_pt": edu[0], "highest_education_en": edu[1],
        "stage": "analysis",
        "created_at": "",
        "profile": {
            **core,
            "key_facts": [
                {"label_pt": "Orçamento", "label_en": "Budget", "value": f"R$ {int(inp.funds_brl):,}".replace(",", ".")},
                {"label_pt": "Histórico de visto", "label_en": "Visa history",
                 "value": (inp.refusal_note or "Recusa anterior") if inp.prior_refusal else "Nenhum"},
                {"label_pt": "Inglês", "label_en": "English", "value": inp.english},
                {"label_pt": "Objetivo", "label_en": "Goal", "value": goal[0]},
            ],
        },
    }
    return candidate
