import { inferKind } from '../src';

describe('inferKind', () => {
  it.each([
    ['🦊', 'emoji'],
    ['👨‍👩‍👧‍👦', 'emoji'],
    ['#f00', 'color'],
    ['rebeccapurple', 'color'],
    [['#f00', '#0f0'], 'gradient'],
    [['#f00'], 'color'],
    ['/icon.png', 'icon'],
    ['https://example.com/icon.svg', 'icon'],
    ['cdn.example.com/icon.webp', 'icon'],
    ['favicon.ico', 'icon'],
    ['favicon.jpg', 'icon'],
    [{ svg: '<text/>' }, 'svg'],
    ['', 'icon'],
    ['not-a-color', 'icon'],
    [['#f00', 'not-a-color'], 'icon'],
  ] as const)('infers %j as %s', (value, expectedKind) => {
    expect(inferKind(value)).toBe(expectedKind);
  });
});
