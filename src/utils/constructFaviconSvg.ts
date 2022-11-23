import { FaviconType } from '../types';

function constructFaviconSvg(
  type: 'icon' | 'emoji',
  value: string,
  isNotification: boolean,
): string;
function constructFaviconSvg(
  type: 'colors' | 'gradient',
  value: string | string[],
  isNotification: boolean,
): string;
function constructFaviconSvg(
  type: FaviconType,
  value: string | string[],
  isNotification: boolean,
): string;
function constructFaviconSvg(
  type: FaviconType,
  value: string | string[],
  isNotification: boolean,
): string {
  // initialise svg string
  let svgBody = '';

  // for emoji
  if (type === 'emoji') {
    svgBody = `<style> circle { fill: red; } </style>
    <text y=".9em" font-size="90">${value}</text>
    ${isNotification ? '<circle cx="80" cy="20" r="20" />' : ''}`;
  }

  // for colors
  if (type === 'colors') {
    const colorArray = typeof value === 'object' ? value : [value];
    const offset = Math.floor(100 / colorArray.length);
    svgBody = colorArray
      .map(
        (color, i) =>
          `<rect x="${
            offset * i
          }" y="0" height="100" width="${offset}" fill="${color.replace(
            /\#/g,
            '%23',
          )}" />`,
      )
      .join();
  }
  // for gradients
  if (type === 'gradient') {
    const offset = Math.floor(100 / (value.length - 1));
    svgBody = `<defs>
    <linearGradient id="gradient">
      ${(value as string[])
        .map(
          (color, i) =>
            `<stop offset="${offset * i}%" stop-color="${color}" />`,
        )
        .join()}
    </linearGradient>
    </defs>
    <rect x="0" y="0" width="100" height="100" fill="url(#gradient)" />
    `
      .replace(/\%/g, '%25')
      .replace(/\#/g, '%23');
  }

  return svgBody;
}

export default constructFaviconSvg;
