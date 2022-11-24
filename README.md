# **use-favicon**

A React hook to update the favicon of your app. Useful to quickly add a favicon to a side project, or to dynamically change the favicon based on the state of your application.

This library makes use of SVG icons, which are now supported in most modern browsers (check out the [caniuse page](https://caniuse.com/?search=svg%20favicon)).

## Features

- Favicon can be either a regular image icon, an emoji, a color palette, or a gradient
- Dynamic favicon based on tab focus
- Dynamic favicon based on light or dark mode
- A notification badge can be triggered on the icon

## Getting started

```jsx
npm install use-favicon
```

```tsx
import useFavicon from 'use-favicon';

// in your functional React component
useFavicon();

// 👆 without a config object this will set your favicon to a random emoji
```

## Examples

### Emoji

```tsx
import useFavicon from 'use-favicon';

export default function App() {
  useFavicon({
    type: 'emoji',
    value: '👾',
  });

  return <div>Example app!</div>;
}
```

### Color gradient

```tsx
import useFavicon from 'use-favicon';

export default function App() {
  useFavicon({
    type: 'gradient',
    value: ['#ff00ff', '#0000ff'], // purple to blue
    direction: '45deg',
  });

  return <div>Example app!</div>;
}
```

### Away and dark variant

```tsx
import useFavicon from 'use-favicon';

export default function App() {
  useFavicon({
    // default favicon
    type: 'emoji',
    value: '🌞',
    // favicon to use when user has dark mode
    darkVariant: {
      type: 'emoji',
      value: '🌝',
    },
    // favicon to use when tab is unfocused
    awayVariant: {
      type: 'emoji',
      value: '👽',
    },
  });

  return <div>Example app!</div>;
}
```

### Favicon notifications

```tsx
import useFavicon from 'use-favicon';

export default function App() {
  const { setFaviconNotification } = useFavicon({
    type: 'emoji',
    value: '🧠',
    notification: {
      position: 'bottom right',
      color: '#fb464c',
    },
  });

  return (
    <div>
      <button onClick={() => setFaviconNotification(true)}>
        Notification on
      </button>
      <button onClick={() => setFaviconNotification(false)}>
        Notification off
      </button>
    </div>
  );
}
```
