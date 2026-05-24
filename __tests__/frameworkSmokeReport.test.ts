import { renderSmokeTestLog } from '../docs/v2-modernization/framework-smoke/report.mjs';

describe('renderSmokeTestLog', () => {
  it('renders automated outcomes and manual checklist items for each framework', () => {
    const markdown = renderSmokeTestLog({
      generatedAt: '2026-05-21 20:00:00',
      packageTarball: 'use-favicon-1.0.1.tgz',
      frameworks: [
        {
          name: 'Next.js App Router',
          slug: 'next-app-router',
          automatedStatus: 'passed',
          install: { status: 'passed', detail: 'pnpm install completed.' },
          build: { status: 'passed', detail: 'pnpm build completed.' },
          manualStatus: 'pending',
          manualNotes: 'Open the app in a browser and verify favicon updates.',
        },
        {
          name: 'React Router v7',
          slug: 'react-router-v7',
          automatedStatus: 'failed',
          install: { status: 'failed', detail: 'Registry access blocked.' },
          build: { status: 'skipped', detail: 'Build skipped because install failed.' },
          manualStatus: 'blocked',
          manualNotes: 'Manual browser verification is blocked until dependencies install.',
        },
      ],
    });

    expect(markdown).toContain('# Framework Smoke Tests');
    expect(markdown).toContain('Generated: 2026-05-21 20:00:00');
    expect(markdown).toContain('Package tarball: `use-favicon-1.0.1.tgz`');
    expect(markdown).toContain('| Next.js App Router | passed | pending |');
    expect(markdown).toContain('| React Router v7 | failed | blocked |');
    expect(markdown).toContain('## `next-app-router` — Next.js App Router');
    expect(markdown).toContain('- Install: passed — pnpm install completed.');
    expect(markdown).toContain('- Build: passed — pnpm build completed.');
    expect(markdown).toContain('- [ ] No hydration warnings in the console on first paint.');
    expect(markdown).toContain('- [ ] Badge with a number renders correctly.');
    expect(markdown).toContain('Manual notes: Manual browser verification is blocked until dependencies install.');
  });
});
