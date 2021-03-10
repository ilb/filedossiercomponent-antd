// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const httpProxy = require('http-proxy');
const proxy = httpProxy.createServer({ changeOrigin: true, target: 'https://demo01.ilb.ru/' });

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        req.url = req.url.replace(/^\/api/, '');

        proxy.web(req, res);
      }
    }
  ]
};
