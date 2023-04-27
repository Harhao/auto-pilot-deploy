const { checkDll, uploadSourceMap } = require("./utils");
const log = require("./log");
const webpack = require("webpack");
const getEnv = require("./getEnv");
const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(process.cwd(), 'webui/mkt/client-push');
fs.ensureDir(distPath);

async function main() {
  await checkDll();
  let webpackConfig = require("../build/webpack.prod");
  webpackConfig.watch = true;
  webpackConfig.output.path = distPath;

  // 确保有打包目录存在
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
