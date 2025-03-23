// src/stores/user.ts
import { defineStore } from "pinia";

export interface User {
  username: string;
  avatar: string;
  nickname?: string;
  atoken: string;
  rtoken: string;
  user_id: string;
  // 其他用户属性
}

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null as User | null, // 初始化时设为 null
  }),
  actions: {
    async setCurrentUser(user: User) {
      localStorage.setItem("user", JSON.stringify(user));
      // console.log(user);
      this.currentUser = user;
    },
    isLogin() {
      return this.currentUser !== null;
    },
    setAtoken(atoken: string) {
      if (this.currentUser) {
        this.currentUser.atoken = atoken;
      }
      this.setCurrentUser(this.currentUser);
    },
    setRtoken(rtoken: string) {
      if (this.currentUser) {
        this.currentUser.rtoken = rtoken;
      }
      this.setCurrentUser(this.currentUser);
    },
    logout() {
      this.currentUser = null;
      localStorage.removeItem("user");
    },
    async loadUser() {
      if (this.currentUser) {
        return true;
      }
      // console.log("loading");
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          this.currentUser = JSON.parse(userData) as User;
          // console.log(this.currentUser);
        } catch (error) {
          console.error("用户数据解析失败", error);
          localStorage.removeItem("user"); // 清除无效数据
          this.currentUser = null;
          return false;
        }
        return true;
      } else {
        console.log("no userData in localStorage");
        return false;
      }
    },
  },
});
