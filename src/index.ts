import { useCallback, useEffect, useState } from "react";

export interface faviconFns {
  triggerNotification: () => void;
  clearNotification: () => void;
}

export interface faviconOptions {
  icon?: string;
  emoji?: string;
  awayEmoji?: string;
}

const useFavicon = ({ icon, emoji, awayEmoji }: faviconOptions): faviconFns => {
  const [isNotification, setIsNotification] = useState(true);
  const [isAway, setIsAway] = useState(false);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;
    if (icon) favicon.setAttribute("href", icon);
  }, [isNotification]);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;
    if (emoji) {
      favicon.setAttribute(
        "href",
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${
          isAway ? awayEmoji : emoji
        }</text></svg>`
      );
    }
  }, [isAway]);

  useEffect(() => {
    const toggleIsAway = () => setIsAway((prev) => !prev);
    document.addEventListener("visibilitychange", toggleIsAway);
  }, []);

  return {
    triggerNotification: useCallback(() => setIsNotification(true), []),
    clearNotification: useCallback(() => setIsNotification(false), []),
  };
};

export default useFavicon;
