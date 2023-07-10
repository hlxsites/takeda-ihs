import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.classList.add(`columns-${block.children.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    row.classList.add('column');
    const decoration = row.children[0].textContent;
    const content = row.children[1];
    content.classList.add('content');
    if (decoration) {
      content.classList.add(decoration.replaceAll(/[^a-zA-Z-]/g, '-'));
    }
    row.replaceChildren(content);
  });

  await decorateIcons(block);
}
