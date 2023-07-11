export default async function decorate(block) {
  const triangle = block.querySelector('div > div > p > picture > img');
  triangle.setAttribute('loading', 'lazy');
}
