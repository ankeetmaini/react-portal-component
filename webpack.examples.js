const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const path = require('path');
const HtmlPlugin = require('./html-webpack-plugin');


const EXAMPLES = path.resolve(__dirname, 'examples');

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

function getEntries() {
  return fs.readdirSync(EXAMPLES).reduce((entries, example) => {
    const examplePath = path.join(EXAMPLES, example);
    if (isDirectory(examplePath)) {
      entries[path.relative(EXAMPLES, path.resolve(examplePath, 'index'))] = path.join(examplePath, 'index');
    }
    return entries;
  }, {});
}

module.exports = {
  entry: getEntries(),
  output: {
    path: './lib',
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css/, exclude: /node_modules/, loader: 'style-loader!css-loader' },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['./lib']),
    new HtmlPlugin({ templatePath: './index.tpl.html' }),
  ],
};
