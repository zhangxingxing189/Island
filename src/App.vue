<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useParentStore } from "@/stores/getIslands";
const store = useParentStore();
onMounted(async () => {
  //await store.fetchData();
});

import AiChat from "@/components/aiChat.vue";
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
