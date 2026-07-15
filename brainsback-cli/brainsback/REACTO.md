# Proof of Mastery (REACTO)

> Explain it to prove you own it.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## R — The Problem
The initial proposal of the "Brains-Back" workflow assumed the Socratic review component would execute via GitHub Copilot's PR Reviewer on GitHub.com. However, the PR reviewer currently fails to adhere to custom instruction prompting. Since the paper has shifted from new ideas track to a traditional track, we need an actively working implementation. Thus, the Socratic review step must be moved into the VS Code IDE workflow where Copilot successfully executes custom instructions, requiring updates to both the paper and the `brainsback` CLI tool.

## E — Examples
- **Input**: A workflow where a PR triggers the AI Socratic debate on GitHub.com.
  **Output**: A workflow where `SOCRATIC_REVIEW.md` is generated and interactively debated in VS Code *before* making the PR.
- **Input**: The CLI tool generating `TODO.md`, `REPORT.md`, and `REACTO.md`.
  **Output**: The CLI tool now also generates `SOCRATIC_REVIEW.md` during `brainsback init`.

## A — Approach
1. Locate and update instances in the paper claiming Socratic review occurs via PR review on GitHub.com, explicitly explaining the limitation and the pivot to the VS Code IDE.
2. Formally introduce `SOCRATIC_REVIEW.md` as an equal-weight artifact in both the paper and the CLI workflow.
3. Add `SOCRATIC_REVIEW.md` to `brainsback` CLI templates and initialization sequence.
4. Add illustrative examples of `SOCRATIC_REVIEW.md` and `REPORT.md` to the paper using the running example issue.
5. Compile and review the LaTeX paper for flow, contradictions, and successful builds.

## C — Code
Changes span both the LaTeX source (`paper/main.tex` and includes) and the Node.js CLI tool (`lib/commands/init.js`, `templates/`). The main trade-off is organizational: moving review from the PR stage to the local IDE stage actually tightens the feedback loop, but requires an additional artifact (`SOCRATIC_REVIEW.md`) to prove the debate happened.

## T — Tests
1. Compile the paper using `latexmk` and ensure a successful, warning-free PDF build.
2. Read the resulting paper to verify continuity and that no PR-review-based Socratic claims remain.
3. Run the CLI test suite (`npm test`) to ensure `init.test.js` expects the new `SOCRATIC_REVIEW.md` file.

## O — Optimization
N/A. This is a workflow, architecture, and documentation pivot, not an algorithmic optimization.