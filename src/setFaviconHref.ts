function getOrCreateFaviconLink(): HTMLLinkElement {
  const existingLink = document.querySelector("link[rel='icon']");

  if (existingLink instanceof HTMLLinkElement) {
    return existingLink;
  }

  const link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
  return link;
}

export function setFaviconHref(href: string): void {
  const faviconLink = getOrCreateFaviconLink();
  faviconLink.setAttribute('href', href);
}
