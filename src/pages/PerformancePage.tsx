import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from 'recharts';
import {
  BarChart3,
  Brain,
  Trophy,
  TrendingUp,
  Activity,
  Target,
  Gauge,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getModelInfo, trainModel } from '@/lib/api';
import { MOCK_MODEL_INFO } from '@/lib/credit-engine';
import { ModelInfo } from '@/types';

const tooltipStyle = {
  backgroundColor: 'hsl(222 40% 9%)',
  border: '1px solid hsl(222 30% 16%)',
  borderRadius: '8px',
  color: 'hsl(210 40% 96%)',
  fontSize: '12px',
};

export function PerformancePage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo>(MOCK_MODEL_INFO as unknown as ModelInfo);
  const [training, setTraining] = useState(false);
  const [trainMsg, setTrainMsg] = useState('');

  useEffect(() => {
    getModelInfo().then(setModelInfo);
  }, []);

  const handleTrain = async () => {
    setTraining(true);
    setTrainMsg('');
    try {
      const res = await trainModel();
      setTrainMsg(res.message);
      if (res.success) {
        const info = await getModelInfo();
        setModelInfo(info);
      }
    } finally {
      setTraining(false);
    }
  };

  const accuracyData = modelInfo.models.map((m) => ({
    name: m.name,
    Accuracy: m.metrics.accuracy,
    Precision: m.metrics.precision,
    Recall: m.metrics.recall,
    'F1 Score': m.metrics.f1,
    'ROC-AUC': m.metrics.roc_auc,
  }));

  const rocData = [
    { fpr: 0, tpr_lr: 0, tpr_dt: 0, tpr_rf: 0 },
    { fpr: 0.1, tpr_lr: 0.55, tpr_dt: 0.48, tpr_rf: 0.72 },
    { fpr: 0.2, tpr_lr: 0.72, tpr_dt: 0.62, tpr_rf: 0.85 },
    { fpr: 0.3, tpr_lr: 0.82, tpr_dt: 0.73, tpr_rf: 0.91 },
    { fpr: 0.4, tpr_lr: 0.88, tpr_dt: 0.82, tpr_rf: 0.95 },
    { fpr: 0.5, tpr_lr: 0.92, tpr_dt: 0.88, tpr_rf: 0.97 },
    { fpr: 0.6, tpr_lr: 0.95, tpr_dt: 0.92, tpr_rf: 0.98 },
    { fpr: 0.7, tpr_lr: 0.97, tpr_dt: 0.95, tpr_rf: 0.99 },
    { fpr: 0.8, tpr_lr: 0.98, tpr_dt: 0.97, tpr_rf: 0.995 },
    { fpr: 0.9, tpr_lr: 0.99, tpr_dt: 0.98, tpr_rf: 1.0 },
    { fpr: 1.0, tpr_lr: 1.0, tpr_dt: 1.0, tpr_rf: 1.0 },
  ];

  const learningCurveData = [
    { samples: 100, train: 1.0, test: 0.68 },
    { samples: 200, train: 0.98, test: 0.74 },
    { samples: 300, train: 0.96, test: 0.78 },
    { samples: 400, train: 0.95, test: 0.81 },
    { samples: 500, train: 0.94, test: 0.83 },
    { samples: 600, train: 0.93, test: 0.84 },
    { samples: 700, train: 0.92, test: 0.85 },
    { samples: 800, train: 0.91, test: 0.855 },
  ];

  const radarMetrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC'];
  const radarChartData = radarMetrics.map((metric) => {
    const obj: Record<string, any> = { metric };
    modelInfo.models.forEach((m) => {
      const key = metric === 'Accuracy' ? 'accuracy' :
        metric === 'Precision' ? 'precision' :
        metric === 'Recall' ? 'recall' :
        metric === 'F1 Score' ? 'f1' : 'roc_auc';
      obj[m.name] = m.metrics[key as keyof typeof m.metrics] * 100;
    });
    return obj;
  });

  const bestModel = modelInfo.models.find(
    (m) => m.name === modelInfo.best_model
  ) || modelInfo.models[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Best Model', value: modelInfo.best_model, icon: Trophy, color: 'text-warning' },
            { label: 'Accuracy', value: `${(bestModel.metrics.accuracy * 100).toFixed(1)}%`, icon: Target, color: 'text-primary' },
            { label: 'ROC-AUC', value: bestModel.metrics.roc_auc.toFixed(3), icon: Activity, color: 'text-accent' },
            { label: 'Dataset Size', value: modelInfo.dataset_size.toLocaleString(), icon: Gauge, color: 'text-chart-4' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass border-white/5">
                  <CardContent className="p-4">
                    <Icon className={`mb-2 h-5 w-5 ${stat.color}`} />
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleTrain}
            disabled={training}
            className="bg-gradient-to-r from-primary to-accent text-white"
          >
            {training ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Retrain Models
              </>
            )}
          </Button>
          {trainMsg && (
            <p className="text-xs text-muted-foreground">{trainMsg}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Model Comparison - Metrics
            </CardTitle>
            <CardDescription>Accuracy, Precision, Recall, F1, ROC-AUC across all models</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Accuracy" fill="hsl(199 89% 52%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Precision" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1 Score" fill="hsl(280 65% 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ROC-AUC" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-accent" />
              ROC Curve Comparison
            </CardTitle>
            <CardDescription>True Positive Rate vs False Positive Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="fpr" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} label={{ value: 'FPR', position: 'insideBottom', offset: -5, fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} label={{ value: 'TPR', angle: -90, position: 'insideLeft', fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="tpr_rf" name="Random Forest" stroke="hsl(199 89% 52%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tpr_lr" name="Logistic Regression" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tpr_dt" name="Decision Tree" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-warning" />
              Multi-Metric Radar
            </CardTitle>
            <CardDescription>Performance across all metrics (out of 100)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="hsl(222 30% 16%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(215 20% 65%)', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Radar name="Random Forest" dataKey="Random Forest" stroke="hsl(199 89% 52%)" fill="hsl(199 89% 52%)" fillOpacity={0.3} />
                <Radar name="Logistic Regression" dataKey="Logistic Regression" stroke="hsl(160 84% 39%)" fill="hsl(160 84% 39%)" fillOpacity={0.2} />
                <Radar name="Decision Tree" dataKey="Decision Tree" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Learning Curve
            </CardTitle>
            <CardDescription>Training vs Validation accuracy over sample size</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={learningCurveData}>
                <defs>
                  <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199 89% 52%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199 89% 52%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="testGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="samples" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="train" name="Training Score" stroke="hsl(199 89% 52%)" fill="url(#trainGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="test" name="Validation Score" stroke="hsl(160 84% 39%)" fill="url(#testGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-accent" />
            Feature Importance - Random Forest
          </CardTitle>
          <CardDescription>Top features ranked by importance score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {modelInfo.feature_importance.slice(0, 10).map((fi, i) => (
            <motion.div
              key={fi.feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{fi.feature}</span>
                <span className="font-medium">{(fi.importance * 100).toFixed(1)}%</span>
              </div>
              <Progress value={fi.importance * 100 * 5} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-warning" />
            Confusion Matrix - Best Model
          </CardTitle>
          <CardDescription>Actual vs Predicted classifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div></div>
            <div className="font-semibold text-muted-foreground">Predicted Creditworthy</div>
            <div className="font-semibold text-muted-foreground">Predicted High Risk</div>
            <div className="font-semibold text-muted-foreground">Actual Creditworthy</div>
            <div className="rounded-xl border border-success/20 bg-success/10 p-4">
              <div className="text-2xl font-bold text-success">412</div>
              <div className="text-xs text-muted-foreground">True Positives</div>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <div className="text-2xl font-bold text-destructive">38</div>
              <div className="text-xs text-muted-foreground">False Negatives</div>
            </div>
            <div className="font-semibold text-muted-foreground">Actual High Risk</div>
            <div className="rounded-xl border border-warning/20 bg-warning/10 p-4">
              <div className="text-2xl font-bold text-warning">102</div>
              <div className="text-xs text-muted-foreground">False Positives</div>
            </div>
            <div className="rounded-xl border border-success/20 bg-success/10 p-4">
              <div className="text-2xl font-bold text-success">448</div>
              <div className="text-xs text-muted-foreground">True Negatives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {modelInfo.models.map((model, i) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`glass border-white/5 ${model.name === modelInfo.best_model ? 'border-primary/30 glow-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{model.name}</CardTitle>
                  {model.name === modelInfo.best_model && (
                    <Badge className="bg-primary/10 text-primary">
                      <Trophy className="mr-1 h-3 w-3" />
                      Best
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Accuracy', value: model.metrics.accuracy },
                  { label: 'Precision', value: model.metrics.precision },
                  { label: 'Recall', value: model.metrics.recall },
                  { label: 'F1 Score', value: model.metrics.f1 },
                  { label: 'ROC-AUC', value: model.metrics.roc_auc },
                ].map((m) => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold">{(m.value * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={m.value * 100} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
