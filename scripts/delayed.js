// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

const loadAdobeDTM = async () => {
  await loadScript('https://assets.adobedtm.com/8fee56b0a165/0dcea4176083/launch-868c1997ca51-development.min.js');
};

await loadAdobeDTM();


<script src="https://assets.adobedtm.com/8fee56b0a165/0dcea4176083/launch-868c1997ca51-development.min.js" async></script>