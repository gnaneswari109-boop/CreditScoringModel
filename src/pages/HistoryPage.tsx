import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RiskMeter } from '@/components/RiskMeter';
import { HistoryEntry } from '@/types';
import {
  getHistory,
  deleteHistoryEntry,
  clearHistory,
  exportHistoryCSV,
  downloadCSV,
} from '@/lib/history';

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refresh = () => setHistory(getHistory());

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    refresh();
  };

  const handleClear = () => {
    clearHistory();
    refresh();
  };

  const handleExport = () => {
    const csv = exportHistoryCSV();
    if (csv) downloadCSV(csv, `creditsense-history-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Prediction History</h3>
            <p className="text-sm text-muted-foreground">
              {history.length} prediction{history.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={history.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={history.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="glass flex min-h-[300px] items-center justify-center border-white/5">
          <CardContent className="p-8 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No Predictions Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your prediction history will appear here once you start making credit assessments.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="glass border-white/5 transition-colors hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {entry.result.approved ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                          <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {entry.result.approved ? 'Approved' : 'Rejected'}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              entry.result.risk_level === 'low'
                                ? 'border-success/30 bg-success/10 text-success'
                                : entry.result.risk_level === 'medium'
                                  ? 'border-warning/30 bg-warning/10 text-warning'
                                  : 'border-destructive/30 bg-destructive/10 text-destructive'
                            }
                          >
                            {entry.result.risk_level} risk
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <span>Score: {entry.result.credit_score}</span>
                          <span>Confidence: {entry.result.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden text-right sm:block">
                        <div className="text-xs text-muted-foreground">Income</div>
                        <div className="text-sm font-medium">
                          ${entry.input.annual_income.toLocaleString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(entry)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.result.approved ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  Prediction Details
                </DialogTitle>
                <DialogDescription>
                  {new Date(selected.timestamp).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <RiskMeter
                  probability={selected.result.probability}
                  riskLevel={selected.result.risk_level}
                  approved={selected.result.approved}
                />
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selected.result.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                    <div className="text-2xl font-bold text-accent">
                      {selected.result.credit_score}
                    </div>
                    <div className="text-xs text-muted-foreground">Credit Score</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                    <div className="text-2xl font-bold capitalize text-warning">
                      {selected.result.risk_level}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Level</div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold">Applicant Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Age:</span> {selected.input.age}</div>
                    <div><span className="text-muted-foreground">Income:</span> ${selected.input.annual_income.toLocaleString()}</div>
                    <div><span className="text-muted-foreground">Employment:</span> {selected.input.employment_status}</div>
                    <div><span className="text-muted-foreground">Occupation:</span> {selected.input.occupation}</div>
                    <div><span className="text-muted-foreground">Loan Amount:</span> ${selected.input.loan_amount.toLocaleString()}</div>
                    <div><span className="text-muted-foreground">Loan Purpose:</span> {selected.input.loan_purpose}</div>
                    <div><span className="text-muted-foreground">DTI:</span> {selected.input.debt_to_income}%</div>
                    <div><span className="text-muted-foreground">Payment Hist:</span> {selected.input.payment_history}</div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    {selected.result.recommendation}
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <h4 className="mb-2 text-sm font-semibold">Suggestions</h4>
                  <ul className="space-y-1">
                    {selected.result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
