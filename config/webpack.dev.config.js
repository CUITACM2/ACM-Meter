/*eslint-disable*/
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var baseConfig = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var utils = require('./utils');
var pagesConfig = require('./pages.config');

process.env.NODE_ENV = 'development';

Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name].unshift(
    'webpack-dev-server/client?http://0.0.0.0:' + baseConfig.devPort,
    'webpack/hot/dev-server'
  );
});

var htmlPlugins = Object.keys(pagesConfig).map(key => {
  return new HtmlWebpackPlugin({
    title: pagesConfig[key].title,
    template: pagesConfig[key].template,
    filename: key + '.html',
    inject: true,
    chunks: pagesConfig[key].chunks,
  });
});

module.exports = webpackMerge(baseConfig, {
  module: {
    loaders: utils.globalCssLoaders()
  },
  devtool: '#eval-source-map',
  plugins: htmlPlugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ])
});