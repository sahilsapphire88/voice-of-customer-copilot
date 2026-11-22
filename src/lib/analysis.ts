import type { FeedbackItem, FeedbackTheme, ThemeCluster, PainPoint, Opportunity, PrioritizationMatrixItem, PMRecommendation, DashboardMetrics, PriorityLevel } from '../types';
import { ALL_DEMO_FEEDBACK, getFeedbackByTheme } from '../data/demoFeedback';
import { THEME_LABELS, THEME_COLORS } from '../types';

function calculateThemeClusters(feedback: FeedbackItem[]): ThemeCluster[] {
  const themes: FeedbackTheme[] = [
    'performance', 'ux_usability', 'pricing', 'reliability', 'missing_features',
    'onboarding', 'integrations', 'mobile_experience', 'security_privacy', 'customer_support', 'billing'
  ];

  return themes.map(theme => {
    const themeFeedback = feedback.filter(f => f.themes.includes(theme));
    const count = themeFeedback.length;
    const percentage = (count / feedback.length) * 100;
    const avgSentiment = themeFeedback.reduce((sum, f) => sum + f.sentimentScore, 0) / count || 0;
    const affectedCustomers = new Set(themeFeedback.map(f => f.customerId)).size;
    
    const negativeFeedback = themeFeedback.filter(f => f.sentimentScore < -0.3);
    const painPoints = extractPainPoints(negativeFeedback, theme);
    
    const quotes = themeFeedback
      .filter(f => f.sentimentScore < -0.3)
      .sort((a, b) => a.sentimentScore - b.sentimentScore)
      .slice(0, 3)
      .map(f => f.text);

    const revenueImpact = calculateRevenueImpact(themeFeedback);

    return {
      theme,
      label: THEME_LABELS[theme],
      description: getThemeDescription(theme),
      feedbackCount: count,
      percentage: Math.round(percentage * 10) / 10,
      avgSentimentScore: Math.round(avgSentiment * 100) / 100,
      topPainPoints: painPoints,
      representativeQuotes: quotes,
      affectedCustomers,
      revenueImpact,
      trend: determineTrend(themeFeedback),
    };
  }).filter(c => c.feedbackCount > 0)
    .sort((a, b) => b.feedbackCount - a.feedbackCount);
}

function extractPainPoints(feedback: FeedbackItem[], theme: FeedbackTheme): PainPoint[] {
  const painPointMap = new Map<string, { count: number; items: FeedbackItem[]; severity: 'critical' | 'high' | 'medium' | 'low' }>();
  
  const keywords: Record<FeedbackTheme, string[]> = {
    performance: ['slow', 'load', 'timeout', 'lag', 'crash', 'speed', 'response time'],
    ux_usability: ['confusing', 'broken', 'can\'t find', 'navigation', 'search', 'filter', 'keyboard', 'accessibility'],
    pricing: ['expensive', 'cost', 'price', 'budget', 'seat', 'tier', 'contract', 'discount'],
    reliability: ['down', 'outage', 'data loss', 'fail', 'unreliable', 'crash', 'bug', 'error'],
    missing_features: ['need', 'missing', 'lack', 'no ', 'doesn\'t have', 'wish', 'request'],
    onboarding: ['onboard', 'setup', 'learn', 'confusing', 'overwhelming', 'training', 'guided'],
    integrations: ['sync', 'integration', 'api', 'webhook', 'salesforce', 'slack', 'teams', 'jira'],
    mobile_experience: ['mobile', 'phone', 'touch', 'offline', 'responsive', 'app'],
    security_privacy: ['security', 'audit', 'compliance', 'sso', 'saml', 'encryption', 'gdpr', 'rbac'],
    customer_support: ['support', 'response', 'ticket', 'agent', 'help', 'csm', 'wait'],
    billing: ['bill', 'invoice', 'charge', 'seat count', 'po number', 'billing portal'],
  };

  feedback.forEach(item => {
    const matchedKeywords = keywords[theme]?.filter(kw => item.text.toLowerCase().includes(kw.toLowerCase())) || [];
    const key = matchedKeywords.join(',') || 'general';
    
    const existing = painPointMap.get(key) || { count: 0, items: [], severity: 'low' };
    existing.count++;
    existing.items.push(item);
    
    const avgSeverity = existing.items.reduce((sum, i) => sum + Math.abs(i.sentimentScore), 0) / existing.items.length;
    if (avgSeverity > 0.8) existing.severity = 'critical';
    else if (avgSeverity > 0.6) existing.severity = 'high';
    else if (avgSeverity > 0.4) existing.severity = 'medium';
    
    painPointMap.set(key, existing);
  });

  return Array.from(painPointMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([key, value], index) => ({
      id: `pp_${theme}_${index}`,
      title: formatPainPointTitle(key, theme),
      description: generatePainPointDescription(value.items, theme),
      theme,
      frequency: value.count,
      severity: value.severity,
      affectedCustomers: [...new Set(value.items.map(i => i.customerId))],
      evidence: value.items.slice(0, 3).map(i => i.text),
      relatedThemes: [...new Set(value.items.flatMap(i => i.themes))].filter(t => t !== theme),
    }));
}

function formatPainPointTitle(key: string, theme: FeedbackTheme): string {
  const titles: Record<string, string> = {
    'slow,load,timeout,lag,crash,speed,response time': 'Slow Load Times & Timeouts',
    'confusing,broken,can\'t find,navigation,search,filter,keyboard,accessibility': 'Confusing Navigation & Broken UI',
    'expensive,cost,price,budget,seat,tier,contract,discount': 'Pricing Structure Concerns',
    'down,outage,data loss,fail,unreliable,crash,bug,error': 'System Reliability & Outages',
    'need,missing,lack,no ,doesn\'t have,wish,request': 'Critical Feature Gaps',
    'onboard,setup,learn,confusing,overwhelming,training,guided': 'Difficult Onboarding Experience',
    'sync,integration,api,webhook,salesforce,slack,teams,jira': 'Integration Failures & Gaps',
    'mobile,phone,touch,offline,responsive,app': 'Poor Mobile Experience',
    'security,audit,compliance,sso,saml,encryption,gdpr,rbac': 'Security & Compliance Gaps',
    'support,response,ticket,agent,help,csm,wait': 'Inadequate Customer Support',
    'bill,invoice,charge,seat count,po number,billing portal': 'Billing Issues & Transparency',
  };
  return titles[key] || `${THEME_LABELS[theme]} Issues`;
}

function generatePainPointDescription(items: FeedbackItem[], theme: FeedbackTheme): string {
  const count = items.length;
  const avgSentiment = items.reduce((sum, i) => sum + i.sentimentScore, 0) / count;
  const topSources = [...new Set(items.map(i => i.source))].slice(0, 3).join(', ');
  
  return `${count} customers report ${theme} issues (avg sentiment: ${avgSentiment.toFixed(2)}). Primary sources: ${topSources}.`;
}

function getThemeDescription(theme: FeedbackTheme): string {
  const descriptions: Record<FeedbackTheme, string> = {
    performance: 'System speed, load times, API response times, and resource utilization',
    ux_usability: 'User interface design, navigation, accessibility, and ease of use',
    pricing: 'Pricing model, tier structure, seat costs, contract terms, and value perception',
    reliability: 'Uptime, data integrity, error rates, disaster recovery, and system stability',
    missing_features: 'Feature gaps, competitive parity, workflow automation, and extensibility',
    onboarding: 'Initial setup, learning curve, time-to-value, and user adoption',
    integrations: 'Third-party connectivity, API quality, webhook reliability, and data sync',
    mobile_experience: 'Mobile app/web usability, offline capability, and responsive design',
    security_privacy: 'Access controls, audit logs, compliance, data residency, and encryption',
    customer_support: 'Response times, agent expertise, self-service resources, and CSM quality',
    billing: 'Invoice accuracy, billing portal, payment flexibility, and cost predictability',
  };
  return descriptions[theme];
}

function calculateRevenueImpact(feedback: FeedbackItem[]): number {
  const tierMultiplier = { free: 0, pro: 500, enterprise: 5000 };
  return feedback.reduce((sum, f) => sum + (tierMultiplier[f.customerTier] || 0), 0);
}

function determineTrend(feedback: FeedbackItem[]): 'increasing' | 'stable' | 'decreasing' {
  const recent = feedback.filter(f => new Date(f.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const older = feedback.filter(f => new Date(f.createdAt) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  
  if (recent.length > older.length * 1.5) return 'increasing';
  if (older.length > recent.length * 1.5) return 'decreasing';
  return 'stable';
}

export function calculateOpportunities(clusters: ThemeCluster[]): Opportunity[] {
  return clusters.map((cluster, index) => {
    const frequencyScore = Math.min(10, Math.round(cluster.feedbackCount / 2));
    const impactScore = Math.min(10, Math.round(
      (cluster.revenueImpact / 10000) * 5 + 
      (cluster.affectedCustomers / 5) * 3 +
      (Math.abs(cluster.avgSentimentScore) * 10) * 2
    ));
    
    const opportunityScore = Math.round(frequencyScore * impactScore);
    const priority = determinePriority(opportunityScore, frequencyScore, impactScore);
    const rationale = generateRationale(cluster, frequencyScore, impactScore);
    
    return {
      id: `opp_${cluster.theme}`,
      theme: cluster.theme,
      problem: cluster.topPainPoints[0]?.title || `${THEME_LABELS[cluster.theme]} issues`,
      evidence: cluster.representativeQuotes,
      frequency: cluster.feedbackCount,
      impactScore,
      frequencyScore,
      opportunityScore,
      affectedRevenue: cluster.revenueImpact,
      affectedCustomers: cluster.affectedCustomers,
      priority,
      rationale,
      suggestedActions: generateSuggestedActions(cluster.theme),
      effort: determineEffort(cluster.theme),
      confidence: Math.min(0.95, 0.6 + (cluster.feedbackCount / 100)),
    };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore);
}

function determinePriority(score: number, freq: number, impact: number): PriorityLevel {
  if (score >= 60 && freq >= 6 && impact >= 6) return 'high';
  if (score >= 30 && (freq >= 4 || impact >= 5)) return 'investigate';
  return 'low';
}

function generateRationale(cluster: ThemeCluster, freq: number, impact: number): string {
  const parts = [];
  parts.push(`${cluster.feedbackCount} feedback items (${cluster.percentage}% of total)`);
  parts.push(`${cluster.affectedCustomers} affected customers`);
  parts.push(`$${(cluster.revenueImpact / 1000).toFixed(0)}K MRR at risk`);
  parts.push(`Avg sentiment: ${cluster.avgSentimentScore.toFixed(2)}`);
  if (cluster.trend === 'increasing') parts.push('Trend: increasing');
  return parts.join('; ');
}

function generateSuggestedActions(theme: FeedbackTheme): string[] {
  const actions: Record<FeedbackTheme, string[]> = {
    performance: [
      'Audit and optimize critical rendering paths',
      'Implement progressive loading for dashboards',
      'Add performance budgets and monitoring',
      'Optimize database queries and add caching',
    ],
    ux_usability: [
      'Conduct usability testing on top workflows',
      'Redesign navigation and information architecture',
      'Implement keyboard shortcuts and accessibility',
      'Add contextual help and guided tours',
    ],
    pricing: [
      'Introduce mid-tier pricing plan',
      'Add usage-based pricing option',
      'Simplify billing and remove hidden fees',
      'Offer flexible monthly Enterprise contracts',
    ],
    reliability: [
      'Implement comprehensive monitoring and alerting',
      'Add automated failover and disaster recovery',
      'Create transparent status page with postmortems',
      'Improve backup and data recovery procedures',
    ],
    missing_features: [
      'Prioritize top 5 requested integrations',
      'Build workflow automation engine',
      'Add bulk operations and admin tools',
      'Implement advanced permissions/RBAC',
    ],
    onboarding: [
      'Redesign onboarding flow with progressive disclosure',
      'Add interactive product tours',
      'Create role-based setup wizards',
      'Build self-service knowledge base',
    ],
    integrations: [
      'Build native Salesforce bidirectional sync',
      'Improve Slack/Teams notification controls',
      'Add webhook retry logic and dead letter queue',
      'Publish public API with OpenAPI spec',
    ],
    mobile_experience: [
      'Rebuild mobile web with responsive tables',
      'Add offline-first architecture',
      'Improve touch targets and gestures',
      'Implement progressive web app features',
    ],
    security_privacy: [
      'Add audit logging for all admin actions',
      'Implement EU data residency option',
      'Support authenticator apps and hardware keys',
      'Achieve SOC2 Type II compliance',
    ],
    customer_support: [
      'Reduce support response time to <4 hours',
      'Hire dedicated enterprise CSMs',
      'Build AI-powered self-service portal',
      'Implement proactive health scoring',
    ],
    billing: [
      'Fix seat count synchronization',
      'Add PO number support to invoices',
      'Implement real-time billing portal',
      'Add usage-based billing alerts',
    ],
  };
  return actions[theme] || ['Investigate further', 'Gather more customer feedback'];
}

function determineEffort(theme: FeedbackTheme): 'low' | 'medium' | 'high' {
  const effortMap: Record<FeedbackTheme, 'low' | 'medium' | 'high'> = {
    performance: 'high',
    ux_usability: 'medium',
    pricing: 'low',
    reliability: 'high',
    missing_features: 'high',
    onboarding: 'medium',
    integrations: 'high',
    mobile_experience: 'high',
    security_privacy: 'high',
    customer_support: 'medium',
    billing: 'low',
  };
  return effortMap[theme];
}

export function createPrioritizationMatrix(opportunities: Opportunity[]): PrioritizationMatrixItem[] {
  return opportunities.map(opp => {
    let quadrant: PrioritizationMatrixItem['quadrant'];
    if (opp.frequencyScore >= 6 && opp.impactScore >= 6) quadrant = 'high_impact_high_freq';
    else if (opp.frequencyScore < 6 && opp.impactScore >= 6) quadrant = 'high_impact_low_freq';
    else if (opp.frequencyScore >= 6 && opp.impactScore < 6) quadrant = 'low_impact_high_freq';
    else quadrant = 'low_impact_low_freq';
    
    return {
      opportunity: opp,
      quadrant,
      x: opp.frequencyScore,
      y: opp.impactScore,
    };
  });
}

export function generateRecommendations(opportunities: Opportunity[]): PMRecommendation[] {
  return opportunities
    .filter(o => o.priority !== 'low')
    .map((opp, index) => ({
      id: `rec_${opp.id}`,
      opportunityId: opp.id,
      title: opp.problem,
      priority: opp.priority,
      rationale: opp.rationale,
      supportingEvidence: opp.evidence.slice(0, 3),
      estimatedEffort: opp.effort,
      expectedImpact: `Address ${opp.affectedCustomers} customers, ${opp.frequency} feedback items, $${(opp.affectedRevenue / 1000).toFixed(0)}K MRR`,
      risks: generateRisks(opp.theme),
      nextSteps: opp.suggestedActions.slice(0, 3),
      relatedOpportunities: opportunities
        .filter(o => o.theme !== opp.theme && o.priority !== 'low')
        .slice(0, 2)
        .map(o => o.id),
    }));
}

function generateRisks(theme: FeedbackTheme): string[] {
  const risks: Record<FeedbackTheme, string[]> = {
    performance: ['Requires deep architectural changes', 'Risk of introducing regressions', 'Long development cycle'],
    ux_usability: ['Subjective - hard to measure success', 'May require user retraining', 'Design debt accumulation'],
    pricing: ['Revenue impact uncertain', 'Existing customer migration complexity', 'Competitive response risk'],
    reliability: ['High engineering investment', 'Ongoing operational overhead', 'Complex distributed systems challenges'],
    missing_features: ['Scope creep risk', 'Integration maintenance burden', 'API stability commitments'],
    onboarding: ['Hard to measure ROI', 'Continuous content maintenance', 'Diverse user personas'],
    integrations: ['Third-party API dependencies', 'Partner relationship management', 'Ongoing compatibility work'],
    mobile_experience: ['Separate codebase/maintenance', 'Platform-specific bugs', 'App store review delays'],
    security_privacy: ['Compliance audit costs', 'Legal review requirements', 'Ongoing certification maintenance'],
    customer_support: ['Hiring/training timeline', 'Scaling support operations', 'Quality consistency'],
    billing: ['Payment provider limitations', 'Migration of existing subscriptions', 'Finance system integration'],
  };
  return risks[theme] || ['Requires further investigation'];
}

export function calculateDashboardMetrics(feedback: FeedbackItem[]): DashboardMetrics {
  const sentimentDist: Record<string, number> = {};
  feedback.forEach(f => {
    sentimentDist[f.sentiment] = (sentimentDist[f.sentiment] || 0) + 1;
  });

  const themeCounts: Record<string, number> = {};
  feedback.forEach(f => {
    f.themes.forEach(t => {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    });
  });

  const clusters = calculateThemeClusters(feedback);
  const opportunities = calculateOpportunities(clusters);
  const matrix = createPrioritizationMatrix(opportunities);
  
  const priorityBreakdown: Record<PriorityLevel, number> = {
    high: opportunities.filter(o => o.priority === 'high').length,
    investigate: opportunities.filter(o => o.priority === 'investigate').length,
    low: opportunities.filter(o => o.priority === 'low').length,
  };

  const npsFeedback = feedback.filter(f => f.source === 'nps');
  const promoters = npsFeedback.filter(f => f.sentimentScore > 0.5).length;
  const detractors = npsFeedback.filter(f => f.sentimentScore < -0.5).length;
  const npsScore = npsFeedback.length > 0 ? Math.round(((promoters - detractors) / npsFeedback.length) * 100) : 0;

  const feedbackTrend = generateFeedbackTrend(feedback);

  return {
    totalFeedback: feedback.length,
    uniqueCustomers: new Set(feedback.map(f => f.customerId)).size,
    avgSentiment: Math.round(feedback.reduce((sum, f) => sum + f.sentimentScore, 0) / feedback.length * 100) / 100,
    sentimentDistribution: sentimentDist as DashboardMetrics['sentimentDistribution'],
    topThemes: Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme, count]) => ({ theme: theme as FeedbackTheme, count })),
    topPainPoints: clusters.flatMap(c => c.topPainPoints).slice(0, 10),
    npsScore,
    feedbackTrend,
    priorityBreakdown,
  };
}

function generateFeedbackTrend(feedback: FeedbackItem[]): { date: string; count: number }[] {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return last30Days.map(date => ({
    date,
    count: feedback.filter(f => f.createdAt.startsWith(date)).length,
  }));
}

export function analyzeFeedback(feedback: FeedbackItem[] = ALL_DEMO_FEEDBACK) {
  const clusters = calculateThemeClusters(feedback);
  const opportunities = calculateOpportunities(clusters);
  const matrix = createPrioritizationMatrix(opportunities);
  const recommendations = generateRecommendations(opportunities);
  const metrics = calculateDashboardMetrics(feedback);
  
  return {
    clusters,
    opportunities,
    matrix,
    recommendations,
    metrics,
  };
}

export const ANALYSIS_RESULT = analyzeFeedback();