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
const { statusProject } = require('../lib/commands/status');

function createTempDir() {
  const prefix = path.join(os.tmpdir(), 'brainsback-status-');
  return fs.mkdtempSync(prefix);
}

describe('statusProject', () => {
  test('reports a healthy workflow after init', async () => {
    const tmpDir = createTempDir();
    await initProject(tmpDir);

    // Add minimal content to brainsback/TODO.md so it is considered non-empty
    const todoPath = path.join(tmpDir, 'brainsback/TODO.md');
    await fs.appendFile(todoPath, '\nNon-empty content for tests.');

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await statusProject(tmpDir);

    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n');

    expect(output).toContain('Core Mastery-Aware artifacts are present and brainsback/TODO.md has content');
    expect(output).toContain('GitHub Copilot integration artifacts are present');

    logSpy.mockRestore();
  });

  test('warns when brainsback/TODO.md is empty', async () => {
    const tmpDir = createTempDir();
    await initProject(tmpDir);

    // Explicitly set brainsback/TODO.md to header only to trigger the warning
    fs.writeFileSync(path.join(tmpDir, 'brainsback/TODO.md'), '# TODO');

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await statusProject(tmpDir);

    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n');

    expect(output).toContain('brainsback/TODO.md is present but appears empty');

    logSpy.mockRestore();
  });

  test('accepts alternate headers for TODO/REPORT/REACTO validation', async () => {
    const tmpDir = createTempDir();
    await initProject(tmpDir);

    // Use alternate accepted headers and ensure TODO has meaningful (non-template) content.
    fs.writeFileSync(
      path.join(tmpDir, 'brainsback/TODO.md'),
      ['# Strategic Blueprint', '', 'Real plan: ship it safely.'].join('\n')
    );
    fs.writeFileSync(
      path.join(tmpDir, 'brainsback/REPORT.md'),
      ['# REPORT', '', 'Summary.'].join('\n')
    );
    fs.writeFileSync(
      path.join(tmpDir, 'brainsback/REACTO.md'),
      ['# REACTO-SE', '', 'R: ...'].join('\n')
    );

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await statusProject(tmpDir);

    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n');

    expect(output).toContain(
      '✅ brainsback/TODO.md structure looks valid (starts with "# Strategic Blueprint" or "# TODO")'
    );
    expect(output).toContain(
      '✅ brainsback/REPORT.md structure looks valid (starts with "# Implementation Report" or "# REPORT")'
    );
    expect(output).toContain(
      '✅ brainsback/REACTO.md structure looks valid (starts with "# Proof of Mastery (REACTO)" or "# REACTO-SE")'
    );
    expect(output).toContain('✅ Core Mastery-Aware artifacts are present and brainsback/TODO.md has content.');

    logSpy.mockRestore();
  });

  test('treats template-like TODO placeholders as empty', async () => {
    const tmpDir = createTempDir();
    await initProject(tmpDir);

    // Header is valid, but body contains only placeholder-ish content that should be ignored.
    fs.writeFileSync(
      path.join(tmpDir, 'brainsback/TODO.md'),
      [
        '# TODO',
        '',
        '**Hard rule**: This is placeholder.',
        '⚠️ HUMAN ONLY: placeholder',
        '_placeholder_',
        '- [ ]',
        '> quoted placeholder',
        'Focus on the **what** and **why**',
        'Focus on the **what** and **why**. The code will follow.', // exact template usage without blockquote
      ].join('\n')
    );

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await statusProject(tmpDir);

    const output = logSpy.mock.calls.map(args => args.join(' ')).join('\n');

    expect(output).toContain('brainsback/TODO.md is present but appears empty');

    logSpy.mockRestore();
  });
});
