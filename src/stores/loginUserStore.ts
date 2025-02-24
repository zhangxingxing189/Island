import { defineStore } from "pinia";
import { ref } from "vue";
export const loginUserStore = defineStore("loginUserStoreId", () => {
  const loginUser = ref("");
  return {
    loginUser,
  };
});
