const fs = require('fs-extra');
const path = require('path');
const chalkModule = require('chalk');
const chalk = chalkModule.default || chalkModule;

async function initProject(targetPath) {
  let templatesDir = path.join(__dirname, '../../templates');
  
  // Handle bundled environment where directory structure might be flatter (e.g. dist/brainsback.js)
  // We check for a known file (TODO.md) to ensure we found the correct directory, 
  // avoiding false positives if a 'templates' folder exists at the grandparent level (e.g. node_modules/templates).
  if (!fs.existsSync(path.join(templatesDir, 'TODO.md'))) {
    templatesDir = path.join(__dirname, '../templates');
  }
  
  // Check if target path exists
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  // Check if already initialized
  const brainsbackDir = path.join(targetPath, 'brainsback');
  const todoPath = path.join(brainsbackDir, 'TODO.md');
  if (fs.existsSync(todoPath)) {
    console.log(chalk.yellow('⚠️  Project already initialized with brains-back. Backfilling any missing artifacts...'));
  }

  // List of templates to copy
  const templates = [
    // Core brainsback artifacts
    { templatePath: 'TODO.md', targetPath: 'brainsback/TODO.md', description: 'Strategic Blueprint (human-only)' },
    { templatePath: 'REPORT.md', targetPath: 'brainsback/REPORT.md', description: 'Implementation Summary (AI-generated)' },
    { templatePath: 'REACTO.md', targetPath: 'brainsback/REACTO.md', description: 'Proof of Mastery (human-only)' },
    { templatePath: 'SOCRATIC_REVIEW.md', targetPath: 'brainsback/SOCRATIC_REVIEW.md', description: 'Socratic Review record (AI-serialized)' },

    // GitHub Copilot integration
    { templatePath: 'github/copilot-instructions.md', targetPath: '.github/copilot-instructions.md', description: 'Repository instructions for GitHub Copilot' },
    { templatePath: 'github/PULL_REQUEST_TEMPLATE.md', targetPath: '.github/PULL_REQUEST_TEMPLATE.md', description: 'PR template with mastery verification checklist' },
    { templatePath: 'github/skills/mastery-aware-workflow', targetPath: '.github/skills/mastery-aware-workflow', description: 'Agent Skill: Mastery-Aware Workflow' },
    { templatePath: 'github/skills/verify-as-you-go', targetPath: '.github/skills/verify-as-you-go', description: 'Agent Skill: Verify-As-You-Go' },
    { templatePath: 'github/agents/brainsback-reviewer.md', targetPath: '.github/agents/brainsback-reviewer.md', description: 'Custom agent: Socratic Brains-Back Reviewer' }
  ];

  console.log(chalk.blue('📁 Creating agentic workflow artifacts...'));
  
  // Copy each template
  for (const template of templates) {
    const sourcePath = path.join(templatesDir, template.templatePath);
    const targetFilePath = path.join(targetPath, template.targetPath);

    // Ensure parent directory exists for nested targets (e.g. .github/...)
    const targetDir = path.dirname(targetFilePath);
    await fs.ensureDir(targetDir);
    
    if (fs.existsSync(targetFilePath)) {
      console.log(chalk.yellow(`⚠️  ${template.targetPath} already exists, skipping...`));
      continue;
    }

    try {
      await fs.copy(sourcePath, targetFilePath);
      console.log(chalk.green(`✅ Created ${template.targetPath} - ${template.description}`));
    } catch (error) {
      throw new Error(`Failed to create ${template.targetPath}: ${error.message}`);
    }
  }

  // Instructions
  console.log(chalk.blue('\n🧠 Mastery-Aware Pipeline initialized!'));
  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.white('1. 📝 Edit brainsback/TODO.md with your strategic blueprint'));
  console.log(chalk.white('2. 🤖 Have your AI implement based on brainsback/TODO.md'));
  console.log(chalk.white('3. 📋 Fill brainsback/REACTO.md to prove your mastery'));
  console.log(chalk.white('4. 🔄 Use `brainsback clear` to reset when needed'));
  
  console.log(chalk.yellow('\n⚡ Key principles:'));
  console.log(chalk.gray('• brainsback/TODO.md is human-only (AI cannot edit)'));
  console.log(chalk.gray('• brainsback/REPORT.md is AI-generated summary'));
  console.log(chalk.gray('• brainsback/REACTO.md proves your understanding'));
  console.log(chalk.gray('• brainsback/SOCRATIC_REVIEW.md is the AI-serialized record of the Socratic mastery exchange'));
}

module.exports = { initProject };