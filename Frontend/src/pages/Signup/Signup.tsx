import { FC, ReactElement } from "react";
import LoginHeader from "../../components/LoginHeader/LoginHeader";
import SignupForm from "../../components/SignupForm/SignupForm";

const Signup: FC = (): ReactElement => {
  return (
    <div>
      <LoginHeader />
      <SignupForm />
    </div>
  );
};

export default Signup;
