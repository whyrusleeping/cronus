var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-hot-middleware/client',
        './app/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'app')
        },{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },{
            test: /\.(woff|woff2)$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff"
        },{
            test: /\.ttf$/,
            loader: "file-loader"
        },{
            test: /\.eot$/,
            loader: "file-loader"
        },{
            test: /\.svg$/,
            loader: "file-loader"
        }]
    }
};
