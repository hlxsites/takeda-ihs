// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

function addCookieOneTrust() {
  const cookieScript = document.createElement('script');
  cookieScript.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
  cookieScript.type = 'text/javascript';
  cookieScript.setAttribute('data-domain-script', 'ae0babd7-7067-4af4-bfa9-84ae35b5957f');
  document.head.appendChild(cookieScript);
}

addCookieOneTrust();

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
