import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Shield,
  Brain,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Activity,
  Target,
  Database,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Page } from '@/types';
import { MOCK_MODEL_INFO } from '@/lib/credit-engine';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { label: 'Model Accuracy', value: '86%', icon: Target, color: 'text-primary' },
  { label: 'ROC-AUC Score', value: '0.91', icon: Activity, color: 'text-accent' },
  { label: 'Best Model', value: 'Random Forest', icon: Brain, color: 'text-warning' },
  { label: 'Dataset Size', value: '1,000', icon: Database, color: 'text-chart-4' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Three ML models (Logistic Regression, Decision Tree, Random Forest) compared automatically to select the best performer.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive creditworthiness evaluation with confidence scores, risk meters, and detailed financial analysis.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Interactive visualizations including ROC curves, confusion matrices, feature importance, and correlation heatmaps.',
  },
  {
    icon: Zap,
    title: 'Real-Time Scoring',
    description: 'Instant credit decisions with explainable AI recommendations and actionable financial improvement suggestions.',
  },
];

const steps = [
  { step: '01', title: 'Input Financial Data', description: 'Enter applicant details including income, employment, credit history, and loan information.' },
  { step: '02', title: 'AI Analysis', description: 'The trained Random Forest model evaluates 19+ financial features in real-time.' },
  { step: '03', title: 'Credit Decision', description: 'Get instant approval/rejection with confidence score, credit score, and risk level.' },
  { step: '04', title: 'Recommendations', description: 'Receive personalized financial improvement tips and loan eligibility guidance.' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-card/30 p-8 lg:p-12">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              <Brain className="mr-1.5 h-3 w-3" />
              Machine Learning Powered
            </Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
              Intelligent Credit Scoring &<br />
              <span className="gradient-text">Creditworthiness Prediction</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground lg:text-lg">
              CreditSense AI leverages supervised machine learning to predict loan
              applicant creditworthiness. Compare three classification algorithms,
              visualize model performance, and make data-driven lending decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate('predict')}
                className="bg-gradient-to-r from-primary to-accent text-white glow-primary"
              >
                Start Prediction
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('performance')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Model Performance
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass border-white/5">
                <CardContent className="p-5">
                  <Icon className={`mb-3 h-6 w-6 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <section>
        <h3 className="mb-6 text-2xl font-bold">Key Features</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass h-full border-white/5 transition-colors hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-6 text-2xl font-bold">How It Works</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass relative h-full border-white/5">
                <CardContent className="p-6">
                  <span className="text-4xl font-bold text-primary/20">
                    {step.step}
                  </span>
                  <h4 className="mt-2 text-base font-semibold">{step.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <Card className="glass border-white/5">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Trained Models Comparison</h3>
                  <p className="text-sm text-muted-foreground">
                    Best model auto-selected by ROC-AUC score
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {MOCK_MODEL_INFO.models.map((model) => (
                  <div
                    key={model.name}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2"
                  >
                    {model.name === MOCK_MODEL_INFO.best_model && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    <div>
                      <div className="text-sm font-semibold">{model.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ROC-AUC: {model.metrics.roc_auc.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
        <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h3 className="text-2xl font-bold">Ready to assess creditworthiness?</h3>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Start by entering the applicant's financial information and get an instant
          AI-powered credit decision with detailed recommendations.
        </p>
        <Button
          size="lg"
          className="mt-6 bg-gradient-to-r from-primary to-accent text-white"
          onClick={() => onNavigate('predict')}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
}
