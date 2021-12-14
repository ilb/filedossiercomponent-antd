// @see https://github.com/vercel/next.js/issues/17806
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    return config;
  }
};
