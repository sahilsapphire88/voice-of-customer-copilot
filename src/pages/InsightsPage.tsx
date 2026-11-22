import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { Separator } from '../components/ui/Separator';
import { ANALYSIS_RESULT } from '../lib/analysis';
import { THEME_LABELS, SENTIMENT_LABELS } from '../types';
import { formatNumber, formatCurrency, formatDate, getThemeColor, getPriorityColor } from '../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Users, DollarSign, Target } from 'lucide-react';
import { ALL_DEMO_FEEDBACK } from '../data/demoFeedback';

export function InsightsPage() {
  const { clusters, metrics } = ANALYSIS_RESULT;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">AI Insights Dashboard</h1>
        <p className="text-secondary-500 text-sm mt-1">Automated analysis of customer feedback patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Top Pain Points"
          value={clusters.flatMap(c => c.topPainPoints).length}
          icon={AlertTriangle}
          color="danger"
          description="Across all themes"
        />
        <StatCard
          title="Feedback Themes"
          value={clusters.length}
          icon={Target}
          color="primary"
          description="Auto-clustered"
        />
        <StatCard
          title="Sentiment Score"
          value={metrics.avgSentiment.toFixed(2)}
          icon={metrics.avgSentiment > 0 ? TrendingUp : TrendingDown}
          color={metrics.avgSentiment > 0 ? 'success' : 'danger'}
          description="Average across all feedback"
        />
        <StatCard
          title="Revenue at Risk"
          value={formatCurrency(clusters.reduce((sum, c) => sum + c.revenueImpact, 0)).replace('$', '') + 'K'}
          icon={DollarSign}
          color="warning"
          description="MRR exposure"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pain Points by Theme</CardTitle>
            <CardDescription>Frequency and severity of customer pain points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ position: 'relative', height: '320px' }}>
              <PainPointsChart clusters={clusters} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Sentiment Heatmap</CardTitle>
            <CardDescription>Average sentiment per theme (-1 to +1)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clusters.map(cluster => (
                <div key={cluster.theme} className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(getThemeColor(cluster.theme), 'w-32')}>
                    {THEME_LABELS[cluster.theme]}
                  </Badge>
                  <div className="flex-1 h-3 bg-secondary-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${((cluster.avgSentimentScore + 1) / 2) * 100}%`,
                        background: cluster.avgSentimentScore < 0
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : 'linear-gradient(90deg, #4ade80, #22c55e)',
                      }}
                    />
                    <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/50" />
                  </div>
                  <span className={cn(
                    'text-sm font-mono w-12 text-right',
                    cluster.avgSentimentScore < 0 ? 'text-danger-600' : 'text-success-600'
                  )}>
                    {cluster.avgSentimentScore.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Sources</CardTitle>
            <CardDescription>Volume by feedback channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" style={{ position: 'relative', height: '256px' }}>
              <SourcesChart data={metrics.sentimentDistribution} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Tier Breakdown</CardTitle>
            <CardDescription>Feedback distribution by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['enterprise', 'pro', 'free'] as const).map(tier => {
                const count = ALL_DEMO_FEEDBACK.filter(f => f.customerTier === tier).length;
                const customers = new Set(ALL_DEMO_FEEDBACK.filter(f => f.customerTier === tier).map(f => f.customerId)).size;
                return (
                  <div key={tier} className="flex items-center gap-3">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', 
                      tier === 'enterprise' ? 'bg-primary-100 text-primary-600' :
                      tier === 'pro' ? 'bg-success-100 text-success-600' :
                      'bg-secondary-100 text-secondary-600'
                    )}>
                      <span className="text-xs font-bold">{tier[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900 capitalize">{tier}</p>
                      <p className="text-xs text-secondary-500">{customers} customers • {count} feedback</p>
                    </div>
                    <Badge variant="outline" className="text-sm">{formatPercentage((count / ALL_DEMO_FEEDBACK.length) * 100)}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Pain Points Detail</CardTitle>
            <CardDescription>Most critical issues with evidence</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pain Point</th>
                    <th>Theme</th>
                    <th>Frequency</th>
                    <th>Severity</th>
                    <th>Customers</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {clusters.flatMap(c => c.topPainPoints).slice(0, 15).map(pp => (
                    <tr key={pp.id}>
                      <td className="font-medium text-secondary-900">{pp.title}</td>
                      <td><Badge variant="outline" className={getThemeColor(pp.theme)}>{THEME_LABELS[pp.theme]}</Badge></td>
                      <td>{pp.frequency}</td>
                      <td>
                        <Badge variant="outline" className={cn(
                          pp.severity === 'critical' && 'bg-danger-50 text-danger-700',
                          pp.severity === 'high' && 'bg-danger-50 text-danger-700',
                          pp.severity === 'medium' && 'bg-warning-50 text-warning-700',
                          pp.severity === 'low' && 'bg-secondary-50 text-secondary-700'
                        )}>
                          {pp.severity}
                        </Badge>
                      </td>
                      <td>{pp.affectedCustomers.length}</td>
                      <td className="max-w-xs truncate">{pp.evidence[0] || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics Summary</CardTitle>
            <CardDescription>Executive snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricRow label="Total Feedback Items" value={metrics.totalFeedback} icon={Users} />
            <MetricRow label="Unique Customers" value={metrics.uniqueCustomers} icon={Users} />
            <MetricRow label="NPS Score" value={metrics.npsScore} icon={Target} suffix="%" />
            <MetricRow label="Avg Sentiment" value={metrics.avgSentiment.toFixed(2)} icon={TrendingUp} />
            <MetricRow label="Negative Feedback" value={Object.entries(metrics.sentimentDistribution).filter(([k]) => k.includes('negative')).reduce((s, [, v]) => s + v, 0)} icon={AlertTriangle} color="danger" />
            <MetricRow label="Positive Feedback" value={Object.entries(metrics.sentimentDistribution).filter(([k]) => k.includes('positive')).reduce((s, [, v]) => s + v, 0)} icon={TrendingUp} color="success" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, description }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string; description: string }) {
  return (
    <Card className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{description}</p>
          <p className="stat-value text-3xl font-bold text-secondary-900">{value}</p>
          <p className="text-xs text-secondary-500 mt-1">{title}</p>
        </div>
        <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', `bg-${color}-100 text-${color}-600`)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function MetricRow({ label, value, icon: Icon, color = 'primary', suffix = '' }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color?: string; suffix?: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', `bg-${color}-100 text-${color}-600`)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-secondary-500">{label}</p>
        <p className="font-medium text-secondary-900">{value}{suffix}</p>
      </div>
    </div>
  );
}

function PainPointsChart({ clusters }: { clusters: typeof ANALYSIS_RESULT.clusters }) {
  const data = clusters.flatMap(c => 
    c.topPainPoints.slice(0, 3).map(pp => ({
      name: pp.title.length > 25 ? pp.title.slice(0, 25) + '...' : pp.title,
      frequency: pp.frequency,
      theme: THEME_LABELS[c.theme],
      color: getThemeColor(c.theme).replace('bg-', '').replace(' text-', ''),
    }))
  ).sort((a, b) => b.frequency - a.frequency).slice(0, 10);

  const COLORS = {
    primary: '#0ea5e9',
    secondary: '#64748b',
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} width={200} />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          formatter={(value: number) => [value, 'mentions']}
        />
        <Bar dataKey="frequency" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.color as keyof typeof COLORS] || '#0ea5e9'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function SourcesChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = {
    very_negative: '#ef4444',
    negative: '#f87171',
    neutral: '#94a3b8',
    positive: '#4ade80',
    very_positive: '#22c55e',
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          formatter={(value: number) => [value, 'feedback items']}
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}