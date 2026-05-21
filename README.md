# use-favicon

Declarative React favicons for modern apps. Pass a value, rerender when state changes, and compose browser signals with your own logic when you need dark-mode or away-state variants.

## Install

```bash
pnpm add use-favicon
```

## Quick start

```tsx
import { useFavicon } from 'use-favicon';

export function App() {
  useFavicon('🦊');

  return <main>Hello</main>;
}
```

`useFavicon` returns `void`. Update the favicon by rerendering with a new value.

## Supported values

- `string`: inferred as emoji, CSS color, or icon URL/path.
- `string[]`: inferred as a gradient.
- `{ svg: string }`: raw SVG escape hatch.

## Badge example

```tsx
import { useFavicon } from 'use-favicon';

export function InboxTab({ unreadCount }: { unreadCount: number }) {
  useFavicon('📥', { badge: unreadCount });

  return <main>Unread: {unreadCount}</main>;
}
```

Supported `badge` values:

- `true` for a red dot
- `number` or `string` for visible content
- `{ content, color, position }` for customization
- `false`, `0`, or `''` to hide the badge

## Compose dark mode and away state

```tsx
import { useFavicon, useIsAway, useIsDark } from 'use-favicon';

export function PresenceAwareFavicon() {
  const isDark = useIsDark();
  const isAway = useIsAway();

  useFavicon(isAway ? '😴' : isDark ? '🌚' : '🌞', { badge: 7 });

  return null;
}
```

Both `useIsDark` and `useIsAway` are SSR-safe and return `false` on the server.

## Raw SVG and icon URLs

```tsx
import { useFavicon } from 'use-favicon';

export function CustomMark() {
  useFavicon({
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#111827" /><path d="M28 72L50 24L72 72H61L50 47L39 72Z" fill="#f8fafc" /></svg>',
  });

  return null;
}
```

```tsx
import { useFavicon } from 'use-favicon';

export function PngFavicon() {
  useFavicon('/icon.png');

  return null;
}
```

## API

```ts
useFavicon(value, options?)
```

`options` currently supports:

```ts
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
```

Named exports:

- `useFavicon`
- `useIsAway`
- `useIsDark`
- `inferKind`
- `buildFaviconSvg`
- `setFaviconHref`

## Migration

v2 removes the v1 imperative and variant APIs. Use [MIGRATION.md](./MIGRATION.md) for an old-to-new mapping of every changed feature.

## Demo

The `site/` workspace is a live v2 demo app wired against `use-favicon@workspace:*`.
