import axios from "axios";
import { ILoginUser } from "../interfaces/user.interface";
import { useMutation } from "@tanstack/react-query";

// ログインする際に動作する関数
const login = async (user: ILoginUser) => {
  try {
    const response = await axios.post(`/user/login`, user, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ?? "予期せぬエラーが発生しました";
    throw new Error(errorMessage);
  }
};

// ログインhook
export default function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
