import { request } from "@/utils/request";

export interface User {
  id: number;
  username: string;
  email?: string;
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

export function register(username: string, password: string, email?: string) {
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
