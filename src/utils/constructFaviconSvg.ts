import { FaviconNotificationOptions, FaviconType } from '../types';

function constructFaviconSvg(
  type: 'icon' | 'emoji',
  value: string,
  isNotification: boolean,
  notificationOptions?: FaviconNotificationOptions,
): string;
function constructFaviconSvg(
  type: 'colors' | 'gradient',
  value: string | string[],
  isNotification: boolean,
  notificationOptions?: FaviconNotificationOptions,
): string;
function constructFaviconSvg(
  type: FaviconType,
  value: string | string[],
  isNotification: boolean,
  notificationOptions?: FaviconNotificationOptions,
): string;
function constructFaviconSvg(
  type: FaviconType,
  value: string | string[],
  isNotification: boolean,
  notificationOptions: FaviconNotificationOptions = {
    position: 'bottom right',
    color: '#ff0000',
  },
): string {
  // initialise svg string with notification color
  let svgBody = '';

  // for emoji
  if (type === 'emoji') {
    svgBody += `<text y=".9em" font-size="90">${value}</text>`;
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

  // add notification
  if (isNotification) {
    const [yKey, xKey] = notificationOptions.position.split(' ');
    const positionY = yKey === 'top' ? 20 : yKey === 'bottom' ? 80 : 40;
    const positionX = xKey === 'left' ? 20 : xKey === 'right' ? 80 : 40;
    svgBody += `<circle cx="${positionX}" cy="${positionY}" r="20" style="fill: ${notificationOptions.color.replace(
      /\#/g,
      '%23',
    )}"/>`;
  }

  return svgBody;
}

export default constructFaviconSvg;
