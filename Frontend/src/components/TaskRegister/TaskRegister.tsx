import { FC, ReactElement, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import { ICategory } from "../../interfaces/task.interface";
import useCreateTask from "../../hooks/useCreateTask.hook";
import "./TaskRegister.scss";

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

const TaskRegister: FC<IProps> = ({
  setProperty,
  isFlipped,
  handleFlip,
  setIsAnimating,
}): ReactElement => {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [category, setCategory] = useState<ICategory>("study");

  const { mutate } = useCreateTask();

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // タスク作成ボタンを押した際に動作する関数
  const onSubmit = (data: Schema) => {
    mutate(
      { ...data, status: "pending", category, date },
      {
        // タスク作成成功の場合
        onSuccess: (response) => {
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
          reset();
        },
        // タスク作成失敗の場合
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
      className="task-form-container"
      onSubmit={handleSubmit(onSubmit)}
      style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      <div className="task-header">
        <h2 className="task-title">
          <span>✨</span>
          タスク登録
          <span>✨</span>
        </h2>
      </div>
      <div className="task-form-content">
        <div className="form-date-section">
          <div className="section-title">
            <span className="section-number">1</span>
            <span>日付を選択</span>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs()}
              disablePast
              onChange={(e) => setDate(e?.format("YYYY-MM-DD")!)}
              slotProps={{
                textField: {
                  sx: {
                    "& .MuiPickersInputBase-sectionsContainer": {
                      color: "var(--base-color)",
                    },
                    "& .MuiButtonBase-root": {
                      color: "var(--icon-color)",
                    },
                    "& .MuiPickersOutlinedInput-root": {
                      border: "1px solid #e5e7eb",
                    },
                    "& .MuiPickersInputBase-root": {
                      height: "40px",
                    },
                  },
                },
                popper: {
                  sx: {
                    "& .MuiPaper-root": {
                      backgroundColor: "#f0f8ff", // カレンダーポップアップの背景色
                    },
                    "& .MuiTypography-root": {
                      color: "#000080", // カレンダー内のテキストの色
                    },
                    "& .MuiPickersDay-root": {
                      color: "#000080", // 日付の文字色
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
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
            placeholder="タスクを入力..."
            rows={6}
            {...register("description")}
          />
          {errors.description && (
            <div className="error-message">
              ⚠️ タスクの内容を入力してください
            </div>
          )}
        </div>
        <button className="submit-button" type="submit">
          タスク作成
        </button>
      </div>
      <div className="switch-routine">
        <span onClick={handleFlip}>ルーティン登録</span>
      </div>
    </form>
  );
};

export default TaskRegister;
