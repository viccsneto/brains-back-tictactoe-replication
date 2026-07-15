# Tic-Tac-Toe Experiment - Replication Package

Anonymized artifacts for the quasi-experiment on the Mastery-Aware Pipeline for
LLM-assisted software development.

## Contents

- **`PRs/`** — the participant submissions, one folder per pull request. The suffix
  in each folder name indicates its disposition:
  - `PR_NN_SOCRATIC` — included in the analysis (complete Socratic review present).
  - `PR_NN_MISSING_SOCRATIC` — excluded: Socratic review absent.
  - `PR_NN_INCOMPLETE_SOCRATIC` — excluded: Socratic review present but missing required elements.
  - `PR_NN_DISCARDED_DUPLICATE` — excluded: duplicate submission from the same participant.

  The `NN` is the PR number used throughout the paper and the extended report. Each
  folder holds the delivered code (`game.js`, `script.js`, `index.html`, `style.css`,
  `tests/`), the task instructions (`README.md`), the pipeline toggle
  (`pipeline.sh`/`.bat`), the intervention tooling (`__tools__/enabled.github/` — the
  custom Copilot instructions and skills that *are* the pipeline), the reflective
  artifacts (`brainsback/`), and the evaluation artifacts (`artifacts/socratic_review.md`,
  `artifacts/copilot_conversation.md`).

- **`analysis_tasks_llm_prompts/`** — the LLM workflow prompts that governed data
  processing, our documented evidence that scoring followed a fixed, auditable protocol:
  - `anonimize_report_task.md` — the report anonymization workflow.
  - `assess_individual_participants_task.md` — the per-PR scoring rubric
    (Module Explanation 0–45 / Socratic Debate 0–35 / Design Justification 0–20).
  - `integrate_pr_task.md` — accept/reject criteria (consent + Socratic review for
    both tasks) and the full-transcription policy.
  - `verify_report_reliability_task.md` — the **independent** reliability pass that
    cross-checks every report section against the primary artifacts.

- **`experiment_project_baseline/`** — the baseline project delivered to participants
  at the start of the experiment (the initial state of the codebase before any task).

- **`task_timing_analysis.py`** — script that computes per-task timing metrics from
  the participant submission data.

- **`task_complexity_analysis.py`** — script that derives task complexity indicators
  used in the quantitative analysis.


## Anonymization

All directly identifying information has been removed: consent forms deleted;
participant names, registration numbers (matrículas), and GitHub usernames scrubbed
from every text artifact; the shared lecture-slide PDF (which named the researchers
and institution) removed; and `.git*`/`.vscode`/`.DS_Store` cruft stripped. The
build is reproducible and was verified to contain zero residual PII. Scores and all
quantitative metrics are preserved exactly.
