import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useGetTasks() {
  const axiosAuth = useAxiosAuth();
  // タスクを取得する際に動作する関数
  const getTasks = async () => {
    try {
      const result = await axiosAuth.get("/task");
      return result;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchOnWindowFocus: false,
  });
}
