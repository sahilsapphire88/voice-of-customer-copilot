# Personas
## Voice of Customer Copilot

---

### Persona 1: Sarah Chen — The Strategic PM (Primary)

**Role:** Senior Product Manager  
**Company:** Series B B2B SaaS, 150 employees, $15M ARR  
**Experience:** 6 years PM, 2 at current company  
**Team:** Owns "Core Platform" (auth, billing, integrations, admin)  
**Reports to:** VP Product

#### Demographics
- Age: 32
- Location: San Francisco (hybrid)
- Education: MS Computer Science
- Tools: Jira, Productboard, Amplitude, Figma, Slack, Notion

#### Goals
1. **Build the right roadmap** — Balance customer requests, strategic initiatives, tech debt
2. **Communicate with confidence** — Defend priorities to CEO, Sales, Engineering with data
3. **Close the loop** — Follow up with customers when their feedback ships
4. **Scale PM process** — Move from ad-hoc to systematic feedback analysis

#### Pain Points
- **Time poverty:** 60% time in meetings, 20% analysis, 20% execution
- **Feedback fragmentation:** Intercom (support), Gong (sales), G2 (reviews), NPS (survey), Slack (random)
- **Subjective prioritization:** "Impact" in RICE is a guess for qualitative feedback
- **Stakeholder misalignment:** Sales wants features X, Support wants Y, Eng wants Z
- **No visibility on revenue impact:** Can't answer "how much ARR is at risk?"

#### Current Workflow
```
Monday:  Review Intercom tags + Gong highlights (45 min)
Tuesday:  Quarterly NPS deep-dive (2 hrs) — manual in Excel
Wednesday:  Roadmap planning with stakeholders (2 hrs) — debates on priority
Thursday:  Write specs for top 2 items (3 hrs)
Friday:   Ad-hoc: "Can you look at this escalation?" (1 hr)
```

#### Desired Workflow with VoC Copilot
```
Monday:  Open Dashboard → See top 3 themes auto-updated (5 min)
         Ask Assistant: "What's new in reliability this week?" (2 min)
Tuesday:  Review High Priority recommendations with evidence (15 min)
         Make 3 decisions in Decision Log with rationale (10 min)
Wednesday:  Roadmap review — show Impact×Frequency matrix (10 min)
           Stakeholders align faster with shared evidence
Thursday:  Spec writing — quotes auto-linked from insights
Friday:   Proactive: "3 enterprise customers asked for X — here's the data"
```

#### Success Metrics for Sarah
- Time to prepare roadmap review: 2 hrs → 30 min
- Decisions backed by customer evidence: 20% → 80%
- Stakeholder alignment meetings: 4/month → 1/month
- Customer follow-ups sent: 2/quarter → 10/quarter

#### Buying Triggers
- New VP Product mandates "data-driven roadmap"
- Competitor launches similar feature, need fast response
- Churn spike — need to understand why *now*
- Board asks for "voice of customer" in quarterly deck

#### Objections
- "Is this just another dashboard I have to maintain?"
- "Can I trust the AI categorization?"
- "What if my specific themes aren't in your 11 categories?"
- "How does this integrate with Productboard/Jira?"

---

### Persona 2: Marcus Johnson — The Tactical PM (Secondary)

**Role:** Product Manager  
**Company:** Mid-market B2B SaaS, 300 employees, $40M ARR  
**Experience:** 3 years PM, former Software Engineer  
**Team:** Owns "Analytics & Reporting" module  
**Reports to:** Group PM (Sarah)

#### Demographics
- Age: 28
- Location: Austin (remote)
- Education: BS Computer Science
- Tools: Linear, Mixpanel, PostHog, GitHub, Slack, Notion

#### Goals
1. **Ship high-impact features fast** — Minimize wasted engineering cycles
2. **Answer "why this?" instantly** — Evidence for every spec decision
3. **Stay close to customers** — Regular exposure to raw feedback
4. **Grow to Senior PM** — Build reputation for data-driven decisions

#### Pain Points
- **Spec writing blind spots:** Misses edge cases without deep feedback knowledge
- **Engineering pushback:** "Why are we building this?" — needs quick evidence
- **Feedback noise:** Hard to separate signal from 200+ monthly items
- **No time for deep analysis:** Reactive mode, always fighting fires

#### Current Workflow
```
Daily:   Scan Intercom for analytics-related tickets (15 min)
Weekly:  Deep-dive on 1 theme (performance, UX, etc.) — 1 hr manual
Sprint:  Planning — defend priorities with anecdotal evidence
Ad-hoc:  Engineer asks "what's the user problem here?" — search Notion
```

#### Desired Workflow with VoC Copilot
```
Daily:   Assistant notification: "3 new performance complaints" (1 min)
Weekly:  Open Themes page → Performance cluster → see top pain points (5 min)
         Click quote → copy into spec → done
Sprint:  Show Impact×Frequency matrix — "This is why we're doing X"
Ad-hoc:  Ask Assistant: "Quotes about slow dashboard load" → paste in PR
```

#### Success Metrics for Marcus
- Time to find evidence for spec: 20 min → 2 min
- Engineer questions answered with quotes: 40% → 90%
- Features shipped that address top pain points: 60% → 85%
- Feedback items reviewed per week: 10 → 50

#### Buying Triggers
- New feature area with unknown customer problems
- Engineer challenges priority — needs quick defense
- Wants to impress Group PM with data-driven approach
- Team adopts Linear — wants integrated feedback view

---

### Persona 3: Emily Rodriguez — The Learning PM (Tertiary)

**Role:** Associate Product Manager (APM)  
**Company:** Early-stage startup, 50 employees, $3M ARR  
**Experience:** 1 year PM, former Customer Success  
**Team:** Rotates across product areas quarterly  
**Reports to:** Senior PM (mentor)

#### Demographics
- Age: 25
- Location: New York (hybrid)
- Education: BA Economics + Bootcamp
- Tools: Trello, Google Sheets, Typeform, Slack, Notion

#### Goals
1. **Learn PM craft** — Build intuition for customer problems
2. **Contribute meaningfully** — Own a small feature end-to-end
3. **Build portfolio** — Case studies for Senior PM promotion
4. **Understand prioritization** — Learn frameworks in practice

#### Pain Points
- **Imposter syndrome:** "Am I missing something obvious?"
- **No framework:** Taught RICE in bootcamp but doesn't work for qual data
- **Overwhelmed by feedback:** 50+ items/week, no idea where to start
- **Mentor time scarce:** Senior PM too busy for deep coaching

#### Current Workflow
```
Weekly:  Mentor 1:1 — "What should I work on?" (30 min)
         Manual feedback review in Google Sheets (2 hrs) — unsure what matters
Monthly:  Present findings to team — nervous about gaps
Ad-hoc:   Customer calls — takes notes, doesn't know how to synthesize
```

#### Desired Workflow with VoC Copilot
```
Weekly:  Open Dashboard → See "Start Here" recommendations (5 min)
         Ask Assistant: "How do I prioritize these 3 themes?" → gets framework
         Use RICE table → presents to mentor with confidence
Monthly:  Case study auto-generated: "How I prioritized X using VoC Copilot"
Ad-hoc:   Customer call notes → paste in Inbox → auto-categorized
```

#### Success Metrics for Emily
- Confidence in prioritization (self-rated): 3/10 → 8/10
- Mentor feedback quality: "Good effort" → "Great analysis"
- Time to first meaningful insight: 2 weeks → 1 day
- Portfolio artifacts created: 0 → 3/quarter

#### Buying Triggers
- APM program adopts tool as training aid
- Mentor recommends "use this to learn"
- Wants to stand out in performance review
- Company evaluates Productboard — too expensive

---

### Persona Comparison Matrix

| Dimension | Sarah (Strategic) | Marcus (Tactical) | Emily (Learning) |
|-----------|-------------------|-------------------|------------------|
| **Primary Need** | Portfolio view, stakeholder alignment | Quick evidence, spec support | Framework, guidance |
| **Frequency** | Weekly strategic review | Daily tactical use | Weekly learning |
| **Key Feature** | Dashboard, Decision Log, Roadmap | Assistant, Themes, Quotes | Assistant, RICE, Recommendations |
| **Budget Authority** | Influencer → Decision Maker | Influencer | No authority |
| **Tech Savviness** | High | Very High | Medium |
| **Data Sensitivity** | High (board decks) | Medium (specs) | Low (learning) |

---

### Anti-Personas (Who We're NOT Building For)

| Anti-Persona | Reason |
|--------------|--------|
| **Enterprise PM at 5000+ person company** | Needs SSO, audit logs, custom workflows, dedicated CSM |
| **Consumer PM at B2C company** | Different feedback sources (app store, social), different metrics |
| **Solo founder/Indie hacker** | Too early, volume too low, price sensitivity extreme |
| **UX Researcher** | Needs qualitative coding, affinity mapping, not prioritization |
| **Customer Success Manager** | Needs health scores, churn prediction, not product prioritization |

---

*Personas based on 12 interviews + 50 survey responses | Updated: Jan 2024*