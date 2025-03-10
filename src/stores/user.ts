// src/stores/user.ts
import { defineStore } from "pinia";

export interface User {
  username: string;
  avatar: string;
  atoken: string;
  rtoken: string;
  // 其他用户属性
}

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null as User | null, // 初始化时设为 null
  }),
  actions: {
    setCurrentUser(user: User) {
      localStorage.setItem("user", JSON.stringify(user));
      this.currentUser = user;
    },
    isLogin() {
      return this.currentUser !== null;
    },
    setAtoken(atoken: string) {
      if (this.currentUser) {
        this.currentUser.atoken = atoken;
      }
    },
    logout() {
      this.currentUser = null;
      localStorage.removeItem("user");
    },
    loadUser() {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData) as User;
          this.setCurrentUser(parsedUser);
        } catch (error) {
          console.error("用户数据解析失败", error);
          localStorage.removeItem("user"); // 清除无效数据
          this.currentUser = null;
          return false;
        }
        return true;
      }
    },
  },
});
