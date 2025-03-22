import router from "@/router";
import { User } from "@/stores/user";

export function islandRouter(nowUser: User, id: string, name: string) {
  localStorage.setItem(
    "data",
    JSON.stringify({
      user: nowUser,
      island: {
        id: id,
        name: name,
      },
    })
  );
  // 延迟路由跳转避免物理引擎冲突
  router.push({
    path: "/island/",
    query: {
      islandId: id,
      form: "home",
    },
  });
  // window.location.reload();
}
