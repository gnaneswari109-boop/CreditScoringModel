import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  TrendingUp,
  FileDown,
  Upload,
  Loader2,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RiskMeter } from '@/components/RiskMeter';
import {
  PredictionInput,
  PredictionResult,
  DEFAULT_INPUT,
  EMPLOYMENT_OPTIONS,
  OCCUPATION_OPTIONS,
  LOAN_PURPOSE_OPTIONS,
  PAYMENT_HISTORY_OPTIONS,
  HOUSING_OPTIONS,
  MARITAL_OPTIONS,
} from '@/types';
import { predict } from '@/lib/api';
import { addToHistory } from '@/lib/history';

interface PredictionPageProps {
  onNavigate: (page: 'history') => void;
}

type FieldDef = {
  key: keyof PredictionInput;
  label: string;
  type: 'number' | 'select';
  options?: readonly string[];
  placeholder?: string;
  suffix?: string;
  hint?: string;
};

const formSections: { title: string; icon: typeof Calculator; fields: FieldDef[] }[] = [
  {
    title: 'Personal Information',
    icon: Calculator,
    fields: [
      { key: 'age', label: 'Age', type: 'number', placeholder: '35', suffix: 'years' },
      { key: 'marital_status', label: 'Marital Status', type: 'select', options: MARITAL_OPTIONS },
      { key: 'dependents', label: 'Number of Dependents', type: 'number', placeholder: '1', suffix: 'people' },
      { key: 'housing_type', label: 'Housing Type', type: 'select', options: HOUSING_OPTIONS },
    ],
  },
  {
    title: 'Employment & Income',
    icon: TrendingUp,
    fields: [
      { key: 'annual_income', label: 'Annual Income', type: 'number', placeholder: '75000', suffix: '$' },
      { key: 'employment_status', label: 'Employment Status', type: 'select', options: EMPLOYMENT_OPTIONS },
      { key: 'occupation', label: 'Occupation', type: 'select', options: OCCUPATION_OPTIONS },
      { key: 'years_employed', label: 'Years of Employment', type: 'number', placeholder: '8', suffix: 'years' },
    ],
  },
  {
    title: 'Credit & Financial History',
    icon: Sparkles,
    fields: [
      { key: 'credit_history_length', label: 'Credit History Length', type: 'number', placeholder: '12', suffix: 'years' },
      { key: 'payment_history', label: 'Payment History', type: 'select', options: PAYMENT_HISTORY_OPTIONS },
      { key: 'credit_utilization', label: 'Credit Card Utilization', type: 'number', placeholder: '30', suffix: '%' },
      { key: 'num_credit_cards', label: 'Number of Credit Cards', type: 'number', placeholder: '3' },
    ],
  },
  {
    title: 'Loan & Debt Details',
    icon: Calculator,
    fields: [
      { key: 'loan_amount', label: 'Loan Amount Requested', type: 'number', placeholder: '25000', suffix: '$' },
      { key: 'loan_purpose', label: 'Loan Purpose', type: 'select', options: LOAN_PURPOSE_OPTIONS },
      { key: 'monthly_debt', label: 'Monthly Debt Payments', type: 'number', placeholder: '1200', suffix: '$' },
      { key: 'existing_loans', label: 'Existing Loans', type: 'number', placeholder: '2' },
      { key: 'debt_to_income', label: 'Debt-to-Income Ratio', type: 'number', placeholder: '20', suffix: '%' },
      { key: 'savings', label: 'Savings', type: 'number', placeholder: '30000', suffix: '$' },
      { key: 'checking_balance', label: 'Checking Account Balance', type: 'number', placeholder: '8000', suffix: '$' },
    ],
  },
];

export function PredictionPage({ onNavigate }: PredictionPageProps) {
  const [input, setInput] = useState<PredictionInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);

  const updateField = (key: keyof PredictionInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await predict(input);
      setResult(res);
      addToHistory(input, res);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h] = values[i]));
        return obj;
      });
      console.log('Parsed batch rows:', rows.length);
      setBatchOpen(false);
    };
    reader.readAsText(file);
  };

  const downloadReport = () => {
    if (!result) return;
    const report = `
CREDITSENSE AI - CREDIT SCORING REPORT
======================================
Generated: ${new Date().toLocaleString()}

APPLICANT INFORMATION
--------------------
Age:                    ${input.age}
Annual Income:          $${input.annual_income.toLocaleString()}
Employment Status:      ${input.employment_status}
Occupation:             ${input.occupation}
Years Employed:         ${input.years_employed}
Marital Status:         ${input.marital_status}
Dependents:             ${input.dependents}
Housing Type:           ${input.housing_type}

CREDIT HISTORY
--------------
Credit History Length:  ${input.credit_history_length} years
Payment History:        ${input.payment_history}
Credit Utilization:     ${input.credit_utilization}%
Credit Cards:           ${input.num_credit_cards}

LOAN DETAILS
------------
Loan Amount Requested:  $${input.loan_amount.toLocaleString()}
Loan Purpose:           ${input.loan_purpose}
Monthly Debt:           $${input.monthly_debt.toLocaleString()}
Existing Loans:         ${input.existing_loans}
Debt-to-Income Ratio:   ${input.debt_to_income}%
Savings:                $${input.savings.toLocaleString()}
Checking Balance:       $${input.checking_balance.toLocaleString()}

PREDICTION RESULTS
------------------
Decision:               ${result.approved ? 'CREDITWORTHY (APPROVED)' : 'HIGH RISK (REJECTED)'}
Confidence:             ${result.confidence}%
Credit Score:           ${result.credit_score} / 850
Risk Level:             ${result.risk_level.toUpperCase()}
Probability:            ${result.probability}%

RECOMMENDATION
--------------
${result.recommendation}

FINANCIAL IMPROVEMENT SUGGESTIONS
---------------------------------
${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

TOP FACTOR CONTRIBUTIONS
------------------------
${result.feature_contributions.slice(0, 5).map((f) => `${f.feature}: ${f.contribution.toFixed(3)}`).join('\n')}

======================================
CreditSense AI - CodeAlpha ML Internship
`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="glass border-white/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Credit Assessment Form
                </CardTitle>
                <CardDescription className="mt-1">
                  Enter the applicant's financial information for credit scoring
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset} title="Reset form">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title}>
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h4>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          {field.label}
                        </Label>
                        {field.type === 'select' && field.options ? (
                          <Select
                            value={input[field.key] as string}
                            onValueChange={(v) => updateField(field.key, v)}
                          >
                            <SelectTrigger className="bg-white/5">
                              <SelectValue placeholder={field.label} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="relative">
                            <Input
                              type="number"
                              value={input[field.key] as number}
                              onChange={(e) =>
                                updateField(field.key, Number(e.target.value))
                              }
                              placeholder={field.placeholder}
                              className="bg-white/5 pr-12"
                            />
                            {field.suffix && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                {field.suffix}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4 bg-white/5" />
                </div>
              );
            })}

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
                size="lg"
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Predict Creditworthiness
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setBatchOpen(!batchOpen)}>
                <Upload className="mr-2 h-4 w-4" />
                Batch
              </Button>
            </div>

            <AnimatePresence>
              {batchOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Upload a CSV file with applicant data for batch prediction.
                      The CSV should have columns matching the form fields.
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleBatchUpload}
                      className="bg-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass flex min-h-[400px] items-center justify-center border-white/5">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Awaiting Prediction</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill in the applicant's financial details and click
                    "Predict Creditworthiness" to get an AI-powered credit decision.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass flex min-h-[400px] items-center justify-center border-white/5">
                <CardContent className="p-8 text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                  <h3 className="text-lg font-semibold">Analyzing Financial Data</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Running the Random Forest model across 19+ features...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Card className={`glass border-white/5 ${result.approved ? 'glow-success' : 'glow-danger'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.approved ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      Prediction Result
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        result.approved
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-destructive/30 bg-destructive/10 text-destructive'
                      }
                    >
                      {result.approved ? 'APPROVED' : 'REJECTED'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RiskMeter
                    probability={result.probability}
                    riskLevel={result.risk_level}
                    approved={result.approved}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {result.confidence}%
                      </div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {result.credit_score}
                      </div>
                      <div className="text-xs text-muted-foreground">Credit Score</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                      <div
                        className={`text-2xl font-bold capitalize ${
                          result.risk_level === 'low'
                            ? 'text-success'
                            : result.risk_level === 'medium'
                              ? 'text-warning'
                              : 'text-destructive'
                        }`}
                      >
                        {result.risk_level}
                      </div>
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Credit Score Range</span>
                      <span className="font-semibold">{result.credit_score} / 850</span>
                    </div>
                    <Progress value={(result.credit_score - 300) / 550 * 100} className="h-3" />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>300 (Poor)</span>
                      <span>850 (Excellent)</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {result.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    Financial Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.suggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 p-3"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm text-muted-foreground">{suggestion}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Top Factor Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.feature_contributions.slice(0, 8).map((fc) => (
                    <div key={fc.feature} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{fc.feature}</span>
                        <span className="font-medium">{fc.contribution.toFixed(3)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.abs(fc.contribution) / 2 * 100}%`,
                          }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            fc.contribution >= 0 ? 'bg-primary' : 'bg-destructive'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={downloadReport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => onNavigate('history')}>
                  View History
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
