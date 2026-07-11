import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  PieChart as PieChartIcon,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ScatterChart as ScatterIcon,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const tooltipStyle = {
  backgroundColor: 'hsl(222 40% 9%)',
  border: '1px solid hsl(222 30% 16%)',
  borderRadius: '8px',
  color: 'hsl(210 40% 96%)',
  fontSize: '12px',
};

const classDistribution = [
  { name: 'Creditworthy', value: 700, fill: 'hsl(142 71% 45%)' },
  { name: 'High Risk', value: 300, fill: 'hsl(0 72% 51%)' },
];

const incomeDistribution = [
  { range: '0-25k', count: 120, approved: 45 },
  { range: '25-50k', count: 250, approved: 130 },
  { range: '50-75k', count: 280, approved: 200 },
  { range: '75-100k', count: 200, approved: 165 },
  { range: '100-150k', count: 100, approved: 90 },
  { range: '150k+', count: 50, approved: 48 },
];

const ageDistribution = [
  { range: '18-25', count: 80, risk: 65 },
  { range: '26-35', count: 250, risk: 35 },
  { range: '36-45', count: 280, risk: 25 },
  { range: '46-55', count: 220, risk: 28 },
  { range: '56-65', count: 120, risk: 22 },
  { range: '65+', count: 50, risk: 30 },
];

const correlationData = [
  { x: 30, y: 0.65, z: 200 },
  { x: 45, y: 0.72, z: 180 },
  { x: 55, y: 0.78, z: 220 },
  { x: 65, y: 0.82, z: 250 },
  { x: 75, y: 0.88, z: 200 },
  { x: 85, y: 0.91, z: 180 },
  { x: 40, y: 0.55, z: 150 },
  { x: 50, y: 0.68, z: 170 },
  { x: 60, y: 0.75, z: 190 },
  { x: 70, y: 0.85, z: 210 },
  { x: 80, y: 0.89, z: 160 },
  { x: 90, y: 0.93, z: 140 },
];

const riskGauge = [
  { name: 'Low Risk', value: 70, fill: 'hsl(142 71% 45%)' },
  { name: 'Medium Risk', value: 20, fill: 'hsl(38 92% 50%)' },
  { name: 'High Risk', value: 10, fill: 'hsl(0 72% 51%)' },
];

const employmentStats = [
  { status: 'Employed', count: 550, approval: 85 },
  { status: 'Self-Employed', count: 180, approval: 72 },
  { status: 'Retired', count: 120, approval: 68 },
  { status: 'Student', count: 80, approval: 35 },
  { status: 'Unemployed', count: 70, approval: 15 },
];

const loanPurposeStats = [
  { purpose: 'Home', count: 200, avgAmount: 180000 },
  { purpose: 'Car', count: 180, avgAmount: 28000 },
  { purpose: 'Education', count: 150, avgAmount: 35000 },
  { purpose: 'Business', count: 130, avgAmount: 75000 },
  { purpose: 'Personal', count: 140, avgAmount: 15000 },
  { purpose: 'Debt Consol.', count: 120, avgAmount: 22000 },
  { purpose: 'Medical', count: 80, avgAmount: 18000 },
];

const heatmapData = [
  { feature: 'Income', credit_score: 0.72, debt_ratio: -0.68, payment_hist: 0.45, credit_util: -0.52, savings: 0.61 },
  { feature: 'Debt Ratio', credit_score: -0.68, debt_ratio: 1.0, payment_hist: -0.42, credit_util: 0.58, savings: -0.55 },
  { feature: 'Payment Hist', credit_score: 0.65, debt_ratio: -0.42, payment_hist: 1.0, credit_util: -0.38, savings: 0.35 },
  { feature: 'Credit Util', credit_score: -0.52, debt_ratio: 0.58, payment_hist: -0.38, credit_util: 1.0, savings: -0.41 },
  { feature: 'Savings', credit_score: 0.61, debt_ratio: -0.55, payment_hist: 0.35, credit_util: -0.41, savings: 1.0 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Records', value: '1,000', icon: Users, color: 'text-primary' },
          { label: 'Approval Rate', value: '70%', icon: TrendingUp, color: 'text-success' },
          { label: 'Avg. Income', value: '$62.5k', icon: DollarSign, color: 'text-accent' },
          { label: 'Avg. Credit Score', value: '698', icon: Target, color: 'text-warning' },
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Class Distribution
            </CardTitle>
            <CardDescription>Creditworthy vs High Risk applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {classDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-accent" />
              Income Distribution
            </CardTitle>
            <CardDescription>Applicant count and approval rate by income range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={incomeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="range" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="count" name="Total" fill="hsl(199 89% 52%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-warning" />
              Age Distribution & Risk
            </CardTitle>
            <CardDescription>Applicant count and risk percentage by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="range" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="count" name="Count" fill="hsl(280 65% 60%)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="risk" name="Risk %" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ScatterIcon className="h-4 w-4 text-chart-4" />
              Credit Score vs DTI Ratio
            </CardTitle>
            <CardDescription>Correlation between credit score and debt-to-income</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis type="number" dataKey="x" name="DTI" unit="%" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Score" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <ZAxis type="number" dataKey="z" range={[60, 200]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={correlationData} fill="hsl(199 89% 52%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Employment Status Analysis
            </CardTitle>
            <CardDescription>Approval rate by employment status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={employmentStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis type="number" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
                <YAxis dataKey="status" type="category" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="count" name="Total Applicants" fill="hsl(199 89% 52%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="approval" name="Approval %" fill="hsl(160 84% 39%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-accent" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Overall risk level breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={riskGauge} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={6} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-warning" />
            Loan Purpose Statistics
          </CardTitle>
          <CardDescription>Average loan amount by purpose category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={loanPurposeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="purpose" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="count" name="Count" fill="hsl(199 89% 52%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgAmount" name="Avg Amount ($)" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-chart-4" />
            Feature Correlation Heatmap
          </CardTitle>
          <CardDescription>Correlation strength between key financial features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left text-muted-foreground">Feature</th>
                  <th className="p-2 text-center text-muted-foreground">Credit Score</th>
                  <th className="p-2 text-center text-muted-foreground">Debt Ratio</th>
                  <th className="p-2 text-center text-muted-foreground">Payment Hist</th>
                  <th className="p-2 text-center text-muted-foreground">Credit Util</th>
                  <th className="p-2 text-center text-muted-foreground">Savings</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.feature} className="border-t border-white/5">
                    <td className="p-2 font-medium">{row.feature}</td>
                    {(['credit_score', 'debt_ratio', 'payment_hist', 'credit_util', 'savings'] as const).map((col) => {
                      const val = row[col];
                      const intensity = Math.abs(val);
                      const color = val >= 0
                        ? `rgba(142, 71%, 45%, ${intensity})`
                        : `rgba(0, 72%, 51%, ${intensity})`;
                      return (
                        <td key={col} className="p-2 text-center">
                          <div
                            className="mx-auto inline-flex h-10 w-16 items-center justify-center rounded-lg text-xs font-semibold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Positive Correlation</Badge>
            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Negative Correlation</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
