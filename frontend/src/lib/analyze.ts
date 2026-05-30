// Deterministic, transparent rules engine that turns a lead-intake form into a
// full scored Candidate. Powers the deployed demo (no API key). The live Claude
// backend (backend/main.py) returns the same shape using the same rubric.
import type {
  Candidate, CandidateProfile, Destination, DestinationFit, Propensity, AIStatus, IntakeInput,
} from '../types';

const WEIGHTS: Record<string, number> = {
  english: 22, financial: 20, academic: 18, intent: 15, documentation: 10, immigration_risk: 8, program_fit: 7,
};

const ACAD: Record<string, number> = {
  none: 2, high_school: 5, technical: 6.5, undergrad_incomplete: 5.5, undergrad: 8.5, postgrad: 9.5,
};
const ENG: Record<string, number> = { A1: 2, A2: 3.5, B1: 6, B2: 7.5, C1: 9, C2: 10 };

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function financialDim(brl: number): number {
  if (brl >= 110000) return 9.7;
  if (brl >= 80000) return 9;
  if (brl >= 55000) return 8;
  if (brl >= 40000) return 6.5;
  if (brl >= 25000) return 5;
  return 3;
}

function intentDim(text: string, goal: string): number {
  const len = (text || '').trim().length;
  let s = len === 0 ? 3 : len < 40 ? 5.5 : len < 120 ? 7 : 8.5;
  if (goal === 'study_work') s += 0.3;
  return Math.max(2, Math.min(9.5, s));
}

const EDU_LABEL: Record<string, [string, string]> = {
  none: ['Sem ensino médio', 'No high school'],
  high_school: ['Ensino médio completo', 'High school completed'],
  technical: ['Curso técnico', 'Technical diploma'],
  undergrad_incomplete: ['Ensino superior incompleto', 'Incomplete degree'],
  undergrad: ['Ensino superior completo', "Bachelor's degree"],
  postgrad: ['Pós-graduação', 'Postgraduate'],
};
const GOAL_LABEL: Record<string, [string, string]> = {
  study: ['Estudar inglês', 'Study English'],
  study_work: ['Estudar e trabalhar', 'Study + work'],
  work_study: ['Trabalhar e estudar', 'Work + study'],
};
const DIM_LABEL: Record<string, [string, string]> = {
  english: ['inglês', 'English'],
  financial: ['capacidade financeira', 'financial capacity'],
  academic: ['formação acadêmica', 'academic background'],
  intent: ['plano de estudos', 'study plan'],
  documentation: ['documentação', 'documentation'],
  immigration_risk: ['baixo risco migratório', 'low immigration risk'],
  program_fit: ['aderência ao programa', 'program fit'],
};
const DEST_LABEL: Record<Destination, [string, string]> = {
  australia: ['Austrália', 'Australia'],
  ireland: ['Irlanda', 'Ireland'],
  malta: ['Malta', 'Malta'],
  spain: ['Espanha', 'Spain'],
};

function band(score: number): Propensity {
  return score >= 75 ? 'high' : score >= 60 ? 'moderate' : score >= 45 ? 'develop' : 'not_recommended';
}
const BAND_LABEL: Record<Propensity, [string, string]> = {
  high: ['alta', 'high'], moderate: ['moderada', 'moderate'],
  develop: ['a desenvolver', 'develop-first'], not_recommended: ['não indicada', 'not advised'],
};

export function analyzeLocal(input: IntakeInput): Candidate {
  const acad = ACAD[input.education] ?? 5;
  const eng = ENG[input.english] ?? 5;
  const fin = financialDim(input.funds_brl || 0);
  const intent = intentDim(input.intent_text, input.goal);
  const docs = input.prior_refusal ? 5.5 : 8;
  const imm = input.prior_refusal ? 4 : 9.5;
  const fit = input.education === 'undergrad' || input.education === 'postgrad' ? 8
    : input.education === 'technical' ? 7
    : input.education === 'undergrad_incomplete' ? 6.5
    : input.education === 'high_school' ? 6 : 5;

  const breakdown: Record<string, number> = {
    academic: round1(acad), english: round1(eng), financial: round1(fin),
    intent: round1(intent), documentation: round1(docs), immigration_risk: round1(imm), program_fit: round1(fit),
  };

  const readiness = Math.round(
    Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (breakdown[k] / 10) * w, 0),
  );

  // ── Destination propensity ──
  const base = readiness;
  let australia = base
    + (acad >= 8.5 && eng >= 9 && fin >= 8.5 ? 5 : 0)
    - (acad < 7 ? 15 : 0) - (eng < 7 ? 15 : 0) - (fin < 8 ? 12 : 0) - (input.prior_refusal ? 12 : 0);
  let ireland = base + (acad >= 6.5 ? 3 : 0)
    - (eng < 6 ? 12 : 0) - (fin < 6.5 ? 10 : 0) - (input.prior_refusal ? 6 : 0);
  let malta = base + 8 - (eng < 4 ? 8 : 0) - (fin < 5 ? 8 : 0) - (input.prior_refusal ? 4 : 0);
  let spain = base - 4 - (eng < 5 ? 6 : 0) - (fin < 6 ? 8 : 0) - (input.prior_refusal ? 5 : 0);
  australia = clamp(australia, 5, 98); ireland = clamp(ireland, 5, 98);
  malta = clamp(malta, 5, 98); spain = clamp(spain, 5, 98);

  const scores: Record<Destination, number> = { australia, ireland, malta, spain };
  const ranked = (Object.keys(scores) as Destination[])
    .sort((a, b) => scores[b] - scores[a]);
  const recommended = ranked[0];
  const recScore = scores[recommended];

  const destination_fit: DestinationFit[] = ranked.map(d => ({
    destination: d,
    score: Math.round(scores[d]),
    propensity: band(scores[d]),
    rationale_pt: destRationale(d, scores[d], 'pt', input),
    rationale_en: destRationale(d, scores[d], 'en', input),
  }));

  // ── AI status ──
  const wantedAus = input.preferred_destination === 'australia';
  let status: AIStatus;
  if (eng < 4 || readiness < 45) status = 'DEVELOP_FIRST';
  else if (wantedAus && recommended !== 'australia' && australia < 60) status = 'REDIRECT';
  else if (recommended === 'malta' && australia < 55 && ireland < 60) status = 'REDIRECT';
  else if (recScore >= 75) status = 'READY';
  else if (recScore >= 60) status = 'READY_WITH_CONDITIONS';
  else status = 'REDIRECT';

  // ── Conditions ──
  const cond_pt: string[] = []; const cond_en: string[] = [];
  if (eng < 7.5) { cond_pt.push('Elevar o inglês para B2+'); cond_en.push('Raise English to B2+'); }
  if (fin < 8 && recommended === 'australia') { cond_pt.push('Comprovar fundos ao limiar do destino'); cond_en.push('Prove funds to the destination threshold'); }
  else if (fin < 6) { cond_pt.push('Reforçar a comprovação financeira'); cond_en.push('Strengthen proof of funds'); }
  if (input.prior_refusal) { cond_pt.push('Documentar e explicar a recusa de visto anterior'); cond_en.push('Document and explain the prior visa refusal'); }
  if (intent < 7) { cond_pt.push('Detalhar o plano de estudos (estilo Genuine Student)'); cond_en.push('Detail the study plan (Genuine Student style)'); }
  if (acad < 6 && recommended === 'australia') { cond_pt.push('Considerar curso técnico/pathway'); cond_en.push('Consider a technical/pathway course'); }

  // ── Narrative ──
  const recL = DEST_LABEL[recommended];
  const bandL = BAND_LABEL[band(recScore)];
  const strongest = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0][0];
  const weakest = Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0][0];
  const sL = DIM_LABEL[strongest]; const wL = DIM_LABEL[weakest];
  const ai_text_pt =
    `Com base nos dados informados, o melhor match é ${recL[0]} (propensão ${bandL[0]}). `
    + `Ponto mais forte: ${sL[0]}. ${status === 'DEVELOP_FIRST' ? `O fator limitante é ${wL[0]} — recomenda-se desenvolver antes de aplicar a um destino com requisito, evitando recusa.` : status === 'REDIRECT' ? `Para proteger o investimento, recomenda-se redirecionar para ${recL[0]}, mantendo a meta de estudar e trabalhar.` : status === 'READY' ? 'Perfil pronto para avançar à aplicação de visto.' : `Pronto para avançar mediante o ajuste de ${wL[0]}.`}`;
  const ai_text_en =
    `Based on the submitted data, the best match is ${recL[1]} (${bandL[1]} propensity). `
    + `Strongest factor: ${sL[1]}. ${status === 'DEVELOP_FIRST' ? `The limiting factor is ${wL[1]} — develop it before applying to a requirement-gated destination to avoid a refusal.` : status === 'REDIRECT' ? `To protect the investment, redirect to ${recL[1]} while keeping the study+work goal.` : status === 'READY' ? 'Profile ready to proceed to the visa application.' : `Ready to proceed once ${wL[1]} is addressed.`}`;

  const profile: CandidateProfile = {
    readiness_score: readiness,
    score_breakdown: breakdown,
    recommended_destination: recommended,
    destination_fit,
    ai_status: status,
    ai_text_pt, ai_text_en,
    ai_conditions_pt: cond_pt, ai_conditions_en: cond_en,
    key_facts: [
      { label_pt: 'Orçamento', label_en: 'Budget', value: `R$ ${(input.funds_brl || 0).toLocaleString('pt-BR')}` },
      { label_pt: 'Histórico de visto', label_en: 'Visa history', value: input.prior_refusal ? (input.refusal_note || 'Recusa anterior') : 'Nenhum' },
      { label_pt: 'Inglês', label_en: 'English', value: input.english },
      { label_pt: 'Objetivo', label_en: 'Goal', value: GOAL_LABEL[input.goal][0] },
    ],
  };

  const enc = encodeURIComponent(input.name || 'Novo Lead');
  return {
    id: 'intake-' + Date.now(),
    name: input.name || 'Novo Lead',
    photo: `https://ui-avatars.com/api/?name=${enc}&background=0D7291&color=fff&size=256&bold=true`,
    origin_city: input.origin_city || '—',
    goal_pt: GOAL_LABEL[input.goal][0], goal_en: GOAL_LABEL[input.goal][1],
    current_english: input.english,
    highest_education_pt: EDU_LABEL[input.education][0], highest_education_en: EDU_LABEL[input.education][1],
    stage: 'analysis',
    created_at: new Date().toISOString().slice(0, 10),
    profile,
  };
}

function round1(n: number) { return Math.round(n * 10) / 10; }

function destRationale(d: Destination, score: number, lang: 'pt' | 'en', input: IntakeInput): string {
  const b = band(score);
  if (lang === 'pt') {
    const m: Record<Destination, string> = {
      australia: b === 'high' ? 'Perfil atende ao Genuine Student e ao requisito financeiro.' : b === 'moderate' ? 'Elegível, mas inglês/fundos precisam subir ao limiar.' : 'Formação/fundos abaixo do exigido para o Genuine Student.',
      ireland: b === 'high' ? 'ILEP de 25 semanas confortavelmente elegível.' : b === 'moderate' ? 'Viável com reforço de inglês e/ou fundos.' : 'Inglês/fundos abaixo do exigido pelo ILEP.',
      malta: b === 'high' ? 'Entrada acessível para estudar e trabalhar — bom primeiro passo.' : b === 'moderate' ? 'Acessível; iniciar com curso de inglês de base.' : 'Mesmo acessível, fundos/inglês exigem preparação.',
      spain: 'Opção de idioma/lifestyle; exige nível de espanhol.',
    };
    return m[d];
  }
  const m: Record<Destination, string> = {
    australia: b === 'high' ? 'Profile meets the Genuine Student and financial requirement.' : b === 'moderate' ? 'Eligible, but English/funds must rise to threshold.' : 'Education/funds below the Genuine Student bar.',
    ireland: b === 'high' ? '25-week ILEP comfortably eligible.' : b === 'moderate' ? 'Viable with an English and/or funds top-up.' : 'English/funds below the ILEP requirement.',
    malta: b === 'high' ? 'Accessible study+work entry — a good first step.' : b === 'moderate' ? 'Accessible; start with a foundational English course.' : 'Even though accessible, funds/English need preparation.',
    spain: 'Language/lifestyle option; requires a Spanish level.',
  };
  return m[d];
}
