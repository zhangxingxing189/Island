const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/images": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: { "^/images": "" },
      },
    },
  },
});
