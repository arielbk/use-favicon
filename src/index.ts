import { useCallback, useEffect, useState } from "react";
import useIsAway from "./hooks/useIsAway";
import useIsDarkMode from "./hooks/useIsDarkMode";

export interface faviconFns {
  triggerNotification: () => void;
  clearNotification: () => void;
}

export interface faviconOptions {
  icon?: string;
  emoji?: string;
  awayEmoji?: string;
  darkEmoji?: string;
}

const useFavicon = ({
  icon,
  emoji,
  awayEmoji,
  darkEmoji,
}: faviconOptions): faviconFns => {
  const [isNotification, setIsNotification] = useState(true);
  const isAway = useIsAway();
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;
    if (icon) favicon.setAttribute("href", icon);
  }, [isNotification]);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;
    let selectedEmoji = emoji;
    if (isDarkMode && darkEmoji) selectedEmoji = darkEmoji;
    if (isAway && awayEmoji) selectedEmoji = awayEmoji;
    if (selectedEmoji) {
      favicon.setAttribute(
        "href",
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${selectedEmoji}</text></svg>`
      );
    }
  }, [isAway, isDarkMode]);

  return {
    triggerNotification: useCallback(() => setIsNotification(true), []),
    clearNotification: useCallback(() => setIsNotification(false), []),
  };
};

export default useFavicon;
