import { useMutation } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useDeleteTask() {
  const axiosAuth = useAxiosAuth();

  // ルーティンを削除する際に動作する関数
  const deleteRoutine = async ({ path, id }: { path: string; id: string }) => {
    try {
      const result = await axiosAuth.delete(path, { data: { _id: id } });
      return result.data.message;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useMutation({
    mutationFn: deleteRoutine,
  });
}
