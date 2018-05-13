<p align="center">
  <img alt="Logo" height="150" src="https://raw.githubusercontent.com/tdeekens/promster/master/logo.png" /><br /><br />
</p>

<h2 align="center">⏰ Promster - Measure metrics from Hapi/Express servers with Prometheus 🚦</h2>
<p align="center">
  <b>Promster is an Prometheus Exporter for Node.js servers written with Express or Hapi.</b>
</p>

<p align="center">
  <sub>
  ❤️
  Hapi
  · Express
  · Prettier
  · Jest
  · ESLint
  · Babel
  · Lerna
  · Rollup
  🙏
  </sub>
</p>

<p align="center">
  <a href="https://circleci.com/gh/tdeekens/promster">
    <img alt="CircleCI Status" src="https://circleci.com/gh/tdeekens/promster.svg?style=shield&circle-token=63ee7a0e1c766b6b76da6f7ba4c7b9f2a7876191">
  </a>
  <a href="https://codecov.io/gh/tdeekens/promster">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/tdeekens/promster.svg?style=flat-square">
  </a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Ftdeekens%2Fpromster?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftdeekens%2Fpromster.svg?type=shield"/></a>
  <a href="https://snyk.io/test/github/tdeekens/promster"><img src="https://snyk.io/test/github/tdeekens/promster/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/{username}/{repo}" style="max-width:100%;"/></a>
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg">
</p>

## ❯ Package Status

| Package                                 | Version                                             | Dependencies                                                                      | Downloads                                                    |
| --------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`promster/hapi`](/packages/hapi)       | [![hapi Version][hapi-icon]][hapi-version]          | [![hapi Dependencies Status][hapi-dependencies-icon]][hapi-dependencies]          | [![hapi Downloads][hapi-downloads]][hapi-downloads]          |
| [`promster/express`](/packages/express) | [![express Version][express-icon]][express-version] | [![express Dependencies Status][express-dependencies-icon]][express-dependencies] | [![express Downloads][express-downloads]][express-downloads] |
| [`promster/server`](/packages/server)   | [![server Version][server-icon]][server-version]    | [![server Dependencies Status][server-dependencies-icon]][server-dependencies]    | [![server Downloads][server-downloads]][server-downloads]    |
| [`promster/metrics`](/packages/metrics) | [![metrics Version][metrics-icon]][metrics-version] | [![metrics Dependencies Status][metrics-dependencies-icon]][metrics-dependencies] | [![metrics Downloads][metrics-downloads]][metrics-downloads] |

[metrics-version]: https://www.npmjs.com/package/@promster/metrics
[metrics-icon]: https://img.shields.io/npm/v/@promster/metrics.svg?style=flat-square
[metrics-dependencies]: https://david-dm.org/tdeekens/promster?path=packages/metrics
[metrics-dependencies-icon]: https://david-dm.org/tdeekens/promster/status.svg?style=flat-square&
[metrics-downloads]: https://img.shields.io/npm/dm/@promster/metrics.svg
[hapi-version]: https://www.npmjs.com/package/@promster/hapi
[hapi-icon]: https://img.shields.io/npm/v/@promster/hapi.svg?style=flat-square
[hapi-dependencies]: https://david-dm.org/tdeekens/promster?path=packages/hapi
[hapi-dependencies-icon]: https://david-dm.org/tdeekens/promster/status.svg?style=flat-square&
[hapi-downloads]: https://img.shields.io/npm/dm/@promster/hapi.svg
[express-version]: https://www.npmjs.com/package/@promster/express
[express-icon]: https://img.shields.io/npm/v/@promster/express.svg?style=flat-square
[express-dependencies]: https://david-dm.org/tdeekens/promster?path=packages/express
[express-dependencies-icon]: https://david-dm.org/tdeekens/promster/status.svg?style=flat-square&
[express-downloads]: https://img.shields.io/npm/dm/@promster/express.svg
[server-version]: https://www.npmjs.com/package/@promster/server
[server-icon]: https://img.shields.io/npm/v/@promster/server.svg?style=flat-square
[server-dependencies]: https://david-dm.org/tdeekens/promster?path=packages/server
[server-dependencies-icon]: https://david-dm.org/tdeekens/promster/status.svg?style=flat-square&
[server-downloads]: https://img.shields.io/npm/dm/@promster/server.svg

## ❯ Installation

This is a mono repository maintained using
[lerna](https://github.com/lerna/lerna). It currently contains four
[packages](/packages) in a `metrics`, a `hapi` or
`express` integration, and a `server` exposing the metrics for you if you do not want to do that via your existing server.

Depending on the preferred integration use:

`yarn add @promster/hapi` or `npm i @promster/express --save`

or

`yarn add @promster/hapi` or `npm i @promster/express --save`

## ❯ Documentation

Promster has to be setup with your server. Either as an Express middleware of an Hapi plugin. You can expose the gathered metrics via a built-in small server or through our own.

The following metrics are exposed:

* `up`: an indication if the server is started: either 0 or 1
* `http_request_duration_percentiles_microseconds`: a Prometheus summary with request time percentiles in milliseconds (defaults to `[0.5, 0.9, 0.99]`)
* `http_request_duration_buckets_microseconds`: a Prometheus histogram with request time buckets in milliseconds (defaults to `[0.003, 0.03, 0.1, 0.3, 1.5, 10]`)

on each metric the following default labels are measured: `method`, `status_code` and `path`. You can configure more `labels` (see below).

### `@promster/express`

```js
const app = require('./your-express-app');
const { createMiddleware } = require('@promster/express');

// Note: This should be done BEFORE other routes
// Pass 'app' as middleware parameter to additionally expose Prometheus under 'app.locals'
app.use(createMiddleware(app, options));
```

Passing the `app` into the `createMiddleware` call attaches the internal `prom-client` to your Express app's locals. This may come in handy as later you can:

```js
// Create an e.g. custom counter
const counter = new app.locals.Prometheus.Counter({
  name: 'metric_name',
  help: 'metric_help',
});

// to later increment it
counter.inc();
```

### `@promster/hapi`

```js
const { createPlugin } = require('@promster/hapi');
const app = require('./your-hapi-app');

app.register(createPlugin(options));
```

Here you do not have to pass in the `app` into the `createPlugin` call as the internal `prom-client` will be exposed onto Hapi as in:

```js
// Create an e.g. custom counter
const counter = new app.Prometheus.Counter({
  name: 'metric_name',
  help: 'metric_help',
});

// to later increment it
counter.inc();
```

When creating either the Express middleware or Hapi plugin the followin options can be passed:

* `labels`: an `Array<String>` of custom labels to be configured both on all metrics mentioned above
* `getLabelValues`: a function receiving `req` and `res` on reach request. It has to return an object with keys of the configured `labels` above and the respective values
* `normalizePath`: a function called on each request to normalize the request's path
* `normalizeStatusCode`: a function called on each request to normalize the respond's status code (e.g. to get 2xx, 5xx codes instead of detailed ones)
* `normalizeMethod`: a function called on each request to normalize the request's method (to e.g. hide it fully)

### `@promster/server`

In some cases you might want to expose the gathered metrics through an individual server. This is useful for instance to not have `GET /metrics` expose internal server and business metrics to the outside world. For this you can use `@promster/server`:

```js
const { createServer } = require('@promster/server');

// NOTE: The port defaults to `7788`.
createServer({ port: 8888 }).then(server =>
  console.log(`@promster/server started on port 8888.`)
);
```

### `@promster/metrics`

You can use the `metrics` package to expose the gathered metrics through your existing server. To do so just:

```js
const app = require('./your-express-app');
const { getSummary, getContentType } = require('@promster/express');

app.use('/metrics', (req, res) => {
  req.statusCode = 200;

  res.setHeader('Content-Type', getContentType());
  res.end(getSummary());
});
```

This may slightly depend on the server you are using but should be roughly the same for all.
