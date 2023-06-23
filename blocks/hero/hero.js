
export default async function decorate(block) {
  const picture = block.querySelector('picture');
  picture.querySelector('img').setAttribute('loading', 'eager');
  const p = picture.parentElement;

  const image = document.createElement('div');
  image.classList.add('image');
  image.append(picture);
  p.remove(); // remove floating/empty p

  const wrapper = block.querySelector(':scope > div');
  wrapper.classList.add('content-wrapper');
  wrapper.querySelector(':scope > div').classList.add('content');

  block.replaceChildren(image, wrapper);
}
