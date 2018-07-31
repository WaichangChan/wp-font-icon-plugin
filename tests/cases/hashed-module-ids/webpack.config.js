import webpack from 'webpack';
import WebpackSvgFontIconPlugin from '../../../src';

module.exports = {
  entry: './index.js',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new WebpackSvgFontIconPlugin({
      cssFileName: "font_icon.css",
      fontFileName: "a",
      familyName: "WSvgFont",
      classPrefix: "sf"
    }),
  ]
};
