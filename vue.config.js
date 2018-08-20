let webpack = require('webpack');

// vue.config.js
module.exports = {
    configureWebpack: config => {
        plugins: [
            new webpack.DefinePlugin({
                'VERSION': JSON.stringify(config.version),
            }),
        ]
    }
}