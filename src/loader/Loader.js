const path = require("path");
module.exports = function Loader(source) {
  // console.log('==>',this.resourcePath);
  // console.log(this.query);
  let srcName = path.basename(this.resourcePath, ".svg");
  let prefix = this["svgLoader"].call(null, srcName, this.resourcePath);
  let className = prefix ? `${prefix}_${srcName}` : srcName;
  return `module.exports = ${JSON.stringify(className)};`;
};

module.exports.raw = true;
