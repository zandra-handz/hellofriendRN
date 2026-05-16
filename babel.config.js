module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      // production: {
      //   plugins: ["transform-remove-console"],
      // },
      // development: {
      //   plugins: ["transform-remove-console"],
      // },
      // preview: {
      //   plugins: ["transform-remove-console"],
      // },
    },
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./", // NEED TO SET THIS IN METRO TOO
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
      //"react-native-reanimated/plugin",
     "react-native-worklets/plugin", // must be last
    ],
  };
};
