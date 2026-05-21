import type { FaviconValueKind } from './inferKind';

type SvgValue = { svg: string };
type BuildFaviconSvgValue = string | string[] | SvgValue;
type BadgeContent = string | number;

export type BadgePosition = 'top right' | 'top left' | 'bottom right' | 'bottom left';
export type BadgeOption =
  | boolean
  | BadgeContent
  | {
      content: BadgeContent;
      color?: string;
      position?: BadgePosition;
    };
export type BuildFaviconSvgOptions = {
  badge?: BadgeOption;
};

const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
const SVG_CLOSE = '</svg>';
const DEFAULT_BADGE_COLOR = '#ef4444';
const BADGE_POSITIONS: Record<BadgePosition, { x: number; y: number }> = {
  'top right': { x: 76, y: 24 },
  'top left': { x: 24, y: 24 },
  'bottom right': { x: 76, y: 76 },
  'bottom left': { x: 24, y: 76 },
};

function escapeAttributeValue(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
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

function normalizeBadge(badge: BadgeOption | undefined):
  | { color: string; position: BadgePosition }
  | { color: string; content: string; position: BadgePosition }
  | null {
  if (badge === false || badge === 0 || badge === '' || badge == null) {
    return null;
  }

  if (badge === true) {
    return {
      color: DEFAULT_BADGE_COLOR,
      position: 'top right',
    };
  }

  if (typeof badge === 'string' || typeof badge === 'number') {
    return {
      color: DEFAULT_BADGE_COLOR,
      content: String(badge),
      position: 'top right',
    };
  }

  const content = String(badge.content);

  if (content === '' || content === '0') {
    return null;
  }

  return {
    color: badge.color ?? DEFAULT_BADGE_COLOR,
    content,
    position: badge.position ?? 'top right',
  };
}

function buildBadgeSvg(badge: BadgeOption | undefined): string {
  const normalizedBadge = normalizeBadge(badge);

  if (!normalizedBadge) {
    return '';
  }

  const { x, y } = BADGE_POSITIONS[normalizedBadge.position];

  if (!('content' in normalizedBadge)) {
    return `<circle cx="${x}" cy="${y}" r="18" fill="${escapeAttributeValue(normalizedBadge.color)}" stroke="#ffffff" stroke-width="6" />`;
  }

  const content = escapeAttributeValue(normalizedBadge.content);
  const badgeWidth = Math.max(36, 18 + normalizedBadge.content.length * 18);
  const badgeHeight = 36;
  const badgeX = normalizedBadge.position.includes('left') ? x - 18 : x - badgeWidth + 18;
  const badgeY = y - badgeHeight / 2;
  const textX = badgeX + badgeWidth / 2;
  const textY = y + 1;

  return `<rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="${badgeHeight}" rx="18" fill="${escapeAttributeValue(normalizedBadge.color)}" stroke="#ffffff" stroke-width="4" /><text x="${textX}" y="${textY}" font-size="24" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#ffffff">${content}</text>`;
}

export function buildFaviconSvg(
  kind: Exclude<FaviconValueKind, 'icon'>,
  value: BuildFaviconSvgValue,
  options: BuildFaviconSvgOptions = {},
): string {
  if (kind === 'svg') {
    return typeof value === 'object' && value !== null && 'svg' in value ? value.svg : String(value);
  }

  const badgeSvg = buildBadgeSvg(options.badge);

  if (kind === 'emoji') {
    return `${SVG_OPEN}<text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">${String(value)}</text>${badgeSvg}${SVG_CLOSE}`;
  }

  if (kind === 'color') {
    const colorValue = Array.isArray(value) ? value[0] ?? '' : String(value);
    return `${buildColorSvg(colorValue).replace(SVG_CLOSE, '')}${badgeSvg}${SVG_CLOSE}`;
  }

  const gradientValue = Array.isArray(value) ? value : [String(value)];
  return `${buildGradientSvg(gradientValue).replace(SVG_CLOSE, '')}${badgeSvg}${SVG_CLOSE}`;
}
