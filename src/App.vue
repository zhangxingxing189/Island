<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useParentStore } from "@/stores/getIslands";
const store = useParentStore();
const userStore = useUserStore();
onMounted(async () => {
  //await store.fetchData();


  // await store.fetchData();
  if (userStore.loadUser()) {
    let isAuto = await checkLoginAuto();
    console.log(isAuto);
    if (isAuto.code !== 20000) {
      userStore.logout();
      login();
    }
  } else {
    login();
  }
});

import AiChat from "@/components/aiChat.vue";
import { useUserStore } from "@/stores/user";
import { checkLoginAuto } from "@/api/loginApi";
import { login } from "@/pages/home/UIFunction";
</script>
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style></style>

<!--<script>-->
<!--window.difyChatbotConfig = {-->
<!--  token: "pkwi18XUXamz24r4",-->
<!--  baseUrl: "http://localhost",-->
<!--};-->
<!--</script>-->
<!--<script-->
<!--  src="http://localhost/embed.min.js"-->
<!--  id="pkwi18XUXamz24r4"-->
<!--  defer-->
<!--&gt;</script>-->
<!--<style>-->
<!--#dify-chatbot-bubble-button {-->
<!--  background-color: #1c64f2 !important;-->
<!--}-->
<!--#dify-chatbot-bubble-window {-->
<!--  width: 24rem !important;-->
<!--  height: 40rem !important;-->
<!--}-->
<!--</style>-->
