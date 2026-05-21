# use-favicon v2.0 — Modernization Slices

Vertical slices that take `use-favicon` from v1.0.1 to a shippable v2.0.0: declarative API, type inference, SSR-safe, modernized toolchain, with `useIsAway` / `useIsDark` as composable side exports. Animation is deferred to v2.1.

## Slices

### `tooling-refresh` — Modernize toolchain

**Status:** done

**Outside-in:** `pnpm install && pnpm build && pnpm test` from a fresh clone succeeds on Node LTS with no peer-dep warnings; ESM + CJS output present in `dist/`.

**Feedback loop:** CI workflow runs install, typecheck, build, and an empty/placeholder Vitest suite green. `pnpm publish --dry-run` produces a valid package tarball.

**Human checkpoint:** no

**Depends on:** none

**Notes:**
- Migrate from Yarn to pnpm — delete `yarn.lock`, add `pnpm-lock.yaml`, set `packageManager` field in `package.json`, update `.github/` workflows to use `pnpm/action-setup`.
- TypeScript 4.9 → 5.x (latest stable).
- Jest + `ts-jest` + `jest-environment-jsdom` → Vitest + `@vitest/coverage-v8` + jsdom env.
- Bump tsup to latest; verify dual ESM/CJS output still works with the current `exports` map.
- Bump `@types/react` to 19, set `peerDependencies.react` to `>= 18` (drop React 17 support).
- Update `.github/workflows/` to use Node 22, pnpm cache.
- Remove `dist/` from git (add to `.gitignore` if not already).
- Apply the same pnpm migration inside `site/` and update its build/test scripts.

---

### `infer-kind` — Value-to-kind inference

**Status:** done

**Outside-in:** `inferKind('🦊') === 'emoji'`, `inferKind('#f00') === 'color'`, `inferKind(['#f00','#0f0']) === 'gradient'`, `inferKind('/icon.png') === 'icon'`, `inferKind({ svg: '<text/>' }) === 'svg'`.

**Feedback loop:** Vitest table-driven test covering each kind plus edge cases: unicode ZWJ emoji sequences, named CSS colors, URLs with vs without protocol, file extensions (`.png`, `.ico`, `.svg`, `.jpg`, `.webp`), single-element arrays, empty strings.

**Human checkpoint:** no

**Depends on:** tooling-refresh

---

### `build-favicon-svg` — SVG construction

**Status:** done

**Outside-in:** `buildFaviconSvg('emoji', '🦊')` returns a valid SVG string; same for `color`, `gradient`, and `svg` (pass-through). `icon` kind is *not* handled here — the caller sets `<link href>` directly to the URL.

**Feedback loop:** Vitest inline-snapshot tests, one per kind, covering the base shape with no badge. Output is asserted as exact SVG strings so the contract is locked.

**Human checkpoint:** no

**Depends on:** infer-kind

---

### `use-favicon-minimal` — Declarative hook (no badge yet)

**Status:** done

**Outside-in:** `useFavicon('🦊')` mounts and the `<link rel="icon">` href reflects the rendered favicon; re-rendering with `useFavicon('🐻')` updates it; unmounting does not throw. `useFavicon` returns `void`.

**Feedback loop:**
1. RTL `renderHook` tests: initial render writes the expected href; rerender with new value updates href; raw-SVG escape hatch passes through.
2. SSR test using `renderToString` from `react-dom/server` to confirm no `document` access on the server and no thrown errors.

**Human checkpoint:** no

**Depends on:** infer-kind, build-favicon-svg

**Notes:**
- Implement `setFaviconHref(href)` helper: finds or creates `<link rel="icon">`, sets `href`. All DOM access inside `useEffect`.
- No `darkVariant`, `awayVariant`, `setOptions`, `setFaviconNotification`, `withFavicon`, or random-emoji default — these are gone in v2.

---

### `composable-detection-hooks` — `useIsAway` and `useIsDark`

**Status:** not-started

**Outside-in:** `import { useIsAway, useIsDark } from 'use-favicon'` — each returns a `boolean`, subscribes to the right browser event / media query, and returns `false` during SSR with no hydration mismatch.

**Feedback loop:**
1. RTL `renderHook` tests for each: initial value matches a mocked `document.visibilityState` / `matchMedia` result; subscription fires on state change.
2. `getServerSnapshot` returns `false` (asserted directly).
3. SSR test using `renderToString` confirms no throw, no `document` access.

**Human checkpoint:** no

**Depends on:** tooling-refresh

**Notes:** Use `useSyncExternalStore` for React-19 / RSC compatibility. Runs fully parallel to slices 2–4.

---

### `badge-support` — Badge option

**Status:** not-started

**Outside-in:** `useFavicon('🦊', { badge: true })` shows a red dot; `useFavicon('🦊', { badge: 3 })` shows "3"; `useFavicon('🦊', { badge: '!' })` shows "!"; `useFavicon('🦊', { badge: { content: 5, color: '#00f', position: 'top left' } })` shows a customized badge; `badge: 0` or `badge: false` shows no badge.

**Feedback loop:** Extend the `build-favicon-svg` snapshot suite with badge cases; add RTL `renderHook` test that asserts the href changes when `badge` changes between renders.

**Human checkpoint:** no

**Depends on:** use-favicon-minimal

---

### `framework-smoke-tests` — Cross-framework verification

**Status:** not-started

**Outside-in:** Three fresh apps — Next.js App Router, Remix / React Router v7, Vite + React SPA — each install `use-favicon@2` from a local tarball (`pnpm pack`), use the hook in their root, and render correctly.

**Feedback loop:** Manual checklist run per framework:
- No hydration warnings in the console on first paint.
- No `document is not defined` / SSR errors.
- Favicon appears in the tab correctly.
- A state-driven re-render (e.g. button toggles emoji) updates the favicon.
- Badge with a number renders correctly.

Document outcomes in a smoke-test log in `docs/v2-modernization/`.

**Human checkpoint:** yes

**Depends on:** badge-support, composable-detection-hooks

---

### `docs-and-migration` — Docs, migration guide, demo site

**Status:** not-started

**Outside-in:** A reader landing on the repo's README understands the v2 API in under a minute; a v1 user opening `MIGRATION.md` can find their old usage pattern and the v2 equivalent for every removed/changed feature; the `site/` demo deployed against the v2 API works end-to-end.

**Feedback loop:**
1. Every code example in `README.md` and `MIGRATION.md` is copy-paste-runnable against the built v2 package (manual verification).
2. `site/` runs locally against `use-favicon@workspace:*` and every demo widget functions.
3. Human review of README, MIGRATION.md, and the site for clarity and completeness.

**Human checkpoint:** yes

**Depends on:** badge-support, composable-detection-hooks

**Notes:**
- MIGRATION.md must cover every v1 → v2 transition: `type`/`value` → bare value, `setOptions` → re-render, `setFaviconNotification` → `badge`, `darkVariant` → compose with `useIsDark`, `awayVariant` → compose with `useIsAway`, `withFavicon` → call hook directly, `colors` mode → use raw-SVG escape hatch.
- Refresh `site/` deps to match the modernized root toolchain (pnpm, React 19, Vite latest).
