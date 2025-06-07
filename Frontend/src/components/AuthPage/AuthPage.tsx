import { FC, ReactElement, useContext, useState } from "react";
import z from "zod";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "../../hooks/useLogin.hook";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IProperty from "../../interfaces/snackbarProperty.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import { Bell, Calendar, Eye, EyeOff, FileCheck, Zap } from "lucide-react";
import "./AuthPage.scss";

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

// アプリ紹介cardの内容
const features = [
  {
    icon: <FileCheck />,
    title: "タスク管理",
    description: "直感的なインターフェースでタスクを簡単に作成・管理",
  },
  {
    icon: <Calendar />,
    title: "ルーティン管理",
    description: "日々のルーティンを簡単に設定・管理",
  },
  {
    icon: <Bell />,
    title: "リマインダー",
    description: "学習した内容を忘れない為の復習リマインダー機能",
  },
];

const AuthPage: FC = (): ReactElement => {
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<IProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      {/* <form className="authForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="floating-shapes"></div>
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
      </form> */}
      <div className="auth-container">
        <div className="floating-shapes"></div>
        <div className="left-section">
          <div className="left-section-badge">
            <Zap size={18} />
            リマインダー付きタスク管理
          </div>
          <div className="left-section-title">タスクを簡単に管理</div>
          <div className="left-section-description">
            直感的なインターフェースで、タスクの追加や編集が簡単に行えます。
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-section">
          <div className="login-container">
            <div className="login-title">ログインしてタスクを管理しよう！</div>
            <form className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-container">
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button className="form-button">ログイン</button>
            </form>
            <div className="signup-link">
              <span>アカウントをお持ちでないですか？ </span>
              <span className="signup-link-text">サインアップ</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
