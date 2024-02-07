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
    .querySelectorAll('.nav-sections > ul > li.nav-drop')
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

  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    const active = section.querySelector('a');
    if (active) {
      const url = new URL(active.href);
      if (window.location.pathname === url.pathname) {
        section.classList.add('active');
      }
    }

    const submenu = section.querySelector('ul');
    if (submenu) {
      const anchor = section.querySelector('a');
      anchor.append(expander.cloneNode());
      section.classList.add('nav-drop');

      const submenuLinks = submenu.querySelectorAll('li > a');
      const isCurrentPath = Array.from(submenuLinks).some((link) => {
        const isMatch = window.location.pathname === new URL(link.href).pathname
        && link.hash === window.location.hash;
        if (isMatch) {
          link.parentElement.classList.add('active');
          link.href = link.hash;
        }
        return isMatch;
      });
      section.setAttribute('aria-expanded', isCurrentPath ? 'true' : 'false');

      submenuLinks.forEach((link) => {
        if (window.location.pathname === new URL(link.href).pathname) {
          link.href = link.hash;
        }
        link.addEventListener('click', (e) => {
          // remove active class from all links
          submenuLinks.forEach((l) => l.parentElement.classList.remove('active'));
          if (link.hash && window.location.pathname === new URL(link.href).pathname) {
            link.parentElement.classList.add('active');
            e.stopPropagation();
          }
        });
      });

      anchor.setAttribute('tabindex', '0');
      anchor.setAttribute('role', 'button');
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = section.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(sections);
        if (!isDesktop.matches) {
          section.setAttribute('aria-expanded', !expanded);
        } else {
          section.setAttribute('aria-expanded', true);
        }
        const all = section.querySelector('.show-all');
        if (all) {
          all.classList.remove('hide');
        }
        if (e.pointerType !== 'mouse') {
          section.setAttribute('data-touch-click', 'true');
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
