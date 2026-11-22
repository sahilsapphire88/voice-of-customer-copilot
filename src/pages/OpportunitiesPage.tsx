import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ScrollArea } from '../components/ui/ScrollArea';
import { ANALYSIS_RESULT } from '../lib/analysis';
import { THEME_LABELS } from '../types';
import { formatNumber, formatCurrency, getThemeColor, getPriorityColor } from '../lib/utils';
import { AlertTriangle, Target, TrendingUp, Users, DollarSign, Lightbulb, Zap } from 'lucide-react';

export function OpportunitiesPage() {
  const { opportunities } = ANALYSIS_RESULT;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Opportunity Analysis</h1>
        <p className="text-secondary-500 text-sm mt-1">Prioritized product opportunities based on impact × frequency analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Opportunities" value={opportunities.length} icon={Lightbulb} color="primary" />
        <StatCard title="High Priority" value={opportunities.filter(o => o.priority === 'high').length} icon={AlertTriangle} color="danger" />
        <StatCard title="Investigate" value={opportunities.filter(o => o.priority === 'investigate').length} icon={Target} color="warning" />
        <StatCard title="Total MRR at Risk" value={formatCurrency(opportunities.reduce((s, o) => s + o.affectedRevenue, 0)).replace('$', '') + 'K'} icon={DollarSign} color="warning" />
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="matrix">Impact × Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[600px]">
                <table className="table">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="w-8">#</th>
                      <th>Opportunity</th>
                      <th>Theme</th>
                      <th>Priority</th>
                      <th>Frequency</th>
                      <th>Impact</th>
                      <th>Score</th>
                      <th>Customers</th>
                      <th>Revenue</th>
                      <th>Effort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map((opp, index) => (
                      <tr key={opp.id}>
                        <td className="text-secondary-500 font-mono">{index + 1}</td>
                        <td className="font-medium text-secondary-900 max-w-xs truncate">{opp.problem}</td>
                        <td><Badge variant="outline" className={getThemeColor(opp.theme)}>{THEME_LABELS[opp.theme]}</Badge></td>
                        <td>
                          <Badge variant="outline" className={getPriorityColor(opp.priority)}>
                            {opp.priority === 'high' && '🔴 High'}
                            {opp.priority === 'investigate' && '🟡 Investigate'}
                            {opp.priority === 'low' && '🟢 Low'}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-secondary-100 rounded-full flex-1 max-w-24 overflow-hidden">
                              <div className="h-full bg-primary-600" style={{ width: `${opp.frequencyScore * 10}%` }} />
                            </div>
                            <span className="text-sm font-mono text-secondary-700">{opp.frequencyScore}/10</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-secondary-100 rounded-full flex-1 max-w-24 overflow-hidden">
                              <div className="h-full bg-danger-600" style={{ width: `${opp.impactScore * 10}%` }} />
                            </div>
                            <span className="text-sm font-mono text-secondary-700">{opp.impactScore}/10</span>
                          </div>
                        </td>
                        <td className="font-bold text-primary-600">{opp.opportunityScore}</td>
                        <td>{opp.affectedCustomers}</td>
                        <td className="font-medium text-warning-600">{formatCurrency(opp.affectedRevenue).replace('$', '')}K</td>
                        <td>
                          <Badge variant="outline" className={cn(
                            opp.effort === 'high' && 'bg-danger-50 text-danger-700',
                            opp.effort === 'medium' && 'bg-warning-50 text-warning-700',
                            opp.effort === 'low' && 'bg-success-50 text-success-700'
                          )}>
                            {opp.effort}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp, index) => (
              <OpportunityCard key={opp.id} opp={opp} rank={index + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Impact × Frequency Matrix</CardTitle>
              <CardDescription>Visual prioritization framework — top-right quadrant = highest priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96" style={{ position: 'relative', height: '384px' }}>
                <PrioritizationMatrix opportunities={opportunities} />
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <QuadrantLabel quadrant="high_impact_high_freq" label="🔴 Do Now" description="High Impact, High Frequency" color="danger" />
                <QuadrantLabel quadrant="high_impact_low_freq" label="🟡 Investigate" description="High Impact, Low Frequency" color="warning" />
                <QuadrantLabel quadrant="low_impact_high_freq" label="🟢 Quick Wins" description="Low Impact, High Frequency" color="success" />
                <QuadrantLabel quadrant="low_impact_low_freq" label="⚪ Defer" description="Low Impact, Low Frequency" color="secondary" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <Card className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-value text-3xl font-bold text-secondary-900">{value}</p>
          <p className="text-sm text-secondary-500 mt-1">{title}</p>
        </div>
        <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', `bg-${color}-100 text-${color}-600`)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function OpportunityCard({ opp, rank }: { opp: typeof ANALYSIS_RESULT.opportunities[number]; rank: number }) {
  return (
    <Card variant="hover" className="relative">
      <div className="absolute top-3 right-3">
        <Badge variant="outline" className={getPriorityColor(opp.priority)}>
          {opp.priority === 'high' && '🔴 High'}
          {opp.priority === 'investigate' && '🟡 Investigate'}
          {opp.priority === 'low' && '🟢 Low'}
        </Badge>
      </div>
      <div className="pr-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-secondary-400 font-mono text-lg">#{rank}</span>
          <Badge variant="outline" className={getThemeColor(opp.theme)}>{THEME_LABELS[opp.theme]}</Badge>
        </div>
        <h4 className="font-medium text-secondary-900 mb-2">{opp.problem}</h4>
        <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{opp.rationale}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-secondary-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{opp.opportunityScore}</p>
            <p className="text-xs text-secondary-500">Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">{opp.frequencyScore}/10</p>
            <p className="text-xs text-secondary-500">Frequency</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-600">{opp.impactScore}/10</p>
            <p className="text-xs text-secondary-500">Impact</p>
          </div>
        </div>

        <div className="space-y-1 text-xs text-secondary-500">
          <div className="flex justify-between">
            <span>Customers:</span>
            <span className="font-medium text-secondary-900">{opp.affectedCustomers}</span>
          </div>
          <div className="flex justify-between">
            <span>Revenue:</span>
            <span className="font-medium text-warning-600">{formatCurrency(opp.affectedRevenue).replace('$', '')}K</span>
          </div>
          <div className="flex justify-between">
            <span>Effort:</span>
            <span className="font-medium capitalize">{opp.effort}</span>
          </div>
          <div className="flex justify-between">
            <span>Confidence:</span>
            <span className="font-medium">{Math.round(opp.confidence * 100)}%</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-secondary-100">
          <p className="text-xs font-medium text-secondary-700 mb-1">Suggested Actions:</p>
          <ul className="text-xs text-secondary-600 space-y-1">
            {opp.suggestedActions.slice(0, 3).map((action, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-primary-600">→</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function QuadrantLabel({ label, description, color }: { quadrant: string; label: string; description: string; color: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary-50">
      <p className="font-medium text-secondary-900">{label}</p>
      <p className="text-xs text-secondary-500">{description}</p>
    </div>
  );
}

function PrioritizationMatrix({ opportunities }: { opportunities: typeof ANALYSIS_RESULT.opportunities }) {
  const { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = require('recharts');

  const chartData = opportunities.map(opp => ({
    x: opp.frequencyScore,
    y: opp.impactScore,
    name: opp.problem.length > 30 ? opp.problem.slice(0, 30) + '...' : opp.problem,
    theme: THEME_LABELS[opp.theme],
    priority: opp.priority,
    score: opp.opportunityScore,
    color: opp.priority === 'high' ? '#ef4444' : opp.priority === 'investigate' ? '#f59e0b' : '#22c55e',
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          domain={[0, 11]}
          name="Frequency Score"
          nameOffset={15}
          namePosition="bottom"
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <YAxis
          type="number"
          domain={[0, 11]}
          name="Impact Score"
          nameOffset={-10}
          namePosition="left"
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          formatter={(value: number, name: string) => [value, name === 'x' ? 'Frequency' : 'Impact']}
          labelFormatter={(value: number) => `Score: ${value}`}
        />
        <Scatter
          name="Opportunities"
          data={chartData}
          fill="#8884d8"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} r={8} />
          ))}
        </Scatter>
        <line x1={0} y1={5.5} x2={11} y2={5.5} stroke="#e2e8f0" strokeDasharray="5 5" />
        <line x1={5.5} y1={0} x2={5.5} y2={11} stroke="#e2e8f0" strokeDasharray="5 5" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}