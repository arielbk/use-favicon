import { useCallback, useEffect, useState } from 'react';
import useIsAway from './hooks/useIsAway';
import useIsDarkMode from './hooks/useIsDarkMode';
import getFavicon from './utils/getFavicon';
import randomEmoji from './utils/randomEmoji';

export type FaviconFns = {
  triggerNotification: () => void;
  clearNotification: () => void;
  selectFaviconType: (type: string) => void;
};

type IconVariants = {
  default: string;
  dark?: string;
  away?: string;
};

type FaviconTypes = 'icon' | 'emoji' | 'colors';

type UseFaviconOptions = {
  faviconType?: FaviconTypes;
  emoji?: string | IconVariants;
  icon?: string | IconVariants;
  colors?: string[];
};

const useFaviconOptions = ({
  faviconType = 'emoji',
  emoji = randomEmoji(),
  icon,
  colors,
}: UseFaviconOptions): FaviconFns => {
  const [type, setType] = useState(faviconType);
  const [isNotification, setIsNotification] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(
    typeof emoji === 'object' ? emoji.default : emoji,
  );
  const [selectedIcon, setSelectedIcon] = useState(
    typeof icon === 'object' ? icon.default : icon,
  );
  const isAway = useIsAway();
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    // todo: abstract these three selections

    // determine selected emoji
    if (typeof emoji !== 'object') return;
    let emojiVariant = 'default';
    if (isDarkMode && emoji.dark) emojiVariant = 'dark';
    if (isAway && emoji.away) emojiVariant = 'away';
    setSelectedEmoji(emoji[emojiVariant]);

    // determine selected icon
    if (typeof icon !== 'object') return;
    let iconVariant = 'default';
    if (isDarkMode && icon.dark) iconVariant = 'dark';
    if (isAway && icon.away) iconVariant = 'away';
    setSelectedIcon(emoji[iconVariant]);
  }, [isDarkMode, isAway]);

  useEffect(() => {
    const favicon = getFavicon();
    if (!favicon) return;
    if (type === 'icon' && selectedIcon)
      favicon.setAttribute('href', selectedIcon);
    if (type === 'emoji') {
      favicon.setAttribute(
        'href',
        `data:image/svg+xml,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <style>
            circle { fill: red; }
          </style>
          <text y=".9em" font-size="90">${selectedEmoji}</text>
          ${isNotification ? '<circle cx="80" cy="20" r="20" />' : ''}
        </svg>`,
      );
    }
    if (type === 'colors') {
      const offset = Math.floor(100 / colors!.length);
      favicon.setAttribute(
        'href',
        `data:image/svg+xml,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          ${colors?.map(
            (color, i) => `
            <rect x="${
              offset * i
            }" y="0" height="100" width="${offset}" fill="${color.replace(
              '#',
              '%23',
            )}" />
          `,
          )}
        </svg>`,
      );
    }
  }, [selectedEmoji, isNotification]);

  return {
    triggerNotification: useCallback(() => setIsNotification(true), []),
    clearNotification: useCallback(() => setIsNotification(false), []),
    selectFaviconType: useCallback(
      (newType: FaviconTypes) => setType(newType),
      [],
    ),
  };
};

export default useFaviconOptions;
