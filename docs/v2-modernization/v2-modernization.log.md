# v2-modernization — Implementation Log

## `tooling-refresh` — 2026-05-21 19:05:13

**Status:** done
**Summary:** Migrated toolchain to pnpm 10 + TypeScript 5.9 + Vitest 4 + React 19. Yarn-only files removed (yarn.lock, jest.config.js, old `__tests__/index.tsx`). Added `pnpm-workspace.yaml` with `site` workspace. CI workflow now runs on Node 22 with `pnpm/action-setup@v4`. Site dev/typecheck/build wired to consume the lib via pnpm workspace + Vite alias + tsconfig `paths` so it resolves to `src/` rather than `dist/types`.
**Deviations:** `withFavicon`'s `T extends JSX.IntrinsicAttributes` constraint was loosened to `T extends object` with `React.ComponentType<T>` — React 19 removed the global `JSX` namespace shim, and the v1 HOC will be deleted in a later slice anyway. A placeholder `__tests__/index.test.ts` keeps the Vitest suite green for the feedback loop until later slices replace it. `@testing-library/react` bumped to ^16 and `@testing-library/dom` ^10 added to satisfy React-19 peer ranges.
**Handoff:**
- Lib `src/index.tsx` still contains the entire v1 surface (`useFavicon` legacy signature, `withFavicon`, types in `./types`). Downstream slices (`infer-kind`, `build-favicon-svg`, `use-favicon-minimal`) will rewrite this — do not preserve the legacy API.
- The placeholder test imports `useFavicon` and `withFavicon`; delete or rewrite it when the new API lands.
- Site currently still imports the v1 `FaviconOptions` type and uses the v1 calling convention (see `site/src/App.tsx`, `configs.ts`). It typechecks today because the v1 API is still there. When the v2 API lands, the site needs a rewrite — handled in `docs-and-migration`.
- `dist/` is gitignored. `pnpm publish --dry-run` produces a valid tarball (rejected only because v1.0.1 already exists on the registry — version bump happens in a later slice).
- Vitest globals are enabled (`vitest.config.ts`) so `describe/it/expect` work without imports, matching prior Jest ergonomics.
- pnpm reports `Ignored build scripts: esbuild` — harmless for now; if a CI signing requirement appears later, run `pnpm approve-builds`.

## `infer-kind` — 2026-05-21 19:09:19

**Status:** done
**Summary:** Added a new `inferKind` export with v2 value-kind inference for emoji, CSS colors, color arrays, icon paths/URLs, and raw SVG objects. Replaced the placeholder Vitest file with a table-driven spec that locks the intended inference matrix and edge cases.
**Deviations:** none
**Handoff:** `inferKind` now classifies single-color arrays as `color` and multi-color arrays as `gradient`, which `build-favicon-svg` can consume directly in the next slice. The current root export still includes the legacy v1 hook/HOC surface; downstream slices can keep layering the v2 API in public exports until `use-favicon-minimal` replaces that entrypoint fully.

## `build-favicon-svg` — 2026-05-21 19:11:37

**Status:** done
**Summary:** Added a new public `buildFaviconSvg` export for the v2 pipeline and locked its no-badge contract with inline-snapshot tests for `emoji`, `color`, `gradient`, and raw `svg` values. The builder intentionally excludes `icon`, which remains a direct href path for the upcoming hook slice.
**Deviations:** none
**Handoff:** The new builder lives in `src/buildFaviconSvg.ts` and is exported from `src/index.tsx` without disturbing the legacy v1 utility in `src/utils/constructFaviconSvg.ts`. `use-favicon-minimal` should call `inferKind` first, send `icon` values straight to `<link href>`, and route every other kind through `buildFaviconSvg`.

## `use-favicon-minimal` — 2026-05-21 19:15:09

**Status:** done
**Summary:** Replaced the legacy stateful v1 hook entrypoint with the v2 minimal declarative hook: `useFavicon(value)` now infers the value kind, writes either a direct icon URL or an SVG data URI to `<link rel="icon">`, and returns `void`. Added hook tests for initial render, rerender updates, raw SVG passthrough, direct icon URLs, unmount safety, and SSR no-`document` access.
**Deviations:** The slice feedback loop was run at library scope (`test:lib`, `typecheck:lib`, `build:lib`) rather than the root scripts because the demo site still targets the removed v1 API and is scheduled for rewrite in `docs-and-migration`.
**Handoff:** `src/index.tsx` is now the v2 public surface for the hook plus `inferKind`/`buildFaviconSvg`; downstream slices should extend this file rather than revive `withFavicon` or the old option bag. Legacy files such as `src/types.ts`, `src/utils/constructFaviconSvg.ts`, and the site app still exist on disk but are no longer part of the library API contract.

## `composable-detection-hooks` — 2026-05-21 19:19:15

**Status:** done
**Summary:** Added `useIsAway` and `useIsDark` to the public v2 exports, both implemented with `useSyncExternalStore` so they subscribe to `visibilitychange` and `matchMedia('(prefers-color-scheme: dark)')` while returning `false` on the server. Added RTL and SSR coverage for initial state, change subscriptions, direct server snapshots, and server rendering safety.
**Deviations:** The feedback loop was run at library scope (`test:lib`, `typecheck:lib`, `build:lib`) because the demo site still targets the removed v1 API and is owned by `docs-and-migration`.
**Handoff:** `useIsAway` and `useIsDark` live in new top-level modules (`src/useIsAway.ts`, `src/useIsDark.ts`) and are re-exported from `src/index.tsx`, which keeps them on the main package entrypoint for the README and downstream badge-composition docs. Legacy hook files under `src/hooks/` still exist on disk but are not part of the v2 public surface; downstream slices should keep using the new top-level exports.

## `badge-support` — 2026-05-21 19:22:47

**Status:** done
**Summary:** Added v2 badge rendering to the favicon pipeline and hook API: `useFavicon(value, { badge })` now supports a default red dot, numeric/string content, custom color, and custom corner positioning while leaving `badge: false` and `badge: 0` unset. Extended the SVG snapshot suite and hook rerender coverage to lock the badge contract.
**Deviations:** The badge overlay currently uses simple SVG primitives and a built-in `Arial, sans-serif` text stack for numeric/string badges; no extra font-loading or icon-kind badge path was added in this slice.
**Handoff:** Badge types live in `src/buildFaviconSvg.ts` and flow through the public `UseFaviconOptions` export from `src/index.tsx`. `buildFaviconSvg` still passes raw `{ svg }` values through unchanged, so downstream docs and framework smoke tests should treat the badge API as applying to generated emoji/color/gradient favicons rather than rewriting caller-supplied SVG markup.

## `framework-smoke-tests` — 2026-05-21 19:31:35

**Status:** needs-review
**Summary:** Added a cross-framework smoke harness under `docs/v2-modernization/framework-smoke/` with Next.js App Router, React Router v7, and Vite React fixtures that consume a packed `use-favicon` tarball and exercise the state-toggle plus badge path. Added a runner that packs the library, attempts install/build for each fixture, and writes the reviewer-facing outcome log to `docs/v2-modernization/framework-smoke-tests.md`, plus a Vitest spec locking the log format.
**Deviations:** The automated fixture installs are blocked in this sandbox by DNS/network restrictions (`registry.npmjs.org` is unreachable), so the generated smoke log records blocked installs and leaves the manual browser checklist unchecked. The slice is intentionally left at `needs-review` because `Human checkpoint: yes` still applies even once dependency installation works.
**Handoff:** Run `node docs/v2-modernization/framework-smoke/run-framework-smoke-tests.mjs` from a networked machine to regenerate `docs/v2-modernization/framework-smoke-tests.md` with real install/build outcomes, then complete the per-framework browser checklist already embedded in that log. The fixture apps live entirely under `docs/v2-modernization/framework-smoke/fixtures/` and depend on the public `useFavicon` export only, so downstream docs work should not move or rename those entry files without updating the harness.
