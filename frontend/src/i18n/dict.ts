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
  'nav.intake': { pt: 'Novo Candidato · IA', en: 'New Candidate · AI' },

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
  'dash.abroad_title': { pt: 'Alunos no exterior', en: 'Students abroad' },
  'dash.abroad_sub': { pt: 'Ciclo de vida pós-embarque monitorado pela IA', en: 'AI-monitored post-departure lifecycle' },
  'dash.abroad_students': { pt: 'no exterior', en: 'abroad' },
  'dash.abroad_alerts': { pt: 'alertas de conformidade', en: 'compliance alerts' },
  'dash.abroad_renewals': { pt: 'renovações ativas', en: 'active renewals' },
  'dash.abroad_referrals': { pt: 'leads via indicação', en: 'referral leads' },
  'dash.abroad_needs': { pt: 'Requer atenção', en: 'Needs attention' },
  'dash.abroad_link': { pt: 'Ver jornada dos alunos', en: 'View student journey' },

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

  // Journey — live students
  'journey.live_title': { pt: 'Alunos no exterior — acompanhamento ao vivo', en: 'Students abroad — live tracking' },
  'journey.live_sub': {
    pt: 'Cada aluno matriculado é monitorado pela IA: progresso na jornada, conformidade do visto, renovação e pathway de residência.',
    en: 'Each enrolled student is AI-monitored: journey progress, visa compliance, renewal, and residency pathway.',
  },
  'journey.framework_title': { pt: 'Modelo da jornada', en: 'Journey framework' },
  'journey.kpi.students': { pt: 'Alunos no exterior', en: 'Students abroad' },
  'journey.kpi.alerts': { pt: 'Alertas de conformidade', en: 'Compliance alerts' },
  'journey.kpi.renewals': { pt: 'Renovações em andamento', en: 'Renewals in progress' },
  'journey.kpi.referrals': { pt: 'Leads via indicação', en: 'Referral leads' },
  'journey.compliance': { pt: 'Conformidade do visto', en: 'Visa compliance' },
  'journey.attendance': { pt: 'Frequência', en: 'Attendance' },
  'journey.work_hours': { pt: 'Horas de trabalho', en: 'Work hours' },
  'journey.visa_expiry': { pt: 'Visto expira', en: 'Visa expires' },
  'journey.min': { pt: 'mín', en: 'min' },
  'journey.renewal': { pt: 'Renovação & extensão', en: 'Renewal & extension' },
  'journey.pathway': { pt: 'Pathway de residência', en: 'Residency pathway' },
  'journey.eligibility': { pt: 'Elegibilidade', en: 'Eligibility' },
  'journey.alumni': { pt: 'Indicações (alumni)', en: 'Referrals (alumni)' },
  'journey.referrals_made': { pt: 'indicações', en: 'referrals' },
  'journey.became_lead': { pt: 'virou lead', en: 'became lead' },
  'journey.stage_now': { pt: 'Etapa atual', en: 'Current stage' },
  'journey.view_in_pipeline': { pt: 'Indicação no funil', en: 'Referral in pipeline' },
  'journey.alerts_label': { pt: 'Alertas da IA', en: 'AI alerts' },

  // Intake / live AI
  'intake.title': { pt: 'Analisar Novo Candidato', en: 'Analyze a New Candidate' },
  'intake.subtitle': {
    pt: 'Preencha o perfil de um novo lead e a IA gera, na hora, a Pontuação de Prontidão, o match de destino e a recomendação — com critérios objetivos e relacionados ao visto.',
    en: 'Fill in a new lead’s profile and the AI instantly generates the Readiness Score, destination match and recommendation — using objective, visa-relevant criteria only.',
  },
  'intake.form_title': { pt: 'Perfil do candidato', en: 'Candidate profile' },
  'intake.f_name': { pt: 'Nome', en: 'Name' },
  'intake.f_city': { pt: 'Cidade de origem', en: 'Origin city' },
  'intake.f_goal': { pt: 'Objetivo', en: 'Goal' },
  'intake.f_education': { pt: 'Maior formação', en: 'Highest education' },
  'intake.f_english': { pt: 'Nível de inglês', en: 'English level' },
  'intake.f_funds': { pt: 'Capacidade financeira (R$)', en: 'Financial capacity (R$)' },
  'intake.f_intent': { pt: 'Plano de estudos / objetivo', en: 'Study plan / objective' },
  'intake.f_intent_ph': { pt: 'Ex.: concluir curso de inglês e trabalhar na área de TI, visando pathway de residência...', en: 'E.g.: complete an English course and work in IT, aiming for a residency pathway...' },
  'intake.f_refusal': { pt: 'Recusa de visto anterior?', en: 'Prior visa refusal?' },
  'intake.f_refusal_note': { pt: 'Detalhe da recusa (país/ano)', en: 'Refusal detail (country/year)' },
  'intake.f_preferred': { pt: 'Destino preferido (opcional)', en: 'Preferred destination (optional)' },
  'intake.none': { pt: 'Sem preferência', en: 'No preference' },
  'intake.yes': { pt: 'Sim', en: 'Yes' },
  'intake.no': { pt: 'Não', en: 'No' },
  'intake.analyze': { pt: 'Analisar com IA', en: 'Analyze with AI' },
  'intake.analyzing': { pt: 'Analisando perfil...', en: 'Analyzing profile...' },
  'intake.reset': { pt: 'Limpar', en: 'Reset' },
  'intake.empty': { pt: 'Preencha o perfil e clique em “Analisar com IA” para gerar o cartão de prontidão.', en: 'Fill in the profile and click “Analyze with AI” to generate the readiness card.' },
  'intake.result': { pt: 'Resultado da análise', en: 'Analysis result' },
  'intake.mode_live': { pt: 'IA ao vivo · Claude', en: 'Live AI · Claude' },
  'intake.mode_demo': { pt: 'IA simulada (demo)', en: 'Simulated AI (demo)' },
  'intake.demo_note': {
    pt: 'No site publicado, a análise roda um motor de regras local (sem chave de API). Rodando localmente com uma chave Claude, o mesmo botão chama a IA de verdade.',
    en: 'On the published site the analysis runs a local rules engine (no API key). Run locally with a Claude key and the same button calls the real AI.',
  },
  'intake.add': { pt: 'Adicionar ao funil', en: 'Add to pipeline' },
  'intake.added': { pt: 'Adicionado à sessão ✓', en: 'Added to session ✓' },
};
