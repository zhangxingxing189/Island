import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import {useStore} from "@/stores";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user";
import { refreshAToken, isRefreshRequest } from "./loginApi";
import router from "@/router";
import { login } from "@/pages/home/UIFunction";
export const useAxios = axios.create({
  baseURL: "http://118.31.119.216:8080",
  //baseURL: "http://localhost:8080",
});

export interface baseResponse<T> {
  code: number;
  data: T;
  msg: string;
}
const userStores = useUserStore();
useAxios.interceptors.request.use((config) => {
  if (!userStores.currentUser) {
    login();
    return config;
  }
  // 添加 Authorization 请求头
  config.headers.Authorization = userStores.currentUser.atoken;
  return config;
});

useAxios.interceptors.response.use(
  async (response) => {
    // 业务成功状态码
    if (response.data.code === 20000) {
      return response.data;
    }
    const originalRequest = response.config;
    console.log(originalRequest.url);
    // Token 过期处理（兼容 HTTP 401 和业务错误码）
    if (
      shouldHandleTokenExpired(response) &&
      originalRequest.url !== "/api/common/token"
    ) {
      try {
        console.log("*******************************");
        const res = await handleTokenRefresh();
        console.log("-------------------------------");
        // console.log(res);
        if (res === false) {
          await handleTokenExpired(); // 🔴 统一跳转处理
          return Promise.reject(new Error("token过期,需要重新登陆"));
        } else {
          originalRequest.headers.Authorization = `${userStores.currentUser.atoken}`;
          // console.log("newAToken:" + userStores.currentUser.atoken);
          return await useAxios.request(originalRequest);
        }
      } catch (refreshError) {
        await handleTokenExpired(); // 🔴 统一跳转处理
        return Promise.reject(new Error("token过期,需要重新登陆"));
      }
    }

    // 其他业务错误
    const error = new Error(response.data.message || "业务逻辑错误");
    return Promise.reject(error);
  },
  async (error) => {
    return Promise.reject(error);
  }
);
// Token 过期通用处理
const handleTokenExpired = async () => {
  // 清空用户状态
  userStores.logout();

  // 避免重复跳转
  if (router.currentRoute.value.path !== "/login") {
    await router.push({
      path: "/login",
      query: { redirect: router.currentRoute.value.fullPath }, // 保留跳转前路由
    });
  }

  // 显示提示（需确保 UI 库已加载）
  if (typeof message !== "undefined") {
    message.warning("登录状态已过期，请重新登录");
  }
};
const handleTokenRefresh = async () => {
  const userStore = useUserStore();
  try {
    // 标记已重试
    // originalRequest._retry = true;

    // // 调用刷新接口
    // const { data } = await useAxios.post("/auth/refresh", {
    //   refresh_token: userStore.refreshToken,
    // });
    // 1. 尝试刷新 Token
    const newToken = await refreshAToken(userStore.currentUser.rtoken);
    // console.log(newToken);
    if (newToken.data.code === -20000) {
      return false;
    }
    // 2. 更新存储的 Token
    userStore.setRtoken(newToken.data.rtoken);
    userStore.setAtoken(newToken.data.atoken);
    await userStore.setCurrentUser(userStore.currentUser);
    // 重试原始请求
    return true;
  } catch (error) {
    // 刷新失败时强制跳转
    await handleTokenExpired();
    throw error;
  }
};
// 判断是否需要处理 Token 过期
const shouldHandleTokenExpired = (response: AxiosResponse) => {
  return (
    response.status === 401 || // HTTP 标准状态码
    (response.data?.code === -20000 &&
      response.data?.message === "token已过期") ||
    (response.data?.code === 10001 && response.data?.message === "参数无效") // 业务自定义状态码
  );
};
// // 响应拦截器统一处理逻辑
// useAxios.interceptors.response.use(
//   (response) => {
//     // 处理业务成功状态码
//     if (response.data.code === 20000) {
//       return response.data;
//     }
//
//     // // 将业务错误转换为异常
//     // const error = new Error(response.data.message || "业务逻辑错误");
//     // error.response = response; // 保留原始响应
//     // return Promise.reject(error);
//     // 处理业务逻辑错误
//     const errorMsg = response.data.message || "业务逻辑错误";
//     message.error(errorMsg);
//     return Promise.reject(new Error(errorMsg));
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const response = error.response;
//
//     // 网络层错误处理
//     if (!response) {
//       message.error("网络连接异常");
//       return Promise.reject(error);
//     }
//
//     // Token 过期统一处理（兼容两种判断方式）
//     if (shouldHandleTokenExpired(response)) {
//       console.log("token过期");
//       return handleTokenExpiredFlow(originalRequest);
//     }
//
//     // 通用错误处理
//     const errorMsg = response.data?.message || error.message;
//     message.error(errorMsg);
//     return Promise.reject(error);
//   }
// );
//
// // 判断是否需要处理 Token 过期
// const shouldHandleTokenExpired = (response: AxiosResponse) => {
//   return (
//     response.status === 401 || // HTTP 标准状态码
//     (response.data?.code === -20000 && response.data?.message === "token已过期") // 业务自定义状态码
//   );
// };
//
// // Token 过期处理流程
// const handleTokenExpiredFlow = async (originalRequest: AxiosRequestConfig) => {
//   const userStore = useUserStore();
//
//   try {
//     // 1. 尝试刷新 Token
//     const newToken = await refreshAToken(userStore.currentUser.rtoken);
//
//     // 2. 更新存储的 Token
//     userStore.setRtoken(newToken.data.rtoken);
//     userStore.setAtoken(newToken.data.atoken);
//     // 3. 重试原始请求
//     originalRequest.headers.Authorization = `${newToken.data.atoken}`;
//     return useAxios(originalRequest);
//   } catch (refreshError) {
//     // 4. 刷新失败强制登出
//     await performLogout();
//     return Promise.reject(refreshError);
//   }
// };
//
// // 执行登出流程
// const performLogout = async () => {
//   const userStore = useUserStore();
//   console.log("logoutUser");
//   // 清空用户状态
//   userStore.logout();
//
//   // 跳转登录页并显示提示
//   message.warning("登录状态已过期，请重新登录");
//   await router.replace("/login");
//
//   // 清理历史路由栈
//   if (router.currentRoute.value.path !== "/login") {
//     await router.replace("/login");
//   }
// };
