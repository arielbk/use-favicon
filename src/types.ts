export type FaviconFns = {
  triggerNotification: () => void;
  clearNotification: () => void;
  selectFaviconType: (type: string) => void;
};

export type IconVariants = {
  default: string;
  dark?: string;
  away?: string;
};

export type FaviconType = 'icon' | 'emoji' | 'colors' | 'gradient';

export type FaviconOptions = {
  emoji?: string | IconVariants;
  icon?: string | IconVariants;
  colors?: string[];
};

export type IconOptions = FaviconOptions & {
  icon: string | IconVariants;
};

export type EmojiOptions = FaviconOptions & {
  emoji: string | IconVariants;
};

export type ColorOptions = FaviconOptions & {
  colors: string[];
};
