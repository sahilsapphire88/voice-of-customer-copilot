# Product Decision Log
## Voice of Customer Copilot

### Purpose

Track all significant product decisions with context, rationale, and outcomes. Enables learning, accountability, and onboarding.

### Decision Template

| Field | Description |
|-------|-------------|
| **ID** | DEC-YYYYMMDD-XXX |
| **Date** | Decision date |
| **Title** | One-line summary |
| **Type** | Strategy / Scope / Technical / UX / Pricing / Process |
| **Status** | Proposed / Approved / Rejected / Deferred / Implemented |
| **Decision Maker(s)** | Who approved |
| **Context** | Why this decision now |
| **Options Considered** | Alternatives evaluated |
| **Rationale** | Why chosen option wins |
| **RICE Score** | If applicable |
| **Evidence** | Data, research, feedback supporting |
| **Risks** | Known unknowns, mitigation |
| **Success Metrics** | How we'll know it worked |
| **Follow-up Date** | When to review outcome |
| **Outcome** | Filled after follow-up |

---

### Decision Log

#### DEC-20240115-001: MVP Scope — Rule-based vs ML Clustering
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Technical |
| **Status** | Approved |
| **Decision Maker** | VP Product, Lead Engineer |
| **Context** | Need to choose clustering approach for MVP. ML requires training data, expertise, maintenance. |
| **Options** | 1. Full ML (custom model) 2. Pre-trained transformer + fine-tune 3. Rule-based keyword matching 4. Hybrid: rules + semantic similarity |
| **Rationale** | Rule-based with keyword matching + semantic similarity (sentence-transformers) gives 80% accuracy for 11 predefined themes in 10% of ML effort. Transparent, debuggable, no training data needed. Can upgrade to ML post-PMF. |
| **RICE** | Reach: 100, Impact: 2, Confidence: 85%, Effort: 2 → **8,500** |
| **Evidence** | Competitor analysis: Enterpret uses ML but 6-month setup. User research: PMs prefer transparent categorization. |
| **Risks** | Theme coverage gaps → Mitigation: "Uncategorized" bucket + manual override + confidence scores |
| **Success Metrics** | Categorization accuracy >75% vs manual coding; <5% "uncategorized" |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-002: Pricing Model — Freemium vs Free Trial
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Pricing |
| **Status** | Approved |
| **Decision Maker** | CEO, VP Product |
| **Context** | Need pricing strategy for launch. Competitors: Productboard (trial), Canny (freemium), Enterpret (enterprise only). |
| **Options** | 1. 14-day free trial → paid 2. Freemium (limited free forever) 3. Free for individuals, paid teams 4. Usage-based (feedback items/month) |
| **Rationale** | Freemium with generous free tier (50 items, 3 themes) builds trust, enables viral adoption in PM communities. Paid tiers unlock team features (SSO, unlimited, integrations). Aligns with PLG motion. |
| **RICE** | Reach: 200, Impact: 2, Confidence: 70%, Effort: 1 → **28,000** |
| **Evidence** | Survey: 65% PMs prefer trying free first. Canny's freemium drives 40% of paid conversions. |
| **Risks** | Free users never convert → Mitigation: Clear upgrade triggers (team size, volume, SSO) |
| **Success Metrics** | Free→Paid conversion >5%; Free tier activation >60% |
| **Follow-up** | 2024-07-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-003: Data Privacy — No External AI APIs
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Strategy |
| **Status** | Approved |
| **Decision Maker** | CTO, VP Product, Legal |
| **Context** | AI Assistant could use OpenAI/Anthropic APIs but customer feedback is sensitive. |
| **Options** | 1. Use GPT-4 via API 2. Use local LLMs (Llama/Mistral) 3. Rule-based responses only 4. Hybrid: local for classification, API for generation (with PII stripping) |
| **Rationale** | MVP uses rule-based + semantic search (no external AI). Post-MVP: evaluate local LLMs for generation. Never send raw feedback to external APIs without explicit consent. Differentiates from competitors who use OpenAI. |
| **RICE** | Reach: 100, Impact: 3, Confidence: 90%, Effort: 1 → **27,000** |
| **Evidence** | User research: "No black boxes" — 78% want transparent AI. Enterprise reqs: SOC2, data residency. |
| **Risks** | Assistant quality lower than GPT-4 → Mitigation: Set expectations ("Demo Assistant"), cite sources always |
| **Success Metrics** | Assistant helpfulness rating >4/5; Zero data privacy incidents |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-004: Prioritization Framework — Impact×Frequency + RICE
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Product |
| **Status** | Approved |
| **Decision Maker** | VP Product |
| **Context** | Need prioritization framework that works for qualitative feedback. RICE alone doesn't capture frequency well. |
| **Options** | 1. Pure RICE 2. ICE (Impact×Confidence×Ease) 3. Weighted Scoring 4. Impact×Frequency Matrix + RICE for roadmap sequencing |
| **Rationale** | Impact×Frequency is intuitive for feedback data (quadrant visual). RICE adds effort/confidence for roadmap sequencing. Best of both: visual triage + quantitative scoring. |
| **RICE** | Reach: 100, Impact: 2, Confidence: 85%, Effort: 1 → **17,000** |
| **Evidence** | User research: PMs love 2x2 matrices. Intercom uses RICE. Combining addresses both tactical + strategic needs. |
| **Risks** | Two frameworks confuse users → Mitigation: Clear labeling: "Matrix for triage, RICE for roadmap" |
| **Success Metrics** | >80% of decisions use at least one framework; Stakeholder alignment survey +20% |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-005: Theme Taxonomy — Fixed 11 Themes vs Custom
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Product |
| **Status** | Approved |
| **Decision Maker** | VP Product, Lead Designer |
| **Context** | Should themes be fixed or user-customizable? |
| **Options** | 1. Fixed 11 themes (MVP) 2. User-created themes 3. Fixed + "Other" with sub-tags 4. ML-discovered themes |
| **Rationale** | Fixed 11 themes cover 90%+ of B2B SaaS feedback (validated by research). Enables benchmarking, consistent analysis, faster MVP. Custom themes add complexity (taxonomy management, merging, reporting). Add post-PMF. |
| **RICE** | Reach: 100, Impact: 1, Confidence: 80%, Effort: 3 → **2,667** |
| **Evidence** | Research: 11 themes emerged from 500+ feedback items across 12 companies. Competitors with custom themes report "taxonomy drift" problems. |
| **Risks** | Vertical-specific themes missing (e.g., HIPAA for HealthTech) → Mitigation: Sub-tags within themes, vertical templates post-MVP |
| **Success Metrics** | Theme coverage >90% of feedback; <10% items in "Other" |
| **Follow-up** | 2024-07-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-006: Demo Data — Synthetic Only, Clearly Labeled
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Product |
| **Status** | Approved |
| **Decision Maker** | VP Product, Legal |
| **Context** | Need realistic data for demo/portfolio without real customer data. |
| **Options** | 1. Anonymized real data 2. Fully synthetic with clear labels 3. Hybrid: synthetic structure + real patterns 4. No demo data — empty state |
| **Rationale** | Synthetic only eliminates privacy risk, legal review, and "looks fake" complaints if clearly labeled. 45 items across 15 personas covers all themes, sentiments, sources. Enables instant value in portfolio. |
| **RICE** | Reach: 200, Impact: 2, Confidence: 95%, Effort: 1 → **38,000** |
| **Evidence** | Portfolio best practice: "Show, don't tell." Competitor demos often use fake data without labels — erodes trust. |
| **Risks** | Users think it's real → Mitigation: "DEMO/SYNTHETIC" badges everywhere, watermark, onboarding disclaimer |
| **Success Metrics** | Zero confusion reports; Portfolio viewers understand it's demo |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-007: Tech Stack — React + TypeScript + Vite + Tailwind + Recharts
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Technical |
| **Status** | Approved |
| **Decision Maker** | Lead Engineer |
| **Context** | Choose frontend stack for MVP. |
| **Options** | 1. React + TS + Vite + Tailwind (modern, fast) 2. Next.js (SSR, more complex) 3. Vue + Nuxt (team less familiar) 4. SvelteKit (smaller ecosystem) |
| **Rationale** | Team expertise in React/TS. Vite = fast dev/build. Tailwind = rapid UI. Recharts = declarative charts. No backend needed for MVP (localStorage/demo data). Deploy to Vercel/Netlify free tier. |
| **RICE** | Reach: 100, Impact: 1, Confidence: 95%, Effort: 1 → **9,500** |
| **Evidence** | Stack used successfully in 3 previous projects. Hiring pool large. |
| **Risks** | Recharts bundle size → Mitigation: Tree-shaking, lazy load chart pages |
| **Success Metrics** | Build time <60s; Bundle <500kb gzipped; Zero critical vulnerabilities |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

#### DEC-20240115-008: No Backend / Database for MVP
| Field | Value |
|-------|-------|
| **Date** | 2024-01-15 |
| **Type** | Technical |
| **Status** | Approved |
| **Decision Maker** | Lead Engineer, VP Product |
| **Context** | Backend adds complexity (auth, hosting, migrations, costs). |
| **Options** | 1. Full backend (PostgreSQL + API) 2. BaaS (Supabase/Firebase) 3. Local-first (IndexedDB + sync later) 4. Demo data only — no persistence |
| **Rationale** | MVP is a portfolio demo + validation tool. Demo data + localStorage for user-added feedback sufficient. Real backend in v1.1 when we have paying customers. |
| **RICE** | Reach: 100, Impact: 1, Confidence: 90%, Effort: 1 → **9,000** |
| **Evidence** | 80% of portfolio viewers never sign up. Premature backend = wasted effort. |
| **Risks** | User-added feedback lost on clear cache → Mitigation: Export/import JSON, clear warning |
| **Success Metrics** | Zero backend costs; Deploy preview on every PR |
| **Follow-up** | 2024-04-15 |
| **Outcome** | *Pending* |

---

### Decision Review Process

**Monthly Review (1st Monday):**
1. Review decisions with follow-up date = this month
2. Assess outcomes vs success metrics
3. Update decision log with outcomes
4. Identify patterns (systematic over/under-estimation)

**Quarterly Retrospective:**
1. Decision quality analysis (RICE calibration)
2. Process improvements
3. Template updates
4. Share learnings with team

---

*Decision Log v1.0 | Updated per decision | Owner: Product*