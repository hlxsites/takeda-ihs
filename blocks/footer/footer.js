import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta).pathname : '/footer';
  const resp = await fetch(
    `${footerPath}.plain.html`,
    window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {},
  );

  if (resp.ok) {
    const footer = document.createElement('div');
    // decorate footer DOM
    footer.innerHTML = await resp.text();

    // size the footer image
    const image = footer.querySelector('picture img');
    image.width = '100';
    image.height = '36';

    decorateIcons(footer);
    block.append(footer);
  }
}
