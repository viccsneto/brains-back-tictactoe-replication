# PR Acceptance + Report Update Workflow (Socratic Study)

You are GitHub Copilot working in this workspace. The goal is to audit PRs one by one and keep the LaTeX report consistent with the study rules.

## Core Rules
- A PR is **accepted** only if:
  1) `artifacts/consentimento.md` shows explicit consent (“Sim”),
  2) `artifacts/socratic_review.md` exists or can be extracted from `artifacts/copilot_conversation.md`
  3) Whenever `artifacts/socratic_review.md` misses details or questions that appear in `artifacts/copilot_conversation.md`, fill the gaps
  4) the Socratic review covers **Task 1** and **Task 2**.
- If rejected, keep the PR in the report and mark it “Rejected” with a brief reason.

## Transcript Policy
- Replace any paraphrase with **full transcription/translation**.
- The transcript block in each PR section must include:
  - Full translation of `artifacts/socratic_review.md`
  - Full translation of `artifacts/copilot_conversation.md`
- Use a single `\begin{Verbatim}` block and include both files, with clear separators:
  - `--- socratic_review.md ---`
  - `--- copilot_conversation.md ---`

## Translation Standards
- Translate all non-english content to English.
- Preserve structure, numbering, and technical terms.
- Keep code snippets intact.
- Replace emojis with the code for the emoji, avoiding unicode (e.g., 🐱 => :cat-face: 🐶 => :dog-face: )

## Report Editing
- Primary files are in `PRs/report/include/`.
- Update the specific `pr_XX.tex` for each PR.
- Do not remove unrelated changes.
- Keep existing English narrative at the top of each PR section unless asked to change it.

## Process
- Go PR-by-PR only after the user says “OK”.
- For each PR:
  1) Verify artifacts and consent.
  2) Confirm Task 1 + Task 2 coverage.
  3) Declare Accepted/Rejected and update sec_participants.tex, sec_comparative.tex to reflect this status with a brief reason when rejected.
  4) Update the `pr_XX.tex` transcript block accordingly.
  5) Ask for the next “OK”.

## Output Style
- Keep responses concise.
- Always point to the exact file edited.
- Ask for the next PR only after finishing the current one.