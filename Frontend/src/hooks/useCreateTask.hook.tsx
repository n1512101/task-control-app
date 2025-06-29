import useAxiosAuth from "./useAxiosAuth.hook";
import { ITask } from "../interfaces/task.interface";
import { useMutation } from "@tanstack/react-query";

export default function useCreateTask() {
  const axiosAuth = useAxiosAuth();
  // タスク作成する際に動作する関数
  const createTask = async (task: ITask) => {
    try {
      const response = await axiosAuth.post("/task/create", task);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data[0]?.msg ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useMutation({
    mutationFn: createTask,
  });
}
