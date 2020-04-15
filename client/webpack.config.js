// partially override expo-cli's built-in webpack config to fix some
// errors in production builds.
// note: this only affects the expo web build, not native/mobile.

const expoConfig = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  let conf = await expoConfig(env, argv);

  // adjust Google Workbox (service worker) config to avoid caching problems
  if (conf["plugins"]) {
    conf["plugins"].forEach((plugin) => {
      // detect workbox plugin
      if (
        plugin["config"] &&
        plugin["config"]["swDest"] === "service-worker.js"
      ) {
        // tell it never to cache index.html or service-worker.js
        plugin["config"]["exclude"].push(/index.html/);
        plugin["config"]["exclude"].push(/service-worker.js/);

        // (optional) tell it to start new service worker versions immediately, even if tabs
        // are still running the old one.
        plugin["config"]["skipWaiting"] = true;
      }
    });
  }

  return conf;
};
