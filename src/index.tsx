import * as React from 'react';
import { useEffect, useState } from 'react';
import useIsAway from './hooks/useIsAway';
import useIsDarkMode from './hooks/useIsDarkMode';
import { FaviconApi, FaviconOptions, FaviconType } from './types';
import constructFaviconSvg from './utils/constructFaviconSvg';
import getFaviconLink from './utils/getFaviconLink';
import randomEmoji from './utils/randomEmoji';

function useFavicon(
  // random emoji favicon without options
  props: FaviconOptions = { type: 'emoji', value: randomEmoji() },
): FaviconApi {
  const [options, setOptions] = useState(props);

  const [type, setType] = useState<FaviconType>(props.type);
  const [value, setValue] = useState(props.value);
  const [isNotification, setIsNotification] = useState(false);

  const [faviconSvg, setFaviconSvg] = useState<string>();

  const isAway = useIsAway();
  const isDarkMode = useIsDarkMode();

  // determine favicon variant
  useEffect(() => {
    setType(options.type);
    setValue(options.value);
    if (isDarkMode && options.darkVariant) {
      setType(options.darkVariant.type);
      setValue(options.darkVariant.value);
    }
    if (isAway && options.awayVariant) {
      setType(options.awayVariant.type);
      setValue(options.awayVariant.value);
    }
  }, [options, isAway, isDarkMode]);

  useEffect(() => {
    // get favicon svg
    const svg = constructFaviconSvg(
      type,
      value,
      isNotification,
      props.notification,
    );
    setFaviconSvg(svg);
  }, [type, value, isNotification]);

  useEffect(() => {
    // set favicon svg
    const favicon = getFaviconLink();
    // just set the icon directly
    if (type === 'icon') {
      favicon.setAttribute('href', props.value as string);
    } else {
      favicon.setAttribute('href', `data:image/svg+xml,${faviconSvg}`);
    }
  }, [faviconSvg]);

  return {
    setFaviconNotification: (newIsNotification?: boolean) => {
      if (newIsNotification !== undefined) {
        setIsNotification(newIsNotification);
      } else {
        setIsNotification((prev) => !prev);
      }
    },
    faviconSvg,
    setOptions,
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
