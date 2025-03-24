import router from "@/router";
import { User } from "@/stores/user";

export async function islandRouter(nowUser: User, id: string, name: string) {
  // 延迟路由跳转避免物理引擎冲突
  try {
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
    await router.push({
      path: "/island",
      query: { islandId: id, form: "home" },
    });
  } catch (error) {
    console.error("导航错误:", error);
  }
  window.location.reload();
}
