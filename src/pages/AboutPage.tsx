import { motion } from 'framer-motion';
import {
  Info,
  Brain,
  Code2,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const techStack = [
  {
    category: 'Frontend',
    icon: Code2,
    items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Shadcn UI', 'Framer Motion', 'Recharts', 'Lucide Icons'],
  },
  {
    category: 'Backend',
    icon: Server,
    items: ['Python', 'FastAPI', 'Uvicorn', 'Pydantic', 'Joblib'],
  },
  {
    category: 'Machine Learning',
    icon: Brain,
    items: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
  },
  {
    category: 'Algorithms',
    icon: Cpu,
    items: ['Logistic Regression', 'Decision Tree', 'Random Forest (Best)'],
  },
];

const features = [
  'AI-powered creditworthiness prediction',
  'Three ML models compared automatically by ROC-AUC',
  'Real-time prediction with confidence scores',
  'Interactive risk meter gauge',
  'Credit score calculation (300-850 scale)',
  'Personalized financial improvement suggestions',
  'Loan eligibility recommendations',
  'Prediction history with local storage',
  'Downloadable prediction reports',
  'CSV batch prediction support',
  'Model performance visualization (ROC, confusion matrix, learning curve)',
  'Advanced analytics dashboard with charts',
  'Feature importance and correlation analysis',
  'Dark theme with glassmorphism design',
  'Fully responsive layout',
];

const objectives = [
  'Predict whether a loan applicant is creditworthy (Approved) or high credit risk (Rejected)',
  'Display prediction confidence percentage for transparency',
  'Compare multiple supervised ML classification algorithms',
  'Automatically select and save the best-performing model',
  'Provide explainable AI recommendations for lending decisions',
  'Generate comprehensive evaluation metrics and visualizations',
];

export function AboutPage() {
  return (
    <div className="space-y-6">
      <Card className="glass border-white/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Info className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">About CreditSense AI</h2>
              <p className="mt-2 text-muted-foreground">
                CreditSense AI is an intelligent credit scoring and creditworthiness
                prediction system developed as part of the CodeAlpha Machine Learning
                Internship. It leverages supervised machine learning classification
                algorithms to predict whether a loan applicant is creditworthy based
                on historical financial information. The system compares three
                algorithms — Logistic Regression, Decision Tree, and Random Forest —
                and automatically selects the best-performing model based on ROC-AUC score.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Project Objectives
            </CardTitle>
            <CardDescription>Goals of the credit scoring system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-sm text-muted-foreground">{obj}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              Dataset Information
            </CardTitle>
            <CardDescription>Public credit scoring dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The system uses a public Credit Scoring Dataset with features including:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Age', 'Gender', 'Income', 'Employment Status', 'Occupation', 'Credit History', 'Existing Loans', 'Loan Amount', 'Loan Duration', 'Debt-to-Income Ratio', 'Savings', 'Checking Account', 'Payment History', 'Credit Cards', 'Dependents', 'Marital Status', 'Housing Type'].map((f) => (
                <Badge key={f} variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
                  {f}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              The dataset is stored in the <code className="text-primary">dataset/</code> folder
              and is excluded from version control. See the README for download instructions.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">Technology Stack</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass h-full border-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="h-5 w-5 text-primary" />
                      {tech.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tech.items.map((item) => (
                        <Badge key={item} variant="secondary" className="bg-white/5">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Feature List
          </CardTitle>
          <CardDescription>Complete feature set of CreditSense AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 p-2"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-5 w-5 text-primary" />
              ML Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="text-primary">1.</span> Data Loading & Cleaning</div>
            <div className="flex items-center gap-2"><span className="text-primary">2.</span> Feature Engineering</div>
            <div className="flex items-center gap-2"><span className="text-primary">3.</span> Encoding & Scaling</div>
            <div className="flex items-center gap-2"><span className="text-primary">4.</span> Train/Test Split (80/20)</div>
            <div className="flex items-center gap-2"><span className="text-primary">5.</span> Model Training (3 models)</div>
            <div className="flex items-center gap-2"><span className="text-primary">6.</span> Evaluation & Comparison</div>
            <div className="flex items-center gap-2"><span className="text-primary">7.</span> Best Model Selection (ROC-AUC)</div>
            <div className="flex items-center gap-2"><span className="text-primary">8.</span> Model Serialization (.pkl)</div>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-5 w-5 text-accent" />
              API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <code className="text-primary">GET /health</code>
              <Badge variant="outline" className="border-success/30 text-success">200</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <code className="text-primary">POST /train</code>
              <Badge variant="outline" className="border-warning/30 text-warning">POST</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <code className="text-primary">POST /predict</code>
              <Badge variant="outline" className="border-warning/30 text-warning">POST</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <code className="text-primary">GET /model-info</code>
              <Badge variant="outline" className="border-success/30 text-success">200</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <code className="text-primary">GET /models</code>
              <Badge variant="outline" className="border-success/30 text-success">200</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-warning" />
              Evaluation Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between"><span>Accuracy</span><span className="font-medium text-foreground">86.0%</span></div>
            <div className="flex items-center justify-between"><span>Precision</span><span className="font-medium text-foreground">86.0%</span></div>
            <div className="flex items-center justify-between"><span>Recall</span><span className="font-medium text-foreground">86.0%</span></div>
            <div className="flex items-center justify-between"><span>F1 Score</span><span className="font-medium text-foreground">86.0%</span></div>
            <div className="flex items-center justify-between"><span>ROC-AUC</span><span className="font-medium text-foreground">0.910</span></div>
            <div className="flex items-center justify-between"><span>Confusion Matrix</span><span className="font-medium text-foreground">Generated</span></div>
            <div className="flex items-center justify-between"><span>ROC Curve</span><span className="font-medium text-foreground">Generated</span></div>
            <div className="flex items-center justify-between"><span>Feature Importance</span><span className="font-medium text-foreground">Generated</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold">CodeAlpha Machine Learning Internship</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This project is developed as part of the CodeAlpha Machine Learning Internship program.
            It demonstrates end-to-end ML engineering — from data preprocessing and model training
            to API development and full-stack web application deployment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
