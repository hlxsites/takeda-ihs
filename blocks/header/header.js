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
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
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
  toggleAllNavSections(navSections, 'false');
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
 * Toggles the `aria-expanded` attribute of the target element.
 *
 * @param {Event} e
 */
function toggleExpanded(e) {
  const expanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
  e.currentTarget.setAttribute('aria-expanded', !expanded);
}

/**
 * Builds the logo Div.
 * @returns {HTMLDivElement}
 */
function buildLogo() {
  const logo = document.createElement('div');
  logo.classList.add('nav-logo');
  logo.innerHTML = `
    <a href="/" rel="noopener">
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
  brand.innerHTML = "<div>Takeda's Integrated Health Systems Team</div>";
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
      const anchor = section.querySelector('a');
      anchor.append(expander.cloneNode());
      section.classList.add('nav-drop');
      section.setAttribute('aria-expanded', 'false');
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'button');
      anchor.addEventListener('click', (e) => {
        const expanded = section.getAttribute('aria-expanded') === 'true';
        if (e.currentTarget !== e.target || !isDesktop.matches) {
          e.preventDefault();
          e.stopPropagation();
          toggleAllNavSections(sections);
          section.setAttribute('aria-expanded', !expanded);
        }
      });
      // enable nav dropdown keyboard accessibility
      anchor.addEventListener('keydown', openOnKeydown);
      section.addEventListener('mouseenter', toggleExpanded);
      section.addEventListener('mouseleave', toggleExpanded);
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
        <nav id="nav" aria-expanded="true">
        </nav>
      </div>
    `;

    const nav = block.querySelector('nav');
    nav.append(html.querySelector('.nav-utility'));

    const sections = buildSections(html.querySelector('.nav-sections'));
    nav.append(sections);
    nav.append(buildLogo());
    nav.append(buildBrand());

    const hamburger = buildHamburger();
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(nav, sections);
    });
    nav.append(hamburger);
    isDesktop.addEventListener('change', () => toggleMenu(nav, sections, isDesktop.matches));
    await decorateIcons(block);
  }
}
