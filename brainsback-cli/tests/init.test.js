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
const { initProject } = require('../lib/commands/init');

function createTempDir() {
  const prefix = path.join(os.tmpdir(), 'brainsback-init-');
  return fs.mkdtempSync(prefix);
}

describe('initProject', () => {
  test('creates core brains-back artifacts and GitHub integration files', async () => {
    const tmpDir = createTempDir();

    await initProject(tmpDir);

    const expectedFiles = [
      'brainsback/TODO.md',
      'brainsback/REPORT.md',
      'brainsback/REACTO.md',
      path.join('.github', 'copilot-instructions.md'),
      path.join('.github', 'skills', 'mastery-aware-workflow', 'SKILL.md'),
      path.join('.github', 'agents', 'brainsback-reviewer.md'),
    ];

    for (const relPath of expectedFiles) {
      const fullPath = path.join(tmpDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  test('is idempotent and does not throw when already initialized', async () => {
    const tmpDir = createTempDir();

    await initProject(tmpDir);

    // Second call should not throw and should keep existing files
    await expect(initProject(tmpDir)).resolves.not.toThrow();
  });
});
