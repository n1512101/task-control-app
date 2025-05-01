import { FC, ReactElement, useContext } from "react";
import axios from "axios";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import "./HomeHeader.scss";
import { AuthContext, AuthContextType } from "../../context/AuthContext";

interface PropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HomeHeader: FC<PropsType> = ({ open, setOpen }): ReactElement => {
  // ダークモード切り替え用
  const { mode, toggle } = useContext<DarkModeContextType>(DarkModeContext);
  const { setAccessToken } = useContext<AuthContextType>(AuthContext);
  const navigate: NavigateFunction = useNavigate();

  // ログアウトする際に動作する関数
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACK_API_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
    setAccessToken(null);
    navigate("/login");
  };

  return (
    <div className="homeHeader">
      <div className="left">
        <span>タスク管理アプリ</span>
        {open ? (
          <MenuOpenRoundedIcon
            className="icon"
            onClick={() => setOpen(false)}
          />
        ) : (
          <MenuRoundedIcon className="icon" onClick={() => setOpen(true)} />
        )}
        {mode === "dark" ? (
          <LightModeIcon className="icon" onClick={toggle} />
        ) : (
          <DarkModeIcon className="icon" onClick={toggle} />
        )}
      </div>
      <div className="right">
        <span onClick={handleLogout}>ログアウト</span>
      </div>
    </div>
  );
};

export default HomeHeader;
