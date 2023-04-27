const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");
const progressBarPlugin = require("progress-bar-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const config = require("../config");
const { isProduction } = require("../scripts/utils");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { dllName } = require("../config");
const workerCount = require("os").cpus().length - 1;
const webpack = require("webpack");

const webpackBaseConfig = {
  entry: path.resolve(__dirname, "../main.tsx"),
  devtool: "source-map",
  output: {
    publicPath: process.env.PUBLIC_PATH,
    filename: "static/js/[name]_[hash:16].js",
    path: path.resolve(__dirname, "../dist"),
  },
  resolve: {
    modules: ["node_modules"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: workerCount
            },
          },
          {
            loader: "ts-loader",
            options: {
              //开启多线程编译
              happyPackMode: true,
              compilerOptions: {
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new progressBarPlugin(),
    new htmlWebpackPlugin({
      title: "自动发布平台",
      template: path.resolve(__dirname, "../public/index.html"),
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
  ],
};

if (config.isDll) {
  webpackBaseConfig.plugins.push(
    new DllReferencePlugin({
      manifest: require(`../dll/${dllName}.manifest.json`),
    })
  );
  webpackBaseConfig.plugins.push(
    new AddAssetHtmlWebpackPlugin({
      publicPath: process.env.PUBLIC_PATH,
      filepath: path.resolve(__dirname, `../dll/${dllName}.dll.js`), // 对应的 dll 文件路径
    })
  );
}
if (!isProduction()) {
  const address = require("address");
  const realIPAddress = address.ip();
  webpackBaseConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here:`,
          `http://${config.devServer.host}:${config.devServer.port}`,
          `http://${realIPAddress}:${config.devServer.port}`,
        ],
      },
      clearConsole: true,
    })
  );
}
module.exports = webpackBaseConfig;
