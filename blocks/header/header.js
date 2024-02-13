import {
  getMetadata,
  decorateIcons,
  decorateSections,
} from '../../scripts/lib-franklin.js';
import { createElemWithClass } from '../../scripts/utils.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function setAttributes(element, attributes) {
  // eslint-disable-next-line
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections > ul > li.top-nav')
    .forEach((section) => {
      setAttributes(section, {
        'aria-expanded': expanded,
        'data-touch-click': null,
      });
    });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const button = nav.querySelector('.nav-hamburger button');
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';

  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  setAttributes(nav, { 'aria-expanded': expanded ? 'false' : 'true' });
  toggleAllNavSections(navSections);
  setAttributes(button, {
    'aria-label': expanded ? 'Open navigation' : 'Close navigation',
  });
}

function buildLogo() {
  const logo = createElemWithClass('div', 'nav-logo');
  const link = document.createElement('a');
  setAttributes(link, { href: '/', rel: 'noopener', tabindex: '0' });
  const img = document.createElement('img');
  setAttributes(img, {
    alt: 'Takeda Logo',
    class: 'logo',
    src: '/styles/images/logo.png',
    loading: 'lazy',
    height: '274',
    width: '815',
  });
  link.appendChild(img);
  logo.appendChild(link);
  return logo;
}

function buildHamburger() {
  const hamburger = createElemWithClass('div', 'nav-hamburger');
  const button = document.createElement('button');
  setAttributes(button, {
    class: 'nav-hamburger-icon',
    'aria-controls': 'nav',
    'aria-label': 'Open navigation',
    tabindex: '0',
  });
  const iconHamburger = createElemWithClass('span', 'icon', 'icon-hamburger');
  const iconClose = createElemWithClass('span', 'icon', 'icon-close');
  button.append(iconHamburger, iconClose);
  hamburger.appendChild(button);
  return hamburger;
}

/**
 * Builds the Sections menu Div
 *
 * @param {HTMLDivElement} sections the sections nav elementsVie
 * @returns {HTMLDivElement}
 */
function buildSections(sections) {
  const expander = document.createElement('span');
  expander.classList.add('icon', 'icon-chevron-down');

  sections.querySelectorAll(':scope > ul > li').forEach((topmenu) => {
    topmenu.classList.add('top-nav');
    const active = topmenu.querySelector('a');
    if (active) {
      const url = new URL(active.href);
      if (window.location.pathname === url.pathname) {
        topmenu.classList.add('active');
      }
    }

    const submenu = topmenu.querySelector('ul');
    if (submenu) {
      const topanchor = topmenu.querySelector('a');
      topanchor.append(expander.cloneNode());

      const submenuLinks = submenu.querySelectorAll('li > a');
      const isCurrentPath = Array.from(submenuLinks).some((subanchor) => {
        const isMatch = window.location.pathname === new URL(subanchor.href).pathname
        && subanchor.hash === window.location.hash;
        if (isMatch) {
          subanchor.parentElement.classList.add('active');
          subanchor.href = subanchor.hash;
        }
        return isMatch;
      });
      topmenu.setAttribute('aria-expanded', isCurrentPath ? 'true' : 'false');

      submenuLinks.forEach((subanchor) => {
        subanchor.parentElement.classList.add('sub-nav');
        if (window.location.pathname === new URL(subanchor.href).pathname) {
          subanchor.href = subanchor.hash;
        }
        subanchor.addEventListener('click', (e) => {
          // remove active class from all links
          submenuLinks.forEach((l) => l.parentElement.classList.remove('active'));
          if (subanchor.hash && window.location.pathname === new URL(subanchor.href).pathname) {
            subanchor.parentElement.classList.add('active');
            e.stopPropagation();
            toggleMenu(document.getElementById('nav'), sections, false);
          }
        });
      });

      topanchor.setAttribute('tabindex', '0');
      topanchor.setAttribute('role', 'button');
      topanchor.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          e.stopPropagation();
          const expanded = topmenu.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(sections);
          topmenu.setAttribute('aria-expanded', !expanded);
          const all = topmenu.querySelector('.show-all');
          if (all) {
            all.classList.remove('hide');
          }
          if (e.pointerType !== 'mouse') {
            topmenu.setAttribute('data-touch-click', 'true');
          }
        }
      });
    }
  });
  return sections;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/drafts/phase-two-redo/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    decorateSections(html);
    html.querySelectorAll('.section[data-section]').forEach((section) => {
      const clazz = section.getAttribute('data-section');
      const wrapper = section.children[0];
      wrapper.classList.replace('default-content-wrapper', `nav-${clazz}`);
    });

    const navWrapper = createElemWithClass('div', 'nav-wrapper');
    const navElement = createElemWithClass('nav', 'nav');
    navElement.id = 'nav';
    navElement.setAttribute('aria-expanded', isDesktop.matches);

    navWrapper.appendChild(navElement);
    block.appendChild(navWrapper);

    const nav = block.querySelector('nav');
    const sections = buildSections(html.querySelector('.nav-sections'));
    const hamburger = buildHamburger();
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(nav, sections);
    });

    const contactus = html.querySelector('.nav-contact-us');

    const utility = html.querySelector('.nav-utility');

    // Order maintains tabindex keyboard nav
    nav.append(buildLogo());
    nav.append(hamburger);
    nav.append(sections);
    nav.append(contactus);

    await decorateIcons(block);

    // Add a link to the Author guide, if anywhere in the Author Guide
    if (window.location.pathname.startsWith('/author-guide')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="/author-guide/">Author Guide</a>';
      utility.querySelector('ul').prepend(li);
    }
  }
}
