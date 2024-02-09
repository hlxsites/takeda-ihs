function createInlineScript(innerHTML, parent) {
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = innerHTML;
  parent.appendChild(script);
}

// eslint-disable-next-line import/prefer-default-export
export function integrateMartech() {
  if (window.location.href.match(/^https?:\/\/(localhost|127.0.0.1)/) === null) {
    createInlineScript(document.body);
  }
}
