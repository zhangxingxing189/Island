// 必须包含所有文件路径
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 必须包含 Vue 文件类型
    // 如果有额外目录需添加，例如：
    "./src/views/**/*.vue"
  ],
  // 其他配置保持默认
}