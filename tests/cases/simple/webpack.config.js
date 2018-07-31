import WebpackSvgFontIconPlugin from '../../../index';

module.exports = {
  entry: './index',
  plugins: [
    new WebpackSvgFontIconPlugin({
      cssFileName: "font_icon.css",
      fontFileName: "font/WSvgFont",
      familyName: "WSvgFont",
      classPrefix: "sf",
      startCode: 0xe001
    }),
  ]
};
