var path = require("path");

module.exports = {
  publicPath: "/",
  devServer: {
    port: 8088,
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.js"
      }
    },
    devtool: 'source-map'
  },
  lintOnSave: true
};
