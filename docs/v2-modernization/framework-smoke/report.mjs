export const MANUAL_CHECKLIST_ITEMS = [
  'No hydration warnings in the console on first paint.',
  'No `document is not defined` / SSR errors.',
  'Favicon appears in the tab correctly.',
  'A state-driven re-render (button toggles emoji) updates the favicon.',
  'Badge with a number renders correctly.',
];

function summarizeDetail(detail, maxLines = 8) {
  const lines = detail.trim().split('\n');

  if (lines.length <= maxLines) {
    return detail;
  }

  return `${lines.slice(0, maxLines).join('\n')}\n...`;
}

function renderAutomatedStep(label, step) {
  return `- ${label}: ${step.status} — ${summarizeDetail(step.detail)}`;
}

function renderManualChecklist() {
  return MANUAL_CHECKLIST_ITEMS.map((item) => `- [ ] ${item}`).join('\n');
}

function renderFrameworkSection(framework) {
  return [
    `## \`${framework.slug}\` — ${framework.name}`,
    '',
    `- Automated status: ${framework.automatedStatus}`,
    renderAutomatedStep('Install', framework.install),
    renderAutomatedStep('Build', framework.build),
    `- Manual status: ${framework.manualStatus}`,
    `- Manual notes: ${framework.manualNotes}`,
    '',
    'Manual checklist:',
    renderManualChecklist(),
  ].join('\n');
}

export function renderSmokeTestLog({ generatedAt, packageTarball, frameworks }) {
  const summaryRows = frameworks
    .map(
      (framework) =>
        `| ${framework.name} | ${framework.automatedStatus} | ${framework.manualStatus} |`,
    )
    .join('\n');

  const sections = frameworks.map(renderFrameworkSection).join('\n\n');

  return [
    '# Framework Smoke Tests',
    '',
    `Generated: ${generatedAt}`,
    `Package tarball: \`${packageTarball}\``,
    '',
    '| Framework | Automated | Manual |',
    '| --- | --- | --- |',
    summaryRows,
    '',
    sections,
    '',
  ].join('\n');
}
