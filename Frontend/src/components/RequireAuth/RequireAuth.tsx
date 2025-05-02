import { ReactNode, useContext } from "react";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from "axios";

// ログインした状態でのみアクセスできる
const RequireAuth = ({ children }: { children: ReactNode }) => {
  // アクセストークンを取得する
  const { accessToken, setAccessToken } =
    useContext<AuthContextType>(AuthContext);
  const navigate: NavigateFunction = useNavigate();

  const { isError, isLoading } = useQuery({
    queryKey: ["verifyToken"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_API_URL}/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return response;
      } catch (error) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACK_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);
        return response;
      }
    },
    retry: false,
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) navigate("/login");

  return children;
};

export default RequireAuth;
