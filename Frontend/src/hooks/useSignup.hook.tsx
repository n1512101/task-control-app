import axios from "axios";
import { IUser } from "../interfaces/user.interface";
import { useMutation } from "@tanstack/react-query";

// サインアップする際に動作する関数
const signupFn = async (user: IUser) => {
  try {
    const response = await axios.post(`/user/signup`, user);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ?? "予期せぬエラーが発生しました";
    throw new Error(errorMessage);
  }
};

// サインアップhook
export default function useSignup() {
  return useMutation({
    mutationFn: signupFn,
  });
}
