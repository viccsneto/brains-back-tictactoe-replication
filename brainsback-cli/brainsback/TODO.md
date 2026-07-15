# Strategic Blueprint

> Focus on the **what** and **why**. The code will follow.

**Hard rule**: AI agents must not edit this file and must not draft paste-ready content for it.

## The Problem
Revieweing the current version of the paper, there are some clarifications and fixes still pending. The initial idea of the cognitive reviewer was to use Github Copilot Reviewer on github.com to engage in a socratic debate. This idea came as a proposal for the new ideas track and for that reason it was hypothetical and even though it didn't need to work, just to be plausible, we tried our best to guide GitHub Copilot to follow custom instructions during review, but for mysterious reasons it, refuses and fallback for standard revision. However, the paper evolved to the traditional track, and we cannot stay in the comfort of hypothesis anymore. We believe that soon the copilot at github.com will be able to answer to custom instructions, or that it can be achieved differently than in the PR review mode, but on github's action features, we haven't explored that option yet. We had no problem running the socratic debate github copilot on the VSCode IDE and it works perfectly as the proposal, for that reason, we need to update the paper to reflect on that.

## Steps
- [x] Find the locations where it claims the socratic review is ran under the Pull Request reviewing process by github.com copilot reviewer
- [x] Update the info stating that unfortunately, despite the best of the efforts, it didn't work as convenient as expected and that this feature had to be moved back to vscode copilot, working pretty well.
- [x] Introduce a new artifact SOCRATIC_REVIEW.md both in the paper (with the same importance as REACTO.md and REPORT.md) and the brainsback cli tool (through its custom instructions templates and agentic SKILLs)
- [x] Add a SOCRATIC_REVIEW.md artifact example to the paper, similar to the TODO.md. Also, also add a REPORT.md artifact to the paper in case it is missing.  All these artifacts should relate to the same issue approached in the paper examples.
- [x] Double check that no contradictions were introduced with this change
- [x] Verify that the paper compiles without any problems

## Success Looks Like
- [ ] The paper no longer holds to the initial idea of running the socratic reviewer in PR reviewing time, but prior to it

## Notes
- [ ] 

---
**⚠️ HUMAN ONLY**: This file is your strategic space. AI agents must not edit it.