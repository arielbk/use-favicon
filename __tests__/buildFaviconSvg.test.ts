import { buildFaviconSvg } from '../src';

describe('buildFaviconSvg', () => {
  it('builds an emoji favicon svg', () => {
    expect(buildFaviconSvg('emoji', '🦊')).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text></svg>"`,
    );
  });

  it('builds a solid color favicon svg', () => {
    expect(buildFaviconSvg('color', '#f00')).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="#f00" /></svg>"`,
    );
  });

  it('builds a gradient favicon svg', () => {
    expect(buildFaviconSvg('gradient', ['#f00', '#0f0', '#00f']))
      .toMatchInlineSnapshot(
        `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="favicon-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f00" /><stop offset="50%" stop-color="#0f0" /><stop offset="100%" stop-color="#00f" /></linearGradient></defs><rect width="100" height="100" rx="18" fill="url(#favicon-gradient)" /></svg>"`,
      );
  });

  it('passes through raw svg values', () => {
    expect(buildFaviconSvg('svg', { svg: '<svg viewBox="0 0 10 10"><path d="M0 0h10v10H0z" /></svg>' }))
      .toMatchInlineSnapshot(
        `"<svg viewBox="0 0 10 10"><path d="M0 0h10v10H0z" /></svg>"`,
      );
  });
});
