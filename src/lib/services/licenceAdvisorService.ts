// REG-VAULT Licence Advisor Service
// Scoring algorithm based on PSR 2017 and EMR 2011

import {
  LicenceType,
  LicenceRecommendation,
} from '@/types/journey';
import {
  LICENCE_ADVISOR_QUESTIONS,
  AdvisorQuestion,
  LicenceScoreImpact,
} from '@/data/licence-advisor-questions';
import {
  LICENCE_REQUIREMENTS,
  CAPITAL_METHODS,
} from '@/data/licence-requirements';

export type QuestionAnswer = string | number | boolean | string[];

export interface AdvisorAnswers {
  [questionId: string]: QuestionAnswer;
}

interface LicenceScore {
  licence: LicenceType;
  score: number;
  eliminated: boolean;
  eliminationReason?: string;
  strengths: string[];
  weaknesses: string[];
}

// Calculate scores for all licence types based on answers
export function calculateLicenceScores(answers: AdvisorAnswers): LicenceScore[] {
  const scores: Record<LicenceType, LicenceScore> = {
    SPI: { licence: 'SPI', score: 50, eliminated: false, strengths: [], weaknesses: [] },
    API: { licence: 'API', score: 50, eliminated: false, strengths: [], weaknesses: [] },
    SEMI: { licence: 'SEMI', score: 50, eliminated: false, strengths: [], weaknesses: [] },
    EMI: { licence: 'EMI', score: 50, eliminated: false, strengths: [], weaknesses: [] },
    RAISP: { licence: 'RAISP', score: 50, eliminated: false, strengths: [], weaknesses: [] },
  };

  // Process each answered question
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = LICENCE_ADVISOR_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    // Apply each impact rule
    question.impactOn.forEach((impact) => {
      const matches = checkCondition(impact, answer);
      if (matches) {
        const licenceScore = scores[impact.licence];

        // Apply score impact
        licenceScore.score += impact.scoreImpact;

        // Check for elimination
        if (impact.eliminates) {
          licenceScore.eliminated = true;
          licenceScore.eliminationReason = getEliminationReason(question, impact);
        }

        // Track strengths and weaknesses
        if (impact.scoreImpact >= 20) {
          licenceScore.strengths.push(getImpactDescription(question, impact, true));
        } else if (impact.scoreImpact <= -20) {
          licenceScore.weaknesses.push(getImpactDescription(question, impact, false));
        }
      }
    });
  });

  // Normalize scores (0-100)
  Object.values(scores).forEach((score) => {
    score.score = Math.max(0, Math.min(100, score.score));
  });

  return Object.values(scores).sort((a, b) => {
    // Eliminated licences go last
    if (a.eliminated !== b.eliminated) {
      return a.eliminated ? 1 : -1;
    }
    // Otherwise sort by score
    return b.score - a.score;
  });
}

// Check if an answer matches a condition
function checkCondition(impact: LicenceScoreImpact, answer: QuestionAnswer): boolean {
  const { condition, value } = impact;

  switch (condition) {
    case 'equals':
      return answer === value;

    case 'not_equals':
      if (Array.isArray(answer) && Array.isArray(value)) {
        // Check if arrays don't match
        return !value.every((v) => (answer as string[]).includes(v));
      }
      return answer !== value;

    case 'greater_than':
      return typeof answer === 'number' && answer > (value as number);

    case 'less_than':
      return typeof answer === 'number' && answer < (value as number);

    case 'contains':
      if (Array.isArray(answer) && Array.isArray(value)) {
        return value.some((v) => (answer as string[]).includes(v));
      }
      return false;

    default:
      return false;
  }
}

// Get elimination reason text
function getEliminationReason(question: AdvisorQuestion, impact: LicenceScoreImpact): string {
  const licenceInfo = LICENCE_REQUIREMENTS[impact.licence];

  switch (question.id) {
    case 'q3_e_money_issuance':
      if (impact.licence === 'SPI' || impact.licence === 'API') {
        return 'Payment institutions cannot issue electronic money';
      }
      if (impact.licence === 'RAISP') {
        return 'AISPs can only provide account information services';
      }
      break;

    case 'q6_monthly_volume':
      if (impact.licence === 'SPI') {
        return `Small PIs are limited to €3 million average monthly transactions`;
      }
      if (impact.licence === 'SEMI') {
        return `Small EMIs are limited to €5 million average outstanding e-money`;
      }
      break;

    case 'q13_geographic_scope':
      if (impact.licence === 'SPI' || impact.licence === 'SEMI') {
        return `Registered institutions cannot passport to other EEA states`;
      }
      break;

    case 'q15_available_capital':
      return `Insufficient capital: ${licenceInfo.fullName} requires €${licenceInfo.initialCapital.toLocaleString()} minimum`;

    case 'q1_primary_activity':
      if (impact.licence === 'RAISP') {
        return 'RAISPs can only provide account information services';
      }
      break;
  }

  return `Does not meet ${licenceInfo.fullName} requirements`;
}

// Get description of score impact
function getImpactDescription(
  question: AdvisorQuestion,
  impact: LicenceScoreImpact,
  isStrength: boolean
): string {
  const category = question.category;
  const licence = LICENCE_REQUIREMENTS[impact.licence];

  // Generate contextual description
  switch (category) {
    case 'business_activities':
      return isStrength
        ? `Business model aligns well with ${licence.fullName} permissions`
        : `Business activities may be restricted under ${licence.fullName}`;

    case 'transaction_volumes':
      return isStrength
        ? `Transaction volumes fit ${licence.fullName} thresholds`
        : `Expected volumes may exceed ${licence.fullName} limits`;

    case 'capital':
      return isStrength
        ? `Capital requirements are achievable`
        : `May face challenges meeting capital requirements`;

    case 'geographic_scope':
      return isStrength
        ? `Geographic scope is well supported`
        : `Geographic expansion may be limited`;

    case 'e_money':
      return isStrength
        ? `E-money requirements align with licence type`
        : `E-money issuance affects licence eligibility`;

    default:
      return isStrength
        ? `Meets ${licence.fullName} criteria`
        : `May not fully meet ${licence.fullName} criteria`;
  }
}

// Generate the full recommendation
export function generateRecommendation(answers: AdvisorAnswers): LicenceRecommendation {
  const scores = calculateLicenceScores(answers);

  // Get top non-eliminated licence
  const validLicences = scores.filter((s) => !s.eliminated);

  if (validLicences.length === 0) {
    // All eliminated - return the highest scoring eliminated one with warnings
    const best = scores[0];
    return {
      recommended: best.licence,
      alternatives: scores.slice(1, 3).map((s) => s.licence),
      confidence: 'low',
      reasoning: [
        `Based on your answers, there are significant challenges with all licence types.`,
        best.eliminationReason || '',
        ...best.weaknesses,
      ].filter(Boolean),
      capitalRequirement: calculateCapitalRequirement(best.licence, answers),
      warnings: [
        `Your business model may need adjustment to qualify for FCA authorisation`,
        ...scores.filter((s) => s.eliminated).map((s) => s.eliminationReason || ''),
      ].filter(Boolean),
      regulatoryReferences: getRelevantReferences(best.licence),
    };
  }

  const recommended = validLicences[0];
  const alternatives = validLicences.slice(1, 3).map((s) => s.licence);

  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'high';
  if (recommended.score < 60) {
    confidence = 'low';
  } else if (recommended.score < 75 || (validLicences[1] && validLicences[1].score > recommended.score - 10)) {
    confidence = 'medium';
  }

  // Generate reasoning
  const reasoning: string[] = [
    `${LICENCE_REQUIREMENTS[recommended.licence].fullName} is recommended based on your business profile.`,
    ...recommended.strengths,
  ];

  // Add comparison notes if close alternatives exist
  if (alternatives.length > 0 && validLicences[1].score > recommended.score - 15) {
    reasoning.push(
      `${LICENCE_REQUIREMENTS[alternatives[0]].fullName} could also be suitable depending on your growth plans.`
    );
  }

  // Generate warnings from weaknesses
  const warnings = [
    ...recommended.weaknesses,
    ...scores.filter((s) => s.eliminated).map((s) => `${LICENCE_REQUIREMENTS[s.licence].fullName}: ${s.eliminationReason}`),
  ].filter(Boolean);

  return {
    recommended: recommended.licence,
    alternatives,
    confidence,
    reasoning,
    capitalRequirement: calculateCapitalRequirement(recommended.licence, answers),
    warnings,
    regulatoryReferences: getRelevantReferences(recommended.licence),
  };
}

// Calculate capital requirement for a licence type
function calculateCapitalRequirement(
  licence: LicenceType,
  answers: AdvisorAnswers
): LicenceRecommendation['capitalRequirement'] {
  const requirements = LICENCE_REQUIREMENTS[licence];
  const initial = requirements.initialCapital;

  // Calculate ongoing capital based on answers
  let ongoing = initial;
  let method = 'N/A';

  if (requirements.ongoingCapital.methodA || requirements.ongoingCapital.methodB || requirements.ongoingCapital.methodC) {
    // Estimate fixed overheads from answers (simplified)
    const volume = (answers.q6_monthly_volume as number) || 1000000;

    // Method A: 10% of fixed overheads (estimate overheads as 20% of revenue)
    const estimatedRevenue = volume * 0.02; // 2% take rate
    const methodA = Math.round(estimatedRevenue * 0.2 * 0.1);

    // Method B: Based on payment volume
    const methodB = calculateMethodB(volume * 12);

    // Method C: Based on relevant income
    const methodC = calculateMethodC(estimatedRevenue);

    // Find lowest method
    const methods = [
      { name: 'A', value: methodA },
      { name: 'B', value: methodB },
      { name: 'C', value: methodC },
    ].sort((a, b) => a.value - b.value);

    ongoing = Math.max(initial, methods[0].value);
    method = `Method ${methods[0].name} (${CAPITAL_METHODS[methods[0].name as 'A' | 'B' | 'C'].name})`;
  }

  // Method D for EMIs
  if (licence === 'EMI' || licence === 'SEMI') {
    const eMoney = (answers.q7_e_money_outstanding as number) || 1000000;
    const methodD = Math.round(eMoney * 0.02);
    if (methodD > ongoing) {
      ongoing = methodD;
      method = `Method D (${CAPITAL_METHODS.D.name})`;
    }
  }

  return {
    initial,
    ongoing,
    method,
  };
}

// Method B calculation (sliding scale)
function calculateMethodB(annualVolume: number): number {
  let capital = 0;
  let remaining = annualVolume;

  if (remaining > 0) {
    const tier1 = Math.min(remaining, 5000000);
    capital += tier1 * 0.04;
    remaining -= tier1;
  }
  if (remaining > 0) {
    const tier2 = Math.min(remaining, 5000000);
    capital += tier2 * 0.025;
    remaining -= tier2;
  }
  if (remaining > 0) {
    const tier3 = Math.min(remaining, 90000000);
    capital += tier3 * 0.01;
    remaining -= tier3;
  }
  if (remaining > 0) {
    const tier4 = Math.min(remaining, 150000000);
    capital += tier4 * 0.005;
    remaining -= tier4;
  }
  if (remaining > 0) {
    capital += remaining * 0.0025;
  }

  return Math.round(capital / 12); // Monthly average
}

// Method C calculation (sliding scale)
function calculateMethodC(annualIncome: number): number {
  let capital = 0;
  let remaining = annualIncome;

  if (remaining > 0) {
    const tier1 = Math.min(remaining, 2500000);
    capital += tier1 * 0.1;
    remaining -= tier1;
  }
  if (remaining > 0) {
    const tier2 = Math.min(remaining, 2500000);
    capital += tier2 * 0.08;
    remaining -= tier2;
  }
  if (remaining > 0) {
    const tier3 = Math.min(remaining, 20000000);
    capital += tier3 * 0.06;
    remaining -= tier3;
  }
  if (remaining > 0) {
    const tier4 = Math.min(remaining, 225000000);
    capital += tier4 * 0.03;
    remaining -= tier4;
  }
  if (remaining > 0) {
    capital += remaining * 0.015;
  }

  return Math.round(capital);
}

// Get relevant regulatory references
function getRelevantReferences(licence: LicenceType): string[] {
  const requirements = LICENCE_REQUIREMENTS[licence];
  const references: string[] = [];

  if (requirements.regulation === 'PSR2017') {
    references.push('Payment Services Regulations 2017');
    references.push('PSR 2017, Part 2 - Registration and Authorisation');
  } else {
    references.push('Electronic Money Regulations 2011');
    references.push('EMR 2011, Part 2 - Registration and Authorisation');
  }

  if (requirements.safeguarding) {
    references.push(
      requirements.regulation === 'PSR2017'
        ? 'PSR 2017, Regulation 23 - Safeguarding'
        : 'EMR 2011, Regulation 20 - Safeguarding'
    );
  }

  if (requirements.passporting) {
    references.push('FCA Handbook SUP 13A - Passporting');
  }

  return references;
}

// Validate if all required questions are answered
export function validateAnswers(answers: AdvisorAnswers): { valid: boolean; missingQuestions: string[] } {
  const requiredQuestions = LICENCE_ADVISOR_QUESTIONS.filter(
    (q) => q.validation?.required !== false
  );

  const missingQuestions = requiredQuestions
    .filter((q) => answers[q.id] === undefined || answers[q.id] === null)
    .map((q) => q.id);

  return {
    valid: missingQuestions.length === 0,
    missingQuestions,
  };
}

// Get progress percentage based on answered questions
export function calculateProgress(answers: AdvisorAnswers): number {
  const totalQuestions = LICENCE_ADVISOR_QUESTIONS.length;
  const answeredQuestions = Object.keys(answers).filter(
    (id) => answers[id] !== undefined && answers[id] !== null
  ).length;

  return Math.round((answeredQuestions / totalQuestions) * 100);
}
