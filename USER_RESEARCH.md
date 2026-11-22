# User Research
## Voice of Customer Copilot

### Research Overview

**Objective:** Understand how Product Managers currently analyze customer feedback, their pain points, and requirements for an AI-assisted tool.

**Methodology:** 
- 12 semi-structured interviews (45 min each)
- 3 contextual inquiries (observing current workflow)
- Survey of 50 PMs (quantitative validation)
- Competitive product testing (5 tools)

**Timeline:** 3 weeks
**Participants:** PMs at Series A-C B2B SaaS companies (2-500 PMs)

---

### Key Findings

#### 1. Current Workflow Pain Points

| Pain Point | Frequency | Severity | Quotes |
|------------|-----------|----------|--------|
| **Manual categorization** | 100% | Critical | "I spend 3-4 hours just tagging feedback in Notion/Excel" |
| **No single source of truth** | 92% | High | "Feedback lives in Intercom, Gong, G2, Slack, emails — nowhere unified" |
| **Recency bias in prioritization** | 83% | High | "The loudest customer or latest escalation wins" |
| **Can't quantify impact** | 75% | High | "I know it's a problem but can't put $ value on it for leadership" |
| **Hard to find evidence** | 67% | Medium | "Searching for that one quote takes forever" |
| **No prioritization framework** | 58% | Medium | "We use RICE but it's subjective for qualitative data" |

#### 2. Current Tools & Workarounds

| Tool | Used By | Purpose | Gaps |
|------|---------|---------|------|
| **Notion/Confluence** | 85% | Documentation, tagging | No analysis, manual |
| **Excel/Google Sheets** | 78% | Quantification, scoring | No text analysis, brittle |
| **Productboard/Pendo** | 42% | Feature voting | Expensive, rigid taxonomy |
| **Intercom/Zendesk tags** | 65% | Support categorization | Limited to support tickets |
| **Gong/Chorus** | 38% | Call analysis | Sales-focused, no product lens |
| **Custom scripts** | 23% | NLP/theme extraction | Technical debt, maintenance |

#### 3. Ideal Solution Requirements

**Must Have:**
- [ ] Unified inbox for all feedback sources
- [ ] Auto-categorization into themes
- [ ] Quantified impact (revenue, customers affected)
- [ ] Direct customer quotes for every insight
- [ ] Visual prioritization framework
- [ ] Export/shareable insights for stakeholders

**Nice to Have:**
- [ ] Slack/Teams integration for real-time capture
- [ ] Jira/Linear sync for delivery tracking
- [ ] Custom theme creation
- [ ] Historical trend analysis
- [ ] Team collaboration (comments, assignments)

**Deal Breakers:**
- ❌ Requires engineering to set up
- ❌ Sends customer data to external AI
- ❌ Locks data in proprietary format
- ❌ >$500/month for team of 5

---

### User Quotes by Theme

#### On Analysis Process
> "I literally copy-paste from Intercom to Notion, tag manually, then move to Excel for scoring. It's embarrassing how manual it is." — *Senior PM, Series B*

> "The worst part is when leadership asks 'where's the data?' and I have to dig through 5 tools to find 3 quotes." — *Group PM, Enterprise*

#### On Prioritization
> "We use RICE but 'Impact' for qualitative feedback is a guess. I wish I could say 'this affects $200K ARR across 12 enterprise customers'." — *PM, Series A*

> "The loudest sales rep or the CEO's friend's request always jumps the queue. We need something objective." — *Director of Product*

#### On AI Assistance
> "I'd use an AI assistant if it showed me the actual customer quotes behind every claim. No black boxes." — *PM, Series B*

> "If it can answer 'what are enterprise customers complaining about this month?' in seconds, that's game-changing." — *VP Product*

---

### Jobs to Be Done

| Job | Current Solution | Desired Solution |
|-----|------------------|------------------|
| **Capture feedback** from all channels | Manual copy-paste | Auto-ingest + quick add |
| **Categorize** into themes | Manual tagging | AI auto-clustering |
| **Quantify** frequency & impact | Manual counting in Excel | Auto-calculated metrics |
| **Find evidence** (quotes) | Search across tools | One-click quote retrieval |
| **Prioritize** objectively | Gut feel / RICE guesses | Impact×Frequency matrix |
| **Communicate** to stakeholders | Screenshots + slides | Shareable live dashboards |
| **Track decisions** | Notion pages | Decision log with rationale |

---

### Persona Validation

Research confirmed 3 primary personas (detailed in PERSONAS.md):

1. **Sarah — Strategic PM** (Primary) — Needs portfolio view, stakeholder communication
2. **Marcus — Tactical PM** (Secondary) — Needs quick answers, evidence for specs
3. **Emily — Learning PM** (Tertiary) — Needs guidance, best practices

---

### Competitive Gaps Identified

| Capability | Productboard | Pendo | Canny | VoC Copilot (Target) |
|------------|--------------|-------|-------|---------------------|
| Multi-source ingestion | ⚠️ Limited | ❌ | ⚠️ Limited | ✅ Unified inbox |
| AI theme clustering | ⚠️ Basic | ❌ | ❌ | ✅ Advanced |
| Revenue impact quantification | ❌ | ❌ | ❌ | ✅ Core feature |
| Evidence traceability | ⚠️ Partial | ❌ | ✅ | ✅ First-class |
| Prioritization framework | ✅ Custom | ⚠️ Basic | ❌ | ✅ Impact×Frequency |
| AI chat assistant | ❌ | ❌ | ❌ | ✅ Core feature |
| Price (team of 5) | $2,500/mo | $2,000/mo | $400/mo | **<$200/mo target** |

---

### Research Artifacts

- [Interview scripts](./research/interview-script.md)
- [Survey results](./research/survey-results.csv)
- [Affinity diagrams](./research/affinity-maps/)
- [Journey maps](./research/journey-maps/)

---

*Research conducted: Jan 2024 | Next refresh: Jul 2024*