import {
  PredictionInput,
  PredictionResult,
  RiskLevel,
  EMPLOYMENT_WEIGHTS,
  PAYMENT_HISTORY_WEIGHTS,
  HOUSING_WEIGHTS,
  LOAN_PURPOSE_RISK,
} from '@/types';

/**
 * Client-side credit scoring engine.
 * Uses a weighted logistic model that mirrors the Python ML pipeline,
 * so the UI is fully functional even without the backend running.
 */

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function computeFeatureScores(input: PredictionInput) {
  const dtiRatio =
    input.annual_income > 0
      ? (input.monthly_debt * 12) / input.annual_income
      : 1;
  const savingsRatio =
    input.annual_income > 0 ? input.savings / input.annual_income : 0;
  const loanToIncome = input.loan_amount / Math.max(input.annual_income, 1);
  const employmentW = EMPLOYMENT_WEIGHTS[input.employment_status] ?? 0.5;
  const paymentW = PAYMENT_HISTORY_WEIGHTS[input.payment_history] ?? 0.5;
  const housingW = HOUSING_WEIGHTS[input.housing_type] ?? 0.5;
  const purposeRisk = LOAN_PURPOSE_RISK[input.loan_purpose] ?? 0.6;

  const ageScore = clamp((input.age - 18) / 50, 0, 1);
  const incomeScore = clamp(input.annual_income / 200000, 0, 1);
  const creditHistScore = clamp(input.credit_history_length / 25, 0, 1);
  const employmentLenScore = clamp(input.years_employed / 20, 0, 1);
  const savingsScore = clamp(savingsRatio / 1, 0, 1);
  const checkingScore = clamp(input.checking_balance / 20000, 0, 1);
  const utilizationScore = clamp(1 - input.credit_utilization / 100, 0, 1);
  const dtiScore = clamp(1 - dtiRatio, 0, 1);
  const loanRatioScore = clamp(1 - loanToIncome, 0, 1);
  const dependentsPenalty = clamp(input.dependents / 6, 0, 1);
  const cardsScore = clamp(1 - Math.abs(input.num_credit_cards - 4) / 10, 0, 1);

  return {
    ageScore,
    incomeScore,
    creditHistScore,
    employmentLenScore,
    savingsScore,
    checkingScore,
    utilizationScore,
    dtiScore,
    loanRatioScore,
    dependentsPenalty,
    cardsScore,
    employmentW,
    paymentW,
    housingW,
    purposeRisk,
    dtiRatio,
    savingsRatio,
    loanToIncome,
  };
}

export function predictCredit(input: PredictionInput): PredictionResult {
  const s = computeFeatureScores(input);

  const logit =
    -1.2 +
    s.ageScore * 0.6 +
    s.incomeScore * 1.5 +
    s.creditHistScore * 1.2 +
    s.employmentLenScore * 0.8 +
    s.savingsScore * 1.0 +
    s.checkingScore * 0.7 +
    s.utilizationScore * 1.3 +
    s.dtiScore * 1.6 +
    s.loanRatioScore * 0.9 +
    s.cardsScore * 0.4 +
    s.employmentW * 1.1 +
    s.paymentW * 1.8 +
    s.housingW * 0.5 +
    s.purposeRisk * 0.6 -
    s.dependentsPenalty * 0.5;

  const probability = sigmoid(logit);
  const approved = probability >= 0.5;
  const confidence = Math.round((approved ? probability : 1 - probability) * 1000) / 10;
  const creditScore = Math.round(300 + probability * 550);
  const riskLevel: RiskLevel =
    probability >= 0.75 ? 'low' : probability >= 0.45 ? 'medium' : 'high';

  const featureContributions = [
    { feature: 'Payment History', contribution: s.paymentW * 1.8 },
    { feature: 'Debt-to-Income', contribution: s.dtiScore * 1.6 },
    { feature: 'Annual Income', contribution: s.incomeScore * 1.5 },
    { feature: 'Credit Utilization', contribution: s.utilizationScore * 1.3 },
    { feature: 'Credit History', contribution: s.creditHistScore * 1.2 },
    { feature: 'Employment Status', contribution: s.employmentW * 1.1 },
    { feature: 'Savings', contribution: s.savingsScore * 1.0 },
    { feature: 'Loan-to-Income', contribution: s.loanRatioScore * 0.9 },
    { feature: 'Employment Length', contribution: s.employmentLenScore * 0.8 },
    { feature: 'Checking Balance', contribution: s.checkingScore * 0.7 },
    { feature: 'Housing Type', contribution: s.housingW * 0.5 },
    { feature: 'Loan Purpose', contribution: s.purposeRisk * 0.6 },
    { feature: 'Age', contribution: s.ageScore * 0.6 },
    { feature: 'Dependents', contribution: -s.dependentsPenalty * 0.5 },
    { feature: 'Credit Cards', contribution: s.cardsScore * 0.4 },
  ].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const suggestions: string[] = [];
  if (s.dtiScore < 0.5)
    suggestions.push(
      'Reduce your monthly debt obligations to improve your debt-to-income ratio. Target below 36%.'
    );
  if (s.utilizationScore < 0.7)
    suggestions.push(
      'Lower your credit card utilization below 30% to significantly boost your credit score.'
    );
  if (s.paymentW < 0.75)
    suggestions.push(
      'Set up automatic payments to ensure all bills are paid on time. Payment history is the biggest factor.'
    );
  if (s.savingsScore < 0.3)
    suggestions.push(
      'Build an emergency fund covering 3-6 months of expenses to strengthen your financial profile.'
    );
  if (s.creditHistScore < 0.5)
    suggestions.push(
      'Keep older credit accounts open to lengthen your credit history average.'
    );
  if (s.employmentW < 0.8)
    suggestions.push(
      'Stable employment history improves creditworthiness. Maintain consistent income sources.'
    );
  if (suggestions.length === 0)
    suggestions.push(
      'Your financial profile is strong. Continue maintaining good credit habits and regular savings.'
    );

  const recommendation = approved
    ? `Based on the analysis, this applicant has a ${confidence}% likelihood of being creditworthy. The financial profile indicates ${riskLevel} risk. Loan approval is recommended with standard terms.`
    : `This applicant shows a ${confidence}% probability of default risk. The financial profile indicates ${riskLevel} risk. Consider requesting additional collateral, a co-signer, or declining the application.`;

  return {
    approved,
    confidence,
    credit_score: creditScore,
    risk_level: riskLevel,
    probability: Math.round(probability * 1000) / 10,
    recommendation,
    suggestions,
    feature_contributions: featureContributions,
  };
}

export const MOCK_MODEL_INFO = {
  best_model: 'Random Forest',
  models: [
    {
      name: 'Logistic Regression',
      metrics: {
        accuracy: 0.7833,
        precision: 0.79,
        recall: 0.78,
        f1: 0.78,
        roc_auc: 0.82,
      },
    },
    {
      name: 'Decision Tree',
      metrics: {
        accuracy: 0.72,
        precision: 0.73,
        recall: 0.72,
        f1: 0.72,
        roc_auc: 0.71,
      },
    },
    {
      name: 'Random Forest',
      metrics: {
        accuracy: 0.86,
        precision: 0.86,
        recall: 0.86,
        f1: 0.86,
        roc_auc: 0.91,
      },
    },
  ],
  feature_names: [
    'Annual Income',
    'Debt-to-Income Ratio',
    'Credit Utilization',
    'Payment History',
    'Credit History Length',
    'Savings',
    'Loan Amount',
    'Age',
    'Employment Length',
    'Existing Loans',
    'Checking Balance',
    'Credit Cards',
    'Dependents',
    'Housing Type',
    'Loan Purpose',
  ],
  feature_importance: [
    { feature: 'Debt-to-Income Ratio', importance: 0.22 },
    { feature: 'Payment History', importance: 0.19 },
    { feature: 'Credit Utilization', importance: 0.15 },
    { feature: 'Annual Income', importance: 0.12 },
    { feature: 'Credit History Length', importance: 0.09 },
    { feature: 'Savings', importance: 0.07 },
    { feature: 'Loan Amount', importance: 0.05 },
    { feature: 'Age', importance: 0.04 },
    { feature: 'Employment Length', importance: 0.03 },
    { feature: 'Existing Loans', importance: 0.02 },
    { feature: 'Checking Balance', importance: 0.01 },
    { feature: 'Credit Cards', importance: 0.005 },
    { feature: 'Dependents', importance: 0.003 },
    { feature: 'Housing Type', importance: 0.002 },
    { feature: 'Loan Purpose', importance: 0.002 },
  ],
  training_date: '2026-07-11',
  dataset_size: 1000,
};
