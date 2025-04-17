const {
  author,
  dependencies,
  version,
} = require("../package.json");

module.exports = {
  name: "7Placer",
  description: "typescript pixelplace.io bot",
  version: version,
  author: author,
  include: '/^https:\\/\\/pixelplace.io\\/\\d+-/',
  require: [
    `https://update.greasyfork.org/scripts/498080/1395134/Hacktimer.js`,
    `https://pixelplace.io/js/jquery.min.js?v2=1`,
    `https://pixelplace.io/js/jquery-ui.min.js?v2=1`,
    `https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.js`,
    `https://cdn.jsdelivr.net/npm/rgbquant@1.1.2/src/rgbquant.min.js`,
  ],
  grant: "none",
  "run-at": "document-start",
};
