// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

const loadAdobeDTM = async () => {
  await loadScript('https://assets.adobedtm.com/8fee56b0a165/0dcea4176083/launch-5b9d43d0b93e-development.min.js');
};

await loadAdobeDTM();
