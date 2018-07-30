const WebpackSvgFontIconPlugin = require('../src');
const loader = require.resolve('../src/loader/Loader');

test('static loader function with options', () => {
    expect(WebpackSvgFontIconPlugin.loader()).toEqual([
        { loader }
    ])
});