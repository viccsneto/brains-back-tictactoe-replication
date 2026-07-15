const fs = require('fs-extra');
const path = require('path');
const chalkModule = require('chalk');
const chalk = chalkModule.default || chalkModule;
const simpleGit = require('simple-git');
const inquirer = require('inquirer');

async function clearProject(targetPath, force = false) {
  const brainsbackDir = path.join(targetPath, 'brainsback');
  const todoPath = path.join(brainsbackDir, 'TODO.md');
  
  // Check if project is initialized
  if (!fs.existsSync(todoPath)) {
    throw new Error('Project is not initialized with brains-back. Run `brainsback init` first.');
  }

  // Get git status
  const git = simpleGit(targetPath);
  const isRepo = await git.checkIsRepo();
  
  if (!isRepo) {
    throw new Error('Not a git repository. Clear command requires git for safety.');
  }

  const status = await git.status();
  const hasChanges = status.files.length > 0;

  // Show warning and get confirmation unless forced
  if (!force) {
    console.log(chalk.red('⚠️  WARNING: This will:'));
    console.log(chalk.yellow('  • Reset current branch to last commit (if changes exist)'));
    console.log(chalk.yellow('  • Reset agentic artifacts (TODO.md, REACTO.md) and delete REPORT.md and SOCRATIC_REVIEW.md'));
    
    if (hasChanges) {
      console.log(chalk.red('\n💀 UNCOMMITTED CHANGES DETECTED:'));
      status.files.forEach(file => {
        console.log(chalk.red(`    ${file.working_dir || file.index}${file.path}`));
      });
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clear the project?',
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.blue('Operation cancelled.'));
      return;
    }

    // Double confirmation if there are changes
    if (hasChanges) {
      const { doubleConfirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'doubleConfirm',
          message: 'This will PERMANENTLY delete uncommitted changes. Continue?',
          default: false
        }
      ]);

      if (!doubleConfirm) {
        console.log(chalk.blue('Operation cancelled.'));
        return;
      }
    }
  }

  // Reset git if there are changes
  if (hasChanges) {
    console.log(chalk.yellow('🔄 Resetting to last commit...'));
    await git.reset(['--hard', 'HEAD']);
    await git.clean('f', ['-d']);
    console.log(chalk.green('✅ Git reset complete'));
  }

  // Reset agentic artifacts
  console.log(chalk.yellow('🔄 Resetting agentic artifacts...'));

  // Get templates directory (assuming structure: lib/commands/clear.js -> ../../templates/)
  let templatesDir = path.join(__dirname, '../../templates');
  // Handle bundled environment where directory structure might be flatter (e.g. dist/brainsback.js)
  // We check for a known file (TODO.md) to ensure we found the correct directory, 
  // avoiding false positives if a 'templates' folder exists at the grandparent level (e.g. node_modules/templates).
  if (!fs.existsSync(path.join(templatesDir, 'TODO.md'))) {
    templatesDir = path.join(__dirname, '../templates');
  }

  // 1. Delete REPORT.md
  const reportPath = path.join(targetPath, 'brainsback/REPORT.md');
  if (fs.existsSync(reportPath)) {
    await fs.remove(reportPath);
    console.log(chalk.gray('   Deleted brainsback/REPORT.md'));
  }

  // 1b. Delete SOCRATIC_REVIEW.md
  const socraticReviewPath = path.join(targetPath, 'brainsback/SOCRATIC_REVIEW.md');
  if (fs.existsSync(socraticReviewPath)) {
    await fs.remove(socraticReviewPath);
    console.log(chalk.gray('   Deleted brainsback/SOCRATIC_REVIEW.md'));
  }

  // 2. Reset TODO.md and REACTO.md from templates
  const resetArtifacts = [
    { template: 'TODO.md', target: 'brainsback/TODO.md' },
    { template: 'REACTO.md', target: 'brainsback/REACTO.md' }
  ];

  for (const item of resetArtifacts) {
    const source = path.join(templatesDir, item.template);
    const dest = path.join(targetPath, item.target);
    
    // Ensure destination directory exists (should already exist, but good safety)
    await fs.ensureDir(path.dirname(dest));

    try {
      await fs.copy(source, dest, { overwrite: true });
      console.log(chalk.gray(`   Reset ${item.target} to template`));
    } catch (err) {
      console.warn(chalk.red(`   Failed to reset ${item.target}: ${err.message}`));
    }
  }

  console.log(chalk.green('\n✅ Project iteration cleared successfully!'));
  console.log(chalk.cyan('Ready for the next iteration cycle.'));
}

module.exports = { clearProject };