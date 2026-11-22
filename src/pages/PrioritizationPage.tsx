import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ScrollArea } from '../components/ui/ScrollArea';
import { ANALYSIS_RESULT } from '../lib/analysis';
import { generateRecommendations } from '../lib/analysis';
import { formatNumber, formatCurrency, getThemeColor, getPriorityColor } from '../lib/utils';
import { AlertTriangle, Target, CheckCircle, ArrowRight, Zap, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';

const recommendations = generateRecommendations(ANALYSIS_RESULT.opportunities);
type Recommendation = typeof recommendations[number];

export function PrioritizationPage() {
  const highPriority = recommendations.filter(r => r.priority === 'high');
  const investigate = recommendations.filter(r => r.priority === 'investigate');
  const lowPriority = recommendations.filter(r => r.priority === 'low');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Prioritization & Recommendations</h1>
          <p className="text-secondary-500 text-sm mt-1">PM-ready recommendations with rationale and next steps</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary-50 text-primary-700">
            {highPriority.length} High Priority
          </Badge>
          <Badge variant="outline" className="bg-warning-50 text-warning-700">
            {investigate.length} Investigate
          </Badge>
          <Badge variant="outline" className="bg-success-50 text-success-700">
            {lowPriority.length} Low Priority
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PriorityColumn
          title="🔴 High Priority"
          subtitle="Do Now — High Impact × High Frequency"
          color="danger"
          icon={AlertTriangle}
          recommendations={highPriority}
        />
        <PriorityColumn
          title="🟡 Investigate"
          subtitle="Deep Dive — High Impact or High Frequency"
          color="warning"
          icon={Target}
          recommendations={investigate}
        />
        <PriorityColumn
          title="🟢 Low Priority"
          subtitle="Defer or Quick Wins"
          color="success"
          icon={CheckCircle}
          recommendations={lowPriority}
        />
      </div>

      <Tabs defaultValue="roadmap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roadmap">Suggested Roadmap</TabsTrigger>
          <TabsTrigger value="rice">RICE Scores</TabsTrigger>
          <TabsTrigger value="decisions">Decision Log</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Roadmap Recommendation</CardTitle>
              <CardDescription>Suggested sequencing based on priority, effort, and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <RoadmapView recommendations={recommendations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rice">
          <Card>
            <CardHeader>
              <CardTitle>RICE Prioritization Framework</CardTitle>
              <CardDescription>Reach × Impact × Confidence ÷ Effort scoring</CardDescription>
            </CardHeader>
            <CardContent>
              <RiceTable recommendations={recommendations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Product Decision Log</CardTitle>
              <CardDescription>Track decisions, rationale, and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <DecisionLog recommendations={recommendations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PriorityColumn({ title, subtitle, color, icon: Icon, recommendations }: { 
  title: string; 
  subtitle: string; 
  color: string; 
  icon: React.ComponentType<{ className?: string }>;
  recommendations: Recommendation[];
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', `bg-${color}-100 text-${color}-600`)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3">
        {recommendations.length === 0 ? (
          <div className="empty-state py-8">
            <p className="text-sm text-secondary-500">No recommendations in this category</p>
          </div>
        ) : (
          recommendations.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} color={color} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ rec, color }: { rec: Recommendation; color: string }) {
  return (
    <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-100 hover:border-secondary-200 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-secondary-900 mb-1">{rec.title}</h4>
          <p className="text-xs text-secondary-600 line-clamp-2 mb-2">{rec.rationale}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" size="sm" className={cn(
              rec.estimatedEffort === 'high' && 'bg-danger-50 text-danger-700',
              rec.estimatedEffort === 'medium' && 'bg-warning-50 text-warning-700',
              rec.estimatedEffort === 'low' && 'bg-success-50 text-success-700'
            )}>
              Effort: {rec.estimatedEffort}
            </Badge>
            <Badge variant="outline" size="sm" className="bg-primary-50 text-primary-700">
              {rec.relatedOpportunities.length} related
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-secondary-200">
        <p className="text-xs font-medium text-secondary-700 mb-1">Next Steps:</p>
        <ul className="text-xs text-secondary-600 space-y-1">
          {rec.nextSteps.slice(0, 2).map((step, i) => (
            <li key={i} className="flex items-start gap-1">
              <ArrowRight className="h-3 w-3 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoadmapView({ recommendations }: { recommendations: Recommendation[] }) {
  const quarters = [
    { label: 'Q1', items: recommendations.filter(r => r.priority === 'high').slice(0, 3) },
    { label: 'Q2', items: recommendations.filter(r => r.priority === 'investigate').slice(0, 3) },
    { label: 'Q3', items: recommendations.filter(r => r.priority === 'high').slice(3, 6) },
    { label: 'Q4', items: recommendations.filter(r => r.priority === 'investigate').slice(3, 6) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quarters.map(q => (
        <Card key={q.label} variant="hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{q.label}</CardTitle>
              <Badge variant="outline" className="bg-primary-50 text-primary-700">{q.items.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {q.items.length === 0 ? (
              <p className="text-sm text-secondary-500 text-center py-4">No items scheduled</p>
            ) : (
              q.items.map((rec, i) => (
                <div key={rec.id} className="p-3 bg-secondary-50 rounded-lg border-l-4 border-primary-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-secondary-400">{i + 1}.</span>
                    <Badge variant="outline" size="sm" className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' && 'High'}
                      {rec.priority === 'investigate' && 'Investigate'}
                      {rec.priority === 'low' && 'Low'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-secondary-900">{rec.title}</p>
                  <p className="text-xs text-secondary-500">Effort: {rec.estimatedEffort}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RiceTable({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <ScrollArea className="max-h-96">
      <table className="table">
        <thead>
          <tr>
            <th>Opportunity</th>
            <th>Reach</th>
            <th>Impact</th>
            <th>Confidence</th>
            <th>Effort</th>
            <th>RICE Score</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((rec, index) => {
            const opp = ANALYSIS_RESULT.opportunities.find(o => o.id === rec.opportunityId);
            const reach = opp?.affectedCustomers || 0;
            const impact = opp?.impactScore || 5;
            const confidence = Math.round((opp?.confidence || 0.7) * 100);
            const effort = rec.estimatedEffort === 'high' ? 10 : rec.estimatedEffort === 'medium' ? 5 : 2;
            const rice = Math.round((reach * impact * confidence) / effort);
            
            return (
              <tr key={rec.id}>
                <td className="font-medium text-secondary-900 max-w-xs truncate">{rec.title}</td>
                <td className="font-mono">{reach}</td>
                <td className="font-mono">{impact}/10</td>
                <td className="font-mono">{confidence}%</td>
                <td>
                  <Badge variant="outline" className={cn(
                    rec.estimatedEffort === 'high' && 'bg-danger-50 text-danger-700',
                    rec.estimatedEffort === 'medium' && 'bg-warning-50 text-warning-700',
                    rec.estimatedEffort === 'low' && 'bg-success-50 text-success-700'
                  )}>
                    {rec.estimatedEffort} ({effort})
                  </Badge>
                </td>
                <td className="font-bold text-primary-600">{formatNumber(rice)}</td>
                <td>
                  <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' && '🔴 High'}
                    {rec.priority === 'investigate' && '🟡 Investigate'}
                    {rec.priority === 'low' && '🟢 Low'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollArea>
  );
}

function DecisionLog({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-4">
      {recommendations.slice(0, 10).map((rec, index) => (
        <Card key={rec.id} variant="hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' && '🔴 Decide: Proceed'}
                    {rec.priority === 'investigate' && '🟡 Decide: Investigate'}
                    {rec.priority === 'low' && '🟢 Decide: Defer'}
                  </Badge>
                  <span className="text-sm text-secondary-500">Decision #{index + 1}</span>
                  <span className="text-sm text-secondary-500">•</span>
                  <span className="text-sm text-secondary-500">{new Date().toLocaleDateString()}</span>
                </div>
                <h4 className="font-medium text-secondary-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-secondary-600 mb-3">{rec.rationale}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" size="sm" className="bg-primary-50 text-primary-700">
                    Effort: {rec.estimatedEffort}
                  </Badge>
                  <Badge variant="outline" size="sm" className="bg-warning-50 text-warning-700">
                    Confidence: {Math.round((ANALYSIS_RESULT.opportunities.find(o => o.id === rec.opportunityId)?.confidence || 0.7) * 100)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Approve</Button>
                <Button variant="ghost" size="sm">Defer</Button>
                <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700">Reject</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}