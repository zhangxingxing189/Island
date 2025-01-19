<template>
  <div id="login-page">
    <div class="center" v-if="usepassword">
      <h1 class="title">登录</h1>
      <a-input
        class="input"
        placeholder="请输入用户名"
        v-model:value="passwordObj.username"
      ></a-input>
      <a-input-password
        class="input"
        placeholder="请输入密码"
        v-model:value="passwordObj.password"
      ></a-input-password>
      <a-button @click="usepassword = !usepassword">切换登录方式</a-button>
      <a-button class="login" type="primary" @click="loginPassword"
        >登录</a-button
      >
    </div>
    <div class="center" v-else>
      <h1 class="title">登录</h1>
      <a-input
        class="input"
        placeholder="请输入手机号"
        v-model:value="phoneObj.phone"
      ></a-input>
      <div class="phonecheckDiv">
        <a-input-password
          class="phonecheck"
          placeholder="请输入验证码"
          v-model:value="phoneObj.code"
        ></a-input-password>
        <a-button class="getphoneButton" type="primary">获取验证码</a-button>
      </div>
      <a-button @click="usepassword = !usepassword">切换登录方式</a-button>
      <a-button class="login" type="primary" @click="loginPassword"
        >登录</a-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  usertype,
  loginApi_password,
  check_security_code,
  get_security_code,
} from "@/api/loginApi";
import { message } from "ant-design-vue";
interface passwordType {
  username: string;
  password: string;
}
interface phoneType {
  phone: string;
  code: string;
}
let passwordObj = reactive<passwordType>({
  username: "",
  password: "",
});
let phoneObj = reactive<phoneType>({
  phone: "",
  code: "",
});
const usepassword = ref(false);
const hasCode = ref(false);
let user = ref<usertype>();
function wait60Seconds() {
  setTimeout(() => {
    hasCode.value = false;
  }, 60000); // 60000 毫秒 = 60 秒
}
async function get_code() {
  if (!phoneObj.phone) {
    message.warn("请输入手机号");
    return;
  }
  if (hasCode.value) {
    message.warn("请60秒后再试");
    return;
  }
  let res = await get_security_code({ phone: phoneObj.phone });
  if (res == "success") {
    message.success("获取成功");
    hasCode.value = true;
    wait60Seconds();
  }
}
async function loginPassword() {
  if (usepassword.value) {
    user.value = await loginApi_password(passwordObj);
  } else {
    user.value = await check_security_code(phoneObj);
  }
}
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
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.32);
  border: rgba(38, 234, 234, 0.44) 3px solid;
  width: 30vw;
  height: 50vh;
  padding: 20px;
  .input {
    position: relative;
    margin-top: 15px;
    height: 6vh;
    width: 30vw;
    margin-left: 10px;
    margin-right: 10px;
    max-width: 30vw;
    min-width: 30vw;
  }
  .login {
    position: relative;
    margin-top: 10px;
    height: 6vh;
    width: 10vw;
    min-width: 10vw;
    max-width: 10vw;
  }
  .phonecheckDiv {
    display: flex;
    flex-direction: row;
    align-items: center;
    .phonecheck {
      position: relative;
      width: 25vw;
      height: 6vh;
      margin-top: 15px;
    }
    .getphoneButton {
      position: relative;
      height: 6vh;
      width: 5vw;
      margin-top: 15px;
    }
  }
}
</style>
