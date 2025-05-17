import { FC, ReactElement, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICategory, IRepeatType } from "../../interfaces/task.interface";
import useCreateRoutine from "../../hooks/useCreateRoutine.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import "./RoutineRegister.scss";

// フォームスキーマ定義
const schema = z.object({
  description: z.string().nonempty(),
});
type Schema = z.infer<typeof schema>;

interface IProps {
  setProperty: (property: ISnackbarProperty) => void;
  isFlipped: boolean;
  handleFlip: () => void;
  setIsAnimating: (isAnimating: boolean) => void;
}

const RoutineRegister: FC<IProps> = ({
  setProperty,
  isFlipped,
  handleFlip,
  setIsAnimating,
}): ReactElement => {
  const [repeatType, setRepeatType] = useState<IRepeatType>("daily");
  const [category, setCategory] = useState<ICategory>("study");

  const { mutate } = useCreateRoutine();

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // ルーティン作成ボタンを押した際に動作する関数
  const onSubmit = (data: Schema) => {
    mutate(
      { ...data, status: "pending", repeatType, category },
      {
        // ルーティン作成成功の場合
        onSuccess: (response) => {
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
          reset();
        },
        // ルーティン作成失敗の場合
        onError: (error) => {
          setProperty({
            open: true,
            message: error.message,
            severity: "warning",
          });
        },
      }
    );
  };

  return (
    <form
      className="routine-form-container"
      onSubmit={handleSubmit(onSubmit)}
      style={{ transform: `rotateY(${isFlipped ? 360 : 180}deg)` }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      <div className="routine-header">
        <h2 className="routine-title">
          <span>✨</span>
          ルーティン登録
          <span>✨</span>
        </h2>
      </div>
      <div className="routine-form-content">
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">1</span>
            <span>タイプ</span>
          </div>
          <div className="type-selector">
            <button
              className={`type-button ${
                repeatType === "daily" ? "type-button-active" : ""
              }`}
              onClick={() => setRepeatType("daily")}
              type="button"
            >
              毎日
            </button>
            <button
              className={`type-button ${
                repeatType === "weekly" ? "type-button-active" : ""
              }`}
              onClick={() => setRepeatType("weekly")}
              type="button"
            >
              毎週
            </button>
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">2</span>
            <span>カテゴリー</span>
          </div>
          <div className="category-selector">
            <div
              className={`category-card ${
                category === "study" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("study")}
            >
              <span className="category-emoji">📚</span>
              <span className="category-label">勉強</span>
            </div>
            <div
              className={`category-card ${
                category === "job" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("job")}
            >
              <span className="category-emoji">💼</span>
              <span className="category-label">仕事</span>
            </div>
            <div
              className={`category-card ${
                category === "recreation" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("recreation")}
            >
              <span className="category-emoji">🎮</span>
              <span className="category-label">娯楽</span>
            </div>
            <div
              className={`category-card ${
                category === "exercise" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("exercise")}
            >
              <span className="category-emoji">🏃</span>
              <span className="category-label">運動</span>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">3</span>
            <span>タスク内容</span>
          </div>
          <textarea
            className="task-textarea"
            placeholder="ルーティンを入力..."
            rows={6}
            {...register("description")}
          />
          {errors.description && (
            <div className="error-message">
              ⚠️ ルーティンの内容を入力してください
            </div>
          )}
        </div>
        <button className="submit-button" type="submit">
          ルーティン作成
        </button>
      </div>
      <div className="switch-task">
        <span onClick={handleFlip}>タスク登録</span>
      </div>
    </form>
  );
};

export default RoutineRegister;
