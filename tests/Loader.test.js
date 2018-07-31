const WebpackSvgFontIconPlugin = require('../src');
const loader = require.resolve('../src/loader/Loader');
const path = require('path');
const webpack = require('webpack');
const memoryfs = require('memory-fs');

test('loader', (done) => {
    const compiler = webpack({
        context: __dirname,
        entry: path.resolve(__dirname, 'assets/a.svg'),
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [{
                test: /\.svg$/,
                use: WebpackSvgFontIconPlugin.loader()
            }]
        },
        plugins: [
            new WebpackSvgFontIconPlugin({
                fontFileName: "ficon",
                familyName: "ficon",
                classPrefix: "sf"
            }),
        ]
    });
    compiler.outputFileSystem = new memoryfs();

    compiler.run((err, stats) => {
        
        expect(err || stats.hasErrors()).toBeFalsy();

        const output = stats.toJson().modules[0].source;

        expect(output).toBe('module.exports = "sf_a";');

        done();
    });
});