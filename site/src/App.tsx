import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useFavicon,
  useIsAway,
  useIsDark,
  type FaviconValue,
  type UseFaviconOptions,
} from 'use-favicon';
import './App.css';

type Kind = 'emoji' | 'color' | 'gradient' | 'image' | 'svg';
type BadgeMode = 'none' | 'dot' | 'count' | 'custom';
type BadgePosition = 'top right' | 'top left' | 'bottom right' | 'bottom left';
type ViewMode = 'default' | 'dark' | 'away';

const EMOJI_PRESETS = ['🦊', '📥', '🚀', '🟢', '🌚', '🌞', '😴', '🧪', '🎯'];
const COLOR_PRESETS = ['#f97316', '#38bdf8', '#a855f7', '#10b981', '#ef4444', '#0f172a'];
const GRADIENT_PRESETS: string[][] = [
  ['#f97316', '#fb7185', '#38bdf8'],
  ['#0ea5e9', '#a855f7'],
  ['#10b981', '#0ea5e9'],
  ['#fbbf24', '#ef4444'],
];

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#111827" />
  <path d="M28 72L50 24L72 72H61L50 47L39 72Z" fill="#f8fafc" />
</svg>`;

function quote(value: string): string {
  if (value.includes("'") && !value.includes('"')) {
    return `"${value}"`;
  }
  return `'${value.replace(/'/g, "\\'")}'`;
}

function buildValueLiteral(kind: Kind, state: PlaygroundState): string {
  if (kind === 'gradient') {
    return `[${state.gradient.map((color) => quote(color)).join(', ')}]`;
  }
  if (kind === 'svg') {
    const svg = state.svg.replace(/\s+/g, ' ').trim();
    return `{ svg: ${quote(svg)} }`;
  }
  if (kind === 'emoji') return quote(state.emoji);
  if (kind === 'color') return quote(state.color);
  return quote(state.image);
}

function buildOptionsLiteral(badge: BadgeState): string | null {
  if (badge.mode === 'none') return null;
  if (badge.mode === 'dot') return '{ badge: true }';
  if (badge.mode === 'count') return `{ badge: ${badge.count} }`;
  const parts = [`content: ${quote(badge.content)}`];
  if (badge.color) parts.push(`color: ${quote(badge.color)}`);
  if (badge.position) parts.push(`position: ${quote(badge.position)}`);
  return `{ badge: { ${parts.join(', ')} } }`;
}

type SnippetInput = {
  kind: Kind;
  state: PlaygroundState;
  badge: BadgeState;
  variants: VariantState;
};

function buildSnippet({ kind, state, badge, variants }: SnippetInput): string {
  const baseValue = buildValueLiteral(kind, state);
  const optionsLiteral = buildOptionsLiteral(badge);
  const optionsArg = optionsLiteral ? `, ${optionsLiteral}` : '';

  const useDark = variants.darkEnabled && kind === 'emoji';
  const useAway = variants.awayEnabled && kind === 'emoji';

  if (!useDark && !useAway) {
    return `import { useFavicon } from 'use-favicon';

export function App() {
  useFavicon(${baseValue}${optionsArg});
  return <main>Hello</main>;
}`;
  }

  const hookImports = ['useFavicon'];
  if (useAway) hookImports.push('useIsAway');
  if (useDark) hookImports.push('useIsDark');

  const lines: string[] = [];
  if (useDark) lines.push('  const isDark = useIsDark();');
  if (useAway) lines.push('  const isAway = useIsAway();');

  const darkLit = quote(variants.darkEmoji);
  const awayLit = quote(variants.awayEmoji);

  let expr: string;
  if (useDark && useAway) {
    expr = `isAway ? ${awayLit} : isDark ? ${darkLit} : ${baseValue}`;
  } else if (useDark) {
    expr = `isDark ? ${darkLit} : ${baseValue}`;
  } else {
    expr = `isAway ? ${awayLit} : ${baseValue}`;
  }

  lines.push(`  useFavicon(${expr}${optionsArg});`);

  return `import { ${hookImports.join(', ')} } from 'use-favicon';

export function App() {
${lines.join('\n')}
  return <main>Hello</main>;
}`;
}

type PlaygroundState = {
  emoji: string;
  color: string;
  gradient: string[];
  image: string;
  svg: string;
};

type BadgeState = {
  mode: BadgeMode;
  count: number;
  content: string;
  color: string;
  position: BadgePosition;
};

type VariantState = {
  darkEnabled: boolean;
  darkEmoji: string;
  awayEnabled: boolean;
  awayEmoji: string;
};

const INITIAL_STATE: PlaygroundState = {
  emoji: '🦊',
  color: '#38bdf8',
  gradient: ['#f97316', '#fb7185', '#38bdf8'],
  image: '/vite.svg',
  svg: DEFAULT_SVG,
};

const INITIAL_BADGE: BadgeState = {
  mode: 'none',
  count: 3,
  content: '!',
  color: '#ef4444',
  position: 'top right',
};

const INITIAL_VARIANTS: VariantState = {
  darkEnabled: false,
  darkEmoji: '🌚',
  awayEnabled: false,
  awayEmoji: '😴',
};

function App() {
  const [kind, setKind] = useState<Kind>('emoji');
  const [state, setState] = useState<PlaygroundState>(INITIAL_STATE);
  const [badge, setBadge] = useState<BadgeState>(INITIAL_BADGE);
  const [variants, setVariants] = useState<VariantState>(INITIAL_VARIANTS);
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [copied, setCopied] = useState(false);
  const [currentHref, setCurrentHref] = useState('');
  const copyTimer = useRef<number | null>(null);

  const isDark = useIsDark();
  const isAway = useIsAway();

  const variantsAvailable = kind === 'emoji';
  const showDarkTab = variantsAvailable && variants.darkEnabled;
  const showAwayTab = variantsAvailable && variants.awayEnabled;
  const showTabs = showDarkTab || showAwayTab;

  useEffect(() => {
    if (viewMode === 'dark' && !showDarkTab) setViewMode('default');
    if (viewMode === 'away' && !showAwayTab) setViewMode('default');
  }, [viewMode, showDarkTab, showAwayTab]);

  const baseValue: FaviconValue = useMemo(() => {
    if (kind === 'gradient') return state.gradient;
    if (kind === 'svg') return { svg: state.svg };
    if (kind === 'emoji') return state.emoji;
    if (kind === 'color') return state.color;
    return state.image;
  }, [kind, state]);

  const activeValue: FaviconValue = useMemo(() => {
    if (viewMode === 'dark' && showDarkTab) return variants.darkEmoji;
    if (viewMode === 'away' && showAwayTab) return variants.awayEmoji;
    return baseValue;
  }, [viewMode, showDarkTab, showAwayTab, variants.darkEmoji, variants.awayEmoji, baseValue]);

  const options: UseFaviconOptions = useMemo(() => {
    if (badge.mode === 'none') return {};
    if (badge.mode === 'dot') return { badge: true };
    if (badge.mode === 'count') return { badge: badge.count };
    return {
      badge: {
        content: badge.content,
        color: badge.color,
        position: badge.position,
      },
    };
  }, [badge]);

  useFavicon(activeValue, options);

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']");
    setCurrentHref(link?.getAttribute('href') ?? '');
  }, [activeValue, options]);

  const snippet = buildSnippet({ kind, state, badge, variants });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const updateGradient = (index: number, color: string) => {
    setState((prev) => ({
      ...prev,
      gradient: prev.gradient.map((c, i) => (i === index ? color : c)),
    }));
  };

  const addGradientStop = () => {
    setState((prev) => ({ ...prev, gradient: [...prev.gradient, '#000000'] }));
  };

  const removeGradientStop = (index: number) => {
    setState((prev) => ({
      ...prev,
      gradient: prev.gradient.length > 2 ? prev.gradient.filter((_, i) => i !== index) : prev.gradient,
    }));
  };

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">use-favicon</p>
        <h1>Declarative favicons for React.</h1>
        <p className="lede">
          Pass a value, rerender to change it. Emoji, colors, gradients, image URLs, or raw SVG —
          all from one hook. Optional badges, composable browser signals, zero dependencies.
        </p>
        <div className="hero-actions">
          <code className="install">pnpm add use-favicon</code>
          <a
            className="github"
            href="https://github.com/arielbk/use-favicon"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
          <span className="hero-hint">↗ the favicon in your browser tab is rendered by this page</span>
        </div>
      </header>

      <section className="playground" aria-label="Playground">
        <div className="controls">
          <div className="control-block">
            <h2>1. Pick a value</h2>
            <div className="kind-row">
              {(['emoji', 'color', 'gradient', 'image', 'svg'] as Kind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={k === kind ? 'kind kind-active' : 'kind'}
                  onClick={() => setKind(k)}
                >
                  {k === 'svg' ? 'Raw SVG' : k === 'image' ? 'Image URL' : k[0].toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>

            {kind === 'emoji' && (
              <div className="field-group">
                <label className="field">
                  <span>Emoji</span>
                  <input
                    type="text"
                    value={state.emoji}
                    onChange={(e) => setState((p) => ({ ...p, emoji: e.target.value }))}
                  />
                </label>
                <div className="presets">
                  {EMOJI_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="preset"
                      onClick={() => setState((p) => ({ ...p, emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {kind === 'color' && (
              <div className="field-group">
                <label className="field">
                  <span>Color</span>
                  <div className="color-pair">
                    <input
                      type="color"
                      value={state.color}
                      onChange={(e) => setState((p) => ({ ...p, color: e.target.value }))}
                    />
                    <input
                      type="text"
                      value={state.color}
                      onChange={(e) => setState((p) => ({ ...p, color: e.target.value }))}
                    />
                  </div>
                </label>
                <div className="presets">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="preset preset-swatch"
                      style={{ background: color }}
                      onClick={() => setState((p) => ({ ...p, color }))}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {kind === 'gradient' && (
              <div className="field-group">
                {state.gradient.map((color, index) => (
                  <div key={index} className="gradient-row">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateGradient(index, e.target.value)}
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => updateGradient(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => removeGradientStop(index)}
                      disabled={state.gradient.length <= 2}
                      aria-label="Remove stop"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="ghost-btn" onClick={addGradientStop}>
                  + Add stop
                </button>
                <div className="presets">
                  {GRADIENT_PRESETS.map((gradient, i) => (
                    <button
                      key={i}
                      type="button"
                      className="preset preset-swatch"
                      style={{ background: `linear-gradient(135deg, ${gradient.join(', ')})` }}
                      onClick={() => setState((p) => ({ ...p, gradient }))}
                      aria-label={gradient.join(', ')}
                    />
                  ))}
                </div>
              </div>
            )}

            {kind === 'image' && (
              <div className="field-group">
                <label className="field">
                  <span>Image URL</span>
                  <input
                    type="text"
                    value={state.image}
                    placeholder="/icon.png"
                    onChange={(e) => setState((p) => ({ ...p, image: e.target.value }))}
                  />
                </label>
                <p className="hint">URLs and paths are passed straight through as the favicon href.</p>
              </div>
            )}

            {kind === 'svg' && (
              <div className="field-group">
                <label className="field">
                  <span>SVG markup</span>
                  <textarea
                    rows={8}
                    value={state.svg}
                    onChange={(e) => setState((p) => ({ ...p, svg: e.target.value }))}
                  />
                </label>
                <p className="hint">Escape hatch for full control over the rendered SVG.</p>
              </div>
            )}
          </div>

          <div className="control-block">
            <h2>2. Add a badge (optional)</h2>
            <div className="kind-row">
              {(['none', 'dot', 'count', 'custom'] as BadgeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={mode === badge.mode ? 'kind kind-active' : 'kind'}
                  onClick={() => setBadge((b) => ({ ...b, mode }))}
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {badge.mode === 'count' && (
              <div className="field-group">
                <label className="field">
                  <span>Count</span>
                  <input
                    type="number"
                    min={0}
                    value={badge.count}
                    onChange={(e) => setBadge((b) => ({ ...b, count: Number(e.target.value) }))}
                  />
                </label>
              </div>
            )}

            {badge.mode === 'custom' && (
              <div className="field-group">
                <label className="field">
                  <span>Content</span>
                  <input
                    type="text"
                    value={badge.content}
                    onChange={(e) => setBadge((b) => ({ ...b, content: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Color</span>
                  <div className="color-pair">
                    <input
                      type="color"
                      value={badge.color}
                      onChange={(e) => setBadge((b) => ({ ...b, color: e.target.value }))}
                    />
                    <input
                      type="text"
                      value={badge.color}
                      onChange={(e) => setBadge((b) => ({ ...b, color: e.target.value }))}
                    />
                  </div>
                </label>
                <label className="field">
                  <span>Position</span>
                  <select
                    value={badge.position}
                    onChange={(e) =>
                      setBadge((b) => ({ ...b, position: e.target.value as BadgePosition }))
                    }
                  >
                    <option value="top right">top right</option>
                    <option value="top left">top left</option>
                    <option value="bottom right">bottom right</option>
                    <option value="bottom left">bottom left</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="control-block">
            <h2>3. Vary by browser state (optional)</h2>
            {variantsAvailable ? (
              <div className="field-group">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={variants.darkEnabled}
                    onChange={(e) =>
                      setVariants((v) => ({ ...v, darkEnabled: e.target.checked }))
                    }
                  />
                  <span>Different favicon in dark mode</span>
                </label>
                {variants.darkEnabled && (
                  <label className="field field-indent">
                    <span>Dark mode emoji</span>
                    <input
                      type="text"
                      value={variants.darkEmoji}
                      onChange={(e) => setVariants((v) => ({ ...v, darkEmoji: e.target.value }))}
                    />
                  </label>
                )}

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={variants.awayEnabled}
                    onChange={(e) =>
                      setVariants((v) => ({ ...v, awayEnabled: e.target.checked }))
                    }
                  />
                  <span>Different favicon when tab is hidden</span>
                </label>
                {variants.awayEnabled && (
                  <label className="field field-indent">
                    <span>Away emoji</span>
                    <input
                      type="text"
                      value={variants.awayEmoji}
                      onChange={(e) => setVariants((v) => ({ ...v, awayEmoji: e.target.value }))}
                    />
                  </label>
                )}

                <p className="hint">
                  Your browser is{' '}
                  <strong>{isDark ? 'dark' : 'light'}</strong>
                  {' · tab is '}
                  <strong>{isAway ? 'away' : 'active'}</strong>. Use the tabs above the preview to
                  flip through each branch manually.
                </p>
              </div>
            ) : (
              <div className="field-group">
                <p className="hint">
                  The visual variant editor is emoji-only. <code>useIsDark</code> and{' '}
                  <code>useIsAway</code> still work with any value type — compose them in your own
                  code:
                </p>
                <pre className="snippet">
                  <code>{`import { useFavicon, useIsDark } from 'use-favicon';

const isDark = useIsDark();
useFavicon(isDark ? darkValue : lightValue);`}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="preview-column">
          <div className="preview-card">
            {showTabs && (
              <div className="view-tabs" role="tablist" aria-label="Preview branch">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'default'}
                  className={viewMode === 'default' ? 'view-tab view-tab-active' : 'view-tab'}
                  onClick={() => setViewMode('default')}
                >
                  Default
                </button>
                {showDarkTab && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'dark'}
                    className={viewMode === 'dark' ? 'view-tab view-tab-active' : 'view-tab'}
                    onClick={() => setViewMode('dark')}
                  >
                    Dark
                  </button>
                )}
                {showAwayTab && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'away'}
                    className={viewMode === 'away' ? 'view-tab view-tab-active' : 'view-tab'}
                    onClick={() => setViewMode('away')}
                  >
                    Away
                  </button>
                )}
              </div>
            )}
            <p className="aside-label">Preview</p>
            <FaviconPreview href={currentHref} size={160} />
            <p className="aside-hint">In a browser tab it looks like:</p>
            <BrowserTab href={currentHref} />
          </div>

          <div className="snippet-card">
            <div className="snippet-header">
              <span>Generated code</span>
              <button type="button" className="copy-btn" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="snippet">
              <code>{snippet}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="api-section">
        <div className="signals-card">
          <h2>API</h2>
          <pre className="snippet">
            <code>{`useFavicon(value, options?)

// value
//   string                       emoji, CSS color, or image URL/path
//   string[]                     gradient stops
//   { svg: string }              raw SVG

// options.badge
//   true                         red dot
//   number | string              visible content
//   { content, color, position } customized`}</code>
          </pre>
          <p className="panel-copy">
            Exports: <code>useFavicon</code>, <code>useIsDark</code>, <code>useIsAway</code>,{' '}
            <code>buildFaviconSvg</code>, <code>inferKind</code>, <code>setFaviconHref</code>.
          </p>
        </div>
      </section>

      <footer className="footer">
        <span>MIT licensed</span>
        <span>·</span>
        <a
          href="https://github.com/arielbk/use-favicon"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}

function FaviconPreview({ href, size }: { href: string; size: number }) {
  return (
    <div className="favicon-preview" style={{ width: size, height: size }}>
      {href ? (
        <img src={href} alt="Favicon preview" width={size} height={size} />
      ) : (
        <span className="favicon-placeholder">…</span>
      )}
    </div>
  );
}

function BrowserTab({ href }: { href: string }) {
  return (
    <div className="browser-tab">
      <div className="tab">
        {href ? <img src={href} alt="" width={16} height={16} /> : <span className="tab-dot" />}
        <span className="tab-title">use-favicon</span>
        <span className="tab-close">×</span>
      </div>
    </div>
  );
}

export default App;
