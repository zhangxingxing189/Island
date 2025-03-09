<template>
  <div id="login-page">
    <div class="center">
      <div class="right">
        <img
          src="../../assets/logo.png"
          alt="QQ登录"
          @click="QQLogin"
          class="image"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore, User } from "@/stores/user";
import router from "@/router";
import { useRoute } from "vue-router";
import { post_QQCode } from "@/api/loginApi";
let route = useRoute();
let userStore = useUserStore();
async function QQ() {
  // 安全处理 code 参数
  const code = Array.isArray(route.query.code)
    ? route.query.code[0]
    : route.query.code;
  console.log(code);
  if (!code) {
    await router.replace("/login");
    console.log("886");
    return;
  }

  // API 调用
  if (code !== null) {
    const res = await post_QQCode(code);
    if (res.data.code === 200) {
      console.log(code);
      console.log(res);
      await router.replace("/island");
    }
  }
}
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
    width: 35%;
    height: 55%;
    background-color: rgba(255, 255, 255, 0.52);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    border-radius: 10px;

    .image {
      cursor: pointer;
      width: 80px;
      height: 80px;
    }
  }
}
</style>
