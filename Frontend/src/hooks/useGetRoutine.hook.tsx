import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth.hook";

export default function useGetRoutine() {
  const axiosAuth = useAxiosAuth();
  // ルーティン取得する際に動作する関数
  const getRoutine = async () => {
    try {
      const routines = await axiosAuth.get("/routine");
      return routines;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ?? "予期せぬエラーが発生しました";
      throw new Error(errorMessage);
    }
  };

  return useQuery({
    queryKey: ["routine"],
    queryFn: getRoutine,
    refetchOnWindowFocus: false,
  });
}
