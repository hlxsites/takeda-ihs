// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

const loadAdobeDTM = async () => {
  await loadScript('https://assets.adobedtm.com/8fee56b0a165/4f6b3b702502/launch-9b9e958a7168-development.min.js');
};

await loadAdobeDTM();
