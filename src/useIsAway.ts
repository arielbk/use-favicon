import { useSyncExternalStore } from 'react';

export function getAwayServerSnapshot(): false {
  return false;
}

function subscribe(onStoreChange: () => void): () => void {
  document.addEventListener('visibilitychange', onStoreChange);

  return () => {
    document.removeEventListener('visibilitychange', onStoreChange);
  };
}

function getSnapshot(): boolean {
  return document.visibilityState === 'hidden';
}

export function useIsAway(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getAwayServerSnapshot);
}
