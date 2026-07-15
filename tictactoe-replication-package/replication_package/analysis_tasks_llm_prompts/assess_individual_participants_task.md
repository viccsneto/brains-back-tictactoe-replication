# Individual Participant Scoring Workflow (Socratic Study)

You are GitHub Copilot working in this workspace. The goal is to score PRs one by one and keep the LaTeX report consistent with the study rules.

## Core Rules
- Use the existing Accepted/Rejected status as already recorded in the report.
- The status can be inferred from [PRs/report/include/sec_participants.tex](PRs/report/include/sec_participants.tex) and/or the corresponding `pr_XX.tex`.
- Reject the participant if the Socratic debate is missing for either Task 1 or Task 2 (incomplete debate means rejected).
- Do not reuse pre-calculated or pre-inferred metrics from the report. Recompute everything from the artifacts and code.
- Update all dependent sections after each PR (ongoing updates per PR, not after a full pass).
- Recalculate `Debt`, `Conversation`, and `Review` fields in `sec_participants.tex` for each PR.
- Record cognitive debt per task (Task 1: Low/Medium/High, Task 2: Low/Medium/High) and add a field indicating which task has the smaller debt (T1, T2, or Tie).

## Scoring Criteria
- Rejected cases must show `--` for all metrics.
- Accepted cases must score each metric and compute a total (0--100).
- Use this rubric:
  - **Module explanation (0--45):** Ability to describe interactions between components without looking at the code.
  - **Socratic debate (0--35):** Quality of answers to technical questions.
  - **Design justification (0--20):** Understanding of the architectural \emph{rationale}.
  
## Report Editing
- Primary reference files are in `PRs/report/include/`.
- Do not remove unrelated changes.
- For each PR, generate or update the relevant entries in:
  - `sec_participants.tex`
  - `sec_qualitative.tex`
  - `sec_socratic.tex`
  - `sec_comparative.tex`

## Process
- Go PR-by-PR only after the user says “OK”.
- For each PR:
  1) Read `pr_XX.tex`, `artifacts/socratic_review.md`, and `artifacts/copilot_conversation.md`.
  2) Check the repository/PR code to validate contribution quality and adherence to the answers.
  3) Infer Accepted/Rejected from [PRs/report/include/sec_participants.tex](PRs/report/include/sec_participants.tex) or `pr_XX.tex`.
  4) If rejected, assign `--` to all metrics and skip scoring.
  5) If accepted, score Task 1 and Task 2 separately using the defined Scoring Criteria.
  6) Compute totals for Task 1 and Task 2, then compute the delta (Task 2 minus Task 1) as the cognitive debt shift.
  7) Record a brief note explaining the delta (e.g., which dimension changed and why).
  8) Update all dependent report sections with the recomputed metrics for this PR.
  9) Ask for the next “OK”.

## Output Style
- Keep responses concise.
- Always point to the exact file edited.
- Ask for the next PR only after finishing the current one.