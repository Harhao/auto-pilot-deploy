const path = require("path");
const git = require("git-rev-sync");

module.exports = {
  org: "",
  project: "client",
  release: git.short(),
  include: path.resolve(__dirname, "../dist"),
  ignore: ["node_modules"],
  urlPrefix: process.env.PUBLIC_PATH,
  environment: process.env.NODE_ENV,
  url: "",
  authToken: ""
};