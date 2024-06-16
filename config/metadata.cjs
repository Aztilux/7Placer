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
  match: "https://pixelplace.io/*",
  require: [
    `https://update.greasyfork.org/scripts/498080/1395134/Hacktimer.js`,
    `https://pixelplace.io/js/jquery.min.js?v2=1`,
    `https://pixelplace.io/js/jquery-ui.min.js?v2=1`,
  ],
  grant: "none",
  "run-at": "document-start",
};
