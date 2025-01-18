import { useAxios } from "@/api/index";

export interface usertype {
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
