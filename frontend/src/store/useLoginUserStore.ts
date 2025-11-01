import { defineStore } from "pinia";
import { ref } from "vue";
import { getCurrentUser } from "@/api/user";

export const useLoginUserStore = defineStore("loginuser", () => {
  const loginUser = ref<any>({
    userName: "未登录",
  });

  async function fetchLoginUser() {
    try {
      const res: any = await getCurrentUser();
      // backend /auth/me returns user object { id, username, email }
      if (res && res.data) {
        loginUser.value = res.data;
      }
    } catch (err) {
      // leave loginUser as default if unauthenticated
      console.warn("fetchLoginUser failed:", err);
    }
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser;
  }

  return { loginUser, fetchLoginUser, setLoginUser };
});
