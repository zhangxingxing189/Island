<template>
  <div class="app-container">
    <header class="nav-bar">
      <div class="logo">
        <img
          class="logo-img"
          src="@/assets/myLogo.png"
          alt="Home"
          @click="goHome"
        />
        <p>首页</p>
      </div>
      <div class="world">
        <img
          class="world-img"
          src="@/assets/home.png"
          alt="world"
          @click="goWorld"
        />
        <p>航海</p>
      </div>
      <div class="search-box">
        <input
          type="text"
          placeholder="请输入搜索内容"
          v-model="searchText"
          @input="handleSearch"
          class="search-input"
        />
        <button class="icon-search-btn iconfont icon-sousuo"></button>
      </div>
      <div class="bot logo">
        <img
          class="bot-img logo-img"
          src="@/assets/bot.png"
          alt="Bot"
          @click="goBot"
        />
      </div>
      <div class="action-buttons">
        <div
          class="publish-btn"
          @click="handlePublishClick"
          style="margin-right: 20px"
        >
          <i class="iconfont icon-jurassic_edit-user"></i>
          <p>发布</p>
        </div>
        <div class="publish-btn" @click="handleQuizClick">
          <i class="iconfont"
            ><img
              src="@/assets/images/题库.png"
              alt="题库"
              style="width: 22px; display: block"
          /></i>
          <p>刷题</p>
        </div>
      </div>
      <div class="user-info">
        <a-avatar :src="currentUser.avatar" @click="navigateToPersonalCenter" />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useDebounceFn } from "@vueuse/core";
import { useLayoutStore } from "@/stores/layoutStore";
import { getIslandDetail } from "@/api/islandApi";

const router = useRouter();
const route = useRoute();

const isSelect = ref(true);
const isSelectStore = useLayoutStore().isSelect;
let islandName;
// let islandId = Array.isArray(route.params.islandId)
//   ? route.params.islandId[0]
//   : route.params.islandId;
let islandId = route.query.islandId;
console.log(route.params.islandId);
console.log(islandId);
if (!islandId) {
  islandId = "2222222222";
  //默认值
}

const userStore = useUserStore();
const login = async () => {
  if (!userStore.isLogin()) {
    if (!(await userStore.loadUser())) {
      await router.push("/login");
    }
  }
};
login();
// 搜索功能
const searchText = ref("");
const handleSearch = useDebounceFn((e: Event) => {
  console.log("Search:", searchText.value);
  router.push({
    path: "/island/search",
    query: {
      key: searchText.value,
    },
  });
}, 1000);

// 导航操作
const goBot = () => {
  router.push({
    path: "/bot",
    query: {
      islandId: islandId,
    },
  });
};
const goHome = () => {
  isSelect.value = true;
  router.push({
    path: "/island",
    query: {
      islandId: islandId,
    },
  });
};
const goWorld = () => {
  router.push({
    path: "/",
    query: {
      islandId: islandId,
    },
  });
};
const handlePublishClick = () => {
  isSelect.value = true;
  router.push({
    path: "/island/publish",
    query: {
      islandId: islandId,
    },
  });
};

const navigateToPersonalCenter = () => {
  isSelect.value = true;
  console.log(islandId);
  router.push({
    path: "/island/personalCenter",
    query: {
      islandId: islandId,
    },
  });
};

const handleQuizClick = async () => {
  isSelect.value = false;
  // await nextTick(); // 等待DOM更新

  await router.push({
    path: "/quiz/list/" + String(islandId),
    query: { islandId: islandId },
  });
};

// if (userStore.loadUser() || userStore.isLogin()) {
//   // let isAuto = await checkLoginAuto();
//   // console.log(isAuto);
//   // if (isAuto.code !== 20000) {
//   //   console.log("no20000");
//   //   userStore.logout();
//   //   login();
//   //   // console.log("没有登录,去登录,这里先不跳转");
//   // }
// } else {
//   console.log("loadFalse");
//   // console.log("没有登录,去登录,这里先不跳转");
//   login();
// }
const currentUser = userStore.currentUser;
// // console.log(currentUser);
// const getIslandName = async () => {
//   try {
//     const res = await getIslandDetail(islandId);
//     islandName = res?.name;
//   } catch (err) {
//     console.log(err);
//   }
// };
// onMounted(() => {
//   // getIslandName();
//   // console.log(islandName);
// });
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}
/* 新增容器样式 */
.app-container {
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  grid-template-columns: auto minmax(100px, 1200px) repeat(3, auto);
  align-items: center;
  gap: 24px;
  height: 64px;
  padding: 0 32px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  justify-content: space-between;
}
.nav-bar .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-bar .logo p {
  font-size: 12px;
  transform: translateY(-1px);
}

.nav-bar .logo img {
  height: 40px;
  transition: transform 0.3s ease;
}

.nav-bar .logo img:hover {
  transform: scale(1.05);
}
.nav-bar .world {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-bar .world img {
  border-radius: 50%;
  height: 40px;
  transition: transform 0.3s ease;
}

.nav-bar .world img:hover {
  transform: scale(1.05);
}
.nav-bar .world p {
  font-size: 12px;
  transform: translateY(-1px);
}
.search-box {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 40px 0 20px;
  border: none;
  background: #f6f6f6;
  border-radius: 24px;
  font-size: 14px;
}

.icon-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8590a6;
  font-size: 20px;
  padding: 0 12px;
  cursor: pointer;
  transition: color 0.3s;
}

.icon-search-btn:hover {
  color: var(--primary-color);
}

.search-box input:focus {
  box-shadow: 0 0 0 1px var(--primary-color);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.publish-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.publish-btn:hover {
  color: var(--primary-color);
}

.publish-btn:hover i {
  transform: scale(1.1);
}

.publish-btn i {
  font-size: 22px;
  margin-bottom: 1px;
  transition: transform 0.3s;
  height: 30px;
  display: flex;
  align-items: center;
}

.publish-btn p {
  font-size: 10px;
  line-height: 1;
  transform: translateY(-1px);
  margin: 0;
}
.logo-img {
  border-radius: 50%;
}
@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
    gap: 12px;
  }
}
</style>
