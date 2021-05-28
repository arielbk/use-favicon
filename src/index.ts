import { useCallback, useEffect, useState } from "react";

export interface faviconFns {
  triggerNotification: () => void;
  clearNotification: () => void;
}

export interface faviconOptions {
  icon: string;
}

const useFavicon = ({ icon }: faviconOptions): faviconFns => {
  const [letterIndex] = useState(0);
  const [isNotification, setIsNotification] = useState(true);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.setAttribute("href", icon);
  }, [letterIndex, isNotification]);

  return {
    triggerNotification: useCallback(() => setIsNotification(true), []),
    clearNotification: useCallback(() => setIsNotification(false), []),
  };
};

export default useFavicon;
