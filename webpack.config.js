/* eslint-disable */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var autoprefixer = require('autoprefixer');
var pages = require('./pages');
var webpack = require('webpack');
var minify = require('html-minifier').minify;
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

var production = process.env.NODE_ENV == 'production';

function getFileNameTemplate(ext) {
    return production ? '[name].[hash].' + ext + '' : '[name].' + ext + ''
}

var paths = [
    '/',
    '/talks',
    '/articles',
    '/ru/',
    '/ru/talks',
    '/ru/articles',
    '/en',
];

module.exports = {
    entry: {
        'index': ['./src/index.js'],
    },
    output: {
        path: 'dist',
        publicPath: '/',
        filename: getFileNameTemplate('js'),
        libraryTarget: 'umd'
    },
    module: {
        preLoaders: [
            {
                test: /\.html$/,
                loader: 'dot'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
            },
            {
                test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
            },
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    postcss: [ autoprefixer({ browsers: ['not ie < 10'] }) ],
    plugins: [
        new webpack.ProvidePlugin({
            _: "lodash"
        }),
        new ExtractTextPlugin(getFileNameTemplate('css')),
        new StaticSiteGeneratorPlugin('index', paths),
        new CompressionPlugin({
            asset: "[path]",
            algorithm: function(buffer, opts, callback) {
                callback(null, minify(buffer.toString('utf8'), {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    collapseInlineTagWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: false,
                    minifyJS: true,
                }));
            },
            test: /\.html$/,
            threshold: 1,
            minRatio: 1
        })
    ],
};

if (production) {
    module.exports.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }));
}
