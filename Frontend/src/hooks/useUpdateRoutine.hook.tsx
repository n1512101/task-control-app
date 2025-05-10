import { useMutation } from "@tanstack/react-query";
import { IUpdateRoutine } from "../interfaces/routine.interface";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useUpdateRoutine() {
  const axiosAuth = useAxiosAuth();

  // ルーティンを更新する際に動作する関数
  const updateRoutine = async (routine: IUpdateRoutine) => {
    try {
      await axiosAuth.put("/routine", routine);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useMutation({
    mutationFn: updateRoutine,
  });
}
