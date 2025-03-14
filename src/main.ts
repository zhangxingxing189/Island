import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import '@/assets/font/iconfont.css';
import '@/assets/css/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
const pinia = createPinia();
createApp(App).use(Antd).use(pinia).use(router).mount("#app");
