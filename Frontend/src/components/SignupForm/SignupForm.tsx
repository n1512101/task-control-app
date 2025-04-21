import { FC, ReactElement, useContext } from "react";
import {
  DarkModeContext,
  DarkModeContextType,
} from "../../context/DarkModeContext";
import Button from "@mui/material/Button";
import "./SignupForm.scss";

const SignupForm: FC = (): ReactElement => {
  // mode: テーマモード
  const { mode } = useContext<DarkModeContextType>(DarkModeContext);
  // inputの背景色取得
  const inputBackgroundColor = mode === "dark" ? "#888" : "#ddd";

  return (
    <form className="signupForm">
      <div className="emailForm">
        <span>Email: </span>
        <input style={{ backgroundColor: inputBackgroundColor }} />
      </div>
      <div className="nameForm">
        <span>Name: </span>
        <input style={{ backgroundColor: inputBackgroundColor }} />
      </div>
      <div className="passwordForm">
        <span>Password: </span>
        <input
          type="password"
          style={{ backgroundColor: inputBackgroundColor }}
        />
      </div>
      <Button className="signupBtn" variant="outlined" type="submit">
        ログイン
      </Button>
    </form>
  );
};

export default SignupForm;
