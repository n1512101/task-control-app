import { FC, ReactElement, useContext } from "react";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./AuthHeader.scss";

const AuthHeader: FC = (): ReactElement => {
  // ダークモード切り替え用
  const { mode, toggle } = useContext<DarkModeContextType>(DarkModeContext);

  return (
    <div className="auth-header">
      <div className="left">
        <span className="title">タスク管理アプリ</span>
        {mode === "dark" ? (
          <LightModeIcon className="icon" onClick={toggle} />
        ) : (
          <DarkModeIcon className="icon" onClick={toggle} />
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
