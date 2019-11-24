var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const gracefulFs = require('graceful-fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

gracefulFs.gracefulify(fs);
var nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
module.exports = {
  entry: './bin/www',
  target: 'node',
  mode: 'production',
  node: {
    __dirname: true
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true
      },
      sourceMap: true
    }),
    new CopyWebpackPlugin([{ from: './views/', to: './views/' }], {}),
    new CopyWebpackPlugin([{ from: './clients/', to: './clients/' }], {}),
    new CopyWebpackPlugin(
      [{ from: './node_modules/', to: './node_modules/' }],
      {}
    ),
    new webpack.WatchIgnorePlugin([/\.d\.ts$/])
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  externals: nodeModules
};
