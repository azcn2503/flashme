import fs from "fs";
import path from "path";

import { mergeWith, isArray } from "lodash";
import webpack from "webpack";

import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackSourceMapSupportPlugin from "webpack-source-map-support";
import WebpackExternalModule from "webpack-external-module";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

const mergeCustomiser = (a, b) => {
  if (isArray(a) && isArray(b)) {
    return a.concat(b);
  }
};

const nodeModules = {};
fs
  .readdirSync("node_modules")
  .filter(module => [".bin"].indexOf(module) === -1)
  .forEach(module => {
    nodeModules[module] = `commonjs ${module}`;
  });

const baseConfig = {
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: true,
                localIdentName: "[name]__[local]__[hash:base64:5]"
              }
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [path.resolve(__dirname, "node_modules")]
              }
            }
          ]
        })
      },
      {
        test: /\.png$/,
        use: "url-loader"
      }
    ]
  },
  resolve: {
    alias: {
      client: path.resolve(__dirname, "src/client"),
      server: path.resolve(__dirname, "src/server"),
      shared: path.resolve(__dirname, "src/shared")
    },
    extensions: [".js", ".jsx", ".json"]
  },
  plugins: [new HardSourceWebpackPlugin(), new webpack.NoEmitOnErrorsPlugin()]
};

const serverConfig = mergeWith(
  {},
  baseConfig,
  {
    entry: {
      server: path.resolve(__dirname, "src/server/index.js")
    },
    output: {
      path: path.resolve(__dirname, "dist/server"),
      filename: "[name]-bundle.js"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        )
      })
    ],
    target: "node",
    externals: nodeModules
  },
  mergeCustomiser
);

const clientConfig = mergeWith(
  {},
  baseConfig,
  {
    entry: {
      client: path.resolve(__dirname, "src/client/index.js")
    },
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "dist/client"),
      filename: "[name]-bundle.js"
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "[name]-bundle.js",
        minChunks: module => WebpackExternalModule.isExternal(module)
      }),
      new ExtractTextPlugin("styles.css"),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/client/index.html")
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        )
      })
    ]
  },
  mergeCustomiser
);

if (process.env.NODE_ENV === "production") {
  clientConfig.plugins.push(new UglifyJsPlugin());
  serverConfig.plugins.push(new UglifyJsPlugin());
} else {
  clientConfig.devtool = "source-map";
  serverConfig.devtool = "source-map";
  serverConfig.plugins.push(new WebpackSourceMapSupportPlugin());
}

export default [serverConfig, clientConfig];
