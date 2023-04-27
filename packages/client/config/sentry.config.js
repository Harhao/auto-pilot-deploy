const path = require("path");
const git = require("git-rev-sync");

module.exports = {
  org: "fee",
  project: "client",
  release: git.short(),
  include: path.resolve(__dirname, "../dist"),
  ignore: ["node_modules"],
  urlPrefix: process.env.PUBLIC_PATH,
  environment: process.env.NODE_ENV,
  url: "",
  authToken: "994443fca888401eb44193c9f2721996b8fa958ac2f14ef68e9cc0a6b8f7ef7b"
};