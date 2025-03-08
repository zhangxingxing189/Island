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
