import { useSyncExternalStore } from 'react';

const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function getDarkServerSnapshot(): false {
  return false;
}

function subscribe(onStoreChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(DARK_MODE_MEDIA_QUERY);

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange);
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getDarkServerSnapshot);
}
