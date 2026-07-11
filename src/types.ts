export type Page = 'home' | 'predict' | 'performance' | 'analytics' | 'history' | 'about';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface PredictionInput {
  age: number;
  annual_income: number;
  employment_status: string;
  occupation: string;
  years_employed: number;
  credit_history_length: number;
  monthly_debt: number;
  existing_loans: number;
  loan_amount: number;
  loan_purpose: string;
  savings: number;
  checking_balance: number;
  payment_history: string;
  credit_utilization: number;
  debt_to_income: number;
  num_credit_cards: number;
  dependents: number;
  housing_type: string;
  marital_status: string;
}

export interface PredictionResult {
  approved: boolean;
  confidence: number;
  credit_score: number;
  risk_level: RiskLevel;
  probability: number;
  recommendation: string;
  suggestions: string[];
  feature_contributions: { feature: string; contribution: number }[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface ModelInfo {
  best_model: string;
  models: {
    name: string;
    metrics: ModelMetrics;
  }[];
  feature_names: string[];
  feature_importance: { feature: string; importance: number }[];
  training_date: string;
  dataset_size: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  input: PredictionInput;
  result: PredictionResult;
}

export const EMPLOYMENT_OPTIONS = [
  'Employed',
  'Self-Employed',
  'Unemployed',
  'Retired',
  'Student',
] as const;

export const OCCUPATION_OPTIONS = [
  'Software Engineer',
  'Data Scientist',
  'Doctor',
  'Teacher',
  'Accountant',
  'Sales Representative',
  'Manager',
  'Technician',
  'Nurse',
  'Business Owner',
  'Government Employee',
  'Other',
] as const;

export const LOAN_PURPOSE_OPTIONS = [
  'Home',
  'Car',
  'Education',
  'Business',
  'Debt Consolidation',
  'Personal',
  'Medical',
  'Other',
] as const;

export const PAYMENT_HISTORY_OPTIONS = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
] as const;

export const HOUSING_OPTIONS = ['Own', 'Rent', 'Mortgage', 'Other'] as const;

export const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'] as const;

export const DEFAULT_INPUT: PredictionInput = {
  age: 35,
  annual_income: 75000,
  employment_status: 'Employed',
  occupation: 'Software Engineer',
  years_employed: 8,
  credit_history_length: 12,
  monthly_debt: 1200,
  existing_loans: 2,
  loan_amount: 25000,
  loan_purpose: 'Car',
  savings: 30000,
  checking_balance: 8000,
  payment_history: 'Good',
  credit_utilization: 30,
  debt_to_income: 20,
  num_credit_cards: 3,
  dependents: 1,
  housing_type: 'Mortgage',
  marital_status: 'Married',
};

export const EMPLOYMENT_WEIGHTS: Record<string, number> = {
  Employed: 1.0,
  'Self-Employed': 0.85,
  Retired: 0.7,
  Student: 0.3,
  Unemployed: 0.1,
};

export const PAYMENT_HISTORY_WEIGHTS: Record<string, number> = {
  Excellent: 1.0,
  Good: 0.75,
  Fair: 0.45,
  Poor: 0.15,
};

export const HOUSING_WEIGHTS: Record<string, number> = {
  Own: 1.0,
  Mortgage: 0.85,
  Rent: 0.55,
  Other: 0.4,
};

export const LOAN_PURPOSE_RISK: Record<string, number> = {
  Home: 0.9,
  Education: 0.85,
  Car: 0.8,
  Business: 0.65,
  'Debt Consolidation': 0.55,
  Personal: 0.6,
  Medical: 0.7,
  Other: 0.5,
};
