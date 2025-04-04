import { useAxios } from "@/api/index";

export interface usertype {
  //废弃,正在用的是stores里面的
  id: number;
  username: string;
  email: string;
  phone: string;
}

export function loginApi_password(data: {
  username: string;
  password: string;
}): Promise<usertype> {
  return useAxios.post("/api/login", data);
}

export function get_security_code(data: { phone: string }): Promise<string> {
  return useAxios.post("/api/get_security_code", data);
}

export function check_security_code(data: {
  phone: string;
  code: string;
}): Promise<usertype> {
  return useAxios.post("/api/check_security_code", data);
}

export function post_QQCode(code: string) {
  return useAxios.get("/api/login/qq", {
    params: {
      code: code,
    },
  });
}
// export function post_QQtoken(token: string) {
//   return useAxios.post("/api/login/qq", token);
// }
export async function refreshAToken(rtokens: string) {
  return useAxios.post("/api/common/token", {
    token: rtokens,
  });
}
export function getUserInfo(id: number) {
  return useAxios.get("/api/common/user", {
    params: {
      user_id: id,
    },
  });
}
// 定义 API 响应结构
interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}
export function checkLoginAuto(): Promise<ApiResponse<usertype>> {
  return useAxios.get("/api/login/auto");
}
