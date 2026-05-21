import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import useFavicon, { buildFaviconSvg } from '../src';

describe('useFavicon', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('writes an emoji favicon on initial render and returns void', () => {
    const { result } = renderHook(() => useFavicon('🦊'));

    const favicon = document.querySelector("link[rel='icon']");

    expect(result.current).toBeUndefined();
    expect(favicon).not.toBeNull();
    expect(favicon?.getAttribute('href')).toBe(
      `data:image/svg+xml,${encodeURIComponent(buildFaviconSvg('emoji', '🦊'))}`,
    );
  });

  it('updates the favicon when the value changes', () => {
    const { rerender } = renderHook(({ value }) => useFavicon(value), {
      initialProps: { value: '🦊' as const },
    });

    rerender({ value: '🐻' });

    const favicon = document.querySelector("link[rel='icon']");

    expect(favicon?.getAttribute('href')).toBe(
      `data:image/svg+xml,${encodeURIComponent(buildFaviconSvg('emoji', '🐻'))}`,
    );
  });

  it('supports raw svg values', () => {
    const rawSvg = { svg: '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>' };

    renderHook(() => useFavicon(rawSvg));

    const favicon = document.querySelector("link[rel='icon']");

    expect(favicon?.getAttribute('href')).toBe(
      `data:image/svg+xml,${encodeURIComponent(rawSvg.svg)}`,
    );
  });

  it('sets icon urls directly as the favicon href', () => {
    renderHook(() => useFavicon('/icon.png'));

    const favicon = document.querySelector("link[rel='icon']");

    expect(favicon?.getAttribute('href')).toBe('/icon.png');
  });

  it('can unmount without throwing', () => {
    const { unmount } = renderHook(() => useFavicon('🦊'));

    expect(() => unmount()).not.toThrow();
  });

  it('does not touch document during SSR', () => {
    const originalDocument = globalThis.document;

    const TestComponent = () => {
      useFavicon('🦊');
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
