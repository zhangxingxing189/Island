<template>
  <div id="login-page">
    <div class="center">
      <img
        src="../../assets/logo.png"
        alt="QQ登录"
        @click="QQLogin"
        class="image"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
function QQLogin() {
  console.log(
    "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102712643&redirect_uri=http://islandlearning.icu/login&state=10086"
  );
  window.open(
    "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102712643&redirect_uri=http://islandlearning.icu/login&state=10086",
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

<!--<template>-->
<!--  <div id="login-page">-->
<!--    &lt;!&ndash; 添加登录按钮容器 &ndash;&gt;-->
<!--    <div id="qqLoginBtn" class="center">-->
<!--      <img src="../../assets/logo.png" alt="QQ登录" class="image" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { onMounted, onUnmounted } from "vue";-->

<!--// QQ SDK初始化状态-->
<!--let qcInitialized = false;-->
<!--const appId = "102712643";-->
<!--const redirectUri = encodeURIComponent("http://islandlearning.icu/login");-->

<!--// 初始化QQ SDK-->
<!--const initQQSDK = () => {-->
<!--  if (qcInitialized || document.getElementById("qqLoginScript")) return;-->

<!--  const script = document.createElement("script");-->
<!--  script.id = "qqLoginScript";-->
<!--  script.src = "https://connect.qq.com/qc_jssdk.js";-->
<!--  script.dataset.appid = appId;-->
<!--  script.dataset.redirecturi = redirectUri;-->

<!--  script.onload = () => {-->
<!--    console.log("QQ SDK 加载完成");-->
<!--    // SDK加载完成后初始化-->
<!--    if (typeof QC !== "undefined") {-->
<!--      QC.Login({-->
<!--        btnId: "qqLoginBtn",-->
<!--        size: "B_M",-->
<!--        scope: "get_user_info",-->
<!--        display: "pc",-->
<!--      });-->
<!--      qcInitialized = true;-->
<!--    }-->
<!--  };-->

<!--  script.onerror = () => {-->
<!--    console.error("QQ SDK 加载失败");-->
<!--  };-->

<!--  document.head.appendChild(script);-->
<!--};-->

<!--// 处理登录回调-->
<!--const checkLoginStatus = () => {-->
<!--  if (typeof QC === "undefined") return;-->

<!--  QC.Login.checkStatus((status: boolean) => {-->
<!--    if (status) {-->
<!--      QC.Login.getMe((openId: string) => {-->
<!--        console.log("登录成功，OpenID:", openId);-->
<!--        // 获取用户信息-->
<!--        QC.api("get_user_info")-->
<!--          .success((res: any) => {-->
<!--            console.log("用户信息:", res.data);-->
<!--            // 处理用户数据逻辑...-->
<!--          })-->
<!--          .error((err: any) => {-->
<!--            console.error("获取用户信息失败:", err);-->
<!--          });-->
<!--      });-->
<!--    }-->
<!--  });-->
<!--};-->

<!--// 页面加载时初始化-->
<!--onMounted(() => {-->
<!--  initQQSDK();-->

<!--  // 添加全局回调监听-->
<!--  window.addEventListener("message", handleQCMessage);-->
<!--});-->

<!--// 清理资源-->
<!--onUnmounted(() => {-->
<!--  if (typeof QC !== "undefined") {-->
<!--    QC.Login.signOut();-->
<!--  }-->
<!--  window.removeEventListener("message", handleQCMessage);-->
<!--});-->

<!--// 处理跨域消息-->
<!--const handleQCMessage = (event: MessageEvent) => {-->
<!--  if (event.origin !== "https://graph.qq.com") return;-->

<!--  try {-->
<!--    const data = JSON.parse(event.data);-->
<!--    if (data.type === "QC_Login_Success") {-->
<!--      checkLoginStatus();-->
<!--    }-->
<!--  } catch (e) {-->
<!--    console.error("消息解析失败:", e);-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--#login-page {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  height: 100vh;-->
<!--}-->

<!--.center {-->
<!--  cursor: pointer;-->
<!--  transition: transform 0.3s;-->
<!--}-->

<!--.center:hover {-->
<!--  transform: scale(1.05);-->
<!--}-->

<!--.image {-->
<!--  width: 200px;-->
<!--  height: auto;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);-->
<!--}-->
<!--</style>-->
