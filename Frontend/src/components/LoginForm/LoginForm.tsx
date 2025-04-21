import { FC, ReactElement, useContext } from "react";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import Button from "@mui/material/Button";
import "./LoginForm.scss";

const LoginForm: FC = (): ReactElement => {
  // mode: テーマモード
  const { mode } = useContext<DarkModeContextType>(DarkModeContext);
  // inputの背景色取得
  const inputBackgroundColor = mode === "dark" ? "#888" : "#ddd";

  return (
    <form className="loginForm">
      <div className="emailForm">
        <span>Email: </span>
        <input style={{ backgroundColor: inputBackgroundColor }} />
      </div>
      <div className="passwordForm">
        <span>Password: </span>
        <input
          type="password"
          style={{ backgroundColor: inputBackgroundColor }}
        />
      </div>
      <Button className="loginBtn" variant="outlined" type="submit">
        ログイン
      </Button>
    </form>
  );
};

export default LoginForm;
