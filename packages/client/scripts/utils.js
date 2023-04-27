const path = require("path");
const fs = require("fs");
const process = require("process");
const { execSync } = require("child_process");
const ora = require("ora");
const log = require("./log");
const { dllName } = require("../config");

function checkDll() {
  return new Promise((resolve, reject) => {
    log.info(`检测是否已生成Dll动态链接库`);
    const filePath = path.resolve(__dirname, `../dll/${dllName}.dll.js`);
    if (!fs.existsSync(filePath)) {
      downloadDll()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
      return;
    }
    log.success("✨ 已存在Dll链接库");
    resolve();
  });
}

function execScript(command) {
  return new Promise((resolve, rejcet) => {
    execSync(command, (error, stdout, stderr) => {
      if (error) {
        log.error(error);
        rejcet(error);
      } else {
        log.info(stdout);
        resolve(stdout);
      }
    });
  });
}

function downloadDll() {
  return new Promise((resolve, reject) => {
    const spinner = ora(`✨✨ 开始打 📦 Dll链接库...`);
    spinner.start();
    try {
      execScript(`npm run build:dll`);
      spinner.succeed("✨✨ 已成功 📦 Dll链接库，开启打包进程...");
      resolve();
    } catch (err) {
      spinner.fail();
      reject(err);
    }
  });
}

function uploadSourceMap() {
  return new Promise((resolve, reject) => {
    const spinner = ora(`开始上传sourcemap...`);
    spinner.start();
    try {
      execScript(`npm run build:upload`);
      spinner.succeed("✨✨ 已成功上传sourcemap...");
      resolve();
    } catch (err) {
      spinner.fail();
      reject(err);
    }
  });
}

function getNpmParam() {
  const env = process.env.NODE_ENV;
  return env;
}

function isProduction() {
  return getNpmParam() === "production";
}
module.exports = {
  downloadDll,
  execScript,
  checkDll,
  getNpmParam,
  isProduction,
  uploadSourceMap
};
