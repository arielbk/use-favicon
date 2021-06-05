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

export type FaviconTypes = 'icon' | 'emoji' | 'colors';

export type UseFaviconOptions = {
  faviconType?: FaviconTypes;
  emoji?: string | IconVariants;
  icon?: string | IconVariants;
  colors?: string[];
};
