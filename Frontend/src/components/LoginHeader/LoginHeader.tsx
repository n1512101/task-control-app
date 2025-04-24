import { FC, ReactElement, useContext } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Theme, useTheme } from "@mui/material";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import "./LoginHeader.scss";

const LoginHeader: FC = (): ReactElement => {
  // ダークモード切り替え用
  const { mode, toggle } = useContext<DarkModeContextType>(DarkModeContext);
  // テーマの色にアクセスする関数
  const theme = useTheme<Theme>();

  const navigate: NavigateFunction = useNavigate();

  return (
    <div
      className="loginHeader"
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <div className="left">
        <span>タスク管理アプリ</span>
        {mode === "dark" ? (
          <LightModeIcon className="icon" onClick={toggle} />
        ) : (
          <DarkModeIcon className="icon" onClick={toggle} />
        )}
      </div>
      <div className="right">
        <span onClick={() => navigate("/login")}>ログイン</span>
        <span onClick={() => navigate("/signup")}>サインアップ</span>
      </div>
    </div>
  );
};

export default LoginHeader;
