// const {
//   getSentryExpoConfig
// } = require("@sentry/react-native/metro");


// const config = getSentryExpoConfig(__dirname);

// const { getDefaultConfig } = require('@expo/metro-config');
// //const { getDefaultConfig } = require('@react-native/metro-config');
// const config = getDefaultConfig(__dirname);



// const { getDefaultConfig } = require('@expo/metro-config');
// const { withSentryConfig } = require('@sentry/react-native/metro');

// let config = getDefaultConfig(__dirname);
// config = withSentryConfig(config);

// module.exports = config;


// const { transformer, resolver } = config;

// config.transformer = {
// ...transformer,
// babelTransformerPath: require.resolve("react-native-svg-transformer"),
// }

// config.resolver.extraNodeModules = {
//   '@': __dirname,
// };

// config.resolver = {
//     ...resolver,
//     assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...resolver.sourceExts, "svg"],
//   };

 


// module.exports = config;



const { withSentryConfig } = require("@sentry/react-native/metro");
//const { getDefaultConfig } = require('@react-native/metro-config');

const { getDefaultConfig } = require('@expo/metro-config');
let config = getDefaultConfig(__dirname);

// --- SVG transformer setup ---
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