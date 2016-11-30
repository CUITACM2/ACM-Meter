var path = require('path');
var autoprefixer = require('autoprefixer');
var utils = require('./utils');
var pagesConfig = require('./pages.config');
var projectRoot = path.resolve(__dirname, '../')

var webpackEntry = {};
Object.keys(pagesConfig).forEach(key => {
  webpackEntry[key] = [pagesConfig[key].entry];
});

module.exports = {
  devPort: 3001,
  entry: webpackEntry,

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: 'chunks/[name].chunk.js'
  },

  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'api': path.resolve(__dirname, '../src/api'),
      'store': path.resolve(__dirname, '../src/store'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'helpers': path.resolve(__dirname, '../src/helpers')
    }
  },

  module: {
    preLoaders: [
      {
        test: /\.(vue|js)$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(gif|jpe?g|png|svg)(\?.*)?$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
      }
    ]
  },

  eslint: {
    formatter: require('eslint-friendly-formatter')
  },

  vue: {
    loaders: utils.vueCssLoaders(),
    postcss: [
      autoprefixer({ browsers: ['last 10 versions'] })
    ]
  }
};
