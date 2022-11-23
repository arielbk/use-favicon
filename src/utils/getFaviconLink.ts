function createFaviconLink() {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  const head = document.querySelector('head');
  head!.appendChild(link);
}

export default function getFaviconLink(): HTMLLinkElement {
  const favicon: HTMLLinkElement | null =
    document.querySelector("link[rel='icon']");
  if (favicon) return favicon;
  createFaviconLink();
  const constructedFavicon = document.querySelector(
    "link[rel='icon']",
  ) as HTMLLinkElement;
  return constructedFavicon;
}
