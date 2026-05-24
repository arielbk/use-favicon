import { useEffect } from 'react';
import { buildFaviconSvg, type BuildFaviconSvgOptions } from './buildFaviconSvg';
import { inferKind, type FaviconValueKind } from './inferKind';
import { setFaviconHref } from './setFaviconHref';
import { useIsAway } from './useIsAway';
import { useIsDark } from './useIsDark';

type RawSvgValue = { svg: string };
export type FaviconValue = string | string[] | RawSvgValue;

export type UseFaviconOptions = BuildFaviconSvgOptions;

function toFaviconHref(
  kind: FaviconValueKind,
  value: FaviconValue,
  options: UseFaviconOptions = {},
): string {
  if (kind === 'icon') {
    return String(value);
  }

  const svg = buildFaviconSvg(kind, value, options);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useFavicon(value: FaviconValue, options: UseFaviconOptions = {}): void {
  useEffect(() => {
    const kind = inferKind(value);
    const href = toFaviconHref(kind, value, options);
    setFaviconHref(href);
  }, [options, value]);
}

export { buildFaviconSvg, inferKind, setFaviconHref, useIsAway, useIsDark };
export type { FaviconValueKind };

export default useFavicon;
