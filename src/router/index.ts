import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homePage",
    component: () => import("../pages/home/homePage.vue"),
    // redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/userPages/loginPage_reset.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
