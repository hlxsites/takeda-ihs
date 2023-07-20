import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list

// This logic turns a fake block into the individual paragraphs.s
function buildRefParagraphs(main) {
  main.querySelectorAll('div.reference').forEach((block) => {
    const paragraphs = [];
    block.querySelectorAll(':scope > div > div').forEach((ref) => {
      if (ref.querySelector('p')) {
        ref.querySelectorAll('p').forEach((p) => {
          p.classList.add('reference');
          paragraphs.push(p);
        });
      } else {
        const p = document.createElement('p');
        p.classList.add('reference');
        p.innerHTML = ref.innerHTML;
        paragraphs.push(p);
      }
    });
    block.replaceWith(...paragraphs);
  });
}

// This logic finds the sups and turns the containing paragraphs into references.
function updateRefParagraphs(main) {
  main.querySelectorAll('sup').forEach((sup) => {
    if (!sup.previousSibling) {
      sup.parentElement.classList.add('reference');
      sup.remove();
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
// eslint-disable-next-line no-unused-vars
function buildAutoBlocks(main) {
  try {
    buildRefParagraphs(main);
    updateRefParagraphs(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function buildLayoutContainers(main) {
  main.querySelectorAll('.section[data-layout]').forEach((section) => {
    const container = document.createElement('div');
    container.classList.add('layout-content-wrapper');
    const title = section.querySelector('.section-title-wrapper');
    container.append(...section.children);
    if (title) section.prepend(title);
    section.append(container);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildLayoutContainers(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
