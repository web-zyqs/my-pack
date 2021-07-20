const path = require('path');

module.exports = {
  entry: "./src/entry.js",
  output: {
    path: "./dist/",
    fileName: "bundle.js",
  },
  module: {
    //loader配置
    rules: [
      {
        test: /\.(jpg|png|jpeg)$/,
        use: path.resolve(__dirname, "./loaders/img-loader.js"),
      },
    ],
  },
};
