const { version } = require('../package.json');
const { createPlugin } = require('./plugin');
const {
  getSummary,
  getContentType,
  Prometheus,
  defaultRegister,
} = require('@promster/metrics');

exports.version = version;
exports.createPlugin = createPlugin;
exports.getSummary = getSummary;
exports.getContentType = getContentType;
exports.Prometheus = Prometheus;
exports.defaultRegister = defaultRegister;
