import { FC, ReactElement, useState } from "react";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import IProperty from "../../interfaces/snackbarProperty.interface";
import { Bell, Calendar, FileCheck, Zap } from "lucide-react";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import "./AuthPage.scss";

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
  // カードがひっくり返している状態か
  const [isFlipped, setIsFlipped] = useState(false);
  // アニメーション実行中か
  const [isAnimating, setIsAnimating] = useState(false);

  // カードを裏返す関数
  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
  };

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

  return (
    <>
      <CustomizedSnackBar handleClose={handleClose} property={property} />
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
          <LoginForm
            isFlipped={isFlipped}
            setIsAnimating={setIsAnimating}
            handleFlip={handleFlip}
            setProperty={setProperty}
          />
          <SignupForm
            isFlipped={isFlipped}
            setIsAnimating={setIsAnimating}
            handleFlip={handleFlip}
            setProperty={setProperty}
          />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
