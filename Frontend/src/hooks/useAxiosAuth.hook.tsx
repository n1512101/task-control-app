import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// アクセストークン認証が必要なリクエスト
const useAxiosAuth = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACK_API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 無限ループ防止

        // リフレッシュトークン認証
        try {
          const refreshResult = await axios.post(
            `${import.meta.env.VITE_BACK_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
          const newAccessToken = refreshResult.data.accessToken;
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return instance(originalRequest);
        } catch (error: any) {
          return Promise.reject(
            new Error(
              error.response?.data?.message ?? "予期せぬエラーが発生しました"
            )
          );
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosAuth;
