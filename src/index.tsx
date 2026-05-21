import { useEffect } from 'react';
import { buildFaviconSvg } from './buildFaviconSvg';
import { inferKind, type FaviconValueKind } from './inferKind';
import { setFaviconHref } from './setFaviconHref';

type RawSvgValue = { svg: string };
export type FaviconValue = string | string[] | RawSvgValue;

function toFaviconHref(kind: FaviconValueKind, value: FaviconValue): string {
  if (kind === 'icon') {
    return String(value);
  }

  const svg = buildFaviconSvg(kind, value);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useFavicon(value: FaviconValue): void {
  useEffect(() => {
    const kind = inferKind(value);
    const href = toFaviconHref(kind, value);
    setFaviconHref(href);
  }, [value]);
}

export { buildFaviconSvg, inferKind, setFaviconHref };
export type { FaviconValueKind };

export default useFavicon;
