import * as React from 'react';
import { useEffect, useState } from 'react';
import useIsAway from './hooks/useIsAway';
import useIsDarkMode from './hooks/useIsDarkMode';
import { FaviconFns, FaviconOptions, FaviconType } from './types';
import constructFaviconSvg from './utils/constructFaviconSvg';
import getFaviconLink from './utils/getFaviconLink';
import randomEmoji from './utils/randomEmoji';

function useFavicon(
  // random emoji favicon without options
  props: FaviconOptions = { type: 'emoji', value: randomEmoji() },
): FaviconFns {
  const [type, setType] = useState<FaviconType>(props.type);
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

    // set icon through svg
    const svg = constructFaviconSvg(
      type,
      value,
      isNotification,
      props.notification,
    );
    if (svg)
      favicon.setAttribute(
        'href',
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svg}</svg>`,
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

export function withFavicon<T extends JSX.IntrinsicAttributes>(
  Component: React.FC<T>,
  options: FaviconOptions,
) {
  return function ComponentWithFavicon(props: T) {
    useFavicon(options);

    return <Component {...props} />;
  };
}

export default useFavicon;
