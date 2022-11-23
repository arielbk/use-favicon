import { useEffect, useState } from 'react';
import useIsAway from './hooks/useIsAway';
import useIsDarkMode from './hooks/useIsDarkMode';
import { FaviconFns, FaviconOptions } from './types';
import getFaviconLink from './utils/getFaviconLink';
import randomEmoji from './utils/randomEmoji';

function useFavicon(
  props: FaviconOptions = { type: 'icon', value: randomEmoji() },
): FaviconFns {
  const [type, setType] = useState(props.type);
  const [value, setValue] = useState(props.value);
  const [isNotification, setIsNotification] = useState(false);

  const isAway = useIsAway();
  const isDarkMode = useIsDarkMode();

  // determine favicon variant
  useEffect(() => {
    if (isDarkMode && props.darkVariant) {
      setType(props.darkVariant.type);
      setValue(props.darkVariant.value);
    }
    if (isAway && props.awayVariant) {
      setType(props.awayVariant.type);
      setValue(props.awayVariant.value);
    }
  }, [isAway, isDarkMode]);

  useEffect(() => {
    const favicon = getFaviconLink();

    // just set the icon directly
    if (type === 'icon') favicon.setAttribute('href', props.value as string);

    // initialise svg string
    let svgBody = '';

    // for emoji
    if (type === 'emoji') {
      svgBody = `<style> circle { fill: red; } </style>
      <text y=".9em" font-size="90">${value}</text>
      ${isNotification ? '<circle cx="80" cy="20" r="20" />' : ''}`;
    }

    // for colors
    if (type === 'colors') {
      const colorArray = typeof value === 'object' ? value : [value];
      const offset = Math.floor(100 / colorArray.length);
      svgBody = colorArray
        .map(
          (color, i) =>
            `<rect x="${
              offset * i
            }" y="0" height="100" width="${offset}" fill="${color.replace(
              /\#/g,
              '%23',
            )}" />`,
        )
        .join();
    }
    // for gradients
    if (type === 'gradient') {
      const offset = Math.floor(100 / (value.length - 1));
      svgBody = `<defs>
      <linearGradient id="gradient">
        ${(value as string[])
          .map(
            (color, i) =>
              `<stop offset="${offset * i}%" stop-color="${color}" />`,
          )
          .join()}
      </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#gradient)" />
      `
        .replace(/\%/g, '%25')
        .replace(/\#/g, '%23');
    }
    // set icon through svg
    if (svgBody)
      favicon.setAttribute(
        'href',
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgBody}</svg>`,
      );
  }, [type, value, isNotification]);

  return {
    setFaviconNotification: (newIsNotification?: boolean) => {
      if (newIsNotification !== undefined) {
        setIsNotification(newIsNotification);
      } else {
        setIsNotification((prev) => !prev);
      }
    },
  };
}

export default useFavicon;
