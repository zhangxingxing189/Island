<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import { useParentStore } from "@/stores/getIslands";
// onMounted(async () => {
//   // await store.fetchData();
// });
// async function checkLogin() {
//   if (userStore.isLogin() || userStore.loadUser()) {
//     let isAuto = await checkLoginAuto();
//     console.log(isAuto);
//     if (isAuto.code !== 20000) {
//       console.log("no20000");
//       userStore.logout();
//       login();
//       // console.log("没有登录,去登录,这里先不跳转");
//     }
//   } else {
//     console.log("loadFalse");
//     // console.log("没有登录,去登录,这里先不跳转");
//     login();
//   }
// }
// // checkLogin();
import AiChat from "@/components/aiChat.vue";
</script>
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style></style>
