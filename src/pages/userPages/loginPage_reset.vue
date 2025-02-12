<template>
  <div id="login-page">
    <div class="center">
      <img src="@/assets/QQ.png" alt="QQ登录" @click="QQLogin" class="image" />
    </div>
  </div>
</template>
<script lang="ts" setup>
function QQLogin() {
  window.open(
    "oauth/index.php",
    "TencentLogin",
    "width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1"
  );
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
      width: 100px;
      height: 100px;
    }
  }
}
</style>
