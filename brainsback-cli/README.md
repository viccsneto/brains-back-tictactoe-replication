# Brains-Back CLI 🧠

A CLI tool for implementing **Mastery-Aware Pipelines** for LLM-assisted software development, based on the research paper "Putting Brains Back in the Loop".

## Overview

Brains-Back prevents the "Cognitive Bypass" - a workflow where developers become passive reviewers rather than active creators when using AI assistants. This tool enforces a structured approach that keeps human developers in control of the strategic thinking while allowing AI to handle implementation.

## Core Principles

- **brainsback/TODO.md**: Human-only strategic blueprint (AI cannot edit)
- **brainsback/REPORT.md**: AI-generated implementation summary
- **brainsback/REACTO.md**: Human proof of mastery before merging
- **brainsback/SOCRATIC_REVIEW.md**: AI-guided socratic debate for code review
- **Meta-development**: The tool itself follows its own methodology

## Installation

### From Git Repository (Global CLI)

```bash
npm install -g git+https://github.com/anonymousforpublication/brains-back.git
```

### For Development

```bash
git clone https://github.com/anonymousforpublication/brains-back.git
cd brains-back
npm install
npm link
```

## Usage

### Initialize a Project

```bash
# Initialize current directory
brainsback init

# Initialize specific path
brainsback init --path /path/to/project
```

This creates:
- `brainsback/TODO.md` - Strategic blueprint (human-only)
- `brainsback/REPORT.md` - Implementation summary (AI-generated)
- `brainsback/REACTO.md` - Proof of mastery (human-only)
- `brainsback/SOCRATIC_REVIEW.md` - Interactive code review and debate

### Check Project Status

```bash
# Check status of current directory
brainsback status

# Check status of specific path
brainsback status --path /path/to/project
```

This reports whether the core artifacts and GitHub Copilot integration files
are present, and whether `TODO.md` appears to have content.

### Clear Project Artifacts

```bash
# Clear with confirmation prompts
brainsback clear

# Force clear without prompts (dangerous!)
brainsback clear --force

# Clear specific path
brainsback clear --path /path/to/project
```

**⚠️ Warning**: The `clear` command will:
- Reset the current branch to the last commit
- Remove all agentic artifacts
- Require confirmation if uncommitted changes exist

## Workflow

### 1. Strategic Planning (Human-Only)
```bash
brainsback init
# Edit brainsback/TODO.md with your strategic blueprint
```

### 2. Implementation (AI-Assisted)
- AI reads brainsback/TODO.md for requirements
- AI implements based on the strategy
- AI updates brainsback/REPORT.md with changes

### 3. Mastery Proof (Human-Only)
- Fill out brainsback/REACTO.md to prove understanding:
  - **R**epeat: Problem statement
  - **E**xamples: Edge cases and invalid inputs
  - **A**pproach: Strategic overview
  - **C**ode Rationale: Load-bearing logic
  - **T**est Traceability: Coverage mapping
  - **O**ptimize: Performance analysis

### 4. Socratic Review (AI-Guided)
- Use `brainsback/SOCRATIC_REVIEW.md` to engage in a technical review dialog
- An AI reviewer agent challenges your implementation
- You must defend your design choices and code rationale via debate
- Acts as a final validation of your problem understanding and mastery

### 5. Meta-Development
The project itself can evolve using its own methodology:
- Update TODO.md with new features/fixes
- Let AI implement based on the TODO
- Fill REACTO.md to prove understanding
- Complete SOCRATIC_REVIEW.md for peer review emulation
- Use `brainsback clear` to reset when needed

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `brainsback init` | Initialize agentic workflow | `--path <path>` |
| `brainsback clear` | Reset and clear artifacts | `--path <path>`, `--force` |
| `brainsback status` | Show workflow status and readiness | `--path <path>` |
| `brainsback --help` | Show help information | |
| `brainsback --version` | Show version | |

## File Structure After Init

```
your-project/
├── brainsback/
│ ├── TODO.md              # 🧠 Human strategic blueprint
│ ├── REPORT.md            # 🤖 AI implementation summary
│ ├── REACTO.md            # 📝 Human proof of mastery
│ └── SOCRATIC_REVIEW.md   # 💬 AI-guided Socratic review debate
```

## AI Agent Guidelines

When working with a project initialized with Brains-Back:

1. **READ brainsback/TODO.md** before implementing anything
2. **NEVER CREATE OR MODIFY brainsback/TODO.md** (human-only file)
3. **UPDATE brainsback/REPORT.md** with implementation details
4. **RESPECT the strategic blueprint** in brainsback/TODO.md
5. **REFUSE TO CODE** if brainsback/TODO.md is empty

## Benefits

- **Prevents Cognitive Bypass**: Ensures humans maintain strategic control
- **Improves Code Quality**: Forces understanding before merging
- **Builds Mastery**: REACTO framework proves comprehension
- **Reduces Technical Debt**: Strategic planning prevents rushed implementations
- **Meta-Development**: Tool can evolve using its own methodology

## Research Background

Based on the paper "Putting Brains Back in the Loop: Mastery-Aware Pipelines for LLM-Assisted Software Development" which argues that while AI lowers the barrier to generating code, we must raise the bar for understanding it.

## Contributing

This project follows its own agentic workflow methodology. To contribute:

1. Fork the repository
2. Run `brainsback init` in your fork
3. Fill out brainsback/TODO.md with your planned changes
4. Implement the changes (AI-assisted if desired)
5. Complete brainsback/REACTO.md to prove your understanding
6. Engage in a review debate within brainsback/SOCRATIC_REVIEW.md
7. Submit a pull request with all artifacts

## License

MIT License - see LICENSE file for details.

---

**🧠 Keep the brains in the loop!**