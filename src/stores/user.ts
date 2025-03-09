// src/stores/user.ts
import { id } from "element-plus/es/locale";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: user, // 假设 User 是一个类型
  }),
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user;
    },
    isLogin() {
      return this.currentUser !== null;
    },
    // // 新增刷新Token方法
    // async refreshToken() {
    //   const { rtoken } = this.currentUser;
    //   const response = await axios.post("/auth/refresh", {
    //     refresh_token: rtoken,
    //   });
    //   this.currentUser.atoken = response.data.new_access_token;
    //   return this.currentUser;
    // },
    setAtoken(atoken: string) {
      this.currentUser.atoken = atoken;
    },
    logout() {
      this.currentUser = null;
      localStorage.removeItem("user");
    },
  },
});
let user = {
  username: "zyx",
  avatar: "https://api.yimian.xyz/img",
  atoken: "1234567890",
  rtoken: "1234567890",
};
export interface User {
  username: string;
  avatar: string;
  atoken: string;
  rtoken: string;
  // 其他用户属性
}
