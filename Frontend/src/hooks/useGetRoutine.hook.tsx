import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useGetRoutine(routineType: "daily" | "weekly") {
  const axiosAuth = useAxiosAuth();
  // ルーティン取得する際に動作する関数
  const getRoutine = async () => {
    try {
      const result = await axiosAuth.get("/routine", { params: routineType });
      return result;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useQuery({
    queryKey: ["routine", routineType],
    queryFn: getRoutine,
  });
}
