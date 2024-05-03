const {
  author,
  dependencies,
  version,
} = require("../package.json");

module.exports = {
  name: "777placer",
  version: version,
  author: author,
  match: "https://pixelplace.io/*",
  require: [
    `https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimer.js`,
    `https://pixelplace.io/js/jquery.min.js?v2=1`,
    `https://pixelplace.io/js/jquery-ui.min.js?v2=1`,
  ],
  grant: "none",
  "run-at": "document-start",
};
