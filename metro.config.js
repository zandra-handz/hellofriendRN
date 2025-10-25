 
const { withSentryConfig } = require("@sentry/react-native/metro");

// config = withSentryConfig(config, {
//   debug: true,
//   sourcemaps: true,
//   // This callback fixes the "Debug ID not found" issue
//   sentryBundleCallback: (bundle, options) => {
//     return bundle;
//   },
// });

const { getDefaultConfig } = require("expo/metro-config");
let config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;
const path = require('path');

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],

  extraNodeModules: { // adding this here fixed reload!!!
    "@": path.resolve(__dirname), // '@' points to the project root
  },
};

// --- Wrap with Sentry ---
// config = withSentryConfig(config);

// module.exports = config;

// module.exports = withSentryConfig(config, {
//   debug: true,
//   // This is the correct sentryBundleCallback signature
//   sentryBundleCallback: (bundle, options) => {
//     // Important: pass the options along so Sentry can handle it
//     return bundle;
//   },
// });

module.exports = process.env.NODE_ENV === "production"
  ? withSentryConfig(config)
  : config;