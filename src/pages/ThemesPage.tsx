import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { ScrollArea } from '../components/ui/ScrollArea';
import { ANALYSIS_RESULT } from '../lib/analysis';
import { THEME_LABELS, THEME_COLORS } from '../types';
import { formatNumber, formatCurrency, formatDate, getThemeColor, getPriorityColor } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, TrendingUp, TrendingDown, MessageSquare, AlertTriangle, Target } from 'lucide-react';

export function ThemesPage() {
  const { clusters } = ANALYSIS_RESULT;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Theme Clustering</h1>
        <p className="text-secondary-500 text-sm mt-1">AI-automated grouping of feedback into thematic categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Theme Overview</CardTitle>
            <CardDescription>All themes ranked by feedback volume and business impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clusters.map((cluster, index) => (
                <ThemeCard key={cluster.theme} cluster={cluster} rank={index + 1} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Volume</CardTitle>
            <CardDescription>Feedback count by theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ position: 'relative', height: '320px' }}>
              <ThemeVolumeChart data={clusters} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pain-points" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
          <TabsTrigger value="quotes">Customer Quotes</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="pain-points">
          <Card>
            <CardHeader>
              <CardTitle>Top Pain Points by Theme</CardTitle>
              <CardDescription>Most frequently mentioned issues with severity</CardDescription>
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
                      <th>Related Themes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusters.flatMap(c => c.topPainPoints).map(pp => (
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
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {pp.relatedThemes.map(t => (
                              <Badge key={t} variant="outline" size="sm" className={getThemeColor(t)}>
                                {THEME_LABELS[t]}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map(cluster => (
              <Card key={cluster.theme} variant="hover">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getThemeColor(cluster.theme)}>
                      {THEME_LABELS[cluster.theme]}
                    </Badge>
                    <span className="text-sm text-secondary-500">{cluster.representativeQuotes.length} quotes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cluster.representativeQuotes.map((quote, i) => (
                    <div key={i} className="p-3 bg-secondary-50 rounded-lg border-l-4 border-primary-500">
                      <p className="text-sm text-secondary-700 italic">"{quote.slice(0, 200)}..."</p>
                    </div>
                  ))}
                  {cluster.representativeQuotes.length === 0 && (
                    <p className="text-sm text-secondary-500 text-center py-4">No negative quotes for this theme</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Theme Trends</CardTitle>
              <CardDescription>Feedback volume trend over time by theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clusters.map(cluster => (
                  <div key={cluster.theme} className="p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getThemeColor(cluster.theme)}>
                          {THEME_LABELS[cluster.theme]}
                        </Badge>
                        <span className="text-sm font-medium text-secondary-900">
                          {cluster.feedbackCount} items • {cluster.affectedCustomers} customers
                        </span>
                      </div>
                      <Badge variant="outline" className={cn(
                        cluster.trend === 'increasing' && 'bg-danger-50 text-danger-700',
                        cluster.trend === 'stable' && 'bg-warning-50 text-warning-700',
                        cluster.trend === 'decreasing' && 'bg-success-50 text-success-700'
                      )}>
                        {cluster.trend === 'increasing' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {cluster.trend === 'decreasing' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {cluster.trend.charAt(0).toUpperCase() + cluster.trend.slice(1)}
                      </Badge>
                    </div>
                    <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-500"
                        style={{ width: `${cluster.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-secondary-500 mt-1">
                      <span>Sentiment: {cluster.avgSentimentScore.toFixed(2)}</span>
                      <span>MRR at risk: {formatCurrency(cluster.revenueImpact).replace('$', '')}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ThemeCard({ cluster, rank }: { cluster: typeof ANALYSIS_RESULT.clusters[number]; rank: number }) {
  return (
    <Card variant="hover" className="relative">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-secondary-300 bg-secondary-100">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={getThemeColor(cluster.theme)}>
              {THEME_LABELS[cluster.theme]}
            </Badge>
            <span className="text-sm text-secondary-500">{cluster.percentage}% of feedback</span>
            <Badge variant="outline" className={cn(
              cluster.trend === 'increasing' && 'bg-danger-50 text-danger-700',
              cluster.trend === 'stable' && 'bg-warning-50 text-warning-700',
              cluster.trend === 'decreasing' && 'bg-success-50 text-success-700'
            )}>
              {cluster.trend === 'increasing' && <TrendingUp className="h-3 w-3 mr-1" />}
              {cluster.trend === 'decreasing' && <TrendingDown className="h-3 w-3 mr-1" />}
              {cluster.trend}
            </Badge>
          </div>
          <p className="text-sm text-secondary-600 mb-3">{cluster.description}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-secondary-500">Feedback Items</p>
              <p className="font-bold text-secondary-900">{cluster.feedbackCount}</p>
            </div>
            <div>
              <p className="text-secondary-500">Affected Customers</p>
              <p className="font-bold text-secondary-900">{cluster.affectedCustomers}</p>
            </div>
            <div>
              <p className="text-secondary-500">MRR at Risk</p>
              <p className="font-bold text-warning-600">{formatCurrency(cluster.revenueImpact).replace('$', '')}K</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-secondary-500 text-sm">Avg Sentiment</p>
            <p className={cn('font-bold', cluster.avgSentimentScore < 0 ? 'text-danger-600' : 'text-success-600')}>
              {cluster.avgSentimentScore.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {cluster.topPainPoints.slice(0, 3).map(pp => (
              <Badge key={pp.id} variant="outline" size="sm" className={cn(
                pp.severity === 'critical' && 'bg-danger-50 text-danger-700',
                pp.severity === 'high' && 'bg-danger-50 text-danger-700',
                pp.severity === 'medium' && 'bg-warning-50 text-warning-700',
                pp.severity === 'low' && 'bg-secondary-50 text-secondary-700'
              )}>
                {pp.title}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ThemeVolumeChart({ data }: { data: typeof ANALYSIS_RESULT.clusters }) {
  const chartData = data
    .sort((a, b) => b.feedbackCount - a.feedbackCount)
    .map(d => ({ name: THEME_LABELS[d.theme], value: d.feedbackCount, color: getThemeColor(d.theme).replace('bg-', '').replace(' text-', '') }));

  const COLORS = {
    primary: '#0ea5e9',
    secondary: '#64748b',
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} width={140} />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          formatter={(value: number) => [value, 'feedback items']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={32}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.color as keyof typeof COLORS] || '#0ea5e9'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}