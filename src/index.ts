import { useCallback, useEffect, useState } from "react";
import useIsAway from "./hooks/useIsAway";
import useIsDarkMode from "./hooks/useIsDarkMode";
import getFavicon from "./utils/getFavicon";

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

type UseFaviconOptions = {
  faviconType?: "icon" | "emoji" | "color";
  emoji?: string | IconVariants;
  icon?: string | IconVariants;
};

const useFaviconOptions = ({
  faviconType = "emoji",
  emoji = "😊",
  icon,
}: UseFaviconOptions): FaviconFns => {
  const [type, setType] = useState(faviconType);
  const [isNotification, setIsNotification] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(
    typeof emoji === "object" ? emoji.default : emoji
  );
  const [selectedIcon, setSelectedIcon] = useState(
    typeof icon === "object" ? icon.default : icon
  );
  const isAway = useIsAway();
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    // determine selected emoji
    if (typeof emoji !== "object") return;
    let emojiVariant = "default";
    if (isDarkMode && emoji.dark) emojiVariant = "dark";
    if (isAway && emoji.away) emojiVariant = "away";
    setSelectedEmoji(emoji[emojiVariant]);

    // determine selected icon
    if (typeof icon !== "object") return;
    let iconVariant = "default";
    if (isDarkMode && icon.dark) iconVariant = "dark";
    if (isAway && icon.away) iconVariant = "away";
    setSelectedIcon(emoji[iconVariant]);
  }, [isDarkMode, isAway]);

  useEffect(() => {
    const favicon = getFavicon();
    if (!favicon) return;
    if (type === "icon" && selectedIcon)
      favicon.setAttribute("href", selectedIcon);
    if (type === "emoji") {
      favicon.setAttribute(
        "href",
        `data:image/svg+xml,
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <style>
            circle { fill: red; }
          </style>
          <text y=".9em" font-size="90">${selectedEmoji}</text>
          ${isNotification ? '<circle cx="80" cy="20" r="20" />' : ""}
        </svg>`
      );
    }
  }, [selectedEmoji, isNotification]);

  return {
    triggerNotification: useCallback(() => setIsNotification(true), []),
    clearNotification: useCallback(() => setIsNotification(false), []),
    selectFaviconType: useCallback(
      (newType: "emoji" | "icon" | "color") => setType(newType),
      []
    ),
  };
};

export default useFaviconOptions;
