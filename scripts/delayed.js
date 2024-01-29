// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

const loadAdobeDTM = async () => {
  await loadScript('https://assets.adobedtm.com/8fee56b0a165/a42c27096959/launch-c6342f10fc46-development.min.js');
};

await loadAdobeDTM();
