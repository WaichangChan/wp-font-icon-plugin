/* eslint-disable import/no-dynamic-require, global-require */
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import WebpackSvgFontIconPlugin from "../src";

const cases = process.env.CASES ? process.env.CASES.split(',') : fs.readdirSync(path.join(__dirname, 'cases'));

function getHash(content) {
  return loaderUtils.getHashDigest(content, 'md5', 'hex', 16);
}

describe('Webpack Integration Tests', () => {
  cases.forEach((testCase) => {
    it(testCase, (done) => {
      let options = { entry: { test: './index.js' } };
      const testDirectory = path.join(__dirname, 'cases', testCase);
      const outputDirectory = path.join(__dirname, 'js', testCase);
      const configFile = path.join(testDirectory, 'webpack.config.js');

      if (fs.existsSync(configFile)) {
        options = require(configFile);
      }
      options.context = testDirectory;
      if (!options.module) options.module = {};
      if (!options.module.loaders) {
        options.module.rules = [{ test: /\.svg$/, use: WebpackSvgFontIconPlugin.loader() }];
      }
      if (!options.output) options.output = { filename: '[name].js' };
      if (!options.output.path) options.output.path = outputDirectory;
      if (process.env.CASES) {
        console.log(`\nwebpack.${testCase}.config.js ${JSON.stringify(options, null, 2)}`);
      }

      webpack(options, (err, stats) => {
        if (err) return done(err);
        if (stats.hasErrors()) return done(new Error(stats.toString()));
        // const testFile = path.join(outputDirectory, 'test.js');
        // if (fs.existsSync(testFile)) {
        //   require(testFile)(suite);
        // }
        const expectedDirectory = path.join(testDirectory, 'expected');

        const cssList = glob.sync(`${expectedDirectory}/**/*.css`);

        cssList.forEach((filePath) => {
          // const filePath = path.join(expectedDirectory, file);
          const actualPath = filePath.replace(expectedDirectory, outputDirectory);

          const outputFile = readFileOrEmpty(actualPath);
          const expectedFile = readFileOrEmpty(filePath);

          const outputHash = getHash(outputFile);
          const expectedHash = getHash(expectedFile);

          // console.log(actualPath);
          // console.log(filePath)
          expect(outputHash).toEqual(expectedHash);

        });

        const fontList = glob.sync(`${expectedDirectory}/**/*.@(woff|ttf)`);

        fontList.forEach((filePath) => {
          // const filePath = path.join(expectedDirectory, file);
          const actualPath = filePath.replace(expectedDirectory, outputDirectory);

          expect(fs.existsSync(actualPath)).toBe(true);

        });

        done();
      });
    });
  });
});

function readFileOrEmpty(path) {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (e) {
    return '';
  }
}
