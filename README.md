# Brains-Back TicTacToe Replication Package

This repository contains the artifacts and replication package for the Tic-Tac-Toe Experiment on LLM-assisted software development.

## Repository Structure 

- **`brainsback-cli/`**: Contains the source code for the `brainsback` CLI tool, managing the creation and status of agentic artifacts like `TODO.md`, `REPORT.md`, `REACTO.md`, and `SOCRATIC_REVIEW.md`. See its nested README for installation and usage instructions.

- **`tictactoe-replication-package/`**: Tic-Tac-Toe Experiment - Replication Package.
  - **`tic-tac-toe-experiment-report/`**: The final experiment report `experiment_report.pdf`. This report details the study's qualitative methodology and the results of analyzing pull requests and interviews from the study participants facing cognitive debt in an AI-assisted tic-tac-toe task.
  - **`replication_package/`**: The Artifact Availability package for the quasi-experiment. Includes:
    - **`PRs/`** — participant submissions, one folder per pull request, labeled by disposition (`SOCRATIC`, `MISSING_SOCRATIC`, `INCOMPLETE_SOCRATIC`, `DISCARDED_DUPLICATE`). Each folder holds the delivered code, pipeline tooling, reflective artifacts (`brainsback/`), and evaluation artifacts (`artifacts/`).
    - **`analysis_tasks_llm_prompts/`** — the LLM workflow prompts governing data processing (anonymization, per-PR scoring rubric, accept/reject criteria, and reliability verification).
    - **`experiment_project_baseline/`** — the baseline project delivered to participants at the start of the experiment.
    - **`task_timing_analysis.py`** — computes per-task timing metrics from participant submission data.
    - **`task_complexity_analysis.py`** — derives task complexity indicators used in the quantitative analysis.
