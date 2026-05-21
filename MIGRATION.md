# Migration Guide

This guide maps every v1 pattern to the v2 API.

## Core change

v1 centered on an options object and imperative setters. v2 centers on one declarative rule:

```tsx
useFavicon(value, options?);
```

Change the favicon by rerendering with a new `value` or new `options`.

## Old to new

| v1 pattern | v2 replacement |
| --- | --- |
| `useFavicon({ type, value })` | `useFavicon(value)` |
| `setOptions(nextOptions)` | Update React state/props and rerender `useFavicon(nextValue, nextOptions)` |
| `setFaviconNotification(...)` | Pass `badge` in the second argument |
| `darkVariant` | Compose `useIsDark()` in your own component logic |
| `awayVariant` | Compose `useIsAway()` in your own component logic |
| `withFavicon(Component, options)` | Call `useFavicon(...)` directly inside the component |
| `type: 'colors'` mode | Use the raw SVG escape hatch `{ svg }` |

## `type` and `value` to bare values

v1:

```tsx
useFavicon({
  type: 'emoji',
  value: '👾',
});
```

v2:

```tsx
useFavicon('👾');
```

More inferred values:

```tsx
useFavicon('#f97316');
useFavicon(['#f97316', '#fb7185', '#38bdf8']);
useFavicon('/icon.png');
useFavicon({ svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>' });
```

## `setOptions` to rerenders

v1:

```tsx
const { setOptions } = useFavicon({
  type: 'emoji',
  value: '🙂',
});

setOptions({
  type: 'emoji',
  value: '🦊',
});
```

v2:

```tsx
import { useState } from 'react';
import { useFavicon } from 'use-favicon';

export function Example() {
  const [value, setValue] = useState('🙂');

  useFavicon(value);

  return <button onClick={() => setValue('🦊')}>Switch favicon</button>;
}
```

## `setFaviconNotification` to `badge`

v1:

```tsx
const { setFaviconNotification } = useFavicon({
  type: 'emoji',
  value: '🧠',
  notification: {
    color: '#fb464c',
    position: 'bottom right',
  },
});

setFaviconNotification(true);
```

v2:

```tsx
import { useFavicon } from 'use-favicon';

export function Example({ unread }: { unread: number }) {
  useFavicon('🧠', { badge: unread });
  return null;
}
```

Custom badge styling stays available:

```tsx
useFavicon('🧠', {
  badge: {
    content: '!',
    color: '#0f766e',
    position: 'bottom left',
  },
});
```

## `darkVariant` to `useIsDark`

v1:

```tsx
useFavicon({
  type: 'emoji',
  value: '🌞',
  darkVariant: {
    type: 'emoji',
    value: '🌚',
  },
});
```

v2:

```tsx
import { useFavicon, useIsDark } from 'use-favicon';

export function Example() {
  const isDark = useIsDark();

  useFavicon(isDark ? '🌚' : '🌞');

  return null;
}
```

## `awayVariant` to `useIsAway`

v1:

```tsx
useFavicon({
  type: 'emoji',
  value: '🙂',
  awayVariant: {
    type: 'emoji',
    value: '😴',
  },
});
```

v2:

```tsx
import { useFavicon, useIsAway } from 'use-favicon';

export function Example() {
  const isAway = useIsAway();

  useFavicon(isAway ? '😴' : '🙂');

  return null;
}
```

## `withFavicon` to direct hook usage

v1:

```tsx
import { withFavicon } from 'use-favicon';

function App() {
  return <main>Hello</main>;
}

export default withFavicon(App, {
  type: 'emoji',
  value: '🧪',
});
```

v2:

```tsx
import { useFavicon } from 'use-favicon';

export function App() {
  useFavicon('🧪');

  return <main>Hello</main>;
}
```

If you previously used the HOC conditionally, move that condition into normal component logic and only call the hook from components that should own the favicon.

## `colors` mode to raw SVG

v1 exposed a dedicated `colors` mode. v2 keeps the public surface smaller and leaves full custom drawing to the raw-SVG escape hatch.

```tsx
useFavicon({
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316" /><stop offset="100%" stop-color="#38bdf8" /></linearGradient></defs><rect width="100" height="100" rx="18" fill="url(#g)" /></svg>',
});
```

## Checklist

- Replace every v1 options object with `useFavicon(value, options?)`.
- Replace imperative setter calls with state updates.
- Replace `notification` with `badge`.
- Replace `darkVariant` and `awayVariant` with `useIsDark` and `useIsAway`.
- Remove any `withFavicon` usage.
- Move any custom multi-color drawing into raw SVG.
