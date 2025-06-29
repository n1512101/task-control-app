import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useGetAllTasks() {
  const axiosAuth = useAxiosAuth();
  // 全てのタスクを取得する関数
  const getAllTasks = async () => {
    try {
      const tasks = await axiosAuth.get("/task/all");
      return tasks.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useQuery({
    queryKey: ["allTasks"],
    queryFn: getAllTasks,
    refetchOnWindowFocus: false,
  });
}
