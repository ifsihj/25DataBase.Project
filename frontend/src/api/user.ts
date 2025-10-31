import { request } from "../utils/request";

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
  });
}

export function register(username: string, password: string) {
  return request({
    url: "/api/auth/register",
    method: "post",
    data: { username, password },
  });
}
