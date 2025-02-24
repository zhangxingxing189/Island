// src/stores/user.ts
import { id } from "element-plus/es/locale";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: user as User | null, // 假设 User 是一个类型
  }),
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user;
    },
  },
});
let user={
  id:1,
  name: "zyx",
  email: "",
  avatar: "https://api.yimian.xyz/img",
}
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  // 其他用户属性
}
