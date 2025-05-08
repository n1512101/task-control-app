import { FC, ReactElement, useContext, useState } from "react";
import z from "zod";
import CustomizedSnackBar from "../SnackBar/SnackBar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "../../hooks/useLogin.hook";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IProperty from "../../interfaces/snackbarProperty.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import "./LoginForm.scss";

// スキーマ定義
const schema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "6文字以上入力してください" })
    .max(20, { message: "20文字以内で入力してください" }),
});
type Schema = z.infer<typeof schema>;

const LoginForm: FC = (): ReactElement => {
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<IProperty>({
    open: false,
    message: "",
    severity: "warning",
  });

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  const { mutate } = useLogin();
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // loginボタンを押した際に動作する関数
  const onSubmit = (userInfo: Schema) => {
    mutate(userInfo, {
      // ログイン成功の場合
      onSuccess: (data) => {
        // アクセストークンを受け取って保存
        setAccessToken(data.accessToken);
        // ページ遷移
        navigate("/home");
      },
      // ログイン失敗の場合
      onError: (error) => {
        setProperty({
          open: true,
          message: error.message,
          severity: "warning",
        });
      },
    });
  };

  return (
    <>
      <CustomizedSnackBar handleClose={handleClose} property={property} />
      <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="emailForm">
          <div>
            <span>Email: </span>
            <input {...register("email")} />
          </div>
          <div className="errorMessage">
            {errors.email && <span>{errors.email.message}</span>}
          </div>
        </div>
        <div className="passwordForm">
          <div>
            <span>Password: </span>
            <input {...register("password")} type="password" />
          </div>
          <div className="errorMessage">
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </div>
        <CustomizedButton className="loginBtn" type="submit">
          ログイン
        </CustomizedButton>
      </form>
    </>
  );
};

export default LoginForm;
