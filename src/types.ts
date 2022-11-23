export type FaviconFns = {
  setFaviconNotification: (isNotification?: boolean) => void;
};

export type FaviconType = 'icon' | 'emoji' | 'colors' | 'gradient';

export type FaviconOptions = {
  type: FaviconType;
  // TODO: value can only be string[] if type is colors | gradient
  value: string | string[];
  awayVariant?: FaviconOptions;
  darkVariant?: FaviconOptions;
};
