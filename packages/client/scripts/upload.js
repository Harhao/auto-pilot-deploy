const SentryCli = require('@sentry/cli');
const sentryConfig = require("../config/sentry.config");
const log = require("./log");

const sentryCli = new SentryCli({
  authToken: sentryConfig.authToken,
  org: sentryConfig.org,
  project: sentryConfig.project,
});

const exportVar = (name, value) => {
  process.env[name] = value;
};

exportVar('SENTRY_URL', sentryConfig.url);
exportVar('SENTRY_ORG','fee');
exportVar('SENTRY_AUTH_TOKEN',sentryConfig.authToken);
exportVar('SENTRY_PROJECT',sentryConfig.project);

sentryCli.execute([
  'releases',
  'files',
  sentryConfig.release,
  'upload-sourcemaps',
  sentryConfig.include,
  '--ext',
  'map',
  '--url-prefix',
  sentryConfig.urlPrefix || '~/',
  '--log-level',
  'info'
]).then(() => {
  log.success("sourcemap 上传成功", sentryConfig.urlPrefix);
}).catch(e => {
  log.error("sourcemap 上传失败",e);
})