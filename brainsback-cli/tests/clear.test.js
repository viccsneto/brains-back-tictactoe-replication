jest.mock('chalk', () => {
  const passthrough = (s) => s;
  const methods = {
    blue: passthrough,
    green: passthrough,
    yellow: passthrough,
    red: passthrough,
    gray: passthrough,
    cyan: passthrough,
    white: passthrough,
  };
  return { default: methods, ...methods };
});

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const simpleGit = require('simple-git');
const { initProject } = require('../lib/commands/init');
const { clearProject } = require('../lib/commands/clear');

function createTempGitRepo() {
  const prefix = path.join(os.tmpdir(), 'brainsback-clear-');
  const tmpDir = fs.mkdtempSync(prefix);
  const git = simpleGit(tmpDir);
  return { tmpDir, git };
}

describe('clearProject', () => {
  test('resets brains-back artifacts in a git repository when forced', async () => {
    const { tmpDir, git } = createTempGitRepo();

    // Initialize git repo
    await git.init();

    // Create an initial commit so reset/clean have a target
    await fs.writeFile(path.join(tmpDir, 'README.md'), '# Temp Repo', 'utf8');
    await git.add('.');
    await git.commit('chore: initial commit');

    // Initialize brains-back artifacts
    await initProject(tmpDir);
    // Modify TODO.md to simulate work
    const todoPath = path.join(tmpDir, 'brainsback/TODO.md');

    // commits the brains-back artifacts so that it will simulate a clean state of an initialized project
    await fs.writeFile(todoPath, '# Stable Change', 'utf8');
    await git.add('.');
    await git.commit('Add stable changes');


    await fs.writeFile(todoPath, '# Modified Content', 'utf8');

    // Sanity check that artifacts exist
    const artifacts = ['brainsback/TODO.md', 'brainsback/REPORT.md', 'brainsback/REACTO.md'];
    for (const relPath of artifacts) {
      expect(fs.existsSync(path.join(tmpDir, relPath))).toBe(true);
    }

    // Clear with force to skip interactive prompts
    await clearProject(tmpDir, true);

    // REPORT.md should be removed
    expect(fs.existsSync(path.join(tmpDir, 'brainsback/REPORT.md'))).toBe(false);

    // TODO.md and REACTO.md should exist
    expect(fs.existsSync(path.join(tmpDir, 'brainsback/TODO.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'brainsback/REACTO.md'))).toBe(true);

    // TODO.md should be reset (not equal to modified content)
    const resetContent = await fs.readFile(todoPath, 'utf8');
    expect(resetContent).not.toContain('# Stable Change');
    expect(resetContent).not.toContain('# Modified Content');
  });

  test('throws when not a git repository', async () => {
    const prefix = path.join(os.tmpdir(), 'brainsback-clear-non-git-');
    const tmpDir = fs.mkdtempSync(prefix);

    await initProject(tmpDir);

    await expect(clearProject(tmpDir, true)).rejects.toThrow('Not a git repository');
  });
});
