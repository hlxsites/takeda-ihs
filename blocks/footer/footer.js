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
    const html = await resp.text();

    // decorate footer DOM
    footer.innerHTML = html;

    // size the footer image
    const image = footer.querySelector('picture img');
    image.setAttribute('width', '100');
    image.removeAttribute('height');

    decorateIcons(footer);
    block.append(footer);
  }
}
