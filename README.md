# wp-font-icon-plugin
another font icon plugin for Webpack  
通过webpack将引入的svg打包为字体文件

#### usage:

```javascript
const WebpackSvgFontIconPlugin = require('wp-font-icon-plugin');
//... come config
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
//... other config
```
