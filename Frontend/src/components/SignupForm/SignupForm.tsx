import { ReactElement, useState } from "react";
import z from "zod";
import { Eye, EyeOff } from "lucide-react";
import useSignup from "../../hooks/useSignup.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
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

const SignupForm = ({
  isFlipped,
  setIsAnimating,
  handleFlip,
  setProperty,
}: {
  isFlipped: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  handleFlip: () => void;
  setProperty: (property: ISnackbarProperty) => void;
}): ReactElement => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate } = useSignup();

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
        handleFlip(); // ログインフォームにもどる
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
    <div
      className="signup-container"
      style={{ transform: `rotateY(${isFlipped ? 360 : 180}deg)` }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      <div className="signup-title">アカウントを作成しよう！</div>
      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="your-email@example.com"
            {...register("email")}
          />
          <div className="error-message">
            {errors.email && <span>{errors.email.message}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Your Name"
            {...register("name")}
          />
          <div className="error-message">
            {errors.name && <span>{errors.name.message}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="error-message">
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="••••••••"
              {...register("confirm")}
            />
            <button
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="error-message">
            {errors.confirm && <span>{errors.confirm.message}</span>}
          </div>
        </div>
        <button className="form-button">サインアップ</button>
      </form>
      <div className="login-link">
        <span>すでにアカウントをお持ちですか？ </span>
        <span className="login-link-text" onClick={handleFlip}>
          ログイン
        </span>
      </div>
    </div>
  );
};

export default SignupForm;
