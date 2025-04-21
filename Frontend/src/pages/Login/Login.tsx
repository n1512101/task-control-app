import { FC, ReactElement } from "react";
import LoginHeader from "../../components/LoginHeader/LoginHeader";
import LoginForm from "../../components/LoginForm/LoginForm";

const Login: FC = (): ReactElement => {
  return (
    <div>
      <LoginHeader />
      <LoginForm />
    </div>
  );
};

export default Login;
