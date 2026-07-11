import { HistoryEntry, PredictionInput, PredictionResult } from '@/types';

const STORAGE_KEY = 'creditsense_history';
const MAX_ENTRIES = 100;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(
  input: PredictionInput,
  result: PredictionResult
): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    input,
    result,
  };
  const history = getHistory();
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return entry;
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportHistoryCSV(): string {
  const history = getHistory();
  if (history.length === 0) return '';
  const headers = [
    'Timestamp',
    'Age',
    'Annual Income',
    'Employment Status',
    'Occupation',
    'Years Employed',
    'Credit History Length',
    'Monthly Debt',
    'Existing Loans',
    'Loan Amount',
    'Loan Purpose',
    'Savings',
    'Checking Balance',
    'Payment History',
    'Credit Utilization',
    'Debt-to-Income',
    'Credit Cards',
    'Dependents',
    'Housing',
    'Marital Status',
    'Approved',
    'Confidence',
    'Credit Score',
    'Risk Level',
  ];
  const rows = history.map((e) => [
    e.timestamp,
    e.input.age,
    e.input.annual_income,
    e.input.employment_status,
    e.input.occupation,
    e.input.years_employed,
    e.input.credit_history_length,
    e.input.monthly_debt,
    e.input.existing_loans,
    e.input.loan_amount,
    e.input.loan_purpose,
    e.input.savings,
    e.input.checking_balance,
    e.input.payment_history,
    e.input.credit_utilization,
    e.input.debt_to_income,
    e.input.num_credit_cards,
    e.input.dependents,
    e.input.housing_type,
    e.input.marital_status,
    e.result.approved ? 'Yes' : 'No',
    e.result.confidence,
    e.result.credit_score,
    e.result.risk_level,
  ]);
  return [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(','))
    .join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
