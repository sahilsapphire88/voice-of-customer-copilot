import type { FeedbackItem, ChatMessage, FeedbackTheme, FeedbackSentiment, FeedbackSource } from '../types';
import { ALL_DEMO_FEEDBACK } from '../data/demoFeedback';
import { THEME_LABELS, SENTIMENT_LABELS, SOURCE_LABELS } from '../types';

const SYSTEM_PROMPT = `You are the Voice of Customer Copilot, an AI assistant that helps Product Managers analyze customer feedback. You have access to a dataset of ${ALL_DEMO_FEEDBACK.length} synthetic feedback items from 15 customers across different tiers and industries.

Key capabilities:
- Answer questions about feedback themes, pain points, and trends
- Provide evidence-backed insights with direct customer quotes
- Calculate metrics like sentiment distribution, NPS, priority areas
- Help with prioritization decisions using Impact x Frequency framework
- Generate product recommendations with rationale

Always cite specific feedback items when making claims. Be concise but thorough.`;

function searchFeedback(query: string): FeedbackItem[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  return ALL_DEMO_FEEDBACK
    .map(item => {
      let score = 0;
      const text = item.text.toLowerCase();
      terms.forEach(term => {
        if (text.includes(term)) score += 2;
        if (item.themes.some(t => t.includes(term))) score += 3;
        if (SOURCE_LABELS[item.source].toLowerCase().includes(term)) score += 1;
        if (SENTIMENT_LABELS[item.sentiment].toLowerCase().includes(term)) score += 1;
      });
      return { item, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(r => r.item);
}

function getThemeSummary(theme: FeedbackTheme): string {
  const items = ALL_DEMO_FEEDBACK.filter(f => f.themes.includes(theme));
  const negative = items.filter(f => f.sentimentScore < -0.3);
  const positive = items.filter(f => f.sentimentScore > 0.3);
  const avgSentiment = items.reduce((sum, f) => sum + f.sentimentScore, 0) / items.length;
  const customers = new Set(items.map(f => f.customerId)).size;
  const revenue = items.reduce((sum, f) => sum + (f.customerTier === 'enterprise' ? 5000 : f.customerTier === 'pro' ? 500 : 0), 0);
  
  return `${THEME_LABELS[theme]}: ${items.length} feedback items from ${customers} customers (avg sentiment: ${avgSentiment.toFixed(2)}). ${negative.length} negative, ${positive.length} positive. ~$${(revenue/1000).toFixed(0)}K MRR exposure.`;
}

function getTopPainPoints(limit = 5): string {
  const negative = ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore < -0.5);
  const themeCounts: Record<string, number> = {};
  negative.forEach(f => f.themes.forEach(t => themeCounts[t] = (themeCounts[t] || 0) + 1));
  
  return Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([theme, count]) => `${THEME_LABELS[theme as FeedbackTheme]}: ${count} negative mentions`)
    .join('\n');
}

function getCustomerQuotes(theme?: FeedbackTheme, sentiment?: FeedbackSentiment, limit = 3): string {
  let items = ALL_DEMO_FEEDBACK;
  if (theme) items = items.filter(f => f.themes.includes(theme));
  if (sentiment) items = items.filter(f => f.sentiment === sentiment);
  
  return items
    .sort((a, b) => Math.abs(b.sentimentScore) - Math.abs(a.sentimentScore))
    .slice(0, limit)
    .map(f => `"${f.text.substring(0, 150)}..." — ${f.customerName} (${f.customerTier}, ${f.source})`)
    .join('\n\n');
}

function getMetricsSummary(): string {
  const total = ALL_DEMO_FEEDBACK.length;
  const customers = new Set(ALL_DEMO_FEEDBACK.map(f => f.customerId)).size;
  const avgSentiment = ALL_DEMO_FEEDBACK.reduce((sum, f) => sum + f.sentimentScore, 0) / total;
  const negative = ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore < -0.3).length;
  const positive = ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore > 0.3).length;
  const enterprise = ALL_DEMO_FEEDBACK.filter(f => f.customerTier === 'enterprise').length;
  
  return `Dataset: ${total} feedback items from ${customers} customers (${enterprise} from Enterprise). Avg sentiment: ${avgSentiment.toFixed(2)}. ${negative} negative, ${positive} positive.`;
}

export function generateAIResponse(userMessage: string, history: ChatMessage[]): { response: string; sources: FeedbackItem[] } {
  const query = userMessage.toLowerCase();
  let response = '';
  let sources: FeedbackItem[] = [];

  // Theme-specific queries
  const themes: FeedbackTheme[] = ['performance', 'ux_usability', 'pricing', 'reliability', 'missing_features', 'onboarding', 'integrations', 'mobile_experience', 'security_privacy', 'customer_support', 'billing'];
  const matchedTheme = themes.find(t => query.includes(t.replace('_', ' ')) || query.includes(t));
  
  if (matchedTheme) {
    response = getThemeSummary(matchedTheme);
    sources = ALL_DEMO_FEEDBACK.filter(f => f.themes.includes(matchedTheme)).slice(0, 5);
  }
  // Top pain points
  else if (query.includes('pain point') || query.includes('top issue') || query.includes('biggest problem')) {
    response = `Top pain points:\n${getTopPainPoints(7)}`;
    sources = ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore < -0.5).slice(0, 10);
  }
  // Quotes/evidence
  else if (query.includes('quote') || query.includes('evidence') || query.includes('example') || query.includes('customer said')) {
    const theme = themes.find(t => query.includes(t.replace('_', ' ')));
    const sentiment = Object.keys(SENTIMENT_LABELS).find(s => query.includes(s.replace('_', ' '))) as FeedbackSentiment | undefined;
    response = `Relevant customer quotes:\n\n${getCustomerQuotes(theme, sentiment, 5)}`;
    sources = theme ? ALL_DEMO_FEEDBACK.filter(f => f.themes.includes(theme)).slice(0, 5) : ALL_DEMO_FEEDBACK.slice(0, 5);
  }
  // Metrics/summary
  else if (query.includes('metric') || query.includes('summary') || query.includes('overview') || query.includes('nps') || query.includes('stat')) {
    response = getMetricsSummary();
    sources = ALL_DEMO_FEEDBACK.slice(0, 5);
  }
  // Prioritization
  else if (query.includes('priorit') || query.includes('what should we build') || query.includes('roadmap') || query.includes('focus')) {
    response = `Prioritization framework (Impact × Frequency):\n\n1. **High Impact, High Frequency** (Do Now): Reliability (outages, data loss), Performance (slow loads)\n2. **High Impact, Low Frequency** (Investigate): Security/Compliance gaps, Pricing model\n3. **Low Impact, High Frequency** (Quick Wins): UX polish, Mobile responsiveness, Billing fixes\n4. **Low Impact, Low Frequency** (Defer): Nice-to-have integrations, Advanced customization\n\nRecommendation: Focus on Reliability + Performance first — they affect all customers and drive churn.`;
    sources = ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore < -0.5).slice(0, 8);
  }
  // Sentiment analysis
  else if (query.includes('sentiment') || query.includes('happy') || query.includes('unhappy') || query.includes('satisfaction')) {
    const dist: Record<string, number> = {};
    ALL_DEMO_FEEDBACK.forEach(f => dist[f.sentiment] = (dist[f.sentiment] || 0) + 1);
    response = `Sentiment Distribution:\n${Object.entries(dist).map(([k, v]) => `${SENTIMENT_LABELS[k as FeedbackSentiment]}: ${v} (${((v/ALL_DEMO_FEEDBACK.length)*100).toFixed(1)}%)`).join('\n')}\n\nOverall: More negative than positive — indicates urgent issues to address.`;
    sources = ALL_DEMO_FEEDBACK.slice(0, 5);
  }
  // Source breakdown
  else if (query.includes('source') || query.includes('channel') || query.includes('where') || query.includes('support ticket') || query.includes('review') || query.includes('nps')) {
    const dist: Record<string, number> = {};
    ALL_DEMO_FEEDBACK.forEach(f => dist[f.source] = (dist[f.source] || 0) + 1);
    response = `Feedback by Source:\n${Object.entries(dist).map(([k, v]) => `${SOURCE_LABELS[k as FeedbackSource]}: ${v}`).join('\n')}`;
    sources = ALL_DEMO_FEEDBACK.slice(0, 5);
  }
  // Customer segment
  else if (query.includes('enterprise') || query.includes('pro') || query.includes('free') || query.includes('tier') || query.includes('segment')) {
    const tiers = ['enterprise', 'pro', 'free'] as const;
    const matchedTier = tiers.find(t => query.includes(t));
    if (matchedTier) {
      const items = ALL_DEMO_FEEDBACK.filter(f => f.customerTier === matchedTier);
      const avgSent = items.reduce((s, f) => s + f.sentimentScore, 0) / items.length;
      response = `${matchedTier.toUpperCase()} customers: ${items.length} feedback items, ${new Set(items.map(f => f.customerId)).size} unique customers, avg sentiment: ${avgSent.toFixed(2)}.`;
      sources = items.slice(0, 5);
    } else {
      const tierDist = tiers.map(t => {
        const items = ALL_DEMO_FEEDBACK.filter(f => f.customerTier === t);
        return `${t}: ${items.length} items, ${new Set(items.map(f => f.customerId)).size} customers`;
      }).join('\n');
      response = `Feedback by Tier:\n${tierDist}`;
      sources = ALL_DEMO_FEEDBACK.slice(0, 5);
    }
  }
  // Default: semantic search
  else {
    sources = searchFeedback(userMessage);
    if (sources.length > 0) {
      response = `Found ${sources.length} relevant feedback items:\n\n${sources.slice(0, 3).map(f => `"${f.text.substring(0, 200)}..." — ${f.customerName} (${THEME_LABELS[f.themes[0]]} / ${SENTIMENT_LABELS[f.sentiment]})`).join('\n\n')}`;
    } else {
      response = `I couldn't find specific feedback matching your query. Try asking about:\n- Specific themes: "performance", "pricing", "reliability"\n- Pain points: "top issues", "biggest problems"\n- Evidence: "quotes about [topic]", "customer examples"\n- Metrics: "sentiment distribution", "NPS", "summary"\n- Prioritization: "what should we prioritize", "roadmap recommendations"`;
      sources = [];
    }
  }

  return { response, sources };
}

export function generateSuggestedQuestions(): string[] {
  return [
    "What are the top pain points?",
    "Show me feedback about performance issues",
    "What do Enterprise customers complain about?",
    "Give me quotes about pricing concerns",
    "What's the sentiment distribution?",
    "Which themes have the most negative feedback?",
    "What should we prioritize for Q1?",
    "Show me NPS feedback from promoters",
    "What are the biggest reliability issues?",
    "How does feedback differ by customer tier?",
  ];
}