// Bilingual UI dictionary. Keys are stable; values are { pt, en }.
export type Lang = 'pt' | 'en';

export const DICT: Record<string, { pt: string; en: string }> = {
  // Brand / shell
  'brand.tagline': { pt: 'Plataforma de IA', en: 'AI Platform' },
  'shell.footer_org': { pt: 'One Way Intercâmbio', en: 'One Way Intercâmbio' },
  'shell.footer_ver': { pt: 'Plataforma de Prontidão · v1.0', en: 'Readiness Platform · v1.0' },

  // Nav sections
  'nav.section.crm': { pt: 'CRM & CAPTAÇÃO', en: 'CRM & INTAKE' },
  'nav.section.ai': { pt: 'ANÁLISE COM IA', en: 'AI ANALYSIS' },
  'nav.section.ops': { pt: 'OPERAÇÃO', en: 'OPERATIONS' },
  'nav.dashboard': { pt: 'Painel Executivo', en: 'Executive Dashboard' },
  'nav.pipeline': { pt: 'Funil de Candidatos', en: 'Candidate Pipeline' },
  'nav.candidates': { pt: 'Prontidão & Match', en: 'Readiness & Match' },
  'nav.visa': { pt: 'Gestão de Vistos', en: 'Visa Management' },
  'nav.journey': { pt: 'Jornada do Aluno', en: 'Student Journey' },

  // Generic
  'common.search': { pt: 'Buscar...', en: 'Search...' },
  'common.all_destinations': { pt: 'Todos os destinos', en: 'All destinations' },
  'common.all_stages': { pt: 'Todas as etapas', en: 'All stages' },
  'common.candidates': { pt: 'candidatos', en: 'candidates' },
  'common.candidate': { pt: 'candidato', en: 'candidate' },
  'common.loading': { pt: 'Carregando...', en: 'Loading...' },
  'common.none_match': { pt: 'Nenhum candidato corresponde aos filtros.', en: 'No candidates match your filters.' },
  'common.why': { pt: 'Por quê', en: 'Why' },
  'common.flip_hint': { pt: 'Toque para ver a análise', en: 'Tap to see the analysis' },
  'common.flip_back': { pt: 'Voltar', en: 'Back' },
  'common.recommendation': { pt: 'Recomendação da IA', en: 'AI Recommendation' },
  'common.conditions': { pt: 'Condições / pontos de atenção', en: 'Conditions / watch-outs' },
  'common.rerun': { pt: 'Re-analisar', en: 'Re-run AI' },
  'common.close': { pt: 'Fechar', en: 'Close' },

  // Dashboard
  'dash.title': { pt: 'Painel Executivo', en: 'Executive Dashboard' },
  'dash.subtitle': {
    pt: 'Captação, análise de prontidão com IA e match de destino — do lead à matrícula, protegendo o investimento do aluno e a reputação da One Way.',
    en: 'Intake, AI readiness analysis and destination matching — from lead to enrolment, protecting the student investment and One Way’s reputation.',
  },
  'dash.kpi.active': { pt: 'Candidatos ativos', en: 'Active candidates' },
  'dash.kpi.active_sub': { pt: 'no funil', en: 'in pipeline' },
  'dash.kpi.avg': { pt: 'Prontidão média', en: 'Avg readiness' },
  'dash.kpi.avg_sub': { pt: 'pontuação média de prontidão', en: 'mean readiness score' },
  'dash.kpi.ready': { pt: 'Prontos p/ aplicar', en: 'Ready to apply' },
  'dash.kpi.ready_sub': { pt: 'recomendação verde da IA', en: 'AI green recommendation' },
  'dash.kpi.enrolled': { pt: 'Matriculados', en: 'Enrolled' },
  'dash.kpi.enrolled_sub': { pt: 'visto aprovado', en: 'visa approved' },
  'dash.by_stage': { pt: 'Candidatos por etapa', en: 'Candidates by stage' },
  'dash.by_dest': { pt: 'Destino recomendado pela IA', en: 'AI-recommended destination' },
  'dash.propensity': { pt: 'Mix de propensão de visto', en: 'Visa propensity mix' },
  'dash.objective': { pt: 'Objetivo', en: 'Objective' },

  // Pipeline
  'pipe.title': { pt: 'Funil de Candidatos', en: 'Candidate Pipeline' },
  'pipe.subtitle': {
    pt: 'CRM do lead à matrícula. A IA atua em cada etapa para qualificar, analisar e orientar.',
    en: 'CRM from lead to enrolment. AI assists at every stage to qualify, analyse and advise.',
  },
  'pipe.ai_role': { pt: 'Papel da IA', en: 'AI role' },
  'pipe.readiness': { pt: 'Prontidão', en: 'Readiness' },

  // Candidates
  'cand.title': { pt: 'Prontidão & Match de Destino', en: 'Readiness & Destination Match' },
  'cand.subtitle': {
    pt: 'Cada candidato recebe uma Pontuação de Prontidão e um match de destino com propensão de aprovação de visto. Critérios objetivos e relacionados ao visto — sem perfilamento.',
    en: 'Each candidate gets a Readiness Score and a destination match with visa-approval propensity. Objective, visa-relevant criteria only — no profiling.',
  },
  'cand.best_fit': { pt: 'Melhor destino', en: 'Best fit' },
  'cand.readiness_score': { pt: 'Pontuação de Prontidão', en: 'Readiness Score' },
  'cand.fit_ranking': { pt: 'Ranking de destinos', en: 'Destination ranking' },
  'cand.dimensions': { pt: 'Dimensões avaliadas', en: 'Scored dimensions' },
  'cand.ethics': {
    pt: 'Avaliação baseada apenas em critérios objetivos e relacionados ao visto. Nenhum atributo protegido é usado.',
    en: 'Assessment based only on objective, visa-relevant criteria. No protected attribute is used.',
  },

  // Visa
  'visa.title': { pt: 'Gestão de Aplicação de Visto', en: 'Visa Application Management' },
  'visa.subtitle': {
    pt: 'Acompanhe cada aplicação de visto por destino — documentação, comprovação financeira, matrícula e decisão.',
    en: 'Track every visa application by destination — documents, proof of funds, enrolment and decision.',
  },
  'visa.intake': { pt: 'Intake alvo', en: 'Target intake' },
  'visa.progress': { pt: 'Progresso', en: 'Progress' },
  'visa.type': { pt: 'Tipo de visto', en: 'Visa type' },

  // Journey
  'journey.title': { pt: 'Jornada do Aluno no Exterior', en: 'Student Lifetime Abroad' },
  'journey.subtitle': {
    pt: 'Da pré-partida ao pathway de residência — o ciclo de vida do intercambista com pontos de apoio da IA, baseado nas melhores práticas do setor.',
    en: 'From pre-departure to the residency pathway — the student lifecycle with AI touchpoints, based on industry best practice.',
  },
  'journey.actions': { pt: 'Atividades-chave', en: 'Key activities' },
  'journey.ai_touch': { pt: 'Apoio da IA', en: 'AI touchpoint' },
};
