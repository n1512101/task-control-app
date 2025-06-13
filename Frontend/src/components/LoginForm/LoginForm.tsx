import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import useLogin from "../../hooks/useLogin.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
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

const LoginForm = ({
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
    <div
      className="login-container"
      style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      <div className="login-title">ログインしてタスクを管理しよう！</div>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-input"
            placeholder="your-email@example.com"
            {...register("email")}
          />
          <div className="error-message">
            {errors.email && <span>{errors.email.message}</span>}
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
        <button className="form-button">ログイン</button>
      </form>
      <div className="signup-link">
        <span>アカウントをお持ちでないですか？ </span>
        <span className="signup-link-text" onClick={handleFlip}>
          サインアップ
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
