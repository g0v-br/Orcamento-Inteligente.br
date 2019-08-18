var webpack = require('webpack');
module.exports = {
    configureWebpack: {
        externals: {
            '@trust/webcrypto': 'crypto',
            'node-fetch': 'fetch',
            'xmldom': 'window'
        },
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
                VERSION: JSON.stringify('5fa3b9'),
                BROWSER_SUPPORTS_HTML5: true,
                TWO: '1+1'
            })
        ]
    }
}