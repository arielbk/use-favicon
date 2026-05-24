export type FaviconValueKind = 'emoji' | 'color' | 'gradient' | 'icon' | 'svg';

const emojiPattern = /^\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*$/u;
const hexColorPattern = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const functionalColorPattern =
  /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(.+\)$/i;
const iconExtensionPattern =
  /\.(?:png|ico|svg|jpg|jpeg|webp|gif|avif|bmp)(?:[?#].*)?$/i;
const iconPathPattern =
  /^(?:https?:\/\/|data:image\/|\.{0,2}\/|\/|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/).+/i;
const namedColors = new Set([
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'transparent',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
]);

function isColorString(value: string): boolean {
  const trimmed = value.trim().toLowerCase();

  if (trimmed === '') {
    return false;
  }

  return (
    hexColorPattern.test(trimmed) ||
    functionalColorPattern.test(trimmed) ||
    namedColors.has(trimmed)
  );
}

function isIconString(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed === '') {
    return false;
  }

  return iconExtensionPattern.test(trimmed) || iconPathPattern.test(trimmed);
}

export function inferKind(value: unknown): FaviconValueKind {
  if (Array.isArray(value)) {
    if (value.length === 0 || value.some((item) => typeof item !== 'string')) {
      return 'icon';
    }

    if (!value.every((item) => isColorString(item))) {
      return 'icon';
    }

    return value.length === 1 ? 'color' : 'gradient';
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'svg' in value &&
    typeof value.svg === 'string'
  ) {
    return 'svg';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (emojiPattern.test(trimmed)) {
      return 'emoji';
    }

    if (isColorString(trimmed)) {
      return 'color';
    }

    if (isIconString(trimmed)) {
      return 'icon';
    }
  }

  return 'icon';
}
