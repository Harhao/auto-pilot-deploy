const { checkDll, isProduction, uploadSourceMap } = require("./utils");
const log = require("./log");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const config = require("../config");
const getEnv = require("./getEnv");

async function main() {
  const isBuildProduction = isProduction();
  await checkDll();
  let webpackConfig = isBuildProduction
    ? require("../build/webpack.prod")
    : require("../build/webpack.dev");
  if (!isBuildProduction) {
    const compiler = webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        log.error(err || stats.toString());
        return;
      }
      log.success("=========================")
      log.success("✨✨ 构建页面成功，可以访问啦～ ✨✨")
      log.success("=========================")
    });
    webpackDevServer.addDevServerEntrypoints(webpackConfig, config.devServer);
    const server = new webpackDevServer(compiler, config.devServer);
    server.listen(
      config.devServer.port,
      (config.devServer.host,
      () => {
        log.succes(
          `页面地址：${config.devServer.host}:${config.devServer.port}`
        );
      })
    );
    return;
  }
  webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        chunks: false,
        chunkModules: false
      }) + "\n\n"
    );
    if (stats.hasErrors()) {
      log.error("构建时候出现错误", stats);
      process.exit(1);
    }
    log.success("✨✨ 构建项目完成 ✨✨");
    uploadSourceMap();
  });
}

getEnv();
main();
