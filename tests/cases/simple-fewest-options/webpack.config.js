import WebpackSvgFontIconPlugin from '../../../index';

module.exports = {
  entry: './index',
  plugins: [
    new WebpackSvgFontIconPlugin({
      fontFileName: "WSvgFont",
      familyName: "WSvgFont"
    }),
  ],
};
