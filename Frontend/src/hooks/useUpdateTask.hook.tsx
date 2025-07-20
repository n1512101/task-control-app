import { useMutation } from "@tanstack/react-query";
import { IUpdateTask } from "../interfaces/task.interface";
import useAxiosAuth from "./useAxiosAuth.hook";

interface IProperty {
  path: string;
  task: IUpdateTask;
}

export default function useUpdateTask() {
  const axiosAuth = useAxiosAuth();

  // ルーティンを更新する際に動作する関数
  const updateTask = async ({ path, task }: IProperty) => {
    try {
      const response = await axiosAuth.put(path, task);
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useMutation({
    mutationFn: updateTask,
  });
}
