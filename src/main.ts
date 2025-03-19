import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "@/assets/font/iconfont.css";
import "@/assets/css/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
const pinia = createPinia();
createApp(App).use(Antd).use(pinia).use(router).use(mavonEditor).mount("#app");
