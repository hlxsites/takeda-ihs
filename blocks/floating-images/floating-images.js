import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  console.log('float decorators');
  const container = block.querySelector(':scope > div');
  container.children[0].classList.add('content');
  container.children[1].classList.add('image');
  console.log('in floating images ');
}
