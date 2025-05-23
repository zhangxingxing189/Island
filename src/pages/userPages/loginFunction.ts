import { checkLoginAuto } from "@/api/loginApi";
import { login } from "@/pages/home/UIFunction";
import { useUserStore } from "@/stores/user";

export async function checkLogin() {
  const userStore = useUserStore();
  if (userStore.loadUser() || userStore.isLogin()) {
    let isAuto = await checkLoginAuto();
    console.log(isAuto);
    if (isAuto.code !== 20000) {
      console.log("no20000");
      userStore.logout();
      await login();
      // console.log("没有登录,去登录,这里先不跳转");
    }
  } else {
    console.log("loadFalse");
    // console.log("没有登录,去登录,这里先不跳转");
    await login();
  }
}
