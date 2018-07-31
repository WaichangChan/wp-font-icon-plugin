import WebpackSvgFontIconPlugin from '../../../src';

module.exports = {
  entry: './index',
  plugins: [
    new WebpackSvgFontIconPlugin({
      fontFileName: "WSvgFont",
      familyName: "WSvgFont"
    }),
  ],
};
