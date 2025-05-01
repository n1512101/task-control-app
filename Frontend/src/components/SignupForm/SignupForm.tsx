import { FC, ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Button from "@mui/material/Button";
import useSignup from "../../hooks/useSignup.hook";
import CustomizedSnackBar from "../SnackBar/SnackBar";
import IProperty from "../../interfaces/snackbarProperty.interface";
import "./SignupForm.scss";

// スキーマ定義
const schema = z
  .object({
    email: z
      .string()
      .email({ message: "正しいメールアドレスを入力してください" }),
    name: z
      .string()
      .min(3, { message: "3文字以上入力してください" })
      .max(20, { message: "20文字以内で入力してください" }),
    password: z
      .string()
      .min(6, { message: "6文字以上入力してください" })
      .max(20, { message: "20文字以内で入力してください" }),
    confirm: z
      .string()
      .min(6, { message: "6文字以上入力してください" })
      .max(20, { message: "20文字以内で入力してください" }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "パスワードが一致しません",
  });
type Schema = z.infer<typeof schema>;

const SignupForm: FC = (): ReactElement => {
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<IProperty>({
    open: false,
    message: "",
    severity: "success",
  });

  const { mutate } = useSignup();
  const navigate = useNavigate();

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
    // サインアップ成功の場合、ログインページへ遷移する
    if (property.severity === "success") {
      navigate("/login");
    }
  };

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // signupボタンを押した際に動作する関数
  const onSubmit = (userInfo: Schema) => {
    mutate(userInfo, {
      // サインアップ成功の場合
      onSuccess: (data) => {
        setProperty({
          open: true,
          message: data.message,
          severity: "success",
        });
      },
      // サインアップ失敗の場合
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
      <form className="signupForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="emailForm">
          <div>
            <span>Email: </span>
            <input {...register("email")} placeholder="メールアドレスを入力" />
          </div>
          <div className="errorMessage">
            {errors.email && <span>{errors.email.message}</span>}
          </div>
        </div>
        <div className="nameForm">
          <div>
            <span>Name: </span>
            <input {...register("name")} placeholder="3-20文字を入力" />
          </div>
          <div className="errorMessage">
            {errors.name && <span>{errors.name.message}</span>}
          </div>
        </div>
        <div className="passwordForm">
          <div>
            <span>Password: </span>
            <input
              type="password"
              {...register("password")}
              placeholder="6-20文字を入力"
            />
          </div>
          <div className="errorMessage">
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </div>
        <div className="confirmForm">
          <div>
            <span>Confirm: </span>
            <input
              type="password"
              {...register("confirm")}
              placeholder="6-20文字を入力"
            />
          </div>
          <div className="errorMessage">
            {errors.confirm && <span>{errors.confirm.message}</span>}
          </div>
        </div>
        <Button className="signupBtn" variant="outlined" type="submit">
          sign up
        </Button>
      </form>
    </>
  );
};

export default SignupForm;
