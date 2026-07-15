const fs = require('fs-extra');
const path = require('path');
const chalkModule = require('chalk');
const chalk = chalkModule.default || chalkModule;

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function validateMarkdownHeaderAny(filePath, expectedPrefixes) {
  if (!fs.existsSync(filePath)) return false;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const firstLine = (raw.split(/\r?\n/)[0] || '').trim();
    return expectedPrefixes.some(prefix => firstLine.startsWith(prefix));
  } catch {
    return false;
  }
}

function isTodoNonEmpty(todoPath) {
  if (!fs.existsSync(todoPath)) return false;
  const raw = fs.readFileSync(todoPath, 'utf8');
  const meaningfulLines = raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith('#'))
    .filter(line => !line.startsWith('>'))
    .filter(line => !line.includes('⚠️ HUMAN ONLY'))
    .filter(line => !line.startsWith('**Hard rule**'))
    // Filter placeholder-only checklist items.
    .filter(line => !(line === '- [ ]' || line === '- [x]' || line === '- [X]'))
    // Filter common template placeholders.
    .filter(line => !/^_.*_$/.test(line))
    .filter(line => {
      // Robust check for template phrase "Focus on the what and why", ignoring markdown symbols, punctuation, and case.
      const normalized = line.replace(/[^a-z]/gi, '').toLowerCase();
      // Matches "Focus on the **what** and **why**", "Focus on the what and why.", etc.
      return !normalized.includes('focusonthewhatandwhy');
    });

  return meaningfulLines.some(line => /[a-z0-9]/i.test(line));
}

async function statusProject(targetPath) {
  const resolvedPath = path.resolve(targetPath || process.cwd());

  console.log(chalk.blue(`📂 Project path: ${resolvedPath}`));

  // Core brains-back artifacts
  const todoPath = path.join(resolvedPath, 'brainsback/TODO.md');
  const reportPath = path.join(resolvedPath, 'brainsback/REPORT.md');
  const reactoPath = path.join(resolvedPath, 'brainsback/REACTO.md');
  const socraticReviewPath = path.join(resolvedPath, 'brainsback/SOCRATIC_REVIEW.md');

  // Copilot / GitHub integration
  const githubDir = path.join(resolvedPath, '.github');
  const copilotInstructionsPath = path.join(githubDir, 'copilot-instructions.md');
  const skillPath = path.join(githubDir, 'skills', 'mastery-aware-workflow', 'SKILL.md');
  const agentPath = path.join(githubDir, 'agents', 'brainsback-reviewer.md');

  const checks = [];

  // Core artifacts checks
  checks.push({
    label: 'brainsback/TODO.md present',
    ok: checkFileExists(todoPath),
  });

  checks.push({
    label: 'brainsback/TODO.md structure looks valid (starts with "# Strategic Blueprint" or "# TODO")',
    ok: validateMarkdownHeaderAny(todoPath, ['# Strategic Blueprint', '# TODO']),
  });

  checks.push({
    label: 'brainsback/REPORT.md present',
    ok: checkFileExists(reportPath),
  });

  checks.push({
    label: 'brainsback/REPORT.md structure looks valid (starts with "# Implementation Report" or "# REPORT")',
    ok: validateMarkdownHeaderAny(reportPath, ['# Implementation Report', '# REPORT']),
  });

  checks.push({
    label: 'brainsback/REACTO.md present',
    ok: checkFileExists(reactoPath),
  });

  checks.push({
    label: 'brainsback/REACTO.md structure looks valid (starts with "# Proof of Mastery (REACTO)" or "# REACTO-SE")',
    ok: validateMarkdownHeaderAny(reactoPath, ['# Proof of Mastery (REACTO)', '# REACTO-SE']),
  });

  checks.push({
    label: 'brainsback/SOCRATIC_REVIEW.md present',
    ok: checkFileExists(socraticReviewPath),
  });

  checks.push({
    label: 'brainsback/SOCRATIC_REVIEW.md structure looks valid (starts with "# Socratic Review" or "# SOCRATIC_REVIEW")',
    ok: validateMarkdownHeaderAny(socraticReviewPath, ['# Socratic Review', '# SOCRATIC_REVIEW']),
  });

  // Copilot integration checks
  checks.push({
    label: '.github directory present',
    ok: checkFileExists(githubDir),
  });

  checks.push({
    label: 'Copilot repository instructions (.github/copilot-instructions.md)',
    ok: checkFileExists(copilotInstructionsPath),
  });

  checks.push({
    label: 'Agent Skill: mastery-aware-workflow (.github/skills/...)',
    ok: checkFileExists(skillPath),
  });

  checks.push({
    label: 'Custom agent: brainsback-reviewer (.github/agents/...)',
    ok: checkFileExists(agentPath),
  });

  // TODO readiness check
  const todoReady = isTodoNonEmpty(todoPath);
  checks.push({
    label: 'brainsback/TODO.md has content (strategy defined)',
    ok: todoReady,
  });

  console.log('\n' + chalk.cyan('🧠 Brains-Back workflow status:') + '\n');

  let allCorePresent = true;
  let hasCopilotScaffolding = true;

  for (const check of checks) {
    const icon = check.ok ? chalk.green('✅') : chalk.red('❌');
    console.log(`${icon} ${check.label}`);
    if (!check.ok) {
      if ((check.label.includes('TODO.md') && !check.label.includes('has content')) ||
          check.label.includes('REPORT.md') ||
          check.label.includes('REACTO.md') ||
          check.label.includes('SOCRATIC_REVIEW.md')) {
        allCorePresent = false;
      }
      if (check.label.includes('.github') ||
          check.label.includes('Copilot repository instructions') ||
          check.label.includes('Agent Skill') ||
          check.label.includes('Custom agent')) {
        hasCopilotScaffolding = false;
      }
    }
  }

  console.log('\n');

  // Summary
  if (allCorePresent && todoReady) {
    console.log(chalk.green('✅ Core Mastery-Aware artifacts are present and brainsback/TODO.md has content.'));
  } else if (!allCorePresent) {
    console.log(chalk.red('❌ Core artifacts missing. Run `brainsback init` or restore missing files.'));
  } else if (!todoReady) {
    console.log(chalk.yellow('⚠️ brainsback/TODO.md is present but appears empty. Fill it before asking AI to implement.'));
  }

  if (hasCopilotScaffolding) {
    console.log(chalk.green('✅ GitHub Copilot integration artifacts are present.'));
  } else {
    console.log(chalk.yellow('⚠️ Some GitHub Copilot integration artifacts are missing. Re-run `brainsback init` to backfill.'));
  }

  console.log('\n' + chalk.gray('Tip: Use `brainsback init` to create or backfill artifacts, and `brainsback clear` to reset.'));
}

module.exports = { statusProject };
