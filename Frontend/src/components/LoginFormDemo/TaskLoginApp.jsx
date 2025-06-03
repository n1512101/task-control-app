import { useState } from "react";
import {
  Eye,
  EyeOff,
  Moon,
  Sun,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

export default function TaskLoginApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "タスク管理",
      description: "直感的なインターフェースでタスクを簡単に作成・管理",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "スケジュール管理",
      description: "カレンダー機能で期限を見える化",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "チームコラボ",
      description: "チームメンバーとリアルタイムで協力",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "進捗分析",
      description: "詳細なレポートで生産性を向上",
    },
  ];

  return (
    <div>
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          background: ${isDarkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f1f5f9 100%)"};
          transition: background 0.5s ease;
        }

        .left-section {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .right-section {
          flex: 1;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          animation: float 6s ease-in-out infinite;
        }

        .app-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
        }

        .theme-toggle {
          padding: 0.5rem;
          border-radius: 50%;
          border: none;
          background: ${isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)"};
          color: ${isDarkMode ? "#fbbf24" : "#6b7280"};
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          transform: scale(1.1);
          background: ${isDarkMode
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)"};
        }

        .hero-content {
          max-width: 600px;
          margin-top: 4rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: ${isDarkMode
            ? "linear-gradient(45deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))"
            : "linear-gradient(45deg, rgba(79,70,229,0.1), rgba(168,85,247,0.1))"};
          border-radius: 50px;
          border: 1px solid
            ${isDarkMode ? "rgba(168,85,247,0.3)" : "rgba(79,70,229,0.3)"};
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          padding: 1.5rem;
          background: ${isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.7)"};
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          border: 1px solid
            ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"};
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px
            ${isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"};
        }

        .feature-icon {
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
          margin-bottom: 0.5rem;
        }

        .feature-description {
          font-size: 0.9rem;
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
          line-height: 1.5;
        }

        .stats-section {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
        }

        .stat-label {
          font-size: 0.875rem;
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          animation: slideUp 0.6s ease-out;
        }

        .login-card {
          background: ${isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.7)"};
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid
            ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"};
          box-shadow: 0 25px 50px
            ${isDarkMode ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.1)"};
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 1rem;
          background: ${isDarkMode
            ? "linear-gradient(45deg, #a855f7, #3b82f6)"
            : "linear-gradient(45deg, #4f46e5, #a855f7)"};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          animation: float 6s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }

        .login-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: ${isDarkMode ? "#cbd5e1" : "#374151"};
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid
            ${isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(209,213,219,1)"};
          background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "#ffffff"};
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: ${isDarkMode ? "rgba(255,255,255,0.5)" : "#9ca3af"};
        }

        .form-input:focus {
          transform: translateY(-2px);
          border-color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          box-shadow: 0 10px 25px
            ${isDarkMode ? "rgba(168,85,247,0.2)" : "rgba(79,70,229,0.2)"};
        }

        .password-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${isDarkMode ? "rgba(255,255,255,0.6)" : "#6b7280"};
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: ${isDarkMode ? "rgba(255,255,255,0.8)" : "#374151"};
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox {
          width: 1rem;
          height: 1rem;
          border-radius: 0.25rem;
        }

        .checkbox-label {
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
        }

        .forgot-password {
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: ${isDarkMode ? "#c084fc" : "#6366f1"};
        }

        .login-button {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: none;
          background: ${isDarkMode
            ? "linear-gradient(45deg, #a855f7, #3b82f6)"
            : "linear-gradient(45deg, #4f46e5, #a855f7)"};
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }

        .login-button:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
        }

        .signup-text {
          color: ${isDarkMode ? "#cbd5e1" : "#6b7280"};
        }

        .signup-button {
          color: ${isDarkMode ? "#a855f7" : "#4f46e5"};
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .signup-button:hover {
          color: ${isDarkMode ? "#c084fc" : "#6366f1"};
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .floating-shapes::before,
        .floating-shapes::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: ${isDarkMode
            ? "linear-gradient(45deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))"
            : "linear-gradient(45deg, rgba(79,70,229,0.1), rgba(168,85,247,0.1))"};
          animation: float 8s ease-in-out infinite;
        }

        .floating-shapes::before {
          width: 300px;
          height: 300px;
          top: 10%;
          left: -10%;
          animation-delay: -2s;
        }

        .floating-shapes::after {
          width: 200px;
          height: 200px;
          bottom: 10%;
          right: -5%;
          animation-delay: -4s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .app-container {
            flex-direction: column;
          }

          .left-section,
          .right-section {
            flex: none;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .left-section,
          .right-section {
            padding: 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .stats-section {
            gap: 1rem;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Floating background shapes */}
        <div className="floating-shapes"></div>

        {/* Header */}
        <header className="header">
          <div className="logo-section">
            <CheckSquare className="logo-icon" size={32} />
            <h1 className="app-title">タスク管理アプリ</h1>
          </div>

          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Left Section - App Description */}
        <div className="left-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={16} />
              次世代のタスク管理ツール
            </div>

            <h2 className="hero-title">
              生産性を
              <br />
              最大化する
            </h2>

            <p className="hero-subtitle">
              直感的なインターフェースと強力な機能で、個人とチームの生産性を向上させます。
              タスクの管理から進捗の追跡まで、すべてを一つのプラットフォームで。
            </p>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">アクティブユーザー</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">満足度</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">サポート</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="right-section">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div className="login-icon">
                  <CheckSquare size={32} color="white" />
                </div>
                <h2 className="login-title">おかえりなさい</h2>
                <p className="login-subtitle">
                  アカウントにログインしてタスクを管理しましょう
                </p>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your-email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" className="checkbox" />
                    <span className="checkbox-label">ログイン状態を保持</span>
                  </label>
                  <a href="#" className="forgot-password">
                    パスワードを忘れた場合
                  </a>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>ログイン中...</span>
                    </div>
                  ) : (
                    "ログイン"
                  )}
                </button>
              </div>

              <div className="signup-link">
                <span className="signup-text">
                  アカウントをお持ちでない場合{" "}
                </span>
                <a href="#" className="signup-button">
                  サインアップ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
