import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "homePage",
    component: () => import("../pages/home/homePage.vue"),
    // redirect: "/",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/userPages/loginPage_reset.vue"),
  },
  {
    path: "/", //计算机分岛
    name: "island",
    component: () => import("../pages/blogPages/index.vue"),
    // props: true,
  },
  {
    path: "/article",
    name: "article",
    component: () => import("../pages/blogPages/ArticleDetail.vue"),
  },
  {
    path: "/personalCenter",
    name: "personalCenter",
    component: () => import("../pages/blogPages/personalCenter.vue"),
  },
  {
    path: "/imageUpload",
    name: "imageUpload",
    component: () => import("../components/ImageUpload.vue"),
  },
  {
    path: "/create",
    name: "create",
    component: () => import("../pages/blogPages/SaltAuthorRecommend.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
