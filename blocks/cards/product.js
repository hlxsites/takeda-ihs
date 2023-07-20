import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * Builds the Icons variation of the cards block.
 * @param {HTMLDivElement} block
 */
export default async function decorate(block) {
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
  await decorateIcons(block);
}
