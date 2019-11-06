module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    configureWebpack: {
        externals: {
            '@trust/webcrypto': 'crypto',
            'node-fetch': 'fetch',
            'xmldom': 'window'
        },
    }
}