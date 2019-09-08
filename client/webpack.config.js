const path = require('path'),
    webpack = require('webpack')

console.log(path.resolve(__dirname, 'node_modules/supercapacitor'))

module.exports = {
    mode: 'development',
    entry: {
        app: './app.jsx'
    },
    output: {
        path: path.resolve('../public/assets/build'),
        filename: 'js/app.js',
        publicPath: '/assets/build/'
    },
    resolve: {
        modules: [path.resolve('./'), 'node_modules']
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json')
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx|\.js$/,
                resolve: { extensions: ['.js', '.jsx']},
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'node_modules/supercapacitor'),
                    path.resolve(__dirname, 'app.jsx'),
                    path.resolve(__dirname, 'modules')
                ]
            }
        ]
    }
}