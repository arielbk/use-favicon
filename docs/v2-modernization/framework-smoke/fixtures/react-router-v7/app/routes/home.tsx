import { useState } from 'react';
import { useFavicon } from 'use-favicon';

export default function HomeRoute() {
  const [emoji, setEmoji] = useState<'🦊' | '🐻'>('🦊');

  useFavicon(emoji, { badge: 3 });

  return (
    <main>
      <button type="button" onClick={() => setEmoji((current) => (current === '🦊' ? '🐻' : '🦊'))}>
        Toggle favicon
      </button>
    </main>
  );
}
