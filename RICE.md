# RICE Prioritization Framework
## Voice of Customer Copilot

### Overview

RICE = **Reach × Impact × Confidence ÷ Effort**

This framework helps prioritize features, opportunities, and initiatives objectively. Applied to VoC Copilot's own roadmap and recommended for PMs using the tool.

---

### RICE Components Defined

| Component | Scale | Definition for VoC Copilot |
|-----------|-------|---------------------------|
| **Reach** | # of users/quarter | Number of PMs/customers affected per quarter |
| **Impact** | 0.25 / 0.5 / 1 / 2 / 3 | Effect on key metric (time savings, decision quality, adoption) |
| **Confidence** | 0-100% | Evidence level: data (100%), research (80%), expert opinion (50%), gut (20%) |
| **Effort** | Person-weeks | Total engineering + design + PM weeks |

---

### Impact Scale Calibration

| Score | Label | Description |
|-------|-------|-------------|
| 3 | Massive | Transformational — changes how PMs work daily |
| 2 | High | Significant — solves major pain point for many |
| 1 | Medium | Meaningful — noticeable improvement |
| 0.5 | Low | Minor — nice to have, incremental |
| 0.25 | Minimal | Barely noticeable |

---

### VoC Copilot MVP Feature RICE Scores

| Feature | Reach (PMs/qtr) | Impact | Confidence | Effort (pw) | RICE Score | Priority |
|---------|-----------------|--------|------------|-------------|------------|----------|
| **Feedback Inbox (CRUD + filters)** | 100 | 2 (High) | 95% | 3 | **6,333** | P0 |
| **AI Theme Clustering (11 themes)** | 100 | 3 (Massive) | 85% | 4 | **6,375** | P0 |
| **Insights Dashboard (charts + metrics)** | 100 | 2 (High) | 90% | 3 | **6,000** | P0 |
| **Opportunity Analysis (score + rationale)** | 100 | 3 (Massive) | 80% | 3 | **8,000** | P0 |
| **Prioritization Matrix (Impact×Freq)** | 100 | 2 (High) | 85% | 2 | **8,500** | P0 |
| **PM Recommendations (High/Investigate/Low)** | 100 | 3 (Massive) | 75% | 2 | **11,250** | P0 |
| **AI Chat Assistant** | 80 | 2 (High) | 70% | 4 | **2,800** | P1 |
| **Decision Log** | 60 | 1 (Medium) | 80% | 2 | **2,400** | P1 |
| **RICE Calculator** | 50 | 1 (Medium) | 90% | 1 | **4,500** | P1 |
| **Export (PDF/CSV)** | 70 | 0.5 (Low) | 95% | 2 | **1,662** | P2 |
| **Slack Integration** | 40 | 1 (Medium) | 60% | 3 | **800** | P2 |
| **Jira/Linear Sync** | 30 | 2 (High) | 50% | 5 | **600** | P3 |
| **Custom Themes** | 20 | 1 (Medium) | 60% | 4 | **300** | P3 |
| **Multi-workspace/SSO** | 10 | 0.5 (Low) | 90% | 6 | **75** | P4 |

---

### RICE Formula

```
RICE = (Reach × Impact × Confidence) / Effort
```

**Example Calculation — AI Chat Assistant:**
- Reach: 80 PMs/quarter (80% of users)
- Impact: 2 (High — saves 15 min/query)
- Confidence: 70% (based on Viable/Enterpret validation)
- Effort: 4 person-weeks
- RICE = (80 × 2 × 0.7) / 4 = **28** → **2,800** (normalized ×100)

---

### Opportunity RICE Scoring (For PMs Using Tool)

When PMs analyze opportunities in VoC Copilot, we calculate RICE automatically:

| Variable | Source in VoC Copilot |
|----------|----------------------|
| **Reach** | `opportunity.affectedCustomers` (unique customers mentioning theme) |
| **Impact** | `opportunity.impactScore / 10` normalized to 0.25-3 scale |
| **Confidence** | `opportunity.confidence` (60-95%) |
| **Effort** | Mapped: Low=1, Medium=3, High=6 person-weeks |

**Example — Reliability Opportunity:**
- Reach: 12 customers
- Impact: 8/10 → 2.0 (High)
- Confidence: 85%
- Effort: High (6 pw)
- RICE = (12 × 2.0 × 0.85) / 6 = **3.4** → **340**

---

### RICE Calculator Component (For PMs)

```typescript
interface RICEInputs {
  reach: number;           // # customers affected per quarter
  impact: 0.25 | 0.5 | 1 | 2 | 3;
  confidence: number;      // 0-100%
  effortWeeks: number;     // person-weeks
}

function calculateRICE(inputs: RICEInputs): number {
  return Math.round((inputs.reach * inputs.impact * (inputs.confidence / 100)) / inputs.effortWeeks * 100);
}

function getRICELabel(score: number): string {
  if (score >= 500) return '🔴 Critical — Do Now';
  if (score >= 200) return '🟠 High — Schedule Soon';
  if (score >= 100) return '🟡 Medium — Plan For';
  if (score >= 50) return '🟢 Low — Nice to Have';
  return '⚪ Minimal — Deprioritize';
}
```

---

### RICE Best Practices for PMs

1. **Calibrate as a team** — Run 5-10 historical features through RICE together
2. **Use ranges, not points** — "Reach: 50-100" → calculate best/worst case
3. **Confidence = evidence quality** — Not optimism
   - 100%: A/B test result, clear revenue data
   - 80%: Strong user research, competitor precedent
   - 50%: Expert opinion, weak proxy metrics
   - 20%: Gut feel, "vision"
4. **Effort = total team effort** — Eng + Design + PM + QA + Docs
5. **Re-score quarterly** — As confidence increases, RICE changes
6. **Don't optimize the formula** — Use for relative comparison, not absolute truth

---

### Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Inflating Impact** | Everything is "Massive" | Calibrate with historical: "Did last 'Massive' feature move metric 3x?" |
| **Underestimating Effort** | Forgets design, docs, edge cases | Use historical velocity: "Similar feature took 4 pw last time" |
| **Confidence = Optimism** | "I'm sure it'll work" | Ask: "What would prove me wrong?" |
| **Ignoring Reach** | Focuses only on strategic accounts | Include all affected segments |
| **RICE Theater** | Calculates but ignores result | Make RICE gate for sprint planning |

---

### RICE in VoC Copilot Workflow

```
Feedback Inbox → AI Clustering → Themes → Opportunities → RICE Scores → Prioritization Matrix → PM Recommendations → Decision Log
                                                              ↑
                                              Auto-calculated from opportunity data
```

**PM Action:** Review auto-calculated RICE, adjust confidence/effort based on context, use for roadmap sequencing.

---

*Framework adapted from Intercom/Sean McBride | Integrated into VoC Copilot v1.0*