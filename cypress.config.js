import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 指定你本地正在跑的 Vue 应用地址
    baseUrl: "http://localhost:5173",

    // 如果你没有 support 文件，可以设为 false；否则指向 support 文件路径
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
