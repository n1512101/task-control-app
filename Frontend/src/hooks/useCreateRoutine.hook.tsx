import { IRoutine } from "../interfaces/task.interface";
import { useMutation } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useCreateRoutine() {
  const axiosAuth = useAxiosAuth();
  // ルーティン作成する際に動作する関数
  const createRoutine = async (routine: Omit<IRoutine, "_id">) => {
    try {
      const response = await axiosAuth.post("/routine/create", routine);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useMutation({
    mutationFn: createRoutine,
  });
}
