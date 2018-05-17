const {
  Prometheus,
  createObserver,
  normalizePath: defaultNormalizePath,
  normalizeStatusCode: defaultNormalizeStatusCode,
  normalizeMethod: defaultNormalizeMethod,
} = require('@promster/metrics');

const exposePrometheusOnLocals = app => {
  if (app && app.locals) app.locals.Prometheus = Prometheus;
};
const extractPath = req => req.originalUrl || req.url;

const createMiddleware = ({ app, options } = {}) => {
  // NOTE: we need to "spread-default" options as
  // defaulting in argument position will not shallowly merge.
  let defaultedOptions = {
    labels: [],
    getLabelValues: () => ({}),
    normalizePath: defaultNormalizePath,
    normalizeStatusCode: defaultNormalizeStatusCode,
    normalizeMethod: defaultNormalizeMethod,
    ...options,
  };
  const observe = createObserver(defaultedOptions);

  exposePrometheusOnLocals(app);

  function middleware(req, res, next) {
    const start = process.hrtime();
    res.on('finish', () => {
      observe(start, {
        labels: Object.assign(
          {},
          {
            method: defaultedOptions.normalizeMethod(req.method),
            status_code: defaultedOptions.normalizeStatusCode(res.statusCode),
            path: defaultedOptions.normalizePath(extractPath(req)),
          },
          defaultedOptions.getLabelValues(req, res)
        ),
      });
    });

    return next();
  }

  return middleware;
};

exports.default = createMiddleware;
