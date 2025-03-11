import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
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
    path: "/island", //计算机分岛
    name: "island",
    component: () => import("../pages/blogPages/index.vue"),
    // props: true,
    children: [
      // 添加默认重定向
      {
        path: "",
        redirect: { name: "mainContent" },
      },
      {
        path: "mainContent",
        name: "mainContent",
        component: () => import("../pages/blogPages/mainContent.vue"),
      },
      {
        path: "article",
        name: "article",
        component: () => import("../pages/blogPages/ArticleDetail.vue"),
      },
      {
        path: "personalCenter",
        name: "personalCenter",
        component: () => import("../pages/blogPages/personalCenter.vue"),
      },
      {
        path: "imageUpload",
        name: "imageUpload",
        component: () => import("../components/ImageUpload.vue"),
      },
      {
        path: "create",
        name: "create",
        component: () => import("../pages/blogPages/SaltAuthorRecommend.vue"),
      },
      {
        path: "publish",
        name: "publish",
        component: () => import("../pages/blogPages/SaltAuthorRecommend.vue"),
      },
    ],
  },
  {
    path: "/quiz",
    name: "quiz-select",
    component: () => import("../pages/quiz/select.vue"),
  },
  {
    path: "/quiz/pk",
    name: "pk",
    component: () => import("../pages/quiz/pk.vue"),
  },
  {
    path: "/quiz/exercise",
    name: "exercise",
    component: () => import("../pages/quiz/exercise.vue"),
  },
  {
    path: "/quiz/question-bank/:id",
    name: "question-bank",
    component: () => import("../pages/quiz/question_bank.vue"),
  },
  {
    path: "/quiz/list/:id",
    name: "question-bank-list",
    component: () => import("../pages/quiz/list.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
