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

  it('adds a default badge dot when badge is true', () => {
    expect(buildFaviconSvg('emoji', '🦊', { badge: true })).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text><circle cx="76" cy="24" r="18" fill="#ef4444" stroke="#ffffff" stroke-width="6" /></svg>"`,
    );
  });

  it('renders numeric and string badge content', () => {
    expect(buildFaviconSvg('emoji', '🦊', { badge: 3 })).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text><rect x="58" y="6" width="36" height="36" rx="18" fill="#ef4444" stroke="#ffffff" stroke-width="4" /><text x="76" y="25" font-size="24" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#ffffff">3</text></svg>"`,
    );

    expect(buildFaviconSvg('emoji', '🦊', { badge: '!' })).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text><rect x="58" y="6" width="36" height="36" rx="18" fill="#ef4444" stroke="#ffffff" stroke-width="4" /><text x="76" y="25" font-size="24" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#ffffff">!</text></svg>"`,
    );
  });

  it('renders customized badge content and position', () => {
    expect(
      buildFaviconSvg('emoji', '🦊', {
        badge: { content: 5, color: '#00f', position: 'top left' },
      }),
    ).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text><rect x="6" y="6" width="36" height="36" rx="18" fill="#00f" stroke="#ffffff" stroke-width="4" /><text x="24" y="25" font-size="24" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#ffffff">5</text></svg>"`,
    );
  });

  it('omits the badge for falsey badge values', () => {
    expect(buildFaviconSvg('emoji', '🦊', { badge: false })).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text></svg>"`,
    );

    expect(buildFaviconSvg('emoji', '🦊', { badge: 0 })).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" font-size="82" text-anchor="middle" dominant-baseline="central">🦊</text></svg>"`,
    );
  });
});
