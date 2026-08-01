const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const path = require("path");

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: path.resolve(__dirname, "buffer-mock.js"),
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
