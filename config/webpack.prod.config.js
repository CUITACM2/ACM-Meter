/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var baseConfig = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var utils = require('./utils');
var pagesConfig = require('./pages.config');
require('shelljs/global');

// before new build
rm('-rf', 'dist');
mkdir('dist');

process.env.NODE_ENV = 'production';

var htmlPlugins = Object.keys(pagesConfig).map(key => {
  return new HtmlWebpackPlugin({
    title: pagesConfig[key].title,
    template: pagesConfig[key].template,
    filename: key + '.html',
    inject: true,
    chunks: pagesConfig[key].chunks,
    minify: {
      removeComments: true,
      collapseWhitespace: true
    },
    chunksSortMode: 'dependency'
  });
});

module.exports = webpackMerge(baseConfig, {
  module: {
    loaders: utils.globalCssLoaders({ extract: true })
  },
  vue: {
    loaders: utils.vueCssLoaders({ extract: true })
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:7].js',
    chunkFilename: 'chunks/[name].chunk.[hash:7].js',
  },
  plugins: htmlPlugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin("[name].bundle.[hash:7].css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ])
});