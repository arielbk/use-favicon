# PRD: use-favicon v2.0 — Modernization

## Problem Statement

`use-favicon` was last meaningfully updated in late 2022 and ships v1.0.1. The library still works, but the surrounding ecosystem has moved on: React 19 is current, SSR-first frameworks (Next.js App Router, Remix / React Router v7, TanStack Start, Astro) are now the default, and React idioms have shifted from imperative setter-returning hooks toward declarative prop-driven ones. The current API has several rough edges that are obvious in retrospect:

- It returns imperative setters (`setOptions`, `setFaviconNotification`), creating a dual source of truth — props are read once into local state at mount and never re-react to subsequent prop changes (see `src/index.tsx:14-17`).
- It uses a `type` discriminator field that callers must supply manually instead of being inferred from the shape of the value they pass.
- The no-args default generates a random emoji, which produces nondeterministic first-render output and breaks SSR hydration.
- It exports a `withFavicon` HOC, a pattern that has been dead in idiomatic React for years.
- All DOM access (`document`, `window.matchMedia`) happens without SSR guards.
- `colors` (vertical stripe blocks) is a niche favicon mode that adds API surface for marginal value.
- Dependencies — React 18 peer, TypeScript 4.9, Jest 29, tsup 6 — are old enough that consumers on modern toolchains hit friction.

The library needs a clean v2 break that resolves all of the above at once.

## Solution

Ship `use-favicon@2.0.0` — a single major version that takes a breaking-change budget and modernizes the surface to match how a React hook library would be designed if it were written today.

The headline change is a **declarative, inference-based API**:

```ts
useFavicon('🦊');                                // emoji (inferred)
useFavicon('/icon.png');                         // icon URL (inferred)
useFavicon('https://example.com/favicon.ico');   // icon URL (inferred)
useFavicon('#ff0000');                           // solid color (inferred)
useFavicon(['#f00', '#0f0', '#00f']);            // gradient (inferred)
useFavicon({ svg: '<text y=".9em" font-size="90">🦊</text>' }); // raw-SVG escape hatch
useFavicon('🦊', { badge: unreadCount });        // with badge
```

The hook returns `void`. Changing the favicon happens by re-rendering with new props. Dark-mode and tab-away convenience features move out of the main hook and become standalone named exports (`useIsDark`, `useIsAway`) that consumers compose themselves. The hook is fully SSR-safe with no nondeterministic first-render output and no hydration warnings on any modern framework.

Animation support (frame cycling on an interval) is **explicitly deferred to v2.1** to keep v2.0 tight enough to actually ship.

## User Stories

1. As a React developer on Next.js App Router, I want to drop `useFavicon('🦊')` into a client component and have it just work, so I don't get hydration warnings or `document is not defined` errors.
2. As a developer with controlled state (Zustand / Redux / URL params / server state), I want to change the favicon by re-rendering with new props, so the favicon stays in sync with my app state without me wiring up imperative setters.
3. As a developer adding a notification indicator, I want to pass `badge: hasUnread` for a dot, `badge: unreadCount` for a count, or `badge: '!'` for a text indicator, so I don't have to know about position / color options unless I want to customize.
4. As a power user with a custom favicon design, I want to pass `{ svg: '<...>' }` to use my own SVG markup, so I'm never blocked by the library's built-in modes.
5. As a developer building a dark-mode-aware app, I want to import `useIsDark` and `useIsAway` as standalone hooks and combine them with `useFavicon` myself, so I have full control over the conditions that drive favicon changes.
6. As a TypeScript user, I want the value I pass to be type-checked without me supplying a redundant `type` discriminator field, so the API matches my intuition.
7. As a maintainer of an app on React 19 / TS 5.x / Vitest, I want to install `use-favicon@2` without dependency-resolution warnings or peer-dep conflicts.
8. As a developer reading the docs, I want a migration guide that shows v1 → v2 for every supported feature, so I can upgrade without trial and error.

## Implementation Decisions

### Public API surface

The package will export:

- `useFavicon(value, options?)` — default export. `value` is `string | string[] | { svg: string }`. `options` is `{ badge?: BadgeOption }`. Returns `void`.
- `useIsAway()` — named export. Returns `boolean`. Uses `document.visibilitychange`. SSR-safe (returns `false` on the server).
- `useIsDark()` — named export. Returns `boolean`. Uses `matchMedia('(prefers-color-scheme: dark)')`. SSR-safe (returns `false` on the server).
- Type exports: `FaviconValue`, `FaviconOptions`, `BadgeOption`, `BadgePosition`.

Removed from v1: the `setOptions` / `setFaviconNotification` setters, `withFavicon` HOC, `darkVariant` / `awayVariant` options, `colors` (stripe) mode, the `type` discriminator field, the `randomEmoji` default, the `faviconSvg` return value.

### Value inference

A small `inferKind` function maps a value to one of `emoji | icon | color | gradient | svg`:

- `{ svg: string }` → `svg`
- `string[]` → `gradient`
- single string starting with `#` or matching a known CSS color name → `color`
- single string containing `/`, `:`, or ending in `.png` / `.ico` / `.svg` / `.jpg` / `.webp` → `icon`
- otherwise → `emoji`

This is a deep module: small interface (one value in, one kind out), encapsulates all the heuristics, easy to unit-test in isolation, and the rest of the codebase doesn't need to know how the decision was made.

### SVG construction

A `buildFaviconSvg(kind, value, badge)` function produces the final SVG string. It replaces the v1 `constructFaviconSvg` util but has a narrower contract: it does not own state, doesn't know about variants, and accepts a single resolved `badge` shape.

Branches inside: emoji → `<text>`, color → `<rect>` fill, gradient → `<linearGradient>` + `<rect>`, svg → pass-through body. Badge rendering (dot / number / text) is composed on top after the base shape.

The icon kind never goes through SVG construction — it sets the `<link href>` directly to the URL.

### DOM writes

A `setFaviconHref(href)` helper finds or creates the `<link rel="icon">` element and sets its `href`. All DOM access happens inside `useEffect` (so never on the server, and never during render). The helper itself does no SSR-guarding — callers ensure it only runs in effects.

### SSR safety contract

- No `document` / `window` / `matchMedia` access during render.
- All `useState` initializers produce deterministic output (no `randomEmoji()` default).
- All side-effecting code runs in `useEffect`.
- `useIsAway` / `useIsDark` use `useSyncExternalStore` with a `getServerSnapshot` that returns `false`, so they're React-19 / RSC-friendly and produce no hydration mismatch.

### Badge options

```ts
type BadgePosition =
  | 'top left' | 'top center' | 'top right'
  | 'center left' | 'center' | 'center right'
  | 'bottom left' | 'bottom center' | 'bottom right';

type BadgeOption =
  | boolean
  | number
  | string
  | {
      content?: number | string;
      color?: string;
      textColor?: string;
      position?: BadgePosition;
    };
```

A boolean `true` shows a default red dot at `bottom right`. A number shows that count (hidden when `0` or `false`). A string shows that text. The object form covers full customization. Default colors: background `#fb464c`, text `#ffffff`.

### Toolchain modernization

- Peer deps: `react >= 18` (drop React 17 support).
- Dev deps: TypeScript 5.x, Vitest (replacing Jest + ts-jest + jest-environment-jsdom), React Testing Library latest, tsup latest, `@types/react` 19.
- Output: keep dual ESM + CJS via `tsup` with the existing `exports` map.
- Drop the `dist/` checked-in artifacts (already in `.gitignore` story; verify).
- Update `.github/` CI workflows to use current Node LTS.

### Demo site (`site/`)

Refresh to use the v2 API in all examples. Keep the existing Vite + React setup, bump deps. Site is not a release blocker but should be updated in the same PR so the live demo isn't broken on release day.

### Migration guide

Add a `MIGRATION.md` (or a section in the README) covering every v1 → v2 transition path:
- `useFavicon({ type: 'emoji', value: '🦊' })` → `useFavicon('🦊')`
- `useFavicon({ type: 'colors', value: [...] })` → use raw SVG escape hatch
- `setOptions(...)` → re-render with new props
- `setFaviconNotification(true)` → pass `badge: true`
- `darkVariant` → compose with `useIsDark`
- `awayVariant` → compose with `useIsAway`
- `withFavicon` HOC → call `useFavicon` directly in the component

## Testing Decisions

Unit tests (Vitest + RTL with jsdom env):

- `inferKind` — pure function, dense table-driven tests covering each branch (emoji, icon by extension, icon by URL, hex color, named color, color array, svg object) plus edge cases (empty string, single-element array, unicode emoji ZWJ sequences).
- `buildFaviconSvg` — snapshot-style tests for each kind × badge combination, since the SVG output is the contract.
- `setFaviconHref` — verify it creates a `<link rel="icon">` if absent, reuses it if present, and updates `href` correctly.
- `useFavicon` — RTL renderHook tests verifying: initial render sets the correct favicon; re-rendering with a new value updates the favicon; unmount does not throw; badge changes update the favicon; raw SVG passes through.
- `useIsAway` / `useIsDark` — verify the initial value, the subscription to the right event / media query, and that `getServerSnapshot` returns `false`.

SSR tests:

- A small integration test using `renderToString` from `react-dom/server` to verify that `useFavicon`, `useIsAway`, and `useIsDark` do not throw or access `document` on the server.

Manual verification (release checklist, not automated):

- Smoke-test in a fresh Next.js App Router app, a Remix / React Router v7 app, and a Vite SPA. Verify no hydration warnings, no console errors, the favicon renders correctly on first paint, and reactive changes (e.g. driven by `useState`) update it.

Prior art: v1 has `__tests__/index.tsx`. It will be deleted and replaced — the v2 test suite is structured around modules, not the all-in-one entrypoint.

## Out of Scope

- **Animation** (`frames` + `interval`, reduced-motion handling, hidden-tab pausing). Deferred to v2.1 to keep v2.0 shippable.
- **Layered composition API** (multiple stacked layers as a first-class concept). The raw-SVG escape hatch covers this for power users; first-class layers add too much surface for the realistic use cases.
- **JSX-children escape hatch** (`useFavicon(<text>...</text>)`). Adds React-to-SVG serialization weight; the string `svg` form covers the same use case.
- **First-class `colors` (stripe) mode.** Power users can hand-write the SVG.
- **CRA / Webpack 4 / React 17 support.** Dropped.
- **Verified support for TanStack Start, Astro, Next.js Pages Router.** Should work because we use only standard React APIs with proper SSR guards, but not part of the release verification matrix.
- **A preview-the-favicon helper hook** (`useFaviconSvg`). Not built unless someone asks.

## Open Questions

None currently — all scoping questions resolved in conversation. Open items will surface during implementation; track them in the eventual slice plan rather than re-opening the PRD.
