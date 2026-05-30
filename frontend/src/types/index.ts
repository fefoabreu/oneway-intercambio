// ── Domain types for the One Way AI Student Readiness platform ──────────────

export type Stage = 'lead' | 'event' | 'quoted' | 'analysis' | 'visa' | 'enrolled';
export type Destination = 'australia' | 'ireland' | 'malta' | 'spain';
export type Propensity = 'high' | 'moderate' | 'develop' | 'not_recommended';
export type AIStatus = 'READY' | 'READY_WITH_CONDITIONS' | 'DEVELOP_FIRST' | 'REDIRECT';

export interface DestinationFit {
  destination: Destination;
  propensity: Propensity;
  score: number; // 0–100 visa-approval propensity for this destination
  rationale_pt: string;
  rationale_en: string;
}

export interface KeyFact {
  label_pt: string;
  label_en: string;
  value: string;
}

export interface CandidateProfile {
  readiness_score: number; // 0–100 overall
  score_breakdown: Record<string, number>; // dimension key → 0–10
  destination_fit: DestinationFit[]; // ranked best-first
  recommended_destination: Destination;
  ai_status: AIStatus;
  ai_text_pt: string;
  ai_text_en: string;
  ai_conditions_pt: string[];
  ai_conditions_en: string[];
  key_facts: KeyFact[];
}

export interface Candidate {
  id: string;
  name: string;
  photo: string;
  origin_city: string; // city in Brazil
  goal_pt: string;
  goal_en: string;
  current_english: string; // CEFR band
  highest_education_pt: string;
  highest_education_en: string;
  stage: Stage;
  created_at: string;
  profile: CandidateProfile;
}

// ── Lead intake (new-candidate analysis) ─────────────────────────────────────
export type Education = 'none' | 'high_school' | 'technical' | 'undergrad_incomplete' | 'undergrad' | 'postgrad';
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Goal = 'study' | 'study_work' | 'work_study';

export interface IntakeInput {
  name: string;
  origin_city: string;
  goal: Goal;
  education: Education;
  english: EnglishLevel;
  funds_brl: number;
  intent_text: string;
  prior_refusal: boolean;
  refusal_note?: string;
  preferred_destination?: Destination | '';
}

// ── Config ──────────────────────────────────────────────────────────────────
export interface ScoreDimension {
  key: string;
  label_pt: string;
  label_en: string;
  weight: number;
  desc_pt: string;
  desc_en: string;
}

export interface StageDef {
  key: Stage;
  label_pt: string;
  label_en: string;
  desc_pt: string;
  desc_en: string;
  ai_role_pt: string;
  ai_role_en: string;
  color: string;
}

export interface DestinationDef {
  key: Destination;
  label: string;
  flag: string;
  tagline_pt: string;
  tagline_en: string;
  difficulty: number; // 1 (accessible) – 5 (hardest)
  requirements_pt: string[];
  requirements_en: string[];
}

export interface ReadinessConfig {
  objective_pt: string;
  objective_en: string;
  dimensions: ScoreDimension[];
  stages: StageDef[];
  destinations: DestinationDef[];
  bands: { key: AIStatus; label_pt: string; label_en: string }[];
}

// ── Visa case management ──────────────────────────────────────────────────────
export type VisaStepStatus = 'done' | 'in_progress' | 'pending' | 'blocked';

export interface VisaStep {
  key: string;
  label_pt: string;
  label_en: string;
  status: VisaStepStatus;
}

export interface VisaCase {
  candidate_id: string;
  candidate_name: string;
  destination: Destination;
  visa_type: string;
  overall_pct: number;
  target_intake_pt: string;
  target_intake_en: string;
  steps: VisaStep[];
}

// ── Journey ───────────────────────────────────────────────────────────────────
export interface JourneyStage {
  key: string;
  label_pt: string;
  label_en: string;
  icon: string;
  summary_pt: string;
  summary_en: string;
  actions_pt: string[];
  actions_en: string[];
  ai_touch_pt: string;
  ai_touch_en: string;
}

// ── Live per-student journey tracking ─────────────────────────────────────────
export type AlertSeverity = 'ok' | 'info' | 'warning' | 'critical';

export interface StudentAlert {
  severity: AlertSeverity;
  pt: string;
  en: string;
}

export interface StudentCompliance {
  attendance_pct: number;
  attendance_min: number;
  work_hours_used: number;
  work_hours_cap: number;
  work_hours_unit_pt: string;
  work_hours_unit_en: string;
  visa_expiry: string;   // ISO date
  renewal_window: string; // ISO date
}

export interface StudentReferral {
  name: string;
  became_lead: boolean;
}

export interface StudentJourney {
  candidate_id: string;
  name: string;
  photo: string;
  destination: Destination;
  city_abroad: string;
  course: string;
  intake_pt: string;
  intake_en: string;
  current_stage: string;       // matches a JourneyStage.key
  stages_done: string[];
  compliance: StudentCompliance;
  alerts: StudentAlert[];
  renewal: {
    status: 'not_due' | 'action_due' | 'complete';
    label_pt: string; label_en: string;
    next_pt: string; next_en: string;
  };
  pathway: {
    route_pt: string; route_en: string;
    eligibility_pct: number;
    note_pt: string; note_en: string;
  };
  alumni: {
    referrals: number;
    converted_leads: number;
    referred: StudentReferral[];
    testimonial_pt: string;
    testimonial_en: string;
  };
}
