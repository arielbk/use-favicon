# **use-favicon**

A React hook to update the favicon of your app. This can be useful to quickly add a favicon to a side project, or to dynamically change the icon based on certain app states.

## **Features**

- Favicon can be either a regular image icon, an emoji, or a color palette
- Favicon can change based on tab focus or dark mode
- A notification badge can be triggered on the icon

## **Getting started**

```jsx
npm install use-favicon
```

```jsx
import useFavicon from "use-favicon";

// in your functional React component
useFavicon({});

// 👆 with default options, this will set your favicon to a random emoji
```

## Example

```jsx
import useFavicon from "use-favicon";

export default function App() {
  useFavicon({
    // options here
  });

  return <div>Example app!</div>;
}
```

## **API**

`useFavicon` takes an options object as follows:

```jsx
type UseFaviconOptions = {
  faviconType?: FaviconTypes,
  emoji?: string | IconVariants,
  icon?: string | IconVariants,
  colors?: string[],
};

type FaviconTypes = "icon" | "emoji" | "colors";

type IconVariants = {
  default: string,
  dark?: string,
  away?: string,
};
```

It will return the following functions:

```jsx
type FaviconFns = {
  triggerNotification: () => void,
  clearNotification: () => void,
  selectFaviconType: (type: string) => void,
};
```

## Requirements

- React >v16.8 (must support hooks)
- Must be used within a functional component
- Currently cannot be used on server rendered React applications
- SVG icons (required for the emoji and color favicon variants) are now supported in most modern browsers (check out the [caniuse page](https://caniuse.com/?search=svg%20favicon))
