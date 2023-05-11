const baseConfig = require("./webpack.base");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const sentryConfig = require("../config/sentry.config");
const { merge } = require("webpack-merge");

module.exports = merge(baseConfig, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name]_[chunkhash:8].css",
      chunkFilename: "[id].css",
    }),
    new CompressionWebpackPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      threshold: 10240,
      minRatio: 0.8,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: true ? { map: { inline: false } } : {},
    }),
    // new SentryWebpackPlugin(sentryConfig),
  ],
  optimization: {
    usedExports: true,
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: false, // 开启 sourcemap 功能
        uglifyOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: true ? { map: { inline: false } } : {},
      }),
    ],
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
    },
  },
});
