import { request } from "@/utils/request";

export interface User {
  id: number;
  username: string;
}

export function getUsers() {
  return request({
    url: "/api/users",
    method: "get",
  });
}

export function getUser(id: number) {
  return request({
    url: `/api/users/${id}`,
    method: "get",
  });
}

export function login(username: string, password: string) {
  return request({
    url: "/api/auth/login",
    method: "post",
    data: { username, password },
  }).then((res: any) => {
    // backend returns { access_token: "..." }
    const token = res?.data?.access_token;
    if (token) {
      // store under "token" so request interceptor picks it up
      localStorage.setItem("token", token);
    }
    return res;
  });
}

export function register(username: string, password: string, email: string) {
  return request({
    url: "/api/auth/register",
    method: "post",
    // include email if provided
    data: { username, password, email },
  });
}

export function getCurrentUser() {
  return request({
    url: "/api/auth/me",
    method: "get",
  });
}
