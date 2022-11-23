export type FaviconFns = {
  setFaviconNotification: (isNotification?: boolean) => void;
};

export type FaviconType = 'icon' | 'emoji' | 'colors' | 'gradient';

export type FaviconNotificationOptions = {
  position:
    | `${'top' | 'center' | 'bottom'} ${'left' | 'center' | 'right'}`
    | 'center';
  color: string;
};

export type FaviconOptions =
  | {
      type: 'icon' | 'emoji';
      value: string;
      awayVariant?: FaviconOptions;
      darkVariant?: FaviconOptions;
      notification?: FaviconNotificationOptions;
    }
  // value can only be string[] if type is 'colors' | 'gradient'
  | {
      type: 'colors' | 'gradient';
      value: string | string[];
      awayVariant?: FaviconOptions;
      darkVariant?: FaviconOptions;
      notification?: FaviconNotificationOptions;
    };
