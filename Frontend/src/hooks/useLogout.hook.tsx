import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// ログアウトする際に動作する関数
const logout = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/user/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.log("Logout error:", error);
  }
};

// ログアウトhook
export default function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
