import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { BREAKPOINTS } from '../../scripts/scripts.js';

const isDesktop = BREAKPOINTS.medium;

const expandTray = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.target.closest('.isi-tray.block').scrollIntoView({ behavior: 'smooth' });
};

const collapseTray = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
};

const callback = (categories) => {
  const sect = categories[0];
  if (sect.isIntersecting) {
    sect.target.classList.add('visible');
  } else {
    sect.target.classList.remove('visible');
  }
};

const io = new IntersectionObserver(callback, { rootMargin: '0px 0px -100px 0px' });

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const keys = Object.keys(config);

  const mobileIdx = keys.indexOf(keys.find((k) => k.match(/mobile/i)));
  const indIdx = keys.indexOf(keys.find((k) => k.match(/^indications/i)));
  const contraIdx = keys.indexOf(keys.find((k) => k.match(/^contraindications/i)));
  const boxedIdx = keys.indexOf(keys.find((k) => k.match(/boxed/i)));
  const safetyIdx = keys.indexOf(keys.find((k) => k.match(/safety/i)));

  const tmp = document.createElement('div');
  tmp.innerHTML = `
    <div class="desktop-expander">
      <p>Please expand for <a href="#indication" title="Indication">Indication</a> and <a href="#important-safety-information" title="Important Safety Information">Important Safety Information</a>.</p>
    </div>
    <div class="isi-content">
      <div class="buttons">
        <button class="collapse"><span>-</span></button>
        <button class="expand"><span>+</span></button>
      </div>
      <div class="indication" id="indication">
        <h5 class="upper">Indication and Limitations of Use</h5>
      </div>
      <div class="safety-info" id="important-safety-information">
        <h5 class="upper">Important Safety Information</h5>
      </div>
      <p><a class="scroll-to-top" href="#" title="Scroll to Top">Scroll to Top</a></p>
    </div>
  `;

  const mobileOverlay = document.createElement('div');
  mobileOverlay.classList.add('mobile-overlay');
  mobileOverlay.innerHTML = '<button class="expand"><span>+</span></button>';

  const mobileContent = block.children[mobileIdx].children[1];
  mobileContent.classList.add('mobile-content');
  if (!mobileContent.children.length) {
    const p = document.createElement('p');
    p.append(...mobileContent.childNodes);
    mobileContent.append(p);
  }
  mobileOverlay.prepend(mobileContent);
  tmp.prepend(mobileOverlay);

  const indications = block.children[indIdx].children[1];
  if (!indications.children.length) {
    const p = document.createElement('p');
    p.append(...indications.childNodes);
    indications.replaceChildren(p);
  }
  tmp.querySelector('#indication').append(...indications.children);

  let desktopOverlay;

  if (boxedIdx) {
    const boxedWarning = block.children[boxedIdx].children[1];
    boxedWarning.classList.add('boxed-warning');
    if (!boxedWarning.children.length) {
      const p = document.createElement('p');
      p.append(...boxedWarning.children);
      boxedWarning.append(p);
    }
    tmp.querySelector('#important-safety-information').append(boxedWarning);
    desktopOverlay = boxedWarning.cloneNode(true);
  }

  const contra = block.children[contraIdx].children[1];
  if (!contra.children.length || !contra.querySelector('p')) {
    const p = document.createElement('p');
    p.append(...contra.childNodes);
    contra.replaceChildren(p);
  }
  tmp.querySelector('#important-safety-information').append(...contra.children);
  if (!desktopOverlay) {
    desktopOverlay = contra.cloneNode(true);
  }

  tmp.querySelector('.desktop-expander').append(...desktopOverlay.children);

  const safety = block.children[safetyIdx].children[1];
  safety.classList.add('safety-details');
  if (!safety.children.length) {
    const p = document.createElement('p');
    p.append(...safety.childNodes);
    safetyIdx.append(p);
  }
  tmp.querySelector('#important-safety-information').append(safety);

  block.innerHTML = tmp.innerHTML;
  io.observe(block);

  block.querySelectorAll('button.expand').forEach((button) => {
    button.addEventListener('click', expandTray);
  });

  block.querySelectorAll('button.collapse, a.scroll-to-top').forEach((button) => {
    button.addEventListener('click', collapseTray);
  });
}
