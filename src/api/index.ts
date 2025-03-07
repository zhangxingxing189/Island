import axios from "axios";
// import {useStore} from "@/stores";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user";
export const useAxios = axios.create({
  baseURL: "http://10.61.28.40:8080",
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
  (err) => {
    console.log("服务错误", err);
    message.error(err.message);
    return Promise.reject(err.message);
  }
);
