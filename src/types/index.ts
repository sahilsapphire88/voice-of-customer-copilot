export type FeedbackSource = 'support_ticket' | 'review' | 'nps' | 'interview' | 'social' | 'sales_call' | 'churn_survey' | 'feature_request';

export type FeedbackSentiment = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';

export type FeedbackTheme = 
  | 'performance' 
  | 'ux_usability' 
  | 'pricing' 
  | 'reliability' 
  | 'missing_features' 
  | 'onboarding' 
  | 'integrations' 
  | 'mobile_experience' 
  | 'security_privacy' 
  | 'customer_support' 
  | 'billing';

export type PriorityLevel = 'high' | 'investigate' | 'low';

export interface FeedbackItem {
  id: string;
  text: string;
  source: FeedbackSource;
  customerId: string;
  customerName: string;
  customerTier: 'free' | 'pro' | 'enterprise';
  companySize: 'startup' | 'smb' | 'mid_market' | 'enterprise';
  industry: string;
  sentiment: FeedbackSentiment;
  sentimentScore: number; // -1 to 1
  themes: FeedbackTheme[];
  createdAt: string; // ISO date
  upvotes: number;
  isDemo: boolean;
  metadata?: Record<string, unknown>;
}

export interface ThemeCluster {
  theme: FeedbackTheme;
  label: string;
  description: string;
  feedbackCount: number;
  percentage: number;
  avgSentimentScore: number;
  topPainPoints: PainPoint[];
  representativeQuotes: string[];
  affectedCustomers: number;
  revenueImpact: number; // estimated MRR at risk
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  theme: FeedbackTheme;
  frequency: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedCustomers: string[]; // customer IDs
  evidence: string[]; // feedback quotes
  relatedThemes: FeedbackTheme[];
}

export interface Opportunity {
  id: string;
  theme: FeedbackTheme;
  problem: string;
  evidence: string[];
  frequency: number;
  impactScore: number; // 1-10
  frequencyScore: number; // 1-10
  opportunityScore: number; // impact * frequency
  affectedRevenue: number;
  affectedCustomers: number;
  priority: PriorityLevel;
  rationale: string;
  suggestedActions: string[];
  effort: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}

export interface PrioritizationMatrixItem {
  opportunity: Opportunity;
  quadrant: 'high_impact_high_freq' | 'high_impact_low_freq' | 'low_impact_high_freq' | 'low_impact_low_freq';
  x: number; // frequency score (1-10)
  y: number; // impact score (1-10)
}

export interface PMRecommendation {
  id: string;
  opportunityId: string;
  title: string;
  priority: PriorityLevel;
  rationale: string;
  supportingEvidence: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  expectedImpact: string;
  risks: string[];
  nextSteps: string[];
  relatedOpportunities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: FeedbackItem[];
}

export interface DashboardMetrics {
  totalFeedback: number;
  uniqueCustomers: number;
  avgSentiment: number;
  sentimentDistribution: Record<FeedbackSentiment, number>;
  topThemes: { theme: FeedbackTheme; count: number }[];
  topPainPoints: PainPoint[];
  npsScore: number;
  feedbackTrend: { date: string; count: number }[];
  priorityBreakdown: Record<PriorityLevel, number>;
}

export interface FilterState {
  dateRange: { start: string; end: string } | null;
  sources: FeedbackSource[];
  sentiments: FeedbackSentiment[];
  themes: FeedbackTheme[];
  customerTiers: string[];
  companySizes: string[];
  searchQuery: string;
}

export const THEME_LABELS: Record<FeedbackTheme, string> = {
  performance: 'Performance',
  ux_usability: 'UX / Usability',
  pricing: 'Pricing',
  reliability: 'Reliability',
  missing_features: 'Missing Features',
  onboarding: 'Onboarding',
  integrations: 'Integrations',
  mobile_experience: 'Mobile Experience',
  security_privacy: 'Security & Privacy',
  customer_support: 'Customer Support',
  billing: 'Billing',
};

export const THEME_COLORS: Record<FeedbackTheme, string> = {
  performance: 'primary',
  ux_usability: 'secondary',
  pricing: 'warning',
  reliability: 'danger',
  missing_features: 'success',
  onboarding: 'primary',
  integrations: 'secondary',
  mobile_experience: 'warning',
  security_privacy: 'danger',
  customer_support: 'success',
  billing: 'warning',
};

export const SENTIMENT_LABELS: Record<FeedbackSentiment, string> = {
  very_negative: 'Very Negative',
  negative: 'Negative',
  neutral: 'Neutral',
  positive: 'Positive',
  very_positive: 'Very Positive',
};

export const SENTIMENT_COLORS: Record<FeedbackSentiment, string> = {
  very_negative: 'danger',
  negative: 'danger',
  neutral: 'secondary',
  positive: 'success',
  very_positive: 'success',
};

export const SOURCE_LABELS: Record<FeedbackSource, string> = {
  support_ticket: 'Support Ticket',
  review: 'Review',
  nps: 'NPS Survey',
  interview: 'Customer Interview',
  social: 'Social Media',
  sales_call: 'Sales Call',
  churn_survey: 'Churn Survey',
  feature_request: 'Feature Request',
};

export const FEEDBACK_SOURCE_OPTIONS: { value: FeedbackSource; label: string }[] = Object.entries(SOURCE_LABELS).map(([value, label]) => ({ value: value as FeedbackSource, label }));