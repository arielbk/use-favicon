import type { FaviconValueKind } from './inferKind';

type SvgValue = { svg: string };
type BuildFaviconSvgValue = string | string[] | SvgValue;

const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
const SVG_CLOSE = '</svg>';

function escapeAttributeValue(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function buildEmojiSvg(value: string): string {
  return `${SVG_OPEN}<text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">${value}</text>${SVG_CLOSE}`;
}

function buildColorSvg(value: string): string {
  return `${SVG_OPEN}<rect width="100" height="100" rx="18" fill="${escapeAttributeValue(value)}" />${SVG_CLOSE}`;
}

function buildGradientSvg(value: string[]): string {
  const stops = value
    .map((color, index) => {
      const offset = value.length === 1 ? 0 : Math.round((index / (value.length - 1)) * 100);
      return `<stop offset="${offset}%" stop-color="${escapeAttributeValue(color)}" />`;
    })
    .join('');

  return `${SVG_OPEN}<defs><linearGradient id="favicon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient></defs><rect width="100" height="100" rx="18" fill="url(#favicon-gradient)" />${SVG_CLOSE}`;
}

export function buildFaviconSvg(
  kind: Exclude<FaviconValueKind, 'icon'>,
  value: BuildFaviconSvgValue,
): string {
  if (kind === 'svg') {
    return typeof value === 'object' && value !== null && 'svg' in value ? value.svg : String(value);
  }

  if (kind === 'emoji') {
    return buildEmojiSvg(String(value));
  }

  if (kind === 'color') {
    const colorValue = Array.isArray(value) ? value[0] ?? '' : String(value);
    return buildColorSvg(colorValue);
  }

  const gradientValue = Array.isArray(value) ? value : [String(value)];
  return buildGradientSvg(gradientValue);
}
