import { IconVariants } from '..';

export default function getFaviconVariant(
  favicon: string | IconVariants,
  isAway: boolean,
  isDarkMode: boolean,
) {
  if (typeof favicon === 'string') return favicon;
  let variant = 'default';
  if (isDarkMode && favicon.dark) variant = 'dark';
  if (isAway && favicon.away) variant = 'away';
  return favicon[variant];
}
