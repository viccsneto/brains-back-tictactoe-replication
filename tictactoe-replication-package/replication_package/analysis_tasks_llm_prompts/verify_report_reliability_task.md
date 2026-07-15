# Report Reliability Verification Workflow (Socratic Study)

You are GitHub Copilot working in this workspace. The goal is to verify the reliability of the report by cross-checking every section for consistency and correcting any errors found. The workflow must be as rigorous as the individual participant scoring task, but focused on report integrity and ordering.

## Core Rules
- Use the report files in `PRs/report/include/` as the primary source of truth for structure and placement.
- Do not trust pre-calculated values if they conflict across sections; recompute or re-derive from primary artifacts.
- If a mismatch is found, fix the report to make sections consistent and traceable to the underlying PR artifacts.
- Preserve unrelated changes.
- Reorder entries by PR number in every section that lists participants or PRs.
- Every fix must keep section narratives aligned with the updated data.

## Scope (What to Verify)
- Methodology: `sec_methodology.tex`
- Participant tables and metrics: `sec_participants.tex`.
- Socratic summaries: `sec_socratic.tex`.
- Qualitative notes: `sec_qualitative.tex`.
- Comparative summaries: `sec_comparative.tex`.
- Per-PR summaries: `pr_XX.tex` files referenced in the report.
- Limitations: `sec_limitations.tex`
- Conclusion: `sec_conclusion.tex`

## Consistency Checks
- **PR presence:** Every PR listed in one section must appear in all applicable sections.
- **Acceptance status:** Accepted/Rejected must match across `sec_participants.tex` and `pr_XX.tex`.
- **Metrics:** If accepted, scores and totals must match between `sec_participants.tex`, any per-PR tables, and comparative sections.
- **Rejected format:** Rejected cases must show `--` for all metrics everywhere if they appear.
- **Cognitive debt fields:** Task 1 and Task 2 debt levels and the smaller-debt indicator must match across sections.
- **Cognitive debt thresholds:** 0--59 = High, 60--79 = Medium, 80--100 = Low.
- **Delta notes:** Any delta explanation must align with the numeric deltas shown.
- **Ordering:** All lists, tables, and narrative enumerations must be ordered by PR number ascending.

## Process
- Work section-by-section, but always reconcile cross-references before moving on.
- For each inconsistency:
  1) Identify the source of truth (artifacts, `pr_XX.tex`, or underlying data).
  2) Update all affected report sections to match.
  3) Reorder entries by PR number in all affected sections.
- When PR numbers are missing or ambiguous, confirm from folder names in `PRs/` and the corresponding `pr_XX.tex`.

## Output Style
- Keep responses concise.
- Always point to the exact files edited.
- After each batch of fixes, list which sections are now consistent and which remain to be verified.
