import { decorateButtons, readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * Builds the image wrapper div from the block definition
 *
 * @param {HTMLDivElement} block the block
 * @return {HTMLDivElement} the image wrapper
 */
function buildImageWrapper(block) {
  const picture = block.querySelector('picture');
  picture.querySelector('img').setAttribute('loading', 'eager');
  const p = picture.parentElement;
  const image = document.createElement('div');
  image.classList.add('image');
  image.append(picture);

  if (p.nodeName.toLowerCase() === 'p' && !p.textContent.trim()) {
    p.remove(); // remove floating/empty p
  }
  return image;
}

function buildProductContent(block) {
  const config = readBlockConfig(block);
  const keys = Object.keys(config);
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  ['logo', 'title', 'references', 'link'].forEach((part) => {
    const idx = keys.indexOf(part);
    if (idx >= 0) {
      const content = block.children[idx].children[1];
      let p = content.querySelector(':scope > p');
      if (!p) {
        p = document.createElement('p');
      }
      p.innerHTML = block.children[idx].children[1].innerHTML;
      content.classList.add(part);
      content.replaceChildren(p);
      contentDiv.append(content);
      const a = content.querySelector('a');
      if (a) {
        a.setAttribute('target', '_blank');
      }
    }
  });
  decorateButtons(contentDiv);
  return contentDiv;
}

function buildCardContent(block) {
  const config = readBlockConfig(block);
  const keys = Object.keys(config);
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  if (config.title) {
    const idx = keys.indexOf('title');
    const content = block.children[idx].children[1];
    content.classList.add('title');
    contentDiv.append(content);
  }

  if (config.resources) {
    const idx = keys.indexOf('resources');
    const content = block.children[idx].children[1];
    [...content.querySelectorAll('a')].forEach((a) => {
      a.classList.add('resource');
      const wrapper = document.createElement('div');
      wrapper.classList.add('resource-wrapper');
      const text = a.textContent;
      const name = document.createElement('p');
      name.classList.add('name');
      name.textContent = text;
      const download = document.createElement('p');
      download.classList.add('download');
      download.textContent = 'Download';
      wrapper.append(name, download);
      a.replaceChildren(wrapper);
    });

    content.classList.add('resources');
    contentDiv.append(content);
  }
  return contentDiv;
}
/**
 * Builds the content from the block definition & type.
 *
 * @param {HTMLDivElement} block the block
 * @param {String} type the type of block
 * @return {HTMLDivElement} the content wrapper
 */
function buildContent(block, type) {
  const wrapper = block.querySelector(':scope > div');
  wrapper.classList.add('content-wrapper');
  switch (type) {
    case 'product': {
      wrapper.replaceChildren(buildProductContent(block));
      break;
    }
    case 'card': {
      wrapper.replaceChildren(buildCardContent(block));
      break;
    }
    default: {
      wrapper.querySelector(':scope > div').classList.add('content');
      break;
    }
  }
  return wrapper;
}

export default async function decorate(block) {
  let type = 'default';
  if (block.classList.contains('product')) {
    type = 'product';
  } else if (block.classList.contains('card')) {
    type = 'card';
  }
  block.classList.add(type);
  const image = buildImageWrapper(block);
  const wrapper = buildContent(block, type);

  block.replaceChildren(image, wrapper);
}
