import useFavicon, { withFavicon } from '../src';

describe('package surface', () => {
  it('exports the library entry points', () => {
    expect(typeof useFavicon).toBe('function');
    expect(typeof withFavicon).toBe('function');
  });
});
