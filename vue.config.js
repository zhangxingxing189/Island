const { defineConfig } = require("@vue/cli-service");
const path = require("path"); // 新增这行
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: "0.0.0.0", // 允许外部访问
    port: 8080, // 确保端口与转发端口一致
    allowedHosts: "all", // 允许所有 Host 头
    proxy: {
      "/images": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: { "^/images": "" },
      },
      // "/api": {
      //   // 代理标识	10.61.28.40:8080
      //   target: "http://10.61.28.40:8080", // 后端服务器地址
      //   changeOrigin: true, // 修改请求头中的host
      //   pathRewrite: {
      //     "^/api": "/api", // 路径重写（可选）
      //   },
      //   secure: false, // 关闭HTTPS验证（适用于HTTP服务）
      // },
    },
  },
});
