import { getMetadata, decorateIcons, decorateSections } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const navDrop = e.currentTarget.closest('.nav-drop');
  if (navDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = navDrop.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(navDrop.closest('.nav-sections'));
    navDrop.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li.nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    section.removeAttribute('data-touch-click');
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const button = nav.querySelector('.nav-hamburger button');
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections);
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Builds the logo Div.
 * @returns {HTMLDivElement}
 */
function buildLogo() {
  const logo = document.createElement('div');
  logo.classList.add('nav-logo');
  logo.innerHTML = `
    <a href="/" rel="noopener" tabindex="0">
      <img alt="Takeda Logo" class="logo" src="/styles/images/logo.png" loading="lazy" height="274" width="815" />
    </a>
  `;
  return logo;
}

/**
 * Builds the hamburger menu Div.
 * @returns {HTMLDivElement}
 */
function buildBrand() {
  const brand = document.createElement('div');
  brand.classList.add('nav-brand');
  brand.innerHTML = '<a href="/" rel="noopener">Takeda\'s Integrated Health Systems Team</a>';
  return brand;
}

/**
 * Builds the hamburger menu Div.
 * @returns {HTMLDivElement}
 */
function buildHamburger() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');

  hamburger.innerHTML = `
      <button class="nav-hamburger-icon" aria-controls="nav" aria-label="Open navigation" tabindex="0">
        <span class="icon icon-hamburger"></span>
        <span class="icon icon-close"></span>
      </button>
    `;
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

  sections.querySelectorAll('ul > li').forEach((section) => {
    const submenu = section.querySelector('ul');
    if (submenu) {
      const icon = submenu.querySelector('span.icon-right-arrow');
      if (icon) {
        const li = icon.closest('li');
        li.classList.add('hide', 'show-all');
      }

      const anchor = section.querySelector('a');
      anchor.append(expander.cloneNode());
      section.classList.add('nav-drop');
      section.setAttribute('aria-expanded', 'false');

      anchor.setAttribute('tabindex', '0');
      anchor.setAttribute('role', 'button');
      anchor.addEventListener('click', (e) => {
        const expanded = section.getAttribute('aria-expanded') === 'true';
        if (e.pointerType !== 'mouse' || !isDesktop.matches) {
          e.preventDefault();
          e.stopPropagation();
          toggleAllNavSections(sections);
          section.setAttribute('aria-expanded', !expanded);
          const all = section.querySelector('.show-all');
          if (all) {
            all.classList.remove('hide');
          }
          if (e.pointerType !== 'mouse') {
            section.setAttribute('data-touch-click', 'true');
          }
        }
      });
      section.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') {
          toggleAllNavSections(sections);
          section.setAttribute('aria-expanded', 'true');
          const all = section.querySelector('.show-all');
          if (all) {
            all.classList.add('hide');
          }
        }
      });
      section.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') {
          toggleAllNavSections(sections);
          section.setAttribute('aria-expanded', 'false');
          const all = section.querySelector('.show-all');
          if (all) {
            all.classList.remove('hide');
          }
        }
      });
      // enable nav dropdown keyboard accessibility
      anchor.addEventListener('keydown', openOnKeydown);
    }
    if (section.querySelector('hr')) {
      section.classList.add('separator');
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
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
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

    block.innerHTML = `
      <div class="nav-wrapper">
        <nav id="nav" aria-expanded="${isDesktop.matches}">
        </nav>
      </div>
    `;

    const nav = block.querySelector('nav');
    const sections = buildSections(html.querySelector('.nav-sections'));
    const hamburger = buildHamburger();
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(nav, sections);
    });

    // Order maintains tabindex keyboard nav
    nav.append(buildLogo());
    nav.append(buildBrand());
    nav.append(hamburger);
    nav.append(sections);
    nav.append(html.querySelector('.nav-utility'));

    isDesktop.addEventListener('change', () => toggleMenu(nav, sections, isDesktop.matches));
    document.body.addEventListener('click', () => {
      toggleAllNavSections(sections);
    });
    await decorateIcons(block);
  }
}
