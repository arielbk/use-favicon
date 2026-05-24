# use-favicon

Declarative favicons for React. Pass a value, rerender to change it, and compose browser signals like dark-mode and away-state with your own logic.

```tsx
import { useFavicon } from 'use-favicon';

export function App() {
  useFavicon('🦊');

  return <main>Hello</main>;
}
```

## Install

```bash
pnpm add use-favicon
# or
npm install use-favicon
# or
yarn add use-favicon
```

Peer dependency: React 18 or 19.

## How it works

`useFavicon(value, options?)` renders a favicon and returns `void`. To change it, rerender the component with a new value — same as any other React hook.

```tsx
const [emoji, setEmoji] = useState('🙂');
useFavicon(emoji);
```

## Supported values

The value type is inferred automatically:

| Value | Result |
| --- | --- |
| `'🦊'`, `'🚀'`, … | Emoji rendered inside an SVG |
| `'#f97316'`, `'rebeccapurple'` | Solid CSS color tile |
| `['#f97316', '#fb7185', '#38bdf8']` | Diagonal gradient |
| `'/icon.png'`, `'https://…/icon.svg'` | Used directly as the favicon `href` |
| `{ svg: '<svg…>' }` | Raw SVG escape hatch |

## Badges

Pass `badge` in the second argument to overlay a notification badge on emoji, color, or gradient favicons.

```tsx
useFavicon('📥', { badge: unreadCount });
```

| `badge` value | Result |
| --- | --- |
| `true` | Red dot |
| `number` or non-empty `string` | Text content (count or letter) |
| `{ content, color?, position? }` | Customized badge |
| `false`, `0`, or `''` | No badge |

`position` accepts `'top right'` (default), `'top left'`, `'bottom right'`, or `'bottom left'`.

## Dark mode and away state

`useIsDark` and `useIsAway` are standalone hooks. Combine them with your own state — no nested variant objects.

```tsx
import { useFavicon, useIsAway, useIsDark } from 'use-favicon';

export function PresenceFavicon() {
  const isDark = useIsDark();
  const isAway = useIsAway();

  useFavicon(isAway ? '😴' : isDark ? '🌚' : '🌞');
}
```

Both hooks are SSR-safe and return `false` on the server.

## Raw SVG

When you need full control, pass `{ svg }`:

```tsx
useFavicon({
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#111827" /><path d="M28 72L50 24L72 72H61L50 47L39 72Z" fill="#f8fafc" /></svg>',
});
```

## TypeScript

```ts
type FaviconValue = string | string[] | { svg: string };

type UseFaviconOptions = {
  badge?:
    | boolean
    | string
    | number
    | {
        content: string | number;
        color?: string;
        position?: 'top right' | 'top left' | 'bottom right' | 'bottom left';
      };
};

declare function useFavicon(value: FaviconValue, options?: UseFaviconOptions): void;
```

## Named exports

- `useFavicon` — set the favicon from a React component.
- `useIsDark` — `true` when the OS/browser prefers dark mode.
- `useIsAway` — `true` when the tab is hidden.
- `buildFaviconSvg` — pure function that returns the SVG string.
- `inferKind` — detect what kind of value something is.
- `setFaviconHref` — imperatively swap the favicon href.

## Try it

The [`site/`](./site) workspace is a live playground for every feature. Run it with:

```bash
pnpm install
pnpm --filter use-favicon-site dev
```

## Migrating from v1

If you used a previous version of this package, see [MIGRATION.md](./MIGRATION.md) for an old-to-new mapping of every changed feature.

## License

MIT
