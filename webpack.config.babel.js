import fs from 'fs';
import path from 'path';

import { merge, isArray } from 'lodash';
import webpack from 'webpack';
import config from 'config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackSourceMapSupportPlugin from 'webpack-source-map-support';
import WebpackExternalModule from 'webpack-external-module';

const mergeCustomiser = (a, b) => {
  if (isArray(a)) {
    return a.concat(b);
  }
};

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(module => (['.bin'].indexOf(module) === -1))
  .forEach((module) => {
    nodeModules[module] = `commonjs ${module}`;
  });

const baseConfig = {
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        use: 'url-loader'
      }
    ]
  },
  resolve: {
    alias: {
      client: path.resolve(__dirname, 'src/client'),
      server: path.resolve(__dirname, 'src/server')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ],
  devtool: 'eval-source-map'
};

const serverConfig = merge({}, baseConfig, {
  entry: {
    server: path.resolve(__dirname, 'src/server/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new WebpackSourceMapSupportPlugin()
  ],
  target: 'node',
  externals: nodeModules
}, mergeCustomiser);

const clientConfig = merge({}, baseConfig, {
  entry: {
    client: path.resolve(__dirname, 'src/client/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]-bundle.js',
      minChunks: module => WebpackExternalModule.isExternal(module)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/client/index.html')
    })
  ]
}, mergeCustomiser);

export default [
  serverConfig,
  clientConfig
];
