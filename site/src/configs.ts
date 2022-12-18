import { FaviconOptions } from '../../dist/types';

export type Config = {
  id: string;
  name: string;
  options: FaviconOptions;
};

const configs: Config[] = [
  {
    id: 'emoji',
    name: 'Emoji',
    options: {
      type: 'emoji',
      value: '👾',
    },
  },
  {
    id: 'gradient',
    name: 'Color gradient',
    options: {
      type: 'gradient',
      value: ['#ff00ff', '#0000ff'], // purple to blue
    },
  },
  {
    id: 'variants',
    name: 'Away and dark variants',
    options: {
      // default favicon
      type: 'emoji',
      value: '🌞',
      // favicon to use when user has dark mode
      darkVariant: {
        type: 'emoji',
        value: '🌝',
      },
      // favicon to use when tab is unfocused
      awayVariant: {
        type: 'emoji',
        value: '👽',
      },
    },
  },
  {
    id: 'notifications',
    name: 'Notification options',
    options: {
      type: 'emoji',
      value: '🧠',
      notification: {
        position: 'top left',
        color: '#636cff',
      },
    },
  },
];

export default configs;
