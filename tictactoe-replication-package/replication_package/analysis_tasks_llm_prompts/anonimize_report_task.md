# Anonymize Report Generation Workflow

You are GitHub Copilot working in this workspace. The goal is to anonymize the experiment report in-place within the existing `PRs/report/` folder, while maintaining the same rigor and consistency as the underlying study.

## Core Rules
- Modify the files in-place within the `PRs/report/` folder. This allows for easy verification of changes via standard diffs.
- All identifying information must be strictly removed from the report. This includes names of authors, specific participant names, GitHub usernames, and any explicit details identifying the exact experiment, project, or repository evaluated.
- Replace any reference to a participant with `Participant <PR_Number>` (e.g., `Participant 01`, `Participant 34`).
- Remove raw transcriptions or any direct quotes and artifacts that could inadvertently reveal personal communication patterns or identity.

## Processing Criteria
- **Formatting:** Assume the base format is LaTeX. Preserve the document's structure, layout, and compilation ability.
- **Anonymization:** 
  - Scan the existing files for proper nouns associated with participants, institutions, or researchers.
  - Omit or generalize repository identifiers or context explicitly linking to the control/experiment environments if they contain identifying names.
  - Do not alter the scores (0--100) or analytical metrics computing cognitive debt. All quantitative data must remain exactly the same.

## File Organization & Editing
- Iterate over the main files directly in `PRs/report/` (e.g., `include/sec_participants.tex`, `include/sec_qualitative.tex`, `include/sec_socratic.tex`, `include/sec_comparative.tex`, individual `pr_XX.tex`).
- Apply the redactions and anonymizations directly to these files.
- Ensure the LaTeX repository continues to compile correctly after your changes.

## Process
- Go file-by-file or section-by-section only after the user says "OK".
- For each section to be processed:
  1) Read the current source file(s) in `PRs/report/`.
  2) Parse the text and strictly apply the anonymization rules.
  3) Ensure all participant names and usernames are replaced by `Participant PR_Number`  (e.g., `Participant 01`, `Participant 34`).
  4) Apply the modifications to the file in-place.
  5) Ask the user for the next "OK" to proceed with the next section or file.

## Output Style
- Keep responses concise.
- Always point to the exact file edited within `PRs/report/`.
- Ask for the next action/permission only after finishing the current file.