import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import {
  useIsAway,
  useIsDark,
} from '../src';
import { getAwayServerSnapshot } from '../src/useIsAway';
import { getDarkServerSnapshot } from '../src/useIsDark';

type MatchMediaChangeListener = (event: MediaQueryListEvent) => void;

function installMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<MatchMediaChangeListener>();
  const originalMatchMedia = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: (_event: 'change', listener: MatchMediaChangeListener) => {
        listeners.add(listener);
      },
      removeEventListener: (_event: 'change', listener: MatchMediaChangeListener) => {
        listeners.delete(listener);
      },
      addListener: (listener: MatchMediaChangeListener) => {
        listeners.add(listener);
      },
      removeListener: (listener: MatchMediaChangeListener) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
    })),
  });

  return {
    restore() {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: originalMatchMedia,
      });
    },
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;

      listeners.forEach((listener) => listener(event));
    },
  };
}

describe('useIsAway', () => {
  const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');

  afterEach(() => {
    if (originalVisibilityState) {
      Object.defineProperty(document, 'visibilityState', originalVisibilityState);
    }
  });

  it('returns the current visibility state and updates on visibilitychange', () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    const { result } = renderHook(() => useIsAway());

    expect(result.current).toBe(true);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(false);
  });

  it('returns false from the server snapshot', () => {
    expect(getAwayServerSnapshot()).toBe(false);
  });

  it('does not touch document during SSR', () => {
    const originalDocument = globalThis.document;

    const TestComponent = () => {
      useIsAway();
      return null;
    };

    try {
      // @ts-expect-error jsdom document is removed to simulate SSR.
      delete globalThis.document;

      expect(() => renderToString(<TestComponent />)).not.toThrow();
    } finally {
      globalThis.document = originalDocument;
    }
  });
});

describe('useIsDark', () => {
  let restoreMatchMedia: (() => void) | undefined;

  afterEach(() => {
    restoreMatchMedia?.();
    restoreMatchMedia = undefined;
  });

  it('returns the current media query state and updates on change', () => {
    const matchMedia = installMatchMedia(true);
    restoreMatchMedia = matchMedia.restore;

    const { result } = renderHook(() => useIsDark());

    expect(result.current).toBe(true);

    act(() => {
      matchMedia.setMatches(false);
    });

    expect(result.current).toBe(false);
  });

  it('returns false from the server snapshot', () => {
    expect(getDarkServerSnapshot()).toBe(false);
  });

  it('does not touch document during SSR', () => {
    const originalDocument = globalThis.document;

    const TestComponent = () => {
      useIsDark();
      return null;
    };

    try {
      // @ts-expect-error jsdom document is removed to simulate SSR.
      delete globalThis.document;

      expect(() => renderToString(<TestComponent />)).not.toThrow();
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
