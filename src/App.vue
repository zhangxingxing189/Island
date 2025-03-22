<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { onMounted } from "vue";
import { useIslandStore } from "@/stores/getIslands";
import { User, useUserStore } from "@/stores/user";
import { post_QQCode } from "@/api/loginApi";
import router from "@/router";
console.log("here");

onMounted(async () => {
  // // 安全处理 code 参数
  // let route = useRoute();
  // let userStore = useUserStore();
  // let trueCode = route.query.code;
  // console.log(trueCode);
  // const code = Array.isArray(route.query.code)
  //   ? route.query.code[0]
  //   : route.query.code;
  // console.log(code);
  // if (code) {
  //   // API 调用
  //   if (code !== undefined && code !== null) {
  //     const res = await post_QQCode(code);
  //     if (res.code === 20000) {
  //       let userInfo: User = {
  //         username: res.data.username,
  //         avatar: res.data.avatar,
  //         atoken: res.data.atoken,
  //         rtoken: res.data.rtoken,
  //       };
  //       userStore.currentUser = userInfo;
  //       await userStore.setCurrentUser(userInfo);
  //       await router.push("/");
  //     }
  //   }
  // }
  // await userStore.loadUser();
  // const store = useIslandStore();
  // await store.fetchData();
});
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

import AiChat from "@/components/aiChat.vue";
</script>
<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
    <AiChat></AiChat>
  </div>
</template>

<style></style>
