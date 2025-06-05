import { FC, ReactElement, useContext } from "react";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import { Link } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./AuthHeader.scss";

const AuthHeader: FC = (): ReactElement => {
  // ダークモード切り替え用
  const { mode, toggle } = useContext<DarkModeContextType>(DarkModeContext);

  return (
    <div className="authHeader">
      <div className="left">
        <span className="title">タスク管理アプリ</span>
        {mode === "dark" ? (
          <LightModeIcon className="icon" onClick={toggle} />
        ) : (
          <DarkModeIcon className="icon" onClick={toggle} />
        )}
      </div>
      <div className="right">
        <Link className="link" to="/login">
          ログイン
        </Link>
        <Link className="link" to="/signup">
          サインアップ
        </Link>
      </div>
    </div>
  );
};

export default AuthHeader;
