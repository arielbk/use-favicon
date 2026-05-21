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
