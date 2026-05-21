import { useEffect, useState } from 'react';
import {
  useFavicon,
  useIsAway,
  useIsDark,
  type FaviconValue,
  type UseFaviconOptions,
} from 'use-favicon';
import './App.css';

type DemoId = 'emoji' | 'gradient' | 'icon' | 'raw-svg' | 'signals';

type Demo = {
  id: DemoId;
  title: string;
  blurb: string;
  value: FaviconValue;
  options?: UseFaviconOptions;
  snippet: string;
};

const DEMOS: Demo[] = [
  {
    id: 'emoji',
    title: 'Emoji',
    blurb: 'The smallest v2 use case: pass a single value and rerender when it changes.',
    value: '🦊',
    snippet: "useFavicon('🦊');",
  },
  {
    id: 'gradient',
    title: 'Gradient',
    blurb: 'Array values infer the gradient renderer automatically.',
    value: ['#f97316', '#fb7185', '#38bdf8'],
    snippet: "useFavicon(['#f97316', '#fb7185', '#38bdf8']);",
  },
  {
    id: 'icon',
    title: 'Icon URL',
    blurb: 'Image URLs stay as direct href values instead of being wrapped in SVG.',
    value: '/vite.svg',
    snippet: "useFavicon('/vite.svg');",
  },
  {
    id: 'raw-svg',
    title: 'Raw SVG',
    blurb: 'Use the escape hatch when you want complete control over the markup.',
    value: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#111827" /><path d="M28 72L50 24L72 72H61L50 47L39 72Z" fill="#f8fafc" /></svg>',
    },
    snippet:
      "useFavicon({ svg: '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">...</svg>' });",
  },
  {
    id: 'signals',
    title: 'Composed signals',
    blurb: 'Pair `useIsDark` and `useIsAway` with your own state instead of passing variants.',
    value: '🌞',
    options: { badge: 7 },
    snippet:
      "const isDark = useIsDark();\nconst isAway = useIsAway();\nuseFavicon(isAway ? '😴' : isDark ? '🌚' : '🌞', { badge: 7 });",
  },
];

type BadgeMode = 'none' | 'dot' | 'count' | 'custom';

function getBadgeOptions(mode: BadgeMode): UseFaviconOptions {
  if (mode === 'dot') {
    return { badge: true };
  }

  if (mode === 'count') {
    return { badge: 3 };
  }

  if (mode === 'custom') {
    return {
      badge: {
        content: '!',
        color: '#0f766e',
        position: 'bottom left',
      },
    };
  }

  return {};
}

function App() {
  const [demoId, setDemoId] = useState<DemoId>('emoji');
  const [badgeMode, setBadgeMode] = useState<BadgeMode>('count');
  const [previewDark, setPreviewDark] = useState(false);
  const [previewAway, setPreviewAway] = useState(false);
  const [currentHref, setCurrentHref] = useState('');
  const isDark = useIsDark();
  const isAway = useIsAway();

  const selectedDemo = DEMOS.find((demo) => demo.id === demoId) ?? DEMOS[0];
  const usesSignalsDemo = selectedDemo.id === 'signals';
  const value = usesSignalsDemo
    ? previewAway
      ? '😴'
      : previewDark
        ? '🌚'
        : '🌞'
    : selectedDemo.value;
  const options =
    usesSignalsDemo || selectedDemo.id === 'emoji'
      ? getBadgeOptions(badgeMode)
      : (selectedDemo.options ?? {});

  useFavicon(value, options);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    setCurrentHref(favicon?.getAttribute('href') ?? '');
  }, [badgeMode, previewAway, previewDark, value]);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">use-favicon v2</p>
        <h1>Declarative favicons for modern React apps</h1>
        <p className="lede">
          Pass a value, rerender when state changes, and compose browser signals yourself when you
          need them. No imperative setters. No variant object maze.
        </p>
        <div className="status-row">
          <span>Browser dark mode: {isDark ? 'on' : 'off'}</span>
          <span>Browser away state: {isAway ? 'away' : 'active'}</span>
          <span>Current href: {currentHref || 'waiting for first render...'}</span>
        </div>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <h2>Pick a demo</h2>
          <div className="chip-grid">
            {DEMOS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                className={demo.id === demoId ? 'chip chip-active' : 'chip'}
                onClick={() => setDemoId(demo.id)}
              >
                {demo.title}
              </button>
            ))}
          </div>
          <p className="panel-copy">{selectedDemo.blurb}</p>
          <pre className="snippet">
            <code>{selectedDemo.snippet}</code>
          </pre>
        </article>

        <article className="panel">
          <h2>Live controls</h2>
          <div className="control-stack">
            <label className="toggle">
              <span>Badge mode</span>
              <select value={badgeMode} onChange={(event) => setBadgeMode(event.target.value as BadgeMode)}>
                <option value="none">None</option>
                <option value="dot">Dot</option>
                <option value="count">Count</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={previewDark}
                onChange={(event) => setPreviewDark(event.target.checked)}
                disabled={!usesSignalsDemo}
              />
              <span>Preview dark-mode branch</span>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={previewAway}
                onChange={(event) => setPreviewAway(event.target.checked)}
                disabled={!usesSignalsDemo}
              />
              <span>Preview away-state branch</span>
            </label>
          </div>
          <p className="panel-copy">
            Badge changes rerender the hook immediately. The branch preview toggles are only active
            for the composed signal demo.
          </p>
        </article>

        <article className="panel panel-wide">
          <h2>What changed in v2</h2>
          <ul className="fact-list">
            <li>
              <code>useFavicon</code> takes a bare value plus an optional <code>{'{ badge }'}</code>{' '}
              object.
            </li>
            <li>
              <code>useIsDark</code> and <code>useIsAway</code> are separate hooks you compose in
              your own logic.
            </li>
            <li>
              Raw SVG stays available through <code>{'{ svg }'}</code> when you need full control.
            </li>
            <li>Icon URLs remain direct <code>href</code> values, so no extra SVG wrapper is generated.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
