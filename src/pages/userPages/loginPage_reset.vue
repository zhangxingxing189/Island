<template>
  <div id="login-page">
    <div class="center">
      <img
        src="../../assets/Connect_logo.png"
        alt="QQ登录"
        @click="QQLogin"
        class="image"
      />QQ登录
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore, User } from "@/stores/user";
import router from "@/router";
import { useRoute } from "vue-router";
import { post_QQCode } from "@/api/loginApi";
import { onMounted } from "vue";
let route = useRoute();
let userStore = useUserStore();
async function QQ() {
  // 安全处理 code 参数
  const code = Array.isArray(route.query.code)
    ? route.query.code[0]
    : route.query.code;

  // if (!code) {
  //   await router.replace("/login");
  //   console.log("886");
  //   return;
  // }

  // API 调用
  if (code !== null) {
    const res = await post_QQCode(code);
    console.log(code);
    console.log(res);
  }
}
// onMounted(async () => {
//   try {
//     // 安全处理 code 参数
//     const code = Array.isArray(route.query.code)
//       ? route.query.code[0]
//       : route.query.code;
//
//     // if (!code) {
//     //   await router.replace("/login");
//     //   console.log("886");
//     //   return;
//     // }
//
//     // API 调用
//     const res = await post_QQCode(code);
//     console.log(res);
//     // 验证响应数据结构
//     if (!res?.data?.access_token) {
//       throw new Error("无效的响应格式");
//     }
//
//     // 正确初始化用户对象
//     const user = {
//       atoken: res.data.atoken, // 匹配下划线命名
//       rtoken: res.data.rtoken,
//       username: res.data.username || "QQ用户",
//       avatar: res.data.avatar || "/default-avatar.png",
//     };
//
//     // 存储用户状态
//     userStore.setCurrentUser(user);
//
//     // 安全跳转
//     // if (isMounted) {
//     //   router.replace("/island");
//     // }
//   } catch (error) {
//     console.error("QQ登录失败:", error);
//     router.replace("/login");
//   }
// });
function QQLogin() {
  console.log(
    "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102717058&redirect_uri=http://islandlearning.icu/login&state=10086"
  );
  window.open(
    "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102717058&redirect_uri=http://islandlearning.icu/login&state=10086",
    "TencentLogin",
    "width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1"
  );
}
QQ();
</script>
<style scoped>
#login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../../assets/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;

  .center {
    position: absolute;
    right: 0;
    width: 400px;
    height: 96%;
    background-color: rgba(255, 255, 255, 0.52);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    border-radius: 5px;

    .image {
      cursor: pointer;
    }
  }
}
</style>
