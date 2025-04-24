import axios from "axios";
import IUser from "../interfaces/user.interface";
import { useMutation } from "@tanstack/react-query";

// サインアップする際に動作する関数
const signupFn = async (user: IUser) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/user/signup`,
      {
        email: user.email,
        password: user.password,
        name: user.name,
      }
    );
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

// サインアップhook
export default function useSignup() {
  return useMutation({
    mutationFn: signupFn,
  });
}
