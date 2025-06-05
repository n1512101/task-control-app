import { FC, ReactElement } from "react";
import AuthHeader from "../../components/AuthHeader/AuthHeader";
import AuthPage from "../../components/AuthPage/AuthPage";

const Auth: FC = (): ReactElement => {
  return (
    <div>
      <AuthHeader />
      <AuthPage />
    </div>
  );
};

export default Auth;
