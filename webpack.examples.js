const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const HtmlPlugin = require('./html-webpack-plugin');
const exec = require('child_process').exec;

const EXAMPLES = path.resolve(__dirname, 'examples');

// clean the `lib` folder
exec('rm -rf lib/*');

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
    new HtmlPlugin({ templatePath: './index.tpl.html' }),
  ],
};
