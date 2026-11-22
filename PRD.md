# Product Requirements Document (PRD)
## Voice of Customer Copilot

### 1. Product Overview

**Product Name:** Voice of Customer Copilot (VoC Copilot)
**Version:** 1.0 (MVP)
**Product Manager:** [Your Name]
**Last Updated:** 2024

### 2. Problem Statement

Product Managers struggle to systematically analyze qualitative customer feedback from multiple channels (support tickets, reviews, NPS surveys, interviews, sales calls). Current processes are:
- **Manual & Time-consuming:** Hours spent reading and categorizing feedback
- **Inconsistent:** No standardized framework for theme identification
- **Biased:** Recency bias and loudest voice syndrome drive prioritization
- **Disconnected:** Feedback insights don't translate to clear product decisions
- **Non-scalable:** Process breaks down with >50 feedback items/month

### 3. Target Users

**Primary:** Product Managers at B2B SaaS companies (Series A - Series C)
**Secondary:** Product Leaders, UX Researchers, Customer Success Managers
**Personas:** 
- Sarah, Senior PM at Series B SaaS (needs to prioritize roadmap)
- Marcus, Group PM at Enterprise SaaS (needs portfolio-level insights)
- Emily, APM at Early-stage startup (needs to learn from feedback)

### 4. Product Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Reduce feedback analysis time | Time from raw feedback to prioritized insights | <30 minutes (vs 4+ hours manual) |
| Improve prioritization quality | % of high-priority items shipped that improve NPS | >70% |
| Increase feedback utilization | % of feedback items linked to product decisions | >50% |
| User adoption | Weekly active users / total users | >60% |

### 5. Core Features (MVP Scope)

#### 5.1 Feedback Inbox
- **Add/Paste Feedback:** Manual entry with rich metadata (source, customer, sentiment, themes)
- **Demo Dataset:** 45 synthetic feedback items across 15 customers
- **Filtering & Search:** By source, sentiment, theme, customer tier, date range
- **Bulk Operations:** Tag, export, delete multiple items

#### 5.2 AI Insight Dashboard
- **Top Pain Points:** Auto-ranked by frequency × severity
- **Feedback Themes:** 11 predefined clusters with volume % and trend
- **Sentiment Analysis:** Distribution across 5 levels with NPS calculation
- **Frequency Metrics:** Volume trends over 30 days
- **Customer Impact:** Revenue at risk, affected customer count

#### 5.3 Theme Clustering
- **11 Predefined Themes:** Performance, UX/Usability, Pricing, Reliability, Missing Features, Onboarding, Integrations, Mobile Experience, Security/Privacy, Customer Support, Billing
- **Auto-categorization:** Rule-based + keyword matching
- **Theme Details:** Pain points, representative quotes, affected customers, revenue impact, trend direction

#### 5.4 Opportunity Analysis
For each theme:
- **Problem Statement:** Clear, concise problem definition
- **Evidence:** Direct customer quotes (top 3)
- **Frequency Score:** 1-10 based on mention count
- **Impact Score:** 1-10 based on revenue risk + severity + sentiment
- **Opportunity Score:** Frequency × Impact (1-100)
- **Priority Classification:** High (>60), Investigate (30-60), Low (<30)
- **Suggested Actions:** 3-4 concrete next steps
- **Effort Estimate:** Low/Medium/High
- **Confidence Level:** 60-95%

#### 5.5 Prioritization Matrix
- **Impact × Frequency Scatter Plot:** Visual 2x2 quadrant
- **Quadrants:** Do Now (High/High), Investigate (High/Low), Quick Wins (Low/High), Defer (Low/Low)
- **Interactive:** Hover for details, click to drill down

#### 5.6 PM Recommendations
- **🔴 High Priority:** Do Now — with rationale, evidence, effort, impact, risks, next steps
- **🟡 Investigate:** Deep Dive — with research questions, data needed
- **🟢 Low Priority:** Defer/Quick Wins — with conditions to revisit
- **Decision Log:** Track approval/deferral/rejection with timestamps

#### 5.7 AI Product Assistant
- **Chat Interface:** Natural language queries about feedback data
- **Capabilities:** Theme summaries, pain points, quotes, metrics, prioritization advice
- **Source Citations:** Every claim linked to specific feedback items
- **Suggested Questions:** Context-aware prompt starters

### 6. User Flows

#### Flow 1: New Feedback → Insights
1. PM adds/pastes feedback in Inbox
2. Auto-categorized into themes
3. Dashboard updates in real-time
4. New pain points surface in Insights
5. Opportunities recalculated

#### Flow 2: Quarterly Planning
1. PM opens Prioritization page
2. Reviews High Priority recommendations
3. Uses RICE scores to sequence roadmap
4. Makes decisions in Decision Log
5. Exports roadmap for stakeholder review

#### Flow 3: Ad-hoc Analysis
1. PM asks Assistant: "What do Enterprise customers hate about onboarding?"
2. Gets synthesized answer with quotes
3. Drills into Themes page for details
4. Creates new opportunity if needed

### 7. Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| Performance | <2s page load, <500ms filter response |
| Accessibility | WCAG 2.1 AA compliant |
| Browser Support | Chrome, Firefox, Safari, Edge (last 2 versions) |
| Data Privacy | No real customer data — synthetic only |
| Offline | Not required (MVP) |

### 8. Out of Scope (MVP)

- Real AI/ML clustering (using rule-based for demo)
- Real-time data ingestion (API, webhooks)
- User authentication & multi-tenancy
- Custom theme creation
- Integration with Jira/Linear/Productboard
- Historical trend analysis beyond 30 days
- Collaborative features (comments, assignments)
- Export to PDF/PowerPoint
- Mobile app

### 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Demo data feels fake | High | Medium | Clear "SYNTHETIC" labels, realistic scenarios |
| Rule-based categorization inaccurate | Medium | High | Manual override, confidence scores shown |
| PMs don't trust AI recommendations | Medium | High | Show evidence, rationale, confidence |
| Performance with large datasets | Low | Medium | Virtualized lists, pagination |

### 10. Launch Plan

**Phase 1 (Week 1-2):** Core UI + Demo Data + Basic Analysis
**Phase 2 (Week 3):** All Pages + Charts + Assistant
**Phase 3 (Week 4):** Polish + Documentation + Demo Prep
**Launch:** Portfolio demo with recorded walkthrough

---

*This PRD is a living document. Update as learnings emerge.*