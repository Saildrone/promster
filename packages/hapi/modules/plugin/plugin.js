const pkg = require('../package.json');
const {
  Prometheus,
  createMetricTypes,
  createRequestObserver,
  createGcObserver,
  normalizePath,
  normalizeStatusCode,
  normalizeMethod,
} = require('@promster/metrics');

const extractPath = req => req.route.path.replace(/\?/g, '');
const extractStatusCode = req => (req.response ? req.response.statusCode : '');

const createPlugin = ({
  options = {
    labels: [],
    accuracies: ['s'],
    getLabelValues: () => ({}),
    normalizePath,
    normalizeStatusCode,
    normalizeMethod,
  },
} = {}) => {
  const metricTypes = createMetricTypes(options);
  const observeRequest = createRequestObserver(metricTypes, options);
  const observeGc = createGcObserver(metricTypes);

  observeGc();

  const plugin = {
    register(server, options, next) {
      server.ext('onRequest', (request, reply) => {
        request.promster = { start: process.hrtime() };
        return reply.continue();
      });

      server.on('response', req => {
        observeRequest(req.promster.start, {
          labels: Object.assign(
            {},
            {
              method: options.normalizeMethod(req.method),
              path: options.normalizePath(extractPath(req)),
              method: options.normalizeMethod(req.method),
              status_code: options.normalizeStatusCode(extractStatusCode(req)),
            },
            options.getLabelValues(req, res)
          ),
        });
      });

      server.decorate('server', 'Prometheus', Prometheus);

      return next();
    },
  };

  return plugin;
};

plugin.register.attributes = {
  name: pkg.name,
  version: pkg.version,
};

exports.default = createPlugin;
