
import { getMetadata} from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const container = block.querySelector(':scope > div');
  container.children[0].classList.add('content');
  container.children[1].classList.add('image');
  /*** localhost images are broken so adding myself for testing to be removed when there is a fix***/
  //container.children[1].innerHTML = '<img src="https://floating-image-issue-10--takeda-ihs--hlxsites.hlx.page/drafts/media_10701ea634856c238f084328f0cfb6c43894a1511.png?width=2000&format=webply&optimize=medium">';
}
