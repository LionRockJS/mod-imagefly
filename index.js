import url from "node:url";
const dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');
export default {dirname}

import ControllerImageFly from './classes/controller/ImageFly.mjs';

export {
  ControllerImageFly
}