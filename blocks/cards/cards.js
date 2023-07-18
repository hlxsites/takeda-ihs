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

export default async function decorate(block) {

  if (block.classList.contains('icons')) {
    buildIconCards(block);
  }

  /* change to ul, li */
  // const ul = document.createElement('ul');
  // [...block.children].forEach((row) => {
  //   const li = document.createElement('li');
  //   const card = document.createElement('div');
  //   card.classList.add('card');
  //   li.append(card);
  //   card.innerHTML = row.innerHTML;
  //   [...card.children].forEach((div) => {
  //     if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('span.icon'))) div.className = 'card-image';
  //     else div.className = 'card-body';
  //
  //     const button = div.querySelector('p.button-container');
  //     if (button) {
  //       const link = document.createElement('div');
  //       link.classList.add('card-link');
  //       link.append(button);
  //       card.append(link);
  //     }
  //   });
  //   ul.append(li);
  // });
  // block.replaceChildren(ul);
  await decorateIcons(block);
}
