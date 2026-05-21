# Framework Smoke Tests

Generated: 2026-05-21 19:31:14
Package tarball: `use-favicon-1.0.1.tgz`

| Framework | Automated | Manual |
| --- | --- | --- |
| Next.js App Router | failed | blocked |
| React Router v7 | failed | blocked |
| Vite + React SPA | failed | blocked |

## `next-app-router` — Next.js App Router

- Automated status: failed
- Install: failed — ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact-dom: request to https://registry.npmjs.org/@types%2Freact-dom failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
Progress: resolved 1, reused 0, downloaded 0, added 0
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact: request to https://registry.npmjs.org/@types%2Freact failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/react: request to https://registry.npmjs.org/react failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/react-dom: request to https://registry.npmjs.org/react-dom failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/typescript: request to https://registry.npmjs.org/typescript failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/next: request to https://registry.npmjs.org/next failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/csstype: request to https://registry.npmjs.org/csstype failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
...
- Build: skipped — Build skipped because install failed.
- Manual status: blocked
- Manual notes: Manual browser verification is blocked until the fixture dependencies install successfully.

Manual checklist:
- [ ] No hydration warnings in the console on first paint.
- [ ] No `document is not defined` / SSR errors.
- [ ] Favicon appears in the tab correctly.
- [ ] A state-driven re-render (button toggles emoji) updates the favicon.
- [ ] Badge with a number renders correctly.

## `react-router-v7` — React Router v7

- Automated status: failed
- Install: failed — ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@react-router%2Fdev: request to https://registry.npmjs.org/@react-router%2Fdev failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org

This error happened while installing a direct dependency of /private/var/folders/0g/kzhtzc1x6sv1lsdy31k734ym0000gn/T/use-favicon-framework-smoke-fixtures/react-router-v7
- Build: skipped — Build skipped because install failed.
- Manual status: blocked
- Manual notes: Manual browser verification is blocked until the fixture dependencies install successfully.

Manual checklist:
- [ ] No hydration warnings in the console on first paint.
- [ ] No `document is not defined` / SSR errors.
- [ ] Favicon appears in the tab correctly.
- [ ] A state-driven re-render (button toggles emoji) updates the favicon.
- [ ] Badge with a number renders correctly.

## `vite-react-spa` — Vite + React SPA

- Automated status: failed
- Install: failed — ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact-dom: request to https://registry.npmjs.org/@types%2Freact-dom failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
Progress: resolved 1, reused 0, downloaded 0, added 0
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@vitejs%2Fplugin-react: request to https://registry.npmjs.org/@vitejs%2Fplugin-react failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@types%2Freact: request to https://registry.npmjs.org/@types%2Freact failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/vite: request to https://registry.npmjs.org/vite failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/react-dom: request to https://registry.npmjs.org/react-dom failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/react: request to https://registry.npmjs.org/react failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
 ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/typescript: request to https://registry.npmjs.org/typescript failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
...
- Build: skipped — Build skipped because install failed.
- Manual status: blocked
- Manual notes: Manual browser verification is blocked until the fixture dependencies install successfully.

Manual checklist:
- [ ] No hydration warnings in the console on first paint.
- [ ] No `document is not defined` / SSR errors.
- [ ] Favicon appears in the tab correctly.
- [ ] A state-driven re-render (button toggles emoji) updates the favicon.
- [ ] Badge with a number renders correctly.
