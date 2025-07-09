import { FC, ReactElement, useContext, useEffect } from "react";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout.hook";
import { LoadingContext } from "../../context/LoadingContext";
import "./HomeHeader.scss";

interface PropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HomeHeader: FC<PropsType> = ({ open, setOpen }): ReactElement => {
  // ダークモード切り替え用
  const { mode, toggle } = useContext<DarkModeContextType>(DarkModeContext);
  const { setAccessToken } = useContext<AuthContextType>(AuthContext);
  const navigate: NavigateFunction = useNavigate();

  // ローディング状態を管理するcontext
  const { setIsLoading } = useContext(LoadingContext);
  const { mutate, isPending } = useLogout();

  const queryClient = useQueryClient();

  // ログアウトボタンを押した際に動作する関数
  const handleLogout = () => {
    // 成功でも失敗でもアクセストークンを削除してログイン画面に遷移
    mutate(undefined, {
      onSuccess: () => {
        logoutHandler();
      },
      onError: () => {
        logoutHandler();
      },
    });
  };
  const logoutHandler = () => {
    setAccessToken(null);
    queryClient.clear(); // tanstack-queryのデータキャッシュをクリア
    navigate("/auth");
  };

  useEffect(() => {
    // ローディング状態の変更
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return (
    <div className="homeHeader">
      <div className="left">
        <span className="title">タスク管理アプリ</span>
        {open ? (
          <MenuOpenRoundedIcon
            className="icon"
            onClick={() => setOpen(false)}
          />
        ) : (
          <MenuRoundedIcon className="icon" onClick={() => setOpen(true)} />
        )}
        {mode === "dark" ? (
          <LightModeIcon className="icon darkMode-icon" onClick={toggle} />
        ) : (
          <DarkModeIcon className="icon darkMode-icon" onClick={toggle} />
        )}
      </div>
      <div className="right">
        <span onClick={handleLogout}>ログアウト</span>
      </div>
    </div>
  );
};

export default HomeHeader;
