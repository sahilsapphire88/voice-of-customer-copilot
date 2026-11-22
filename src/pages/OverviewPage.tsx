import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Separator } from '../components/ui/Separator';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  AlertTriangle,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ALL_DEMO_FEEDBACK } from '../data/demoFeedback';
import { ANALYSIS_RESULT } from '../lib/analysis';
import { formatNumber, formatCurrency, formatPercentage, getPriorityColor, getThemeColor } from '../lib/utils';
import { THEME_LABELS, SENTIMENT_LABELS } from '../types';

const METRIC_CARDS = [
  {
    title: 'Total Feedback',
    value: ALL_DEMO_FEEDBACK.length,
    icon: MessageSquare,
    trend: { value: '+12%', positive: true },
    description: 'Last 30 days',
    color: 'primary',
  },
  {
    title: 'Active Customers',
    value: new Set(ALL_DEMO_FEEDBACK.map(f => f.customerId)).size,
    icon: Users,
    trend: { value: '+3', positive: true },
    description: 'Providing feedback',
    color: 'success',
  },
  {
    title: 'Avg Sentiment',
    value: ANALYSIS_RESULT.metrics.avgSentiment.toFixed(2),
    icon: TrendingUp,
    trend: { value: '+0.15', positive: true },
    description: 'Improving',
    color: 'warning',
  },
  {
    title: 'NPS Score',
    value: ANALYSIS_RESULT.metrics.npsScore,
    icon: Target,
    trend: { value: '+8', positive: true },
    description: 'vs last quarter',
    color: 'danger',
  },
];

export function OverviewPage() {
  const clusters = ANALYSIS_RESULT.clusters;
  const recommendations = ANALYSIS_RESULT.recommendations;
  const metrics = ANALYSIS_RESULT.metrics;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Overview</h1>
          <p className="text-secondary-500 text-sm mt-1">Voice of Customer Copilot — Demo Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="animate-pulse-soft">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 flex h-2 w-2 rounded-full bg-primary-500 opacity-75"></span>
              <span className="relative flex h-2 w-2 rounded-full bg-primary-500"></span>
            </span>
            Live Demo Data
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((metric, index) => (
          <Card key={metric.title} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">{metric.description}</p>
                <p className="stat-value text-3xl font-bold text-secondary-900">{metric.value}</p>
                <div className="stat-trend">
                  {metric.trend.positive ? (
                    <TrendingUp className="h-4 w-4 stat-trend-positive" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-4 w-4 stat-trend-negative" aria-hidden="true" />
                  )}
                  <span className={metric.trend.positive ? 'stat-trend-positive' : 'stat-trend-negative'}>
                    {metric.trend.value}
                  </span>
                </div>
              </div>
              <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', `bg-${metric.color}-100 text-${metric.color}-600`)}>
                <metric.icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feedback Volume Trend (30 Days)</CardTitle>
                <CardDescription>Daily feedback submissions across all channels</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64" style={{ position: 'relative', height: '256px' }}>
              <FeedbackTrendChart data={metrics.feedbackTrend} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Overall customer sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" style={{ position: 'relative', height: '256px' }}>
              <SentimentChart data={metrics.sentimentDistribution} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Themes by Volume</CardTitle>
                <CardDescription>Most discussed themes across all feedback</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clusters.slice(0, 6).map((cluster, index) => (
                <div key={cluster.theme} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 text-center text-sm font-medium text-secondary-500">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getThemeColor(cluster.theme)}>
                        {THEME_LABELS[cluster.theme]}
                      </Badge>
                      <span className="text-sm font-medium text-secondary-900">{cluster.feedbackCount} items</span>
                      <span className="text-sm text-secondary-500">({cluster.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-secondary-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-primary-600 transition-all duration-500"
                        style={{ width: `${cluster.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">
                      ${formatCurrency(cluster.revenueImpact).replace('$', '')}K MRR
                    </p>
                    <p className="text-xs text-secondary-500">{cluster.affectedCustomers} customers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
            <CardDescription>Opportunities by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {([
                { label: 'High Priority', count: metrics.priorityBreakdown.high, color: 'danger', icon: AlertTriangle },
                { label: 'Investigate', count: metrics.priorityBreakdown.investigate, color: 'warning', icon: Target },
                { label: 'Low Priority', count: metrics.priorityBreakdown.low, color: 'success', icon: TrendingDown },
              ] as const).map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', `bg-${item.color}-100 text-${item.color}-600`)}>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{item.label}</p>
                    <p className="text-xs text-secondary-500">{item.count} opportunities</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-secondary-900">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Recommendations</CardTitle>
                <CardDescription>AI-generated priority actions based on impact × frequency analysis</CardDescription>
              </div>
<a href="/prioritization" className="text-xs text-primary-600 hover:text-primary-700 underline">View All →</a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec) => (
                <Card key={rec.id} variant="hover" className="relative">
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' && '🔴 High Priority'}
                      {rec.priority === 'investigate' && '🟡 Investigate'}
                      {rec.priority === 'low' && '🟢 Low Priority'}
                    </Badge>
                  </div>
                  <div className="pr-8">
                    <h4 className="font-medium text-secondary-900 mb-2">{rec.title}</h4>
                    <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{rec.rationale}</p>
                    <div className="flex items-center gap-4 text-xs text-secondary-500">
                      <span>Effort: <span className="font-medium capitalize">{rec.estimatedEffort}</span></span>
                      <span>Impact: <span className="font-medium">{rec.expectedImpact}</span></span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback Activity</CardTitle>
          <CardDescription>Latest customer feedback across all channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Feedback</th>
                  <th>Source</th>
                  <th>Themes</th>
                  <th>Sentiment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ALL_DEMO_FEEDBACK
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar fallback={item.customerName} size="xs" />
                          <div>
                            <p className="font-medium text-secondary-900">{item.customerName}</p>
                            <p className="text-xs text-secondary-500 capitalize">{item.customerTier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-xs truncate">{item.text}</td>
                      <td><Badge variant="outline" size="sm">{item.source.replace('_', ' ')}</Badge></td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {item.themes.slice(0, 2).map(t => (
                            <Badge key={t} variant="outline" size="sm" className={getThemeColor(t)}>
                              {THEME_LABELS[t]}
                            </Badge>
                          ))}
                          {item.themes.length > 2 && (
                            <Badge variant="outline" size="sm">+{item.themes.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline" size="sm" className={getPriorityColor(item.sentiment)}>
                          {SENTIMENT_LABELS[item.sentiment]}
                        </Badge>
                      </td>
                      <td className="text-secondary-500 text-sm">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackTrendChart({ data }: { data: { date: string; count: number }[] }) {
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = require('recharts');
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis type="category" dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} width={60} />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value: number) => [value, 'feedback items']}
        />
        <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SentimentChart({ data }: { data: Record<string, number> }) {
  const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = require('recharts');
  
  const COLORS = {
    very_negative: '#ef4444',
    negative: '#f87171',
    neutral: '#94a3b8',
    positive: '#4ade80',
    very_positive: '#22c55e',
  };
  
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}