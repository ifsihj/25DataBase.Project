// @/utils/request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "ant-design-vue";
import router from "@/router"; // 确保你有这个 router 实例

const instance = axios.create({
  baseURL: "http://localhost:5000", // 后端服务地址
  timeout: 10000,
});

// 请求拦截器：自动携带 token
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

// 响应拦截器：统一处理错误
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 清除本地 token
          localStorage.removeItem("token");

          // 获取当前路由路径
          const currentPath = router.currentRoute.value.path;

          // 只有不在登录页时，才跳转到登录页（避免重复跳转）
          if (!currentPath.startsWith("/user/login")) {
            message.error("登录已过期，请重新登录");
            router.push("/user/login").catch(() => {});
          }
          break;

        default:
          // 其他错误（400, 500 等）显示后端返回的错误信息或默认提示
          const errorMsg = data?.error || "请求失败，请稍后重试";
          message.error(errorMsg);
      }
    } else if (error.request) {
      // 网络错误（无响应）
      message.error("网络异常，请检查连接");
    } else {
      // 其他未知错误
      message.error("请求出错：" + error.message);
    }

    return Promise.reject(error);
  }
);

// 导出 request 方法
export function request<T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return instance(config);
}
