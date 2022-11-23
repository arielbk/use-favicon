import React from 'react';
import { render } from '@testing-library/react';
import useFavicon from '../src';
import { FaviconOptions } from '../src/types';

const FaviconComponent: React.FC<{ options?: FaviconOptions }> = ({
  options,
}) => {
  useFavicon(options);
  return <div>favicon test</div>;
};

const getFavicon = () => {
  const favicon = document.querySelector("link[rel='icon']");
  if (favicon) return favicon;
  return null;
};

// window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('dom sanity check', () => {
  it('has an empty favicon', () => {
    const favicon = getFavicon();
    expect(favicon).toBeFalsy();
  });
});

describe('random emoji', () => {
  beforeEach(() => render(<FaviconComponent />));

  it('has a favicon', async () => {
    const favicon = getFavicon();
    expect(favicon).toBeTruthy();
  });
  it('has a random emoji favicon', async () => {
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toMatch(
      // emoji regex
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
    );
  });
});

describe('specific emoji', () => {
  it('has the specified emoji favicon: 🙂', async () => {
    render(<FaviconComponent options={{ type: 'emoji', value: '🙂' }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain('🫠');
  });
  it('has the specified emoji favicon: 🫠', async () => {
    render(<FaviconComponent options={{ type: 'emoji', value: '🫠' }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain('🫠');
  });
});

// TODO: check direction of color favicons

describe('sets color favicon', () => {
  it('sets favicon color', () => {
    const color = '#ff0000';
    render(<FaviconComponent options={{ type: 'color', value: color }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(color);
  });
  it('sets multiple favicon colors', () => {
    const colors = ['#ff0000', '#ff00ff'];
    render(<FaviconComponent options={{ type: 'color', value: colors }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(colors[0]);
    expect(href).toContain(colors[1]);
  });
});

describe('sets color gradient', () => {
  it('sets 2-color gradient', () => {
    const colors = ['#ff0000', '#ff00ff'];
    render(<FaviconComponent options={{ type: 'color', value: colors }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(colors[0]);
    expect(href).toContain(colors[1]);
  });
  it('sets 3-color gradient', () => {
    const colors = ['#ff0000', '#ff00ff', '#00ff00'];
    render(<FaviconComponent options={{ type: 'color', value: colors }} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(colors[0]);
    expect(href).toContain(colors[1]);
    expect(href).toContain(colors[2]);
  });
});

// TODO: test if it sets an away variant

describe('dark variant', () => {
  const options = {
    type: 'emoji',
    value: '😎',
    darkVariant: {
      type: 'emoji',
      value: '✨',
    },
  };

  it('set default variant in light mode', () => {
    render(<FaviconComponent options={options} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(options.value);
  });

  it('sets dark variant in dark mode', () => {
    // mocked matchMedia (used to determine dark mode) should now return true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    render(<FaviconComponent options={options} />);
    const favicon = getFavicon();
    const href = favicon?.getAttribute('href');
    expect(href).toContain(options.darkVariant.value);
  });
});
