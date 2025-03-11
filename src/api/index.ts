import axios from "axios";
// import {useStore} from "@/stores";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user";
import { refreshAToken } from "./loginApi";
import router from "@/router";
export const useAxios = axios.create({
  // baseURL: "http://118.31.119.216:8080",
  baseURL: "http://localhost:8080",
});

export interface baseResponse<T> {
  code: number;
  data: T;
  msg: string;
}

useAxios.interceptors.request.use((config) => {
  const userStores = useUserStore();
  if (!userStores.currentUser) {
    return config;
  }
  // 添加 Authorization 请求头
  config.headers.Authorization = userStores.currentUser.atoken;
  return config;
});

useAxios.interceptors.response.use(
  // 响应拦截器
  (response) => {
    if (response.status !== 200) {
      // 失败的
      console.log("服务失败", response.status);
      message.error(response.statusText);
      return Promise.reject(response.statusText);
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Token过期且未重试过
    if (error.response?.code === -20000 && !originalRequest._retry) {
      originalRequest._retry = true;
      // 更新store中的Token
      const userStore = useUserStore();
      try {
        // 调用刷新Token接口
        const newTokenRes = await refreshAToken(userStore.currentUser.rtoken);
        console.log(newTokenRes);
        // 重试原始请求
        if (newTokenRes.data.code === -20000) {
          message.error("atoken刷新不成功");
          useUserStore().logout();
          await router.replace("/login");
          return Promise.reject("atoken刷新不成功");
        }
        originalRequest.headers.Authorization = newTokenRes.data.atoken;
        userStore.setAtoken(newTokenRes.data.atoken);
        return useAxios(originalRequest);
      } catch (refreshError) {
        // 刷新失败跳转登录
        userStore.logout();
        router.replace("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject();
  }
);
