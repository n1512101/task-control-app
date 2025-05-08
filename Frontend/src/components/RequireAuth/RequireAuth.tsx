import { ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAxiosAuth from "../../hooks/useAxiosAuth.hook";

// ログインした状態でのみアクセスできる
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const navigate: NavigateFunction = useNavigate();
  const axiosAuth = useAxiosAuth();

  const { isError, isLoading } = useQuery({
    queryKey: ["verifyToken"],
    queryFn: async () => {
      try {
        const response = await axiosAuth.get(`/auth/verify-token`);
        return response;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    retry: false,
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (isError) navigate("/login");
  }, [isError, navigate]);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return children;
};

export default RequireAuth;
