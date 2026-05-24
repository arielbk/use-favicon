import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useFavicon, useIsAway, useIsDark } from '../src';

describe('documentation examples', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('supports the README quick-start and badge examples', () => {
    const { rerender } = renderHook(
      ({ value, badge }) => useFavicon(value, badge === undefined ? undefined : { badge }),
      {
        initialProps: { value: '🦊', badge: 3 as number | undefined },
      },
    );

    const favicon = document.querySelector("link[rel='icon']");

    expect(favicon?.getAttribute('href')).toContain('data:image/svg+xml');

    rerender({ value: ['#f97316', '#fb7185', '#38bdf8'], badge: '!' });

    expect(favicon?.getAttribute('href')).toContain('%23f97316');
    expect(favicon?.getAttribute('href')).toContain('%3E!%3C%2Ftext%3E');
  });

  it('supports the composed useIsDark/useIsAway example without SSR errors', () => {
    const Example = () => {
      const isDark = useIsDark();
      const isAway = useIsAway();

      useFavicon(isAway ? '😴' : isDark ? '🌚' : '🌞', { badge: 7 });
      return null;
    };

    expect(() => renderHook(() => Example())).not.toThrow();
    expect(() => renderToString(<Example />)).not.toThrow();
  });

  it('supports raw SVG and icon-url escape hatches from the docs', () => {
    const rawSvg = {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#111827" /></svg>',
    };

    const { rerender } = renderHook(({ value }) => useFavicon(value), {
      initialProps: { value: rawSvg as typeof rawSvg | string },
    });

    let favicon = document.querySelector("link[rel='icon']");
    expect(favicon?.getAttribute('href')).toContain(encodeURIComponent(rawSvg.svg));

    rerender({ value: '/icon.png' });

    favicon = document.querySelector("link[rel='icon']");
    expect(favicon?.getAttribute('href')).toBe('/icon.png');
  });
});
