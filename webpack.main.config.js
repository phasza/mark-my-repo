module.exports = {
  entry: "./src/main.js",
  module: {
    rules: require("./webpack.rules"),
  },
  target: "electron-main",
};
