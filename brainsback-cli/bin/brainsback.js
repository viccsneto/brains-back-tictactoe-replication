#!/usr/bin/env node

const { program } = require('commander');
const chalkModule = require('chalk');
const chalk = chalkModule.default || chalkModule;
const packageJson = require('../package.json');
const { initProject } = require('../lib/commands/init');
const { clearProject } = require('../lib/commands/clear');
const { statusProject } = require('../lib/commands/status');

program
  .name('brainsback')
  .description('CLI tool for implementing Mastery-Aware Pipelines for LLM-assisted software development')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize a project with agentic development artifacts (TODO.md, REPORT.md, REACTO.md)')
  .option('-p, --path <path>', 'Target project path', process.cwd())
  .action(async (options) => {
    try {
      console.log(chalk.blue('🧠 Initializing Mastery-Aware Pipeline...'));
      await initProject(options.path);
      console.log(chalk.green('✅ Project initialized successfully!'));
      console.log(chalk.yellow('📝 Start by filling out TODO.md with your strategic blueprint.'));
    } catch (error) {
      console.error(chalk.red('❌ Error initializing project:'), error.message);
      process.exit(1);
    }
  });

program
  .command('clear')
  .description('Reset branch to last commit and clear artifacts (requires confirmation)')
  .option('-p, --path <path>', 'Target project path', process.cwd())
  .option('-f, --force', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      console.log(chalk.yellow('⚠️  Preparing to clear agentic artifacts...'));
      await clearProject(options.path, options.force);
      console.log(chalk.green('✅ Project cleared successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error clearing project:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check the current Mastery-Aware workflow status for this project')
  .option('-p, --path <path>', 'Target project path', process.cwd())
  .action(async (options) => {
    try {
      await statusProject(options.path);
    } catch (error) {
      console.error(chalk.red('❌ Error checking project status:'), error.message);
      process.exit(1);
    }
  });

program.parse();