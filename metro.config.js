// const { withSentryConfig } = require("@sentry/react-native/metro");
// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (async () => {
//   const config = await getDefaultConfig(__dirname);
//   const { transformer, resolver } = config;

//   config.transformer = {
//     ...transformer,
//     babelTransformerPath: require.resolve("react-native-svg-transformer"),
//   };

//   config.resolver = {
//     ...resolver,
//     assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...resolver.sourceExts, "svg"],
//   };

//   // Optional: add .db support here if needed
//   // config.resolver.assetExts.push("db");

//   return withSentryConfig(config);
// })();

const { withSentryConfig } = require("@sentry/react-native/metro");

const { getDefaultConfig } = require('expo/metro-config');
let config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// --- Wrap with Sentry ---
config = withSentryConfig(config);

module.exports = config;
