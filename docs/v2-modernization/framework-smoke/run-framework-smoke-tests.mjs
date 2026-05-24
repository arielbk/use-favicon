import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderSmokeTestLog } from './report.mjs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '..', '..', '..');
const fixturesDir = path.join(currentDir, 'fixtures');
const logPath = path.join(repoRoot, 'docs', 'v2-modernization', 'framework-smoke-tests.md');
const packDir = path.join(os.tmpdir(), 'use-favicon-framework-smoke-pack');
const tempRoot = path.join(os.tmpdir(), 'use-favicon-framework-smoke-fixtures');
const dependencyPlaceholder = 'file:__USE_FAVICON_TARBALL__';

const frameworks = [
  {
    name: 'Next.js App Router',
    slug: 'next-app-router',
    fixtureDir: path.join(fixturesDir, 'next-app-router'),
    requiredFiles: ['package.json', 'tsconfig.json', 'next-env.d.ts', 'app/layout.tsx', 'app/page.tsx'],
  },
  {
    name: 'React Router v7',
    slug: 'react-router-v7',
    fixtureDir: path.join(fixturesDir, 'react-router-v7'),
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'react-router.config.ts',
      'app/root.tsx',
      'app/routes.ts',
      'app/routes/home.tsx',
    ],
  },
  {
    name: 'Vite + React SPA',
    slug: 'vite-react-spa',
    fixtureDir: path.join(fixturesDir, 'vite-react-spa'),
    requiredFiles: ['package.json', 'tsconfig.json', 'tsconfig.node.json', 'vite.config.ts', 'index.html', 'src/App.tsx', 'src/main.tsx'],
  },
];

function formatLocalTimestamp(date) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
}

function runCommand(command, args, cwd, timeout = 30_000) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout,
    killSignal: 'SIGKILL',
    env: {
      ...process.env,
      CI: '1',
    },
  });

  const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();

  return {
    status: result.status === 0 ? 'passed' : 'failed',
    detail:
      output ||
      (result.error?.message
        ? result.error.message
        : `${command} ${args.join(' ')}`),
  };
}

async function assertFixtureShape(framework) {
  await Promise.all(
    framework.requiredFiles.map(async (relativePath) => {
      const absolutePath = path.join(framework.fixtureDir, relativePath);
      await readFile(absolutePath, 'utf8');
    }),
  );
}

async function prepareFixture(framework, tarballPath) {
  const destination = path.join(tempRoot, framework.slug);

  await rm(destination, { recursive: true, force: true });
  await cp(framework.fixtureDir, destination, { recursive: true });

  const packageJsonPath = path.join(destination, 'package.json');
  const packageJson = await readFile(packageJsonPath, 'utf8');
  await writeFile(
    packageJsonPath,
    packageJson.replace(dependencyPlaceholder, `file:${tarballPath}`),
    'utf8',
  );

  return destination;
}

async function packLibrary() {
  await mkdir(packDir, { recursive: true });
  const packResult = runCommand('pnpm', ['pack', '--pack-destination', packDir], repoRoot);

  if (packResult.status !== 'passed') {
    throw new Error(packResult.detail);
  }

  const tarballs = (await readdir(packDir)).filter((entry) => entry.endsWith('.tgz')).sort();
  const tarballName = tarballs.at(-1);

  if (!tarballName) {
    throw new Error(`pnpm pack succeeded but no tarball was written to ${packDir}`);
  }

  return {
    tarballName,
    tarballPath: path.join(packDir, tarballName),
  };
}

async function runFramework(framework, tarballPath) {
  await assertFixtureShape(framework);
  const cwd = await prepareFixture(framework, tarballPath);
  const install = runCommand(
    'pnpm',
    ['install', '--config.fetch-retries=0', '--config.fetch-timeout=5000'],
    cwd,
  );

  if (install.status !== 'passed') {
    return {
      name: framework.name,
      slug: framework.slug,
      automatedStatus: 'failed',
      install,
      build: { status: 'skipped', detail: 'Build skipped because install failed.' },
      manualStatus: 'blocked',
      manualNotes:
        'Manual browser verification is blocked until the fixture dependencies install successfully.',
    };
  }

  const build = runCommand('pnpm', ['build'], cwd);
  const automatedStatus = build.status === 'passed' ? 'passed' : 'failed';

  return {
    name: framework.name,
    slug: framework.slug,
    automatedStatus,
    install,
    build,
    manualStatus: automatedStatus === 'passed' ? 'pending' : 'blocked',
    manualNotes:
      automatedStatus === 'passed'
        ? 'Install and build succeeded in the smoke fixture. Open the app in a browser and complete the manual checklist.'
        : 'Manual browser verification is blocked until the fixture builds successfully.',
  };
}

async function main() {
  const generatedAt = formatLocalTimestamp(new Date());
  const { tarballName, tarballPath } = await packLibrary();

  await mkdir(tempRoot, { recursive: true });

  const results = [];
  for (const framework of frameworks) {
    results.push(await runFramework(framework, tarballPath));
  }

  const markdown = renderSmokeTestLog({
    generatedAt,
    packageTarball: tarballName,
    frameworks: results,
  });

  await writeFile(logPath, markdown, 'utf8');
  process.stdout.write(`${logPath}\n`);
}

main().catch(async (error) => {
  const generatedAt = formatLocalTimestamp(new Date());
  const detail = error instanceof Error ? error.message : String(error);
  const markdown = renderSmokeTestLog({
    generatedAt,
    packageTarball: 'not-created',
    frameworks: frameworks.map((framework) => ({
      name: framework.name,
      slug: framework.slug,
      automatedStatus: 'failed',
      install: { status: 'failed', detail },
      build: { status: 'skipped', detail: 'Build skipped because the package tarball could not be created.' },
      manualStatus: 'blocked',
      manualNotes: 'Manual browser verification is blocked until the smoke harness can create a local package tarball.',
    })),
  });

  await writeFile(logPath, markdown, 'utf8');
  process.stderr.write(`${detail}\n`);
  process.exitCode = 1;
});
