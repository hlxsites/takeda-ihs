import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * Builds the Icons variation of the cards block.
 * @param {HTMLDivElement} block
 */
function buildIconCards(block) {
  [...block.children].forEach((card) => {
    card.classList.add('card');
    [...card.children].forEach((body) => {
      const anchor = body.querySelector('a');

      const content = document.createElement('a');
      content.classList.add('card-content');
      content.href = anchor.href;
      content.title = anchor.title;

      // Pull out the icon
      const icon = body.querySelector('span.icon');
      if (icon) {
        const tmp = icon.parentElement;
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('card-icon');
        iconWrapper.append(icon);
        tmp.remove();
        content.append(iconWrapper);
      } else {
        card.classList.add('no-icon');
      }

      const link = document.createElement('div');
      link.classList.add('card-link');
      link.innerHTML = `<span>${anchor.textContent}</span>`;

      body.classList.add('card-body');

      const tmp = anchor.parentElement;
      tmp.remove();

      content.append(body);
      card.append(content, link);
    });
  });
}

/**
 * Builds the Icons variation of the cards block.
 * @param {HTMLDivElement} block
 */
function buildProductCards(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((card) => {
    const li = document.createElement('li');
    li.classList.add('product', card.children[0].textContent);
    const picture = card.children[1].querySelector('picture');

    const img = picture.querySelector('img');
    const ratio = (parseInt(img.height, 10) / parseInt(img.width, 10)) * 100;
    picture.style.paddingBottom = `${ratio}%`;

    const link = card.children[1].querySelector('a');
    link.innerHTML = `
      <hr>
      <div class="logo">
        ${picture.outerHTML}
      </div>
      <p>Learn More</p>
    `;
    li.append(link);
    ul.append(li);
  });
  block.replaceChildren(ul);
}

export default async function decorate(block) {
  if (block.classList.contains('icons')) {
    buildIconCards(block);
    await decorateIcons(block);
  } if (block.classList.contains('products')) {
    buildProductCards(block);
  } else {
    block.innerHTML = '';
  }
}
