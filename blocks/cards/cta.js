import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * Builds the CTA variation of the cards block.
 * @param {HTMLDivElement} block
 */
export default async function decorate(block) {
  const cards = [...block.children];
  const ButtonContainer = block.querySelector('p.button-container');
  ButtonContainer.classList.remove('button-container');
  const anchor = block.querySelector('a');

  anchor.classList.remove('button', 'primary');
  anchor.classList.add('top-link');
  console.log(anchor);
  const ul = document.createElement('ul');
  ul.classList.add(`cards-${cards.length}`);
  cards.forEach((card) => {
    const li = document.createElement('li');
    li.classList.add('cta', card.children[0].textContent);
    li.append(card.children[1]);

    const picture = li.querySelector('picture');
    picture.closest('p').classList.add('image');

    const img = picture.querySelector('img');
    const ratio = (parseInt(img.height, 10) / parseInt(img.width, 10)) * 100;
    picture.style.paddingBottom = `${ratio}%`;
    ul.append(li);
  });
  block.replaceChildren(ul);
  await decorateIcons(block);
}
