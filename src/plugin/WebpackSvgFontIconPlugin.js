const fontCarrier = require("font-carrier");
const _webpackSources = require('webpack-sources');
// import loaderUtils from 'loader-utils';
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

const font = fontCarrier.create();

class WebpackSvgFontIconPlugin {

    constructor(options) {
        validateOptions({
            "type": "object",
            "properties": {
                cssFileName: {
                    "type": "string"
                },
                fontFileName: {
                    "type": "string"
                },
                familyName: {
                    "type": "string"
                },
                classPrefix: {
                    "type": "string"
                },
                publicPath: {
                    "type": "string"
                },
                startCode:{
                    "type":"number"
                }
            },
            "additionalProperties": false
        }, options, 'WP Font Icon Plugin');
        this.options = options;
        this.moduleList = new Set();
    }

    static loader() {
        return [{ loader: require.resolve('../loader/Loader') }];
    }

    createFont(fs, svgList) {
        let hash = this.options.startCode || 0xe000;

        const familyName = this.options.familyName;

        let css = `.fx_icon{font-family: "${familyName}";}\n`;

        Object.keys(svgList).forEach(file => {
            //   console.log(file.replace(/\.svg$/, ''));
            font.setSvg(
                String.fromCharCode(hash),
                fs.readFileSync(svgList[file]).toString()
            );

            css += `.${file}::after{content:"\\${hash.toString(16)}";}\n`;

            hash++;
        });

        return {
            css,
            fonts: font.output({
                types: ["woff", "ttf"]
            })
        }
    }

    parseName(name, content) {
        return name.replace(/\[(?:(\w+):)?hash(?::([a-z]+\d*))?(?::(\d+))?\]/ig, function () {
            return loaderUtils.getHashDigest(content, arguments[1], arguments[2], parseInt(arguments[3], 10));
        });
    }

    apply(compiler) {
        const svgList = {};

        compiler.hooks.thisCompilation.tap("this-compilation", compilation => {
            compilation.hooks.normalModuleLoader.tap(
                "normalModuleLoader",
                (loaderContext, module) => {
                    loaderContext["svgLoader"] = (name, resourcePath) => {

                        svgList[name] = resourcePath;
                        this.moduleList.add(module);

                        return this.options.classPrefix;
                    };
                }
            ); //end normalModuleLoader

            compilation.hooks.optimizeChunkAssets.tapAsync(
                // compilation.hooks.beforeChunkAssets.tap(

                "MyPlugin",
                (chunks, callback) => {
                    let { fonts, css } = this.createFont(compilation.inputFileSystem, svgList);

                    const cssName = this.parseName(this.options.cssFileName, css);
                    const publicPath = compilation.mainTemplate.outputOptions.publicPath || "";
                    const ffList = [];
                    Object.keys(fonts).forEach(type => {
                        let _file = fonts[type];
                        let fontName = this.parseName(this.options.fontFileName, _file);

                        ffList.push(`url("${publicPath}${fontName}.${type}")`);

                        compilation.assets[`${fontName}.${type}`] = {
                            // 返回文件内容
                            source: () => {
                                return _file;
                            },
                            // 返回文件大小
                            size: () => {
                                return Buffer.byteLength(_file, "utf8");
                            }
                        };
                    });

                    const familyName = this.options.familyName;
                    css = `@font-face {font-family: "${familyName}"; src: ${ffList.join(",")};}` + css;


                    const moduleMap = new Map();

                    for (const m of this.moduleList) {
                        // console.log('>>>', m)
                        moduleMap.set(m.index, true);
                    }

                    chunks.forEach(aChunk => {
                        if (aChunk.hasRuntime()) {
                            for (const md of aChunk.modulesIterable) {
                                if (moduleMap.has(md.index)) {
                                    aChunk.files.push(cssName);
                                    break;
                                }
                            }
                        }
                    });

                    compilation.assets[cssName] = new _webpackSources.ConcatSource(css);
                    callback();
                }
            );
        });
    };
}
module.exports = WebpackSvgFontIconPlugin;
