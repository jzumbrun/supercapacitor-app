var path = require('path'),
    webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        vendor: [path.join(__dirname, 'vendor.js')]
    },
    output: {
        path: path.resolve('../public/assets/dll'),
        filename: 'vendor.js',
        library: 'vendor'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'vendor-manifest.json'),
            name: 'vendor'
        })
    ],
    resolve: {
        modules: [path.resolve('./'), 'node_modules']
    }
}