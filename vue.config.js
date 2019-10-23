var webpack = require('webpack');
module.exports = {
    configureWebpack: {
        externals: {
            '@trust/webcrypto': 'crypto',
            'node-fetch': 'fetch',
            'xmldom': 'window'
        }
    }
}