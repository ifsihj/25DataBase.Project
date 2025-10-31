import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { message } from "ant-design-vue";

const instance = axios.create({
  baseURL: "http://localhost:5000", // 后端服务地址
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem("token");
          window.location.href = "/login";
          message.error("请重新登录");
          break;
        default:
          message.error(error.response.data.error || "请求失败");
      }
    }
    return Promise.reject(error);
  }
);

export function request(config: AxiosRequestConfig) {
  return instance(config);
}
