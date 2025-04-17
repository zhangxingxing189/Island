<template>
  <div id="login-page">
    <div class="center">
      <div class="left">
        <div class="time-container">
          <!-- 时间上半部分 -->
          <div class="time-top">
            <div class="time-digits">
              <span class="hours">{{ formattedTime.hours }}</span>
              <span class="colon">:</span>
              <span class="minutes">{{ formattedTime.minutes }}</span>
              <span class="colon">:</span>
              <span class="seconds">{{ formattedTime.seconds }}</span>
            </div>
            <!--            <div class="time-label">北京时间</div>-->
          </div>

          <!-- 时间下半部分 -->
          <div class="time-bottom">
            <div class="date-display">
              {{ formattedTime.year }}/ {{ formattedTime.month }}/
              {{ formattedTime.date }}/
            </div>
            <p class="motto-text">Are ya ready, kids?</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="image-wrapper">
          <img
            src="../../assets/logo.png"
            alt="QQ登录"
            @click="QQLogin"
            class="image"
            @mouseenter="showHint = true"
            @mouseleave="showHint = false"
          />
          <!-- 新增提示文字 -->
          <transition name="hint-fade">
            <div v-if="showHint" class="hint-text">Aye-aye, Captain!</div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore, User } from "@/stores/user";
import router from "@/router";
import { useRoute } from "vue-router";
import { post_QQCode } from "@/api/loginApi";
import JSONbig from "json-bigint";
// import clock from "@/pages/clock.vue";
import { message } from "ant-design-vue";
let route = useRoute();
let userStore = useUserStore();

const QQ = async () => {
  // 安全处理 code 参数
  let trueCode = route.query.code;
  console.log(trueCode);
  const code = Array.isArray(route.query.code)
    ? route.query.code[0]
    : route.query.code;
  console.log(code);
  if (!code) {
    return;
  }
  // API 调用
  try {
    const res = await post_QQCode(code);
    if (res.code === 20000) {
      console.log(res.data);
      const tokenData = parseJWT(res.data.atoken);
      if (tokenData) {
        console.log("用户ID:", tokenData.userid);
      }
      let userInfo: User = {
        username: res.data.username,
        avatar: res.data.avatar,
        atoken: res.data.atoken,
        rtoken: res.data.rtoken,
        user_id: tokenData.userid,
      };
      console.log(userInfo);
      userStore.currentUser = userInfo;
      await userStore.setCurrentUser(userInfo);
      router.push("/");
    }
  } catch (e) {
    message.error(e.message);
  }
};
const parseJWT = (token: string) => {
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));

    return JSONbig({ storeAsString: true }).parse(payload);
  } catch (error) {
    console.error("Token 解析失败:", error);
    return null;
  }
};
function safePageRedirect(url) {
  try {
    // 尝试通过修改 location 实现跳转
    window.location.assign(url);
  } catch (error) {
    console.error("跳转失败:", error);
    // 极少数浏览器可能需要以下方式
    window.location.replace(url);
  }
}
function QQLogin() {
  const url =
    "https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=102717058&redirect_uri=http://islandlearning.icu/login&state=10086";
  safePageRedirect(url);
}
if (userStore.isLogin()) {
  router.push("/");
}
QQ();
// 在现有 imports 后新增
import { ref, onMounted, onBeforeUnmount } from "vue";

// 新增时间处理逻辑
const currentTime = ref(new Date());
const formattedTime = ref({
  hours: "00",
  minutes: "00",
  seconds: "00",
  year: "2024",
  month: "01",
  date: "01",
});

// 补零函数
const padZero = (num: number) => num.toString().padStart(2, "0");

// 更新时间函数
const updateTime = () => {
  const now = new Date();
  formattedTime.value = {
    hours: padZero(now.getHours()),
    minutes: padZero(now.getMinutes()),
    seconds: padZero(now.getSeconds()),
    year: now.getFullYear().toString(),
    month: padZero(now.getMonth() + 1),
    date: padZero(now.getDate()),
  };
};

// 生命周期钩子
let timer: number;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
const showHint = ref(false);
</script>
<style scoped>
#login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../../assets/newbackground.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;

  .center {
    position: absolute;
    width: 40%;
    height: 55%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;

    backdrop-filter: blur(20px);
    box-shadow: 2px 2px 4px #6c6c6c;
    .left {
      width: 60%;
      height: 100%;
      border-radius: 10px 0 0 10px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 0 4px #6c6c6c;
      padding: 30px;

      .time-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
      }

      .time-top {
        text-align: center;
        margin-bottom: 25px;

        .time-digits {
          font-size: 5em;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 12px;
        }

        .time-label {
          font-size: 1.3em;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 2px;
        }
      }

      .time-bottom {
        text-align: center;

        .date-display {
          font-size: 1.8em;
          color: #fff;
          margin-bottom: 20px;
        }

        .motto-text {
          font-size: 2em;
          color: rgba(255, 255, 255, 0.8);
          position: absolute;
          bottom: 30px;
          width: 100%;
          text-align: center;
          letter-spacing: 1px;
        }
      }
    }
    .right {
      width: 40%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 40px;
      .image-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
      }

      .hint-text {
        position: absolute;
        bottom: calc(100% + 15px); /* 显示在图片上方 */
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 1.2em;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: float-up 0.5s ease-out forwards;

        /* 小箭头 */
        &::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 8px 5px 0;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.8) transparent;
        }
      }

      /* 动画效果 */
      @keyframes float-up {
        0% {
          opacity: 0;
          transform: translate(-50%, 10px);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      .hint-fade-enter-active,
      .hint-fade-leave-active {
        transition: opacity 0.3s;
      }
      .hint-fade-enter,
      .hint-fade-leave-to {
        opacity: 0;
      }
    }

    .image {
      cursor: pointer;
      width: 80px;
      height: 80px;
    }
  }
}
</style>
