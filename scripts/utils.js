export function createElemWithClass(type, ...classNames) {
  const elem = document.createElement(type);
  elem.classList.add(...classNames);
  return elem;
}
